import {server, panoptesAppId} from '../config.json'
import { Link } from 'react-router'
import React, { PropTypes } from 'react'
import DocumentTitle from 'react-document-title'
import Header from './Header'

const UPLOAD_TARGET = server + '/aois'
import Panoptes from 'panoptes-client'

export default class UploadPage extends React.Component {
  componentDidMount() {
    console.log(UPLOAD_TARGET)
  }

  render() {
    return (
      <DocumentTitle title='AOI Uploader'>
        <div className='UploadPage'>
          <Header/>
          <div className='container'>
            <h2 className='text-center'>Upload</h2>
            <hr/>
            <p>
              <strong>
                Upload a KML file
              </strong>
            </p>
            <form method='POST' encType='multipart/form-data' action={UPLOAD_TARGET} className='uploader'>
              <label htmlFor='file'>Drop a file here, or click to browse</label>
              <input id='file' type='file' name='file'/>
                <button type='submit'>Upload</button>
            </form>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}
