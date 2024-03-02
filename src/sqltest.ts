import SQLite from 'tauri-plugin-sql';

export async function setupDB() {
  console.log('Setting up the database');
  const db = await SQLite.load('sqlite:pulsar.db');

  // setup a test table
  await db.execute('CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY, name TEXT)');

  // insert some test data
  // await db.execute('INSERT INTO test (name) VALUES (?)', ['Alice']);
  // await db.execute('INSERT INTO test (name) VALUES (?)', ['Bob']);
  // await db.execute('INSERT INTO test (name) VALUES (?)', ['Charlie']);

  // does not return any data, only the number of rows affected and the last inserted id
  // await db.select('SELECT * FROM test');

  const insertResult = await db.select('INSERT INTO test (name) VALUES (?)', ['Oscar']);

  // actually returns the data
  const result = await db.select('SELECT * FROM test');

  debugger;
  console.log('Query result:');
  console.warn(result);
}

