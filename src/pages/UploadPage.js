import {server, panoptesAppId} from '../config.json'
import { Link } from 'react-router'
import React, { PropTypes } from 'react'
import DocumentTitle from 'react-document-title'
import Header from './Header'
import Panoptes from 'panoptes-client'

const UPLOAD_TARGET = server + '/aois'

export default class UploadPage extends React.Component {

  constructor() {
    super();
    this.state = { user: null };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    console.log(UPLOAD_TARGET) // for uploading aois
    Panoptes.auth.checkCurrent()
      .then(user => this.setState({user}));
  }

  login() {
    console.log('login(): Logging in user...')
    console.log('PANOPTES = ', Panoptes);
    console.log('PANOPTES APP ID: ', panoptesAppId);
    return Panoptes.oauth.signIn('https://localhost:3443')
  }

  logout() {
    Panoptes.oauth.signOut('http://www.google.com')
      .then(user => this.setState({ user }));
  }

  render() {
    return (
      <DocumentTitle title='AOI Uploader'>
        <div className='UploadPage'>
          <Header/>
          <div className='container'>
            <h2 className='text-center'>Upload</h2>
            <hr/>
            {this.state.user ?
              <span>
                <p><strong>Upload a KML file</strong></p>
                <form method='POST' encType='multipart/form-data' action={UPLOAD_TARGET} className='uploader'>
                  <label htmlFor='file'>Drop a file here, or click to browse</label>
                  <input id='file' type='file' name='file'/>
                    <button type='submit'>Upload</button>
                </form>
              </span> :
              <p><strong>Please log in to upload a file.</strong></p>}

          </div>
        </div>
      </DocumentTitle>
    );
  }
}
