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

  static getAllGweets(){
    return pool.query(
      `
        SELECT *
        FROM gweets
      `
    ).then(rows => {
      console.log(`|| rows >`, rows.rows);
      return rows.rows.map(row => new Gweet(row));
    });

  }

  static async insertGweet(text, username){
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
