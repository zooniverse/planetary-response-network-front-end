import { Link } from 'react-router';
import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import Header from './Header'
import BuildProgress from '../components/BuildProgress'
import io from 'socket.io-client'

export default class BuildsPage extends React.Component {

  constructor() {
    super()
    this.state = { status: null }
    this.updateBuildStatus = this.updateBuildStatus.bind(this)
  }

  componentWillMount() {
      this.socket = io.connect('http://localhost:3736')
      this.socket.on('build status', this.updateBuildStatus)
  }

  updateBuildStatus(payload) {
    // console.log('updateBuildStatus()', payload)
    this.setState({status: payload})
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
              </p>
              <BuildProgress status={this.state.status} />
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}
