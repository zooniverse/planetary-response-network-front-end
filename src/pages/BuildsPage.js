import { Link } from 'react-router';
import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import Header from './Header'
import BuildProgress from '../components/BuildProgress'
import io from 'socket.io-client'
import config from '../config.json'
import prnClient from '../lib/prn-client'

export default class BuildsPage extends React.Component {

  constructor() {
    super()
    this.state = { status: null }
  }

  componentWillMount() {
    // Fetch builds
    // builds.findAll((err, builds) => {
    //   console.log('builds', builds)
    //   if (err) throw err
    //   this.setState({ builds })
    // })
    prnClient.get('builds')
      .then(
        builds => this.setState({ builds }),
        reason => alert('There was an error fetching your builds')
      )
  }

  updateBuildStatus(payload) {
    console.log('updateBuildStatus()', payload)
    this.setState({status: JSON.parse(payload) })
  }

  renderBuildList() {
    if (this.state.builds) {
      let builds = this.state.builds.map((build, i) => {
        return (
          <li key={i}>
            <Link to={'builds/'+build.id}>{build.id}</Link>&nbsp;<i className='delete-build fa fa-times-circle'/>
          </li>
        )
      })
      return (
        <ul>
          {builds}
        </ul>
      )
    }
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
              {this.renderBuildList()}
              {this.props.children}
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}
