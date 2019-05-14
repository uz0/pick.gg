import http from './httpService';
import BasicService from './basicService';

export default class UserService extends BasicService {
  async getAllUsers() {
    const usersQuery = await http('/public/users');
    const users = await usersQuery.json();
    return users;
  }

  async getUserDataById(id) {
    const userQuery = await http(`/public/users/${id}`);
    const user = await userQuery.json();
    return user;
  }

  async getUsersRating() {
    const ratingQuery = await http(`/public/users/rating`);
    const rating = await ratingQuery.json();
    return rating;
  }

  updateProfile(payload) {
    return this.request('POST', '/api/users/me', payload);
  }

  getMyProfile() {
    return this.request('GET', '/api/users/me');
  }
}
