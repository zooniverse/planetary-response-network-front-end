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
    // console.log('*** COMPONENT WILL UPDATE ***');
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
    this.setState({
      selectedProjectIndex: el.target.value,
      selectedSubjectSetId: null
    })
  }

  updateSelectedSubjectSet(el) {
    this.setState({ selectedSubjectSetId: el.target.value })
  }

  renderProjectSelector() {
    var projects = this.state.projects
    var selectedProjectIndex = this.state.selectedProjectIndex
    var projectOptions = projects ?
      projects.map(function(project, key){
        return(<option key={key} displaName={project.display_name} value={key}>{project.display_name}</option>)
      }) : null

    var defaultText = projects ? '-- Select a project --' : '-- No projects avaiable --'
    var value = selectedProjectIndex ? selectedProjectIndex : 'default'

    return(
      <select defaultValue='default' value={value} onChange={this.updateSelectedProject} name="project">
        <option value='default' disabled>{defaultText}</option>
        {projectOptions}
      </select>
    )
  }

  renderSubjectSetSelector() {
    var selectedProjectIndex = this.state.selectedProjectIndex
    var selectedSubjectSetId = this.state.selectedSubjectSetId
    var projects = this.state.projects

    if(projects && selectedProjectIndex) {
      var subjectSets = projects[selectedProjectIndex].links.subject_sets
    }

    /* Generate subject set options, or null if none available */
    var subjectSetOptions = subjectSets ?
      projects[selectedProjectIndex].links.subject_sets.map(function(subject_set, key){
        return(<option key={key} value={subject_set}>{subject_set}</option>)
      }) : null

    var value = selectedSubjectSetId ? selectedSubjectSetId : 'default'
    var disabled = selectedProjectIndex ? '' : 'disabled'
    var defaultText = subjectSetOptions ? '-- Select a subject set --' : '-- No subject sets available --'

    return(
      <select defaultValue='default' value={value} onChange={this.updateSelectedSubjectSet} name='subject-set' disabled={disabled}>
        <option value='default' disabled>{defaultText}</option>
        {subjectSetOptions}
      </select>
    )
  }

  renderUploader() {
    return(
      <span>
        <label>Use project: &nbsp; </label>
        {this.renderProjectSelector()}

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
