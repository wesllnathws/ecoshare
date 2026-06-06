const { DatabaseSync } = require("node:sqlite");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "database.sqlite");

const db = new DatabaseSync(DB_PATH);

db.exec("PRAGMA foreign_keys = ON");

module.exports = db;
