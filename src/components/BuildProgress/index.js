import React, { PropTypes } from 'react';

var checklist = [
    { name: 'fetching_mosaics',    title: 'Fetching mosaics' },
    { name: 'tilizing_mosaics',    title: 'Tilizing mosaic images' },
    { name: 'uploading_images',    title: 'Uploading images' },
    { name: 'deploying_subjects',  title: 'Deploying subjects' },
    { name: 'finished',            title: 'Build completed successfully' }
]

window.checklist = checklist

export default class ProgressChecklist extends React.Component {

  render() {
    return (
      <div className='build-progress'>
        <ul className='build-checklist'>
          {checklist.map(function(task,key){
            var taskStatus = ''
            if( typeof this.props.status !== undefined && this.props.status !== null){
              taskStatus = this.props.status[task.name].status
            }
            return <li key={key} className={taskStatus}>{task.title}</li>
          }.bind(this))}
        </ul>
      </div>
    )
  }

}
