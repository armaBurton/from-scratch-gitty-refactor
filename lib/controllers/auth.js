const { Router } = require('express');
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
    try {
      const user = await UserService.create(req.query.code);

      res
        .cookie(process.env.COOKIE_NAME, jwt.sign(user), {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS
        })
        .redirect('/api/v1/auth/dashboard');
    } catch (error) {
      next(error);
    }
  })
  
  .get('/dashboard', authenticate, async (req, res) => {
    res.json(req.user);
  });
