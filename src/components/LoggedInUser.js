import React from 'react';

export default class LoggedInUser extends React.Component {

  render() {
    const classNames = 'btn btn-default navbar-btn navbar-right';
    const logout = this.props.logout;
    return (
      <button className={classNames} onClick={logout}>Log out {this.props.user.displayName}</button>
    );
  }

}

LoggedInUser.propTypes = {
  logout: React.PropTypes.func.isRequired,
  user: React.PropTypes.object.isRequired
};
