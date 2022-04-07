const GithubUser = require('../models/GithubUser');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');

module.exports = class UserService {
  static create(code){
    
    let githubProfile;
    return exchangeCodeForToken(code)
      .then((token) => {
        return getGithubProfile(token);
      })
      .then((profile) => {
        githubProfile = profile;
        return GithubUser.findByUsername(profile.username);
      })
      .then(user => {
        if(!user){
          return GithubUser.insert(githubProfile);
        } else {
          return user;
        }
      });

  }
  
};
