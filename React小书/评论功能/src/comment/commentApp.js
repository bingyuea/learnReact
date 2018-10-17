import React, { Component } from 'react'
import CommontInput from './commentInput'
import CommontList from './commentList'

class CommentApp extends Component {
  constructor() {
    super()
    this.state = {
      comments: []
    }
  }

  handleSubmitContent(content) {
    console.log(content)
    if (!content) {
      return
    }
    if (!content.userName) {
      alert('请输入用户名')
      return
    }
    if (!content.content) {
      alert('请输入评论内容')
      return
    }
    let comments = this.state.comments || []
    comments.push({
      userName: content.userName,
      content: content.content
    })
    console.log(comments)
    this.setState({
      comments
    })
  }

  render() {
    return (
      <div className="commentApp">
        <CommontInput onPush={this.handleSubmitContent.bind(this)} />
        <CommontList comments={this.state.comments} />
      </div>
    )
  }
}

export default CommentApp
