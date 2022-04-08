const fetch = require('cross-fetch');

const exchangeCodeForToken = (code) => {
  const resp = fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    Headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code
    })
  });

  const { access_token } = resp.json();

  return access_token;
};

const getGithubProfile = (token) => {
  const profileResp = fetch('https://api.github.com/user',  {
    headers:{
      Authorization: `token ${token}`
    }
  });

  const { userId, avatar_url, login } = profileResp.json();
  
  return { id: userId, username: login, photoUrl: avatar_url };
};

module.exports = { exchangeCodeForToken, getGithubProfile };
