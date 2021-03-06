import { Link } from 'react-router';
import React, { PropTypes } from 'react';
import BuildProgress from './BuildProgress'
import io from 'socket.io-client'
import config from '../config.json'
import prnClient from '../lib/prn-client'

const socket = io.connect(config.server, {secure: true})

export default class Build extends React.Component {

  constructor() {
    super()
    this.state = {
      build: {}
    }
    this.updateBuildStatus = this.updateBuildStatus.bind(this)
  }

  setBuildById(id) {
    prnClient.get('builds')
      .then(
        builds => {
          let build = builds.filter(build => {
            return build.id === id
          })
          this.setState({ build: build.pop() })
        },
        reason => alert('Build #'+id+' doesn\'t exist')
      )
  }

  componentWillMount() {
    // Fetch build
    this.subscribeToJob(this.props.params.id)
    this.setBuildById(this.props.params.id)
  }

  componentWillReceiveProps(newProps, oldProps) {
    if (!oldProps.params || oldProps.params.id !== newProps.params.id) {
      if (oldProps.params && oldProps.params.id) this.unsubscribeFromJob(oldProps.params.id);
      this.subscribeToJob(newProps.params.id)
      this.setBuildById(this.props.params.id)
    }
  }

  unsubscribeFromJob(id) {
    var subChannel = 'status:'+this.props.params.id
    socket.removeAllListeners(subChannel)
  }

  subscribeToJob(id) {
    // Subscribe to build statuses
    var subChannel = 'status:'+this.props.params.id
    socket.on(subChannel, this.updateBuildStatus)
    socket.on('connect', function(){
      console.log('Socket connected. Listening to channel: ', subChannel);
    })
  }

  updateBuildStatus(payload) {
    var updatedBuild = Object.assign(this.state.build, { status: JSON.parse(payload) })
    this.setState({
      build: updatedBuild
    })
  }

  render() {
    var buildProgressDisplay = null;
    if (this.state.build) {
      if (!this.state.build.status) this.state.build.status = null
      buildProgressDisplay = <BuildProgress status={this.state.build.status} />
    }
    return (
      <div className="build">
        <strong>
          Current Build Status
          ({this.props.params.id})
          {buildProgressDisplay}
        </strong>
      </div>
    );
  }
}
