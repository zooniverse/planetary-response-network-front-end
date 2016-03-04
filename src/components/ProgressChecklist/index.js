import React, { PropTypes } from 'react';

export default class ProgressChecklist extends React.Component {

  render() {
    return (
      <div className='build-progress'>
        <ul className='build-checklist'>
          <li className='done'>Fetching mosaics</li>
          <li className='done'>Tilizing mosaic images</li>
          <li className='in-progress'>Generating subject manifest</li>
          <li className='error'>Uploading images</li>
          <li>Deploying subjects</li>
          <li>Build completed successfully</li>
        </ul>
      </div>
    )
  }

}
