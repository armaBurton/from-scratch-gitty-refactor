const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/utils/github');

describe('from-scratch-gitty routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should redirect to the github oath page upon load', () => {
    return request(app)
      .get('/api/v1/auth/login')
      .then(req => {
        return expect(req.header.location).toMatch('https://github.com/login/oauth/authorize?client_id=fca10e824847706829ae&scope=user&redirect_uri=http://localhost:7890/api/v1/auth/login/callback');
      });
    
  });

  it('should login and redirect users to /api/v1/auth/dashboard', () => {
    return request
      .agent(app)
      .get('/api/v1/auth/login/callback1?code=42')
      .redirects(1)
      .then(req => {
        expect(req.body).toEqual({
          avatar: expect.any(String),
          username: 'fake_github_user',
          email: 'not-real@example.com',
          iat: expect.any(Number),
          exp: expect.any(Number)
        });
      });

  });

  it('should sign a user out', () => {
    //login user
    return request
      .agent(app)
      .get('/api/v1/auth/login/callback1?code1=13')
      .redirects(1)
      .then(req => {
        return expect(req.body).toEqual({
          avatar: expect.any(String),
          username: 'fake_github_user',
          email: 'not-real@example.com',
          iat: expect.any(Number),
          exp: expect.any(Number)
        });
      })
      .then(() => request.agent(app)
        .delete('/logout/'))
      .then(req => {
        return expect(req.body).toEqual({
          status: 404,
          message: 'Not Found'
        });
      });
  });

  it('should get a list of all posts by all users', async () => {
    const expected = [
      {
        id: '1',
        text: 'It\'s good, but I\'ve had better',
        username: 'picky_butt'
      },
      {
        id: '2',
        text: 'My grandma slaps harder',
        username: 'whack_a_mole'
      }
    ];

    const notLoggedIn = { status: 401, message: 'You must be signed in to continue' };
    
    //try to get gweets not logged in
    return request.agent(app)
      .get('/api/v1/gweets/')
      .then(req => expect(req.body).toEqual(notLoggedIn))
      .then(() => request.agent(app)
        .get('/api/v1/auth/login/callback2?code=13')
        .redirects(1))
      .then(req => expect(req.body).toEqual(expected));
  });

  it('should allow a logged in user to post a new gweet', () => {
    const newGweet = {
      text: 'I\'m not really here, Are you?',
      username: 'fake_github_user'
    };
    
    const newGweetReturn = {
      id: expect.any(String),
      text: 'I\'m not really here, Are you?',
      username: 'fake_github_user'
    };

    const notLoggedIn = { status: 401, message: 'You must be signed in to continue' };

    const loggedInReturn = [
      {
        id: '1',
        text: 'It\'s good, but I\'ve had better',
        username: 'picky_butt'
      },
      {
        id: '2',
        text: 'My grandma slaps harder',
        username: 'whack_a_mole'
      }
    ];

    const agent = request.agent(app);

    return agent
      .post('/api/v1/gweets') //view Gweets while not logged in
      .then(req => expect(req.body).toEqual(notLoggedIn))
      .then(() => agent  //try to insert a new gweet while not logged in
        .post('/api/v1/gweets')
        .send(newGweet))
      .then(req => expect(req.body).toEqual(notLoggedIn))
      .then(() => agent //login user
        .get('/api/v1/auth/login/callback2?code13')
        .redirects(1))
      .then(req => expect(req.body).toEqual(loggedInReturn))
      .then(() => agent  //post new Gweet
        .post('/api/v1/gweets/')
        .send(newGweet))
      .then(req => expect(req.body).toEqual(newGweetReturn));
    
  });

  it('should return an array of three random quotes', () => {
    const agent = request.agent(app);

    const expected = [{
      author: expect.any(String), 
      content: expect.any(String)
    }, {
      author: expect.any(String), 
      content: expect.any(String)
    }, {
      author: expect.any(String), 
      content: expect.any(String)
    }];

    //login user
    return agent
      .get('/api/v1/auth/login/callback2?code=13')
      .redirects(1)
      .then(() => agent.get('/api/v1/quotes'))
      .then(req => expect(req.body).toEqual(expected));

  });

});
