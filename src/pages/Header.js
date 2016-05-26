import React from 'react'
import { Link } from 'react-router'
import LoginButton from '../components/LoginButton.js'
import LoggedInUser from '../components/LoggedInUser.js'
import auth from '../lib/auth.js'

export default class Header extends React.Component {

  constructor() {
    super();
    this.state = { user: null };
  }

  componentDidMount() {
    auth.getUser()
      .then(user => this.setState({user}));
  }

  renderNav() {
    const mainNavDisplay = this.state.user ? (
      <ul className="nav navbar-nav">
        <li><Link to="/upload">Upload</Link></li>
        <li><Link to="/jobs">Jobs</Link></li>
        <li><Link to="/settings">Settings</Link></li>
      </ul>
    ) : null;
    return (
      <div id="navbar-collapse" className="collapse navbar-collapse">
        {mainNavDisplay}
        <ul className="nav navbar-nav navbar-right">
          <li>
            {this.state.user ?
              <LoggedInUser user={this.state.user} logout={auth.logout.bind(auth)}/> :
              <LoginButton login={auth.login.bind(auth)}/>}
          </li>
        </ul>
      </div>
    );
  }

  render() {
    console.log('this.state.user = ', this.state.user);
    return (
      <nav className="navbar navbar-default navbar-static-top">
        <div className="container">
          <div className="navbar-header">
            {this.renderNav()}
            <button type="button" data-toggle="collapse" data-target="#navbar-collapse" className="navbar-toggle collapsed">
              <span className="sr-only">Toggle Navigation</span>
              <span className="icon-bar"></span><i className="fa fa-bars fa-2x"/><span className="icon-bar"></span>
            </button>
          </div>
        </div>
      </nav>
    );
  }
}
