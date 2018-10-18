import React, { Component } from 'react'

class Comment extends Component {
  handleDelte() {
    console.log('commnetIndex :', this.props.index)
    if (this.props.onDelete) {
      this.props.onDelete(this.props.index)
    }
  }

  render() {
    return (
      <ul>
        <li>
          <p>{this.props.comment.userName}</p>
          <p>{this.props.comment.content}</p>
          {/* <p>{this.props.comment.timeString}</p> */}
          <button onClick={this.handleDelte.bind(this)}>删除</button>
        </li>
      </ul>
    )
  }
}

export default Comment
