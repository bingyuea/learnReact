import React, { Component } from 'react'
import './App.css'

class App extends Component {
  constructor() {
    super()
    this.state = {
      appState: {
        title: {
          text: 'React.js 小书',
          color: 'red'
        },
        content: {
          text: 'React.js 小书内容',
          color: 'blue'
        }
      }
    }
  }

  componentDidMount() {
    let appState = this.state.appState || {}
    // 这里任何代码都可以修改appState
    // this.dispatch({ type: 'UPDATE_TITLE_TEXT', text: '《React.js 小书》' }) // 修改标题文本
    // this.dispatch({ type: 'UPDATE_TITLE_COLOR', color: 'blue' }) // 修改标题颜色
    let store = this.createStore(appState, this.stateChange)
    store.subscribe(() => {
      this.renderApp(store.getState())
    })
    store.dispatch({
      type: 'UPDATE_TITLE_TEXT',
      text: '《React.js 小书  监测数据变化》'
    }) // 修改标题文本
    store.dispatch({ type: 'UPDATE_TITLE_COLOR', color: 'blue' }) // 修改标题颜色
  }

  renderApp(appState) {
    this.renderTitle(appState.title)
    this.renderContent(appState.content)
  }

  renderTitle(title) {
    const titleDOM = document.getElementById('title')
    titleDOM.innerHTML = title.text
    titleDOM.style.color = title.color
  }

  renderContent(content) {
    const contentDOM = document.getElementById('content')
    contentDOM.innerHTML = content.text
    contentDOM.style.color = content.color
  }

  stateChange(state, action) {
    switch (action.type) {
      case 'UPDATE_TITLE_TEXT':
        state.title.text = action.text
        break
      case 'UPDATE_TITLE_COLOR':
        state.title.color = action.color
        break
      default:
        break
    }
  }

  createStore(state, stateChange) {
    let listeners = []
    const getState = () => state
    const subscribe = listener => listeners.push(listener)
    const dispatch = action => {
      stateChange(state, action)
      listeners.map(listener => listener())
    }
    return { getState, dispatch, subscribe }
  }

  render() {
    return (
      <div>
        <div id="title" />
        <div id="content" />
      </div>
    )
  }
}

export default App
