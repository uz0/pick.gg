import http from './httpService'

export default class UserService {

  getAllUsers = async() => {
    let usersQuery = await http('/api/users');
    let users = await usersQuery.json();
    return users;
  }

  getUserDataById = async(id) => {
    let userQuery = await http(`/api/users/${id}`);
    let user = await userQuery.json();
    return user;
  }

  getMyProfile = async() => {
    let userQuery = await http('/api/users/me');
    let user = await userQuery.json();
    return user;
  }

}
