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

  componentWillUpdate() {
    console.log('*** COMPONENT WILL UPDATE ***');
    Panoptes.auth.checkCurrent()
      .then(function(user) {
        if(user && !this.state.projects) {
          this.fetchUserProjects()
        }
      }.bind(this))
  }

  login() {
    console.log('login(): Logging in user...')
    console.log('PANOPTES = ', Panoptes);
    console.log('PANOPTES APP ID: ', panoptesAppId);
    Panoptes.oauth.signIn('https://localhost:3443')
  }

  logout() {
    Panoptes.oauth.signOut('http://www.google.com')
      .then(user => this.setState({ user }));
  }

  fetchUserProjects() {
    if(this.state.user){
      Panoptes.apiClient.type('projects').get( {owner: this.state.user.display_name} )
        .then(function (projects) {
          // console.log('SUBJECT SETS: ', project.links.subject_sets);
          this.setState({projects: projects})
          console.log('THIS IS ', this);
        }.bind(this))
     }
  }

  updateSelectedProject() {
    console.log('updateSelectedProject()');
  }

  renderUploader() {
    return(
      <span>
        <p><strong>Upload a KML file</strong></p>
        <label>Use project: &nbsp; </label>
        <select onChange={this.updateSelectedProject} name="project">
          <option value='foo'>Foo</option>
          <option value='bar'>Bar</option>

          { /*this.state.projects.map(function(project, i){
              return(<option value={subject_set}>{subject_set}</option>)
            })*/ }
        </select>

        <br/>
        <label>Upload to subject set: &nbsp; </label>
        <select onChange={this.updateSelectedProject} name="subject-set">
          <option value='foo'>Foo</option>
          <option value='bar'>Bar</option>

          { /*this.state.projects.map(function(project, i){
              return(<option value={subject_set}>{subject_set}</option>)
            })*/ }
        </select>

        <form method='POST' encType='multipart/form-data' action={UPLOAD_TARGET} className='uploader'>
          <label htmlFor='file'>Drop a file here, or click to browse</label>
          <input id='file' type='file' name='file'/>
            <button type='submit'>Upload</button>
        </form>
      </span>
    )
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
              this.renderUploader() :
              <p><strong>Please log in to upload a file.</strong></p>}

          </div>
        </div>
      </DocumentTitle>
    );
  }
}
