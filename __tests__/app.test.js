const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

// jest.mock('..lib/middleware/authenticate.js', () => {
//   return (req, res, next) => {
//     req.user = {
//       username: 'test_user',
//       photoUrl: 'http://image.com/image.png',
//     };

//     next();
//   };
// });

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
      .get('/api/v1/auth/login/callback?code=42')
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
      .get('/api/v1/auth/login/callback?code=dawefawef')
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
});


