import React, { Component } from 'react';

import NotificationService from '../../services/notificationService';
import UserService from '../../services/userService';
import http from '../../services/httpService';

import Button from '../../components/button';
import style from './style.module.css';

class Profile extends Component {
  constructor() {
    super();

    this.userService = new UserService();
    this.notificationService = new NotificationService();

    this.state = {
      formData: {
        username: "",
        email: "",
        about: "",
      },
    };
  }

  handleChange = (event) => {
    event.preventDefault();
    let formData = this.state.formData;
    let name = event.target.name;
    let value = event.target.value;
    formData[name] = value;
    this.setState({formData});
  }


  async componentDidMount(){
    let userData = await this.userService.getMyProfile();
    this.setState({ formData: {
      username: userData.user.username,
      email: userData.user.email,
      about: userData.user.about,
    } });
    
  }
  
  handleSubmit = async e => {
    e.preventDefault();

    let { email, about } = this.state.formData;

    await http('/api/users/me', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        about,
      }),
    });
  
    this.notificationService.show("Your data has been updated.");
  }
  
  render() {
    
    return (
      <div className={style.home_page}>
        <main>
          <h1>Profile settings – {this.state.formData.username}</h1>

          <div className={style.content}>
            {/* <ProfileSidebar withData={false} /> */}

            <div className={style.form_container}>
              <form className={style.form} onSubmit={this.handleSubmit}>
                <div>
                  <label>Username</label>
                  <input
                    type="text"
                    name="username"
                    disabled
                    value={this.state.formData.username}
                  />
                </div>

                <div>
                  <label>Email</label>
                  <input
                    type="text"
                    name="email"
                    value={this.state.formData.email}
                    onChange={this.handleChange}
                  />
                </div>

                <div>
                  <label>About</label>
                  <textarea
                    name="about"
                    value={this.state.formData.about}
                    onChange={this.handleChange}
                  />
                </div>

                <Button appearance={'_basic-accent'} text={'Save changes'} />
              </form>

              {/* <div className={style.password_recovery}>
                <p>You can also change your password if needed</p>
                <a href="/">Change password</a>
              </div> */}
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default Profile;