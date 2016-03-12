import React, { PropTypes } from 'react';

var checklist = [
    { name: 'fetching_mosaics',    title: 'Fetching mosaics' },
    { name: 'tilizing_mosaics',    title: 'Tilizing mosaic images' },
    { name: 'generating_manifest', title: 'Generating subject manifest' },
    { name: 'uploading_images',    title: 'Uploading images' },
    { name: 'deploying_subjects',  title: 'Deploying subjects' },
    { name: 'finished',            title: 'Build completed successfully' }
]

window.checklist = checklist

export default class ProgressChecklist extends React.Component {

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps() nextProps = ', nextProps);
  }

  render() {
    console.log('************* PROPS: ', this.props);
    return (
      <div className='build-progress'>
        <ul className='build-checklist'>
          {checklist.map(function(task,i){
            // console.log('INDEX OF: ', checklist.indexOf(task));
            var taskStatus = (task.name == this.props.status) ? 'in-progress' : ''
            return <li className={taskStatus}>{task.title}</li>
          }.bind(this))}
        </ul>
      </div>
    )
  }

}
