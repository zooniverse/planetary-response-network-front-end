import {server, panoptesAppId} from '../config.json'
import { Link } from 'react-router'
import React, { PropTypes } from 'react'
import DocumentTitle from 'react-document-title'
import Header from './Header'
import Panoptes from 'panoptes-client'

const UPLOAD_TARGET = server + '/aois'

export default class UploadPage extends React.Component {

  constructor() {
    super()
    this.state = {
      user: null,
      projectKey: null,
      subjectSetKey: null
    }
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.updateSelectedProject = this.updateSelectedProject.bind(this)
    this.updateSelectedSubjectSet = this.updateSelectedSubjectSet.bind(this)
  }

  componentDidMount() {
    console.log(UPLOAD_TARGET) // for uploading aois
    Panoptes.auth.checkCurrent()
      .then(user => this.setState({user}))
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
      projectKey: el.target.value,
      subjectSetKey: null
    })
  }

  updateSelectedSubjectSet(el) {
    this.setState({
      subjectSetKey: el.target.value
    })
  }

  renderProjectSelector() {
    var projects = this.state.projects
    var projectKey = this.state.projectKey
    var projectOptions = projects ?
      projects.map(function(project, key){
        return(<option key={key} displaName={project.display_name} value={key}>{project.display_name}</option>)
      }) : null

    var defaultText = projects ? '-- Select a project --' : '-- No projects avaiable --'
    var value = projectKey ? projectKey : 'default'

    return(
      <select defaultValue='default' value={value} onChange={this.updateSelectedProject} name="project">
        <option value='default' disabled>{defaultText}</option>
        {projectOptions}
      </select>
    )
  }

  renderSubjectSetSelector() {
    var projectKey = this.state.projectKey
    var subjectSetKey = this.state.subjectSetKey
    var projects = this.state.projects

    if(projects && projectKey) {
      var subjectSets = projects[projectKey].links.subject_sets
      console.log('SUBJECT_SETS = ', subjectSets);
    }

    /* Generate subject set options, or null if none available */
    var subjectSetOptions = subjectSets ?
      subjectSets.map(function(subjectSetId, key){
        return(<option key={key} value={key}>{subjectSetId}</option>)
      }) : null

    var value = subjectSetKey ? subjectSetKey : 'default'
    var disabled = projectKey ? '' : 'disabled'
    var defaultText = subjectSetOptions ? '-- Select a subject set --' : '-- No subject sets available --'

    return(
      <select defaultValue='default' value={value} onChange={this.updateSelectedSubjectSet} name='subject-set' disabled={disabled}>
        <option value='default' disabled>{defaultText}</option>
        {subjectSetOptions}
      </select>
    )
  }

  renderUploader() {
    // disable uploader until project_id and subject_set_id are selected
    var disabled = (this.state.projectKey && this.state.subjectSetKey) ? false : true
    var project_id = this.state.projectKey ? this.state.projects[this.state.projectKey].id : ''
    var subject_set_id = (this.state.projectKey && this.state.subjectSetKey) ? this.state.projects[this.state.projectKey].links.subject_sets[this.state.subjectSetKey] : ''

    return(
      <span>
        <label>Use project: &nbsp; </label>
        {this.renderProjectSelector()}
        <br/>
        <label>Upload to subject set: &nbsp; </label>
        {this.renderSubjectSetSelector()}

        <form method='POST' encType='multipart/form-data' action={UPLOAD_TARGET} className='uploader'>
          <label htmlFor='file'>Drop a file here, or click to browse</label>
          <input name='project_id' value={project_id} type='hidden'/>
          <input name='subject_set_id' value={subject_set_id} type='hidden'/>
          <input disabled={disabled} id='file' type='file' name='file'/>
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
