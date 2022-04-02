const { Router } = require('express');
const res = require('express/lib/response');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const Gweet = require('../models/Gweet');


module.exports = Router()
  //get all gweets
  .get('/getAll', authenticate, async (req, res, next) => {
    const gweets = await Gweet.getAllGweets();

    res.json(gweets);
  })
  
  .post('/newgweet', authenticate, async (req, res, next) => {
    const { text, username } = req.body;

    const gweet = await Gweet.insertGweet(text, username);
    res.json(gweet);
  });
