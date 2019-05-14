import React, { Fragment } from 'react';
import { ReactComponent as AvatarPlaceholder } from 'assets/avatar-placeholder.svg';

const UserPlaceholder = ({ username, userpic, role }) => <Fragment>
  {userpic
    ? <img className={style.avatar_circle} src={userpic} alt="userpic" />
    : <AvatarPlaceholder />
  }

  <div>
    {username && <span>{username}</span>}
    {role && <span>{role}</span>}
  </div>

  <span>{isMenuIcon}</span>
</Fragment>;

export default UserPlaceholder;