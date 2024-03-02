const fs = require(`fs`);
import SQLite from 'tauri-plugin-sql';

export interface PendingTransaction {
  /*
   * The start function should not throw or return a promise because the
   * queue just calls it and does not monitor for failures or completions.
   *
   * It should catch any errors and call the resolve or reject of the wrapping
   * promise when complete.
   *
   * It should also automatically commit or rollback the transaction if needed
   */
  start: () => void;
}

class Database {
  instance!: SQLite;

  path: string;

  const locks: Record<
  string,
  { queue: PendingTransaction[]; inProgress: boolean }
> = {};

  constructor(path: string = ':memory:') {
    this.path = path;
    this.open();
  }

  async open(): Promise<void> {
    let { path } = this;
    // TODO tauri plugin does not support in-memory databases??
    // if (path === 'file::memory:' || path.indexOf('?mode=memory') >= 0) {
    //   path = ':memory:';
    // }

    try {
      this.instance = await SQLite.load(path);
    } catch (error: any) {
      throw new Error(`Failed to open the database. - ${error.message}`);
    }

    if (!this.instance) {
      throw new Error('Failed to open the database.');
    }
  }

  inTransaction(executeBlock: () => void): void {
    try {
      
      executeBlock();
    }

    this.instance.transaction(executeBlock)();
  }

  execute(query: string, args: any[] = []): any {
    return this.instance.prepare(query).run(args);
  }

  executeStatements(queries: string): any {
    return this.instance.exec(queries);
  }

  queryRaw(query: string, args: any[] = []): any | any[] {
    let results = [];
    const stmt = this.instance.prepare(query);
    if (stmt.get(args)) {
      results = stmt.all(args);
    }
    return results;
  }

  count(query: string, args: any[] = []): number {
    const results = this.instance.prepare(query).all(args);

    if (results.length === 0) {
      throw new Error('Invalid count query, can`t find next() on the result');
    }

    const result = results[0];

    if (result.count === undefined) {
      throw new Error('Invalid count query, can`t find `count` column');
    }

    return Number.parseInt(result.count, 10);
  }

  get userVersion(): number {
    return this.instance.pragma('user_version', {
      simple: true,
    });
  }

  set userVersion(version: number): void {
    this.instance.pragma(`user_version = ${version}`);
  }

  unsafeDestroyEverything(): void {
    // Deleting files by default because it seems simpler, more reliable
    // And we have a weird problem with sqlite code 6 (database busy) in sync mode
    // But sadly this won't work for in-memory (shared) databases, so in those cases,
    // drop all tables, indexes, and reset user version to 0

    if (this.isInMemoryDatabase()) {
      this.inTransaction(() => {
        const results = this.queryRaw(`SELECT * FROM sqlite_master WHERE type = 'table'`);
        const tables = results.map((table) => table.name);

        tables.forEach((table) => {
          this.execute(`DROP TABLE IF EXISTS '${table}'`);
        });

        this.execute('PRAGMA writable_schema=1');
        const count = this.queryRaw(`SELECT * FROM sqlite_master`).length;
        if (count) {
          // IF required to avoid SQLIte Error
          this.execute('DELETE FROM sqlite_master');
        }
        this.execute('PRAGMA user_version=0');
        this.execute('PRAGMA writable_schema=0');
      });
    } else {
      this.instance.close();
      if (this.instance.open) {
        throw new Error('Could not close database');
      }

      if (fs.existsSync(this.path)) {
        fs.unlinkSync(this.path);
      }
      if (fs.existsSync(`${this.path}-wal`)) {
        fs.unlinkSync(`${this.path}-wal`);
      }
      if (fs.existsSync(`${this.path}-shm`)) {
        fs.unlinkSync(`${this.path}-shm`);
      }

      this.open();
    }
  }

  isInMemoryDatabase(): any {
    return this.instance.memory;
  }
}

export default Database;

