import { Link } from 'react-router';
import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import Header from './Header'
import BuildProgress from '../components/ProgressChecklist'

export default class BuildsPage extends React.Component {
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
