import { Link } from 'react-router';
import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import Header from './Header'
import BuildProgress from '../components/BuildProgress'
import io from 'socket.io-client'
import config from '../config.json'

export default class BuildsPage extends React.Component {

  constructor() {
    super()
    this.state = { status: null }
    this.updateBuildStatus = this.updateBuildStatus.bind(this)
  }

  componentWillMount() {
    var subChannel = 'status_'+this.props.location.query.job_id
    this.socket = io.connect(config.server, {secure: true})
    this.socket.on(subChannel, this.updateBuildStatus)
    this.socket.on('connect', function(){
      console.log('Socket connected. Listening to channel: ', subChannel);
    })
  }

  updateBuildStatus(payload) {
    console.log('updateBuildStatus()', payload)
    this.setState({status: JSON.parse(payload) })
  }

  render() {
    return (
      <DocumentTitle title='AOI Uploader'>
        <div className='BuildsPage'>
          <Header/>
          <div className='container'>
            <h2 className='text-center'>Current Builds</h2>
            <hr />
            <div className='jumbotron'>
              <p>
                <strong>
                  Current Build Status
                </strong>
                {' '}
                ({this.props.location.query.job_id})
              </p>
              <BuildProgress status={this.state.status} />
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}
