import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import Header from './Header'
import JobProgress from '../components/JobProgress'
import io from 'socket.io-client'
import prnClient from '../lib/prn-client'

export default class JobsPage extends React.Component {

  constructor() {
    super()
    this.state = { status: null }
    this.deleteJob = this.deleteJob.bind(this)
  }

  componentWillMount() {
    prnClient.get('jobs')
      .then(
        jobs => this.setState({ jobs }),
        reason => alert('There was an error fetching your jobs')
      )
  }

  deleteJob(job) {
    console.log('deleteJob: ', job);
    let jobs = this.state.jobs;
    jobs = jobs.filter(ajob => ajob !== job);
    prnClient.delete('jobs', job.id).then(
      () => this.setState({ jobs })
    )
  }

  updateJobStatus(payload) {
    console.log('updateJobStatus()', payload)
    this.setState({status: JSON.parse(payload) })
  }

  renderJobList() {
    console.log('this.state.jobs = ', this.state.jobs);
    if (this.state.jobs != null && this.state.jobs !== 'undefined') {
      if (this.state.jobs.length > 0) {
        let jobs = this.state.jobs.map((job, i) => {
          return (
            <li key={i}>
              <Link to={'jobs/'+job.id}>{job.id}</Link>&nbsp;
              <i className='delete-job fa fa-times-circle' onClick={this.deleteJob.bind(null, job)}/>
            </li>
          )
        })
        return (
          <ul>
            {jobs}
          </ul>
        )
      }
      else {
        return (
          <p>You've got no active jobs.</p>
        )
      }
    } else return null;
  }

  render() {
    return (
      <DocumentTitle title='AOI Uploader'>
        <div className='JobsPage'>
          <Header/>
          <div className='container'>
            <h2 className='text-center'>Current Jobs</h2>
            <hr />
            <div className='jumbotron'>
              {this.renderJobList()}
              {this.props.children}
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}
