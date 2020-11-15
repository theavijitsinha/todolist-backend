import 'bootstrap/dist/css/bootstrap.css';
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

    this.setEditing = this.setEditing.bind(this);
    this.cancelEditing = this.cancelEditing.bind(this);
    this.addTask = this.addTask.bind(this);
    this.updateTask = this.updateTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.toggleTaskCompletion = this.toggleTaskCompletion.bind(this);
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
    axios.post('http://localhost:8080/tasks', task)
      .then(res => res.data)
      .then((task) => {
        this.addTaskToState(task)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  updateTask(task) {
    axios.put('http://localhost:8080/tasks/' + task.id, task)
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

  toggleTaskCompletion(taskID) {
    const task = {
      id: taskID,
      completed: !this.state.tasks[taskID].completed
    };
    axios.put('http://localhost:8080/tasks/' + task.id, task)
      .then(res => res.data)
      .then((task) => {
        this.updateTaskInState(task)
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
      return <TaskRow key={task.id} task={task} editing={task.id === this.state.editingTaskID}
        updateTask={this.updateTask} deleteTask={this.deleteTask}
        toggleCompletion={this.toggleTaskCompletion}
        handleEdit={this.setEditing} cancelEdit={this.cancelEditing} />
    });
    tasks.push(
      <TaskAddForm key="add" addTask={this.addTask} />
    );
    return tasks;
  }
}

class TaskRow extends React.Component {
  render() {
    const task = this.props.task;
    if (this.props.editing) {
      return <TaskEditForm task={task} updateTask={this.props.updateTask}
        cancelEdit={this.props.cancelEdit} />;
    }
    return <Task task={task} handleEdit={this.props.handleEdit}
      deleteTask={this.props.deleteTask} toggleCompletion={this.props.toggleCompletion} />
  }
}

class Task extends React.Component {
  render() {
    return (
      <div className="row align-items-center border-bottom">
        <input type="checkbox" className="col-auto position-static"
          checked={this.props.task.completed} readOnly={true}
          onClick={() => this.props.toggleCompletion(this.props.task.id)} />
        {this.props.task.completed ?
          <div className="col text-muted"><del>{this.props.task.summary}</del></div> :
          <div className="col">{this.props.task.summary}</div>
        }
        <div className="col-2">{this.props.task.dueDate}</div>
        <div className="col-2">
          <div className="row">
            <button className="col m-1 btn btn-outline-dark"
              onClick={() => this.props.handleEdit(this.props.task.id)}>
              Edit
            </button>
            <button className="col m-1 btn btn-outline-danger"
              onClick={() => this.props.deleteTask(this.props.task.id)}>
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }
}

class TaskEditForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { task: Object.assign({}, this.props.task) };

    this.summaryUpdate = this.summaryUpdate.bind(this);
    this.dateUpdate = this.dateUpdate.bind(this);
  }

  summaryUpdate(e) {
    this.setState((state) => {
      let task = state.task;
      task.summary = e.target.value;
      return { task: task };
    })
  }

  dateUpdate(e) {
    this.setState((state) => {
      let task = state.task;
      task.dueDate = e.target.value;
      return { task: task };
    })
  }

  render() {
    return (
      <form className="row align-items-center border-bottom" onSubmit={(e) => {
        this.props.updateTask(this.state.task);
        e.preventDefault();
      }}>
        <input className="col form-control" type="text" value={this.state.task.summary}
          onChange={this.summaryUpdate} placeholder="Task" />
        <div className="col-2 p-1">
          <input className="form-control" type="date" value={this.state.task.dueDate}
            onChange={this.dateUpdate} />
        </div>
        <div className="col-2">
          <div className="row">
            <input className="col btn btn-outline-dark m-1" type="submit" value="Update" />
            <input className="col btn btn-outline-dark m-1" type="button" value="Cancel"
              onClick={this.props.cancelEdit} />
          </div>
        </div>
      </form>
    );
  }
}

class TaskAddForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { task: this.getEmptyTask() };

    this.summaryUpdate = this.summaryUpdate.bind(this);
    this.dateUpdate = this.dateUpdate.bind(this);
    this.clearAndAddTask = this.clearAndAddTask.bind(this);
  }

  getEmptyTask() {
    return {
      completed: false,
      summary: '',
      dueDate: new Date().toISOString().substring(0, 10)
    };
  }

  summaryUpdate(e) {
    this.setState((state) => {
      let task = state.task;
      task.summary = e.target.value;
      return { task: task };
    });
  }

  dateUpdate(e) {
    this.setState((state) => {
      let task = state.task;
      task.dueDate = e.target.value;
      return { task: task };
    });
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
      <form className="row align-items-center" onSubmit={this.clearAndAddTask}>
        <input className="col form-control" type="text" value={this.state.task.summary}
          onChange={this.summaryUpdate}
          placeholder="New task" />
        <div className="col-2 p-1">
          <input className="form-control" type="date" value={this.state.task.dueDate}
            onChange={this.dateUpdate} />
        </div>
        <div className="col-2 p-1">
          <input className="col btn btn-outline-primary" type="submit" value="Add" />
        </div>
      </form>
    );
  }
}

function App() {
  return (
    <div className="container">
      <h1 className="text-center">To Do List</h1>
      <TaskList />
    </div>
  );
}

export default App;
