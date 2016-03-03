import React from 'react';

export default class LoginButton extends React.Component {

  render() {
    const classNames = 'btn btn-default navbar-btn navbar-right';
    const login = this.props.login;
    return (
      <button className={classNames} onClick={login}>Login</button>
    );
  }

}

LoginButton.propTypes = {
  login: React.PropTypes.func.isRequired
};
