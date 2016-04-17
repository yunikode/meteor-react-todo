import React, { Component, PropTypes } from 'react'

// Task component - represents a singe todo item
export default class Task extends Component {
  render() {
    return (
      <li>{this.props.task.text}</li>
    )
  }
}

Task.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is requried
  task: PropTypes.object.isRequired
}
