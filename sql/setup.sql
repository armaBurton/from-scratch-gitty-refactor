-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS gweets CASCADE;

CREATE TABLE users (
  username TEXT NOT NULL PRIMARY KEY,
  avatar TEXT NOT NULL,
  email TEXT NOT NULL
);

CREATE TABLE gweets (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  text TEXT NOT NULL,
  username TEXT REFERENCES users(username)
);
