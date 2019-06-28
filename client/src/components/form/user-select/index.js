import React, { Component } from 'react';
import { http } from 'helpers';

import AsyncSelect from 'react-select/async';
import classnames from 'classnames';

import style from './style.module.css';

const cx = classnames.bind(style);

export default class Select extends Component {
  async componentDidMount() {
    const { userId } = this.props.form.values;

    if (!userId) {
      return;
    }

    const currentUserRequest = await http(`/api/admin/user/${userId}`);
    const { user } = await currentUserRequest.json();

    this.props.form.setFieldValue('userId', {
      label: user.username,
      userId,
    });
  }

  normalizeUsers = users => users.map(({ username, _id }) => ({
    label: username,
    value: _id,
  }));

  usersRequest = async inputValue => {
    const usersRequest = await http(`/api/admin/user/name/${inputValue}`);
    const { users } = await usersRequest.json();

    return this.normalizeUsers(users);
  };

  handleChange = ({ label, value }) => {
    this.props.form.setFieldValue('userId', { label, value });
  };

  render() {
    return (
      <div className={cx('wrapper', this.props.className)}>
        <label className={style.caption}>UserId</label>
        <AsyncSelect
          {...this.props}
          {...this.props.field}
          defaultOptions
          loadOptions={this.usersRequest}
          onChange={this.handleChange}
          onInputChange={this.handleInputChange}
        />
      </div>
    );
  }
}
