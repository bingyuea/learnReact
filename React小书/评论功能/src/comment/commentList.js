import React, { Component } from 'react'
import Comment from './comment'

class CommentList extends Component {
  render() {
    let comments = this.props.comments || []

    return (
      <div className="commentList">
        {comments.map((comment, i) => (
          <Comment comment={comment} key={i} />
        ))}
      </div>
    )
  }
}

export default CommentList
