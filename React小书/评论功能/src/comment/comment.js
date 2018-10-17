import React, { Component } from 'react'

class Comment extends Component {
  render() {
    return (
      <ul>
        <li>
          <p>{this.props.comment.userName}</p>
          <p>{this.props.comment.content}</p>
        </li>
      </ul>
    )
  }
}

export default Comment
