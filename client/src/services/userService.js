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

  getUsersRating = async() => {
    let ratingQuery = await http(`/api/users/rating`);
    let rating = await ratingQuery.json();
    return rating;
  }

  getMyProfile = async() => {
    let userQuery = await http('/api/users/me');
    let user = await userQuery.json();
    return user;
  }

}
