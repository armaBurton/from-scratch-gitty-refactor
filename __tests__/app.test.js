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

  it('should redirect to the github oath page upon load', async () => {
    const req = await request(app)
      .get('/api/v1/auth/login');

    expect(req.header.location).toMatch(
      'https://github.com/login/oauth/authorize?client_id=fca10e824847706829ae&scope=user&redirect_uri=http://localhost:7890/api/v1/auth/login/callback'
    );
    
  });

  it('should login and redirect users to /api/v1/auth/dashboard', async () => {
    const req = await request
      .agent(app)
      .get('/api/v1/auth/login/callback1?code=42')
      .redirects(1);

    expect(req.body).toEqual({
      avatar: expect.any(String),
      username: 'fake_github_user',
      email: 'not-real@example.com',
      iat: expect.any(Number),
      exp: expect.any(Number)
    });
  });

  it('should sign a user out', async () => {
    //login user
    let req = await request
      .agent(app)
      .get('/api/v1/auth/login/callback1?code1=13')
      .redirects(1);

    expect(req.body).toEqual({
      avatar: expect.any(String),
      username: 'fake_github_user',
      email: 'not-real@example.com',
      iat: expect.any(Number),
      exp: expect.any(Number)
    });

    //logout user, delete cookie
    req = await request.agent(app)
      .delete('/logout/');
    expect(req.body).toEqual({
      status: 404,
      message: 'Not Found'
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
    let req = await request.agent(app)
      .get('/api/v1/gweets/');
    expect(req.body).toEqual(notLoggedIn);

    //login user; redirect to get all gweets
    req = await request.agent(app)
      .get('/api/v1/auth/login/callback2?code=13')
      .redirects(1);

    expect(req.body).toEqual(expected);
  });

  it('should allow a logged in user to post a new gweet', async () => {
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

    //view gweets while not logged in.
    const agent = request.agent(app);

    let req = await agent
      .post('/api/v1/gweets');
    console.log('|| req.body >', req.body);
    expect(req.body).toEqual(notLoggedIn);

    // //try to insert new gweet while not logged in
    req = await agent
      .post('/api/v1/gweets')
      .send(newGweet);

    expect(req.body).toEqual(notLoggedIn);

    // //login user
    req = await agent
      .get('/api/v1/auth/login/callback3?code=13')
      .redirects(1);

    console.log('|| req.body >', req.body);
    expect(req.body).toEqual(loggedInReturn);

    // //post new Gweet
    req = await agent
      .post('/api/v1/gweets/')
      .send(newGweet);

    console.log('|| req.body >', req.body);
    expect(req.body).toEqual(newGweetReturn);
  });

});


