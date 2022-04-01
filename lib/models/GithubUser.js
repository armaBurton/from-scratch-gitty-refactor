const pool = require('../utils/pool');

module.exports = class GithubUser {
  username;
  avatar;
  email;

  constructor(rows){
    this.username = rows.username;
    this.avatar = rows.avatar;
    this.email = rows.email;
  }

  static async insert({ username, avatar, email }){
    const { rows } = await pool.query(
      `
        INSERT INTO users (username, avatar, email)
        VALUES ($1, $2, $3)
        RETURNING *
      `,
      [username, avatar, email]
    );

    return new GithubUser(rows[0]);
  }

  static async findByUsername({ username }){
    const { rows } = await pool.query(
      `
        SELECT *
        FROM users
        WHERE username=$1
      `,
      [username]
    );

    if (rows.length < 1) return null;
    return new GithubUser(rows[0]);
  }

  toJSON(){
    return { ...this };
  }
};
