import http from './http-service';
import BasicService from './basic-service';

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

  async getUserRewards() {
    const rewards = await http('/api/rewards/user').then(response => response.json());
    return rewards;
  }

  updateProfile(payload) {
    return this.request('POST', '/api/users/me', payload);
  }

  getMyProfile() {
    return this.request('GET', '/api/users/me');
  }
}
