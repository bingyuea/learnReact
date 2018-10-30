import React, { Component } from 'react'
import './App.css'

class App extends Component {
  constructor() {
    super()
    this.state = {
      appState: {}
    }
  }

  componentDidMount() {
    // this.dispatch({ type: 'UPDATE_TITLE_TEXT', text: '《React.js 小书》' }) // 修改标题文本
    // this.dispatch({ type: 'UPDATE_TITLE_COLOR', color: 'blue' }) // 修改标题颜色
    let store = this.createStore(this.reducer)
    let oldState = store.getState() // 缓存旧的state
    store.subscribe(() => {
      this.renderApp(store.getState(), oldState) // 写入新旧state
      oldState = store.getState() // 对旧的state进行赋值
    })
    store.dispatch({
      type: 'UPDATE_TITLE_TEXT',
      text: '《React.js 小书  监测数据变化》'
    }) // 修改标题文本
    store.dispatch({ type: 'UPDATE_TITLE_TEXT', text: '《React.js 小书》' }) // 修改标题文本
    store.dispatch({ type: 'UPDATE_TITLE_COLOR', color: 'blue' }) // 修改标题颜色
  }

  renderApp(appState, oldAppState = {}) {
    if (appState === oldAppState) {
      return
    }
    console.log('renderApp.......')
    this.renderTitle(appState.title, oldAppState.title)
    this.renderContent(appState.content, oldAppState.content)
  }

  renderTitle(title, oldTitle = {}) {
    if (title === oldTitle) {
      return
    }
    console.log('renderTitle.......')
    const titleDOM = document.getElementById('title')
    titleDOM.innerHTML = title.text
    titleDOM.style.color = title.color
  }

  renderContent(content, oldContent = {}) {
    if (content === oldContent) {
      return
    }
    console.log('renderContent.......')
    const contentDOM = document.getElementById('content')
    contentDOM.innerHTML = content.text
    contentDOM.style.color = content.color
  }

  reducer(state, action) {
    if (!state) {
      return {
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
    switch (action.type) {
      case 'UPDATE_TITLE_TEXT':
        return {
          ...state,
          title: {
            ...state.title,
            text: action.text
          }
        }
      // state.title.text = action.text
      // break
      case 'UPDATE_TITLE_COLOR':
        return {
          ...state,
          title: {
            ...state.title,
            color: action.color
          }
        }
      // state.title.color = action.color
      // break
      default:
        break
    }
  }

  createStore(reducer) {
    let state = null
    let listeners = []
    const getState = () => state
    const subscribe = listener => listeners.push(listener)
    const dispatch = action => {
      state = reducer(state, action) // 这里覆盖原来的对象,这个reducer其实就是一个纯函数
      listeners.map(listener => listener())
    }
    dispatch({})
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
