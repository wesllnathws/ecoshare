const { DatabaseSync } = require("node:sqlite");
const path = require("path");

let db;

try {
  const DB_PATH = path.join(__dirname, "..", "database.sqlite");
  db = new DatabaseSync(DB_PATH);
} catch (err) {
  console.log("usando banco em memoria");
  db = new DatabaseSync(":memory:");
}

db.exec("PRAGMA foreign_keys = ON");

module.exports = db;
