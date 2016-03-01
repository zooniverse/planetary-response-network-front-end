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
    this.state = { user: null, selectedProjectIndex: null, selectedSubjectSetId: null };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.updateSelectedProject = this.updateSelectedProject.bind(this);
    this.updateSelectedSubjectSet = this.updateSelectedSubjectSet.bind(this);
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
          this.setState({projects: projects})
        }.bind(this))
     }
  }

  updateSelectedProject(el) {
    console.log('updateSelectedProject(): ', el.target.value);
    this.setState({ selectedProjectIndex: el.target.value })
  }

  updateSelectedSubjectSet(el) {
    console.log('updateSelectedSubjectSet()');
    this.setState({ selectedSubjectSetId: el.target.value })
  }

  renderSubjectSetSelector() {
    var selectedProjectIndex = this.state.selectedProjectIndex

    if(!selectedProjectIndex || !this.state.projects){return}

    console.log('SELECTED PROJECT INDEX = ', selectedProjectIndex);
    var projects = this.state.projects
    var subjectSetOpts = {}
    if(!selectedProjectIndex){
      console.log('DISABLED!');
      subjectSetOpts['disabled']='disabled'
    } else {
      console.log('NOT DISABLED!');
      subjectSetOpts['disabled']=''
    }

    var subject_sets =
      projects[selectedProjectIndex].links.subject_sets.map(function(subject_set, key){
        console.log('SUBJECT SET: ', subject_set);
        return(<option key={key} value={subject_set}>{subject_set}</option>)
      })

    // for(var subject_set in projects[selectedProjectIndex].links.subject_sets){
    //   console.log('SUBJECT SET: ', subject_set);
    // }

    return(
      <select defaultValue='default' onChange={this.updateSelectedSubjectSet} name="subject-set" {...subjectSetOpts}>
        <option value='default' disabled>-- select a subject set --</option>
        {subject_sets}
      </select>
    )
  }

  renderUploader() {
    console.log('renderUploader()');
    if(!this.state.projects){return}

    if(this.state.selectedProjectIndex){
      console.log('PROJECT:', this.state.projects[this.state.selectedProjectIndex].links.subject_sets);
    }

    return(
      <span>
        <label>Use project: &nbsp; </label>
        <select defaultValue='' onChange={this.updateSelectedProject} name="project">
          <option value='' disabled>-- select a project --</option>
          { this.state.projects.map(function(project, key){
              return(<option key={key} displaName={project.display_name} value={key}>{project.display_name}</option>)
            }) }
        </select>

        <br/>
        <label>Upload to subject set: &nbsp; </label>

        {this.renderSubjectSetSelector()}

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
