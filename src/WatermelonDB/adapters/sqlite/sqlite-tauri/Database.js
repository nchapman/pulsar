"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports.default = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var SQLite = require('tauri-plugin-sql');
var Database = /*#__PURE__*/function () {
  function Database(path = ':memory:') {
    this.path = path;
  }
  var _proto = Database.prototype;
  _proto.open = function open() {
    return new Promise(function ($return, $error) {
      var $Try_1_Post = function () {
        try {
          if (!this.instance) {
            return $error(new Error('Failed to open the database.'));
          }
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this);
      var $Try_1_Catch = function (error) {
        try {
          throw new Error("Failed to open the database. - ".concat(error.message));
        } catch ($boundEx) {
          return $error($boundEx);
        }
      };
      try {
        return Promise.resolve(SQLite.load(this.path)).then(function ($await_2) {
          try {
            this.instance = $await_2;
            return $Try_1_Post();
          } catch ($boundEx) {
            return $Try_1_Catch($boundEx);
          }
        }.bind(this), $Try_1_Catch);
      } catch (error) {
        $Try_1_Catch(error)
      }
    }.bind(this));
  };
  _proto.inTransaction = function inTransaction() {
    // this.instance.transaction(executeBlock)()
  };
  _proto.execute = function execute(args = []) {
    // return this.instance.prepare(query).run(args)
  };
  _proto.executeStatements = function executeStatements() {
    // return this.instance.exec(queries)
  };
  _proto.queryRaw = function queryRaw(args = []) {
    // const stmt = this.instance.prepare(query)
    // if (stmt.get(args)) {
    //   results = stmt.all(args)
    // }
    return [];
  };
  _proto.count = function count(args = []) {
    // const results = this.instance.prepare(query).all(args)

    // if (results.length === 0) {
    //   throw new Error('Invalid count query, can`t find next() on the result')
    // }

    // const result = results[0]

    // if (result.count === undefined) {
    //   throw new Error('Invalid count query, can`t find `count` column')
    // }

    // return Number.parseInt(result.count, 10)
    return 0;
  };
  _proto.unsafeDestroyEverything = function unsafeDestroyEverything() {
    var _this = this;
    // Deleting files by default because it seems simpler, more reliable
    // And we have a weird problem with sqlite code 6 (database busy) in sync mode
    // But sadly this won't work for in-memory (shared) databases, so in those cases,
    // drop all tables, indexes, and reset user version to 0

    if (this.isInMemoryDatabase()) {
      this.inTransaction(function () {
        var results = _this.queryRaw("SELECT * FROM sqlite_master WHERE type = 'table'");
        var tables = results.map(function (table) {
          return table.name;
        });
        tables.forEach(function (table) {
          _this.execute("DROP TABLE IF EXISTS '".concat(table, "'"));
        });
        _this.execute('PRAGMA writable_schema=1');
        var count = _this.queryRaw("SELECT * FROM sqlite_master").length;
        if (count) {
          // IF required to avoid SQLIte Error
          _this.execute('DELETE FROM sqlite_master');
        }
        _this.execute('PRAGMA user_version=0');
        _this.execute('PRAGMA writable_schema=0');
      });
    } else {
      this.instance.close();
      // if (this.instance.open) {
      //   throw new Error('Could not close database')
      // }

      // if (fs.existsSync(this.path)) {
      //   fs.unlinkSync(this.path)
      // }
      // if (fs.existsSync(`${this.path}-wal`)) {
      //   fs.unlinkSync(`${this.path}-wal`)
      // }
      // if (fs.existsSync(`${this.path}-shm`)) {
      //   fs.unlinkSync(`${this.path}-shm`)
      // }

      this.open();
    }
  };
  _proto.isInMemoryDatabase = function isInMemoryDatabase() {
    return false;
  };
  (0, _createClass2.default)(Database, [{
    key: "userVersion",
    get: function get() {
      // return this.instance.pragma('user_version', {
      //   simple: true,
      // })
      return 0;
    },
    set: function set(version) {
      // this.instance.pragma(`user_version = ${version}`)
    }
  }]);
  return Database;
}();
var _default = Database;
exports.default = _default;