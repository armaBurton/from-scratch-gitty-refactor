const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Quotes = require('../models/Quotes');

module.exports = Router()
  //get array of quotes
  .get('/', authenticate, async (req, res, next) => {
    try {
      const promiseOne = await Quotes.getQuotesOne();
      const promiseTwo = await Quotes.getQuotesTwo();
      const promiseThree = await Quotes.getQuotesThree();
      console.log(`|| promiseThree >`, promiseThree);
      res.json([promiseOne, promiseTwo]);
    } catch (error) {
      next(error);
    }
  });
