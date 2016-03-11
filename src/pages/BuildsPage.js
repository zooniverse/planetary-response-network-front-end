import { Link } from 'react-router';
import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import Header from './Header'
import BuildProgress from '../components/ProgressChecklist'
import io from 'socket.io-client'

export default class BuildsPage extends React.Component {

  componentWillMount() {
      this.socket = io.connect('http://localhost:3736')
      // this.socket.on('connect', this.connect(this.socket))
      this.socket.on('build status', this.updateBuildStatus)
  }
  // connect() {
  //   console.log('CONNECTED TO SOCKET: ', this.socket)
  //   // console.log('Connected with socket ID: ', this.socket.id)
  //   // alert('Connected with socket ID: ', this.socket.id)
  // }

  updateBuildStatus(payload) {
    console.log('updateBuildStatus()', payload)
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
              <BuildProgress />
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}
