const pool = require('../utils/pool');

module.exports = class GithubUser {
  id;
  username;
  avatar;
  email;

  constructor(rows){
    this.username = rows.username;
    this.avatar = rows.avatar;
    this.email = rows.email;
  }

  static insert({ username, avatar, email }){
    return pool.query(
      `
        INSERT INTO users (username, avatar, email)
        VALUES ($1, $2, $3)
        RETURNING *
      `,
      [username, avatar, email]
    )
      .then(rows => {
        if (!rows.rows[0]) return null;
        return new GithubUser(rows.rows[0]);
      });

  }

  static findByUsername({ username }){
    return pool.query(
      `
        SELECT *
        FROM users
        WHERE username=$1
      `,
      [username]
    )
      .then(rows => {
        if (!rows[0]) return null;
        return new GithubUser(rows[0]);
      });

  }

  toJSON(){
    return { ...this };
  }
};
