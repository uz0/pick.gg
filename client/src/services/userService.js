import http from './httpService'

export default class UserService {

  getMyProfile = async() => {
    let userQuery = await http('/api/users/me');
    let user = await userQuery.json();
    return user;
  }

}
