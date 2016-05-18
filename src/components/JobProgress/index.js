import React, { PropTypes } from 'react';

var checklist = [
    { name: 'fetching_mosaics',    title: 'Fetching mosaics' },
    { name: 'tilizing_mosaics',    title: 'Tilizing mosaic images' },
    { name: 'uploading_images',    title: 'Uploading images' },
    { name: 'deploying_subjects',  title: 'Deploying subjects' },
    { name: 'finished',            title: 'Job completed successfully' }
]

window.checklist = checklist

export default class ProgressChecklist extends React.Component {

  render() {
    return (
      <div className='job-progress'>
        <ul className='job-checklist'>
          {checklist.map(function(task,key){
            var taskStatus = ''
            if(this.props.status){
              taskStatus = this.props.status[task.name].status
            }
            return <li key={key} className={taskStatus}>{task.title}</li>
          }.bind(this))}
        </ul>
      </div>
    )
  }

}
