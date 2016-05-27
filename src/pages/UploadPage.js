import {host, client} from '../config.js' // get PRN host
import { Link } from 'react-router'
import React, { PropTypes } from 'react'
import DocumentTitle from 'react-document-title'
import Header from './Header'
import auth from '../lib/auth'
import prnClient from '../lib/prn-client'

const UPLOAD_TARGET = host+'/aois?redirect='+client+'/builds'

export default class UploadPage extends React.Component {

  constructor() {
    super()
    this.state = {
      user: null,
      projectKey: null,
      subjectSetKey: null,
      providerKey: 'planet-api'
    }
    this.updateSelectedProject    = this.updateSelectedProject.bind(this)
    this.updateSelectedSubjectSet = this.updateSelectedSubjectSet.bind(this)
    this.updateSelectedProvider   = this.updateSelectedProvider.bind(this)
  }

  componentDidMount() {
    auth.getUser()
      .then(user => {
          this.setState({user})
        }
      );
  }

  componentWillUpdate() {
    // console.log('*** COMPONENT WILL UPDATE ***');
    auth.getUser()
      .then(user => {
        if(user && !this.state.projects) {
          this.fetchUserProjects()
        }
      })
  }

  fetchUserProjects() {
    if(this.state.user){
      prnClient.get('projects', {owner: this.state.user.displayName} )
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

  updateSelectedProvider(el) {
    this.setState({
      providerKey: el.target.value
    }, function(){  console.log('PROVIDER = ', this.state.providerKey); })
  }

  renderProviderSelector() {
    return(
        <span>
          &nbsp;
          <input type='radio' name='provider' value='planet-api' defaultChecked={true} onChange={this.updateSelectedProvider}/>&nbsp;Planet Labs
          &nbsp;
          <input type='radio' name='provider' value='sentinel-2' onChange={this.updateSelectedProvider}/>&nbsp;ESA (Sentinel-2)
        </span>
    )
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
    var provider = this.state.providerKey
    var project_id = this.state.projectKey ? this.state.projects[this.state.projectKey].id : ''
    var subject_set_id = (this.state.projectKey && this.state.subjectSetKey) ? this.state.projects[this.state.projectKey].links.subject_sets[this.state.subjectSetKey] : ''

    return(
      <span>

        <label>Imagery Provider:</label>
        {this.renderProviderSelector()}

        <br/>

        <label>Use project: &nbsp; </label>
        {this.renderProjectSelector()}
        <br/>
        <label>Upload to subject set: &nbsp; </label>
        {this.renderSubjectSetSelector()}

        <form method='POST' encType='multipart/form-data' action={UPLOAD_TARGET}>
          <label>Number of times to repeat job &nbsp; </label>
          <select id='repeat' name='repeat'>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
          </select>
          <br/>
          <label>Interval between jobs &nbsp; </label>
          <select id='interval' name='interval'>
          <option value='60'>1 min</option>
          <option value='300'>5 mins</option>
          <option value='3600'>1 hour</option>
          <option value='86400'>1 day</option>
          </select>
          <div className='uploader'>
            <label htmlFor='file'>Drop a file here, or click to browse</label>
            <input name='provider' value={provider} type='hidden'/>
            <input name='project_id' value={project_id} type='hidden'/>
            <input name='subject_set_id' value={subject_set_id} type='hidden'/>
            <input disabled={disabled} id='file' type='file' name='file'/>
            <button type='submit'>Upload</button>
          </div>
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
