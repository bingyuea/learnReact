import React, { Component } from 'react'
import LocalStorage from '../utils/utils.js'

class CommentInput extends Component {
  constructor() {
    super()
    this.state = {
      userName: '',
      content: ''
    }
  }

  handleUserChange(event) {
    this.setState({
      userName: event.target.value
    })
  }

  handleContentChange(event) {
    this.setState({
      content: event.target.value
    })
  }

  handlePush() {
    if (this.props.onPush) {
      const { userName, content } = this.state
      this.props.onPush({
        userName,
        content
      })
    }
  }

  handleSaveUser(event) {
    LocalStorage.set('userName', event.target.value)
  }

  componentWillMount() {
    this.setState({
      userName: LocalStorage.get('userName') || ''
    })
  }

  componentDidMount() {
    this.textarea.focus()
  }

  render() {
    return (
      <div className="commentInput">
        <div className="item">
          <label>用戶名:</label>
          <input
            ref={input => (this.input = input)}
            type="text"
            value={this.state.userName}
            onBlur={this.handleSaveUser.bind(this)}
            onChange={this.handleUserChange.bind(this)}
          />
        </div>
        <div className="item">
          <label>评论内容:</label>
          <textarea
            ref={textarea => (this.textarea = textarea)}
            value={this.state.content}
            onChange={this.handleContentChange.bind(this)}
          />
        </div>
        <button onClick={this.handlePush.bind(this)}>发布</button>
      </div>
    )
  }
}

export default CommentInput
