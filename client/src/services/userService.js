import http from './httpService';
import BasicService from './basicService';

export default class UserService extends BasicService {

  getAllUsers = async () => {
    let usersQuery = await http('/api/users');
    let users = await usersQuery.json();
    return users;
  }

  getUserDataById = async (id) => {
    let userQuery = await http(`/api/users/${id}`);
    let user = await userQuery.json();
    return user;
  }

  getUsersRating = async () => {
    let ratingQuery = await http(`/api/users/rating`);
    let rating = await ratingQuery.json();
    return rating;
  }

  updateProfile = (payload) => {
    return this.request('POST', '/api/users/me', payload);
  }

  getMyProfile = () => {
    return this.request('GET', '/api/users/me');
  }

}
