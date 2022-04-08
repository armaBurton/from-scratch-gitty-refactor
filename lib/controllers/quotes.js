const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Quotes = require('../models/Quotes');

module.exports = Router()
  //get array of quotes
  .get('/', authenticate, (req, res, next) => {
    const promiseOne = Quotes.getQuotesOne();
    const promiseTwo = Quotes.getQuotesTwo();
    const promiseThree = Quotes.getQuotesThree();

    Promise.all([promiseOne, promiseTwo, promiseThree])
      .then(values => res.json(values))
      .catch(next);
  });
