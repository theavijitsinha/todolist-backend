import './App.css';
import React from 'react'

const axios = require('axios');

class TaskList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: {},
      editingTaskID: null
    };

    this.setEditing = this.setEditing.bind(this)
    this.cancelEditing = this.cancelEditing.bind(this)
    this.addTask = this.addTask.bind(this)
    this.updateTask = this.updateTask.bind(this)
    this.deleteTask = this.deleteTask.bind(this)
  }

  componentDidMount() {
    this.updateTasksFromBackend();
  }

  updateTasksFromBackend() {
    fetch("http://localhost:8080/tasks")
      .then(res => res.json())
      .then(
        (result) => {
          this.clearTasksFromState();
          result.forEach(task => {
            this.addTaskToState(task)
          });
        },
        (error) => {
          console.error(error)
        }
      )
  }

  addTask(task) {
    axios.post('http://localhost:8080/tasks', {
      summary: task.summary,
    })
      .then(res => res.data)
      .then((task) => {
        this.addTaskToState(task)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  updateTask(task) {
    axios.put('http://localhost:8080/tasks/' + task.id, {
      summary: task.summary,
    })
      .then(res => res.data)
      .then((task) => {
        this.updateTaskInState(task)
        this.cancelEditing();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  deleteTask(taskID) {
    axios.delete('http://localhost:8080/tasks/' + taskID)
      .then(() => {
        this.deleteTaskFromState(taskID)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  addTaskToState(task) {
    this.setState((state) => {
      let tasks = Object.assign({}, state.tasks);
      tasks[task.id] = task
      return { tasks: tasks };
    });
  }

  updateTaskInState(task) {
    this.setState((state) => {
      let tasks = Object.assign({}, state.tasks);
      tasks[task.id] = task;
      return { tasks: tasks };
    });
  }

  deleteTaskFromState(taskID) {
    this.setState((state) => {
      let tasks = Object.assign({}, state.tasks);
      delete tasks[taskID];
      return { tasks: tasks };
    });
  }

  clearTasksFromState() {
    this.setState({ tasks: {} });
  }

  setEditing(id) {
    this.setState({
      editingTaskID: id
    });
  }

  cancelEditing() {
    this.setState({
      editingTaskID: null,
    });
  }

  render() {
    const tasks = Object.values(this.state.tasks).map((task) => {
      if (task.id === this.state.editingTaskID) {
        return <TaskEditForm key={task.id} task={task} updateTask={this.updateTask}
          cancelEdit={this.cancelEditing} />;
      }
      return <Task key={task.id} task={task} handleEdit={this.setEditing}
        deleteTask={this.deleteTask} />
    });
    tasks.push(
      <TaskAddForm key="add" addTask={this.addTask} />
    )
    return tasks;
  }
}

class Task extends React.Component {
  render() {
    return (
      <div>
        {this.props.task.summary}
        <button onClick={() => this.props.handleEdit(this.props.task.id)}>Edit</button>
        <button onClick={() => this.props.deleteTask(this.props.task.id)}>Delete</button>
      </div>
    );
  }
}

class TaskEditForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      task: {
        id: this.props.task.id,
        summary: this.props.task.summary
      }
    };

    this.summaryUpdate = this.summaryUpdate.bind(this);
  }

  summaryUpdate(e) {
    this.setState((state) => {
      let task = state.task;
      task.summary = e.target.value;
      return { task: task };
    })
  }

  render() {
    return (
      <form onSubmit={(e) => {
        this.props.updateTask(this.state.task);
        e.preventDefault();
      }}>
        <input type="text" value={this.state.task.summary} onChange={this.summaryUpdate}
          placeholder="Task" />
        <input type="submit" value="Update" />
        <input type="button" value="Cancel" onClick={this.props.cancelEdit} />
      </form>
    );
  }
}

class TaskAddForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { task: this.getEmptyTask() };

    this.summaryUpdate = this.summaryUpdate.bind(this);
    this.clearAndAddTask = this.clearAndAddTask.bind(this);
  }

  getEmptyTask() {
    return {
      summary: ''
    };
  }

  summaryUpdate(e) {
    this.setState((state) => {
      let task = state.task;
      task.summary = e.target.value;
      return { task: task };
    })
  }

  clearAndAddTask(e) {
    const task = this.state.task
    this.props.addTask(task);
    this.setState({
      task: this.getEmptyTask()
    });
    e.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.clearAndAddTask}>
        <input type="text" value={this.state.task.summary} onChange={this.summaryUpdate}
          placeholder="Task" />
        <input type="submit" value="Add" />
      </form>
    );
  }
}

function App() {
  return (
    <div>
      <TaskList />
    </div>
  );
}

export default App;
