import React from 'react'
import { Link } from 'react-router'
import LoginButton from '../components/LoginButton.js'
import Panoptes from 'panoptes-client'
import {panoptesAppId} from 'panoptes-config.json'

export default class Header extends React.Component {

  login() {
    console.log('login(): Logging in user...')
    console.log('PANOPTES = ', Panoptes);
    console.log('PANOPTES APP ID: ', panoptesAppId);
    // return Panoptes.oauth.signIn(redirectUrl)
  }

  render() {
    return (
      <nav className="navbar navbar-default navbar-static-top">
        <div className="container">
          <div className="navbar-header">
            <button type="button" data-toggle="collapse" data-target="#navbar-collapse" className="navbar-toggle collapsed">
              <span className="sr-only">Toggle Navigation</span>
              <span className="icon-bar"></span><span className="icon-bar"></span><span className="icon-bar"></span>
            </button>
          </div>
          <div id="navbar-collapse" className="collapse navbar-collapse">
            <ul className="nav navbar-nav">
              <li><Link to="/upload">Upload</Link></li>
              <li><Link to="/builds">Builds</Link></li>
              <li><Link to="/settings">Settings</Link></li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li><LoginButton login={this.login}/></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
