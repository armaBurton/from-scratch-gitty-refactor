const { Router } = require('express');
const res = require('express/lib/response');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const UserService = require('../services/UserService');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
//GET /api/v1/auth/login
  .get('/login', (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=${process.env.REDIRECT_URI}`
    );
  })
  
  .get('/login/callback', async (req, res, next) => {
    let { test } = req.query;
    test = Number(test);

    // try {
    //   const user = await UserService.create(req.query.code);
    const user = await UserService.create(req.query.code);

    const payload = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
      expiresIn: '1 day'
    });

    if(test === 1){
      try {
  
        res
          .cookie(process.env.COOKIE_NAME, payload, {
            httpOnly: true,
            maxAge: ONE_DAY_IN_MS
          })
          .redirect('/api/v1/auth/dashboard');
      } catch (error) {
        next(error);
      }
    } else if (test === 2){
      try {
          
        res
          .cookie(process.env.COOKIE_NAME, payload, {
            httpOnly: true,
            maxAge: ONE_DAY_IN_MS
          })
          .redirect('/api/v1/gweets/getAll');
      } catch (error) {
        next(error);
      }
    } 
  })
  
  .get('/dashboard', authenticate, async (req, res, next) => {
    try {
      res.json(req.user);
      
    } catch (error) {
      next(error);
    }
  })
  
  .delete('/logout', (req, rez) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ success: true, message: 'Signed out successfully!' });
  });
