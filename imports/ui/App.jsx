import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'

import { Tasks } from '../api/tasks.js' // The actual tasks, not the component

import Task from './Task' // The task rendering component
import AccountsUIWrapper from './AccountsUIWrapper'

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hideCompleted: false
    }
  }

  // the only need for the event is to prevent a page reload
  handleSubmit(e) {
    e.preventDefault()

    // Find the text field vie the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim() // 'trim()' to get rid of unnecessary whitespace

    Tasks.insert({
      text, // short form of 'text: text'
      createdAt: new Date(),
      owner: Meteor.userId(),           // _id of logged in user
      username: Meteor.user().username  // username of logged in user
    })

    // Clear form by setting the input to an empty string
    ReactDOM.findDOMNode(this.refs.textInput).value = ''
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted
    })
  }

  renderTasks() {
    let filteredTasks = this.props.tasks
    if ( this.state.hideCompleted ) {
      filteredTasks = filteredTasks.filter( task => !task.checked )
    }
    return filteredTasks.map((task) => (
      <Task key={task._id} task={task} />
    ))
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List ({this.props.incompleteCount})</h1>

          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
          Hide Completed Tasks
          </label>

          <AccountsUIWrapper />

        {/* Show the input form only to logged in user */}
          { this.props.currentUser ?
            <form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
              {/* bind the context, save the world */}
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add new tasks"
              />
            </form> : ''
          }
        </header>

        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    )
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object
}

export default createContainer(() => {
  return {
    tasks: Tasks.find({}, {sort: { createdAt: -1 }}).fetch(), // show newest first
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user()
  }
},App)
