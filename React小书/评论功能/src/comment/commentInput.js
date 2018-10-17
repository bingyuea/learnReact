import React, { Component } from 'react'

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

  render() {
    return (
      <div className="commentInput">
        <div className="item">
          <label>用戶名:</label>
          <input
            type="text"
            value={this.state.userName}
            onChange={this.handleUserChange.bind(this)}
          />
        </div>
        <div className="item">
          <label>评论内容:</label>
          <textarea
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
