const pool = require('../utils/pool');

module.exports = class Gweet {
  id;
  text;
  username;

  constructor(rows){
    this.id = rows.id;
    this.text = rows.text;
    this.username = rows.username;
  }

  static async getAllGweets(){
    const { rows } = await pool.query(
      `
        SELECT *
        FROM gweets
      `
    );

    return rows.map(row => new Gweet(row));
  }

  static async insertGweet(text, username){
    console.log(`|| text >`, text);
    const { rows } = await pool.query(
      `
        INSERT INTO gweets (text, username)
        VALUES ($1, $2)
        RETURNING *
      `,
      [text, username]
    );
    return new Gweet(rows[0]);
  }

};
