import { Link } from 'react-router';
import React, { PropTypes } from 'react';
import JobProgress from './JobProgress'
import io from 'socket.io-client'
import config from '../config.json'
import prnClient from '../lib/prn-client'

const socket = io.connect(config.apiRoot, {secure: true})

export default class Job extends React.Component {

  constructor() {
    super()
    this.state = {
      job: {}
    }
    this.updateJobStatus = this.updateJobStatus.bind(this)
  }

  setJobById(id) {
    prnClient.get('jobs')
      .then(
        jobs => {
          let job = jobs.filter(job => {
            return job.id === id
          })
          this.setState({ job: job.pop() })
        },
        reason => alert('Job #'+id+' doesn\'t exist')
      )
  }

  componentWillMount() {
    // Fetch job
    this.subscribeToJob(this.props.params.id)
    this.setJobById(this.props.params.id)
  }

  componentWillReceiveProps(newProps, oldProps) {
    if (!oldProps.params || oldProps.params.id !== newProps.params.id) {
      if (oldProps.params && oldProps.params.id) this.unsubscribeFromJob(oldProps.params.id);
      this.subscribeToJob(newProps.params.id)
      this.setJobById(this.props.params.id)
    }
  }

  unsubscribeFromJob(id) {
    var subChannel = 'status:'+this.props.params.id
    socket.removeAllListeners(subChannel)
  }

  subscribeToJob(id) {
    // Subscribe to job statuses
    var subChannel = 'status:'+this.props.params.id
    socket.on(subChannel, this.updateJobStatus);
    socket.on('connect', function(){
      console.log('Socket connected. Listening to channel: ', subChannel);
    })
  }

  updateJobStatus(payload) {
    var updatedJob = Object.assign(this.state.job, { status: JSON.parse(payload) })
    this.setState({
      job: updatedJob
    })
  }

  render() {
    var jobProgressDisplay = null;
    if (this.state.job) {
      if (!this.state.job.status) this.state.job.status = null
      jobProgressDisplay = <JobProgress status={this.state.job.status} />
    }
    return (
      <div className="job">
        <strong>
          Current Job Status
          ({this.props.params.id})
          {jobProgressDisplay}
        </strong>
      </div>
    );
  }
}
