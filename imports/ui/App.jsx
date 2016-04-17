import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { createContainer } from 'meteor/react-meteor-data'

import { Tasks } from '../api/tasks.js' // The actual tasks, not the component

import Task from './Task' // The task rendering component

// App component - represents the whole app
class App extends Component {
  // the only need for the event is to prevent a page reload
  handleSubmit(e) {
    e.preventDefault()

    // Find the text field vie the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim() // 'trim()' to get rid of unnecessary whitespace

    Tasks.insert({
      text, // short form of 'text: text'
      createdAt: new Date()
    })

    ReactDOM.findDOMNode(this.refs.textInput).value = ''
  }

  renderTasks() {
    return this.props.tasks.map((task) => (
      <Task key={task._id} task={task} />
    ))
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List</h1>

          <form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
            {/* bind the context, save the world */}
            <input
              type="text"
              ref="textInput"
              placeholder="Type to add new tasks"
            />
          </form>
        </header>

        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    )
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired
}

export default createContainer(() => {
  return {
    tasks: Tasks.find({}, {sort: { createdAt: -1 }}).fetch() // show newest first
  }
},App)
