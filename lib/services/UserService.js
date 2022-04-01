const GithubUser = require('../models/GithubUser');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');

module.exports = class UserService {
  static async create(code){
    const token = await exchangeCodeForToken(code);

    const profile = await getGithubProfile(token);
    
    let user = await GithubUser.findByUsername(profile.username);

    if(!user){
      user = await GithubUser.insert(profile);
    }

    return user;
  }
  
};
