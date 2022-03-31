const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('..lib/middleware/authenticate.js', () => {
  return (req, res, next) => {
    req.user = {
      username: 'test_user',
      photoUrl: 'http://image.com/image.png',
    };

    next();
  };
});

describe('from-scratch-gitty routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should redirect to the github oath page upon load', async () => {
    const req = await request(app)
      .get('/api/v1/auth');

    
  });
});
