import React, { Component } from 'react'
import Comment from './comment'

class CommentList extends Component {
  handleDeleteList(index) {
    console.log('index :', index)
    if (this.props.onDelete) {
      this.props.onDelete(index)
    }
  }

  render() {
    let comments = this.props.comments || []

    return (
      <div className="commentList">
        {comments.map((comment, i) => (
          <Comment
            comment={comment}
            key={i}
            index={i}
            onDelete={this.handleDeleteList.bind(this)}
          />
        ))}
      </div>
    )
  }
}

export default CommentList
