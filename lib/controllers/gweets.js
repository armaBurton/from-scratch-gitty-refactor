const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Gweet = require('../models/Gweet');


module.exports = Router()
  //get all gweets
  .get('/', authenticate, (req, res, next) => {
    try {
      return Gweet.getAllGweets()
        .then(gweet => res.json(gweet));
        
    } catch (error) {
      next(error);
    }
    
  })

  
  .post('/', authenticate, (req, res, next) => {
    try {
      const { text, username } = req.body;
  
      return Gweet.insertGweet(text, username)
        .then(gweet => res.json(gweet));
    } catch (error) {
      next(error);
    }
  });
