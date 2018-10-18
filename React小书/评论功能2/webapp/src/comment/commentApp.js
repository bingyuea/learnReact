import React, { Component } from 'react'
import CommontInput from './commentInput'
import CommontList from './commentList'
import LocalStorage from '../utils/utils.js'

class CommentApp extends Component {
  constructor() {
    super()
    this.state = {
      comments: []
    }
  }

  componentWillMount() {
    this.setState({
      comments: LocalStorage.get('comments') || []
    })
  }

  componentDidMount() {}

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
      content: content.content,
      timeString: content.createdTime
    })
    this.setState({
      comments
    })
    LocalStorage.set('comments', comments)
  }

  handleDeleteList(index) {
    console.log('CommontList' + index)
    let comments = this.state.comments || []
    comments.splice(index, 1)
    this.setState({
      comments
    })
  }

  render() {
    return (
      <div className="commentApp">
        <CommontInput onPush={this.handleSubmitContent.bind(this)} />
        <CommontList
          comments={this.state.comments}
          onDelete={this.handleDeleteList.bind(this)}
        />
      </div>
    )
  }
}

export default CommentApp
