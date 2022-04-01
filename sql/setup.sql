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

INSERT INTO users (username, avatar, email)
VALUES
('picky_butt', 'https://www.placecage.com/300/300', 'stinky_finger@itchy.bung'),
('whack_a_mole', 'https://www.placecage.com/300/300', 'ill_take_two@lumps.whack');

INSERT INTO gweets (text, username)
VALUES
('It''s good, but I''ve had better', 'picky_butt'),
('My grandma slaps harder', 'whack_a_mole');