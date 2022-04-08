const { fetch } = require('cross-fetch');


module.exports = class Quotes {
  author;
  content;

  constructor(rows){
    this.author = rows.author;
    this.content = rows.content;
  }

  static getQuotesOne(){
    return fetch('https://programming-quotes-api.herokuapp.com/quotes/random')
      .then(data => data.json())
      .then(dataObj => {
        return { author: dataObj.author,
          content: dataObj.en };
      })
      .then(object => new Quotes(object));
  }

  static getQuotesTwo(){
    return fetch('https://futuramaapi.herokuapp.com/api/quotes/1')
      .then(data => data.json())
      // .then(object => console.log('|| object >', object));
      .then(object => {
        return { author: object[0].character,
          content: object[0].quote };
      })
      .then(quoteObj => new Quotes(quoteObj));
  }

  static getQuotesThree(){
    return fetch('https://api.quotable.io/random')
      .then(data => data.json())
      .then(object => {
        return { author: object.author,
          content: object.content };
      })
      .then(quoteObj => new Quotes(quoteObj));
  }
};

