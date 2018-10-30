### (一)优雅地修改共享状态 引入 dispatch

#### state (这里可以类比 vue 中的 data)

```
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
```

#### componentDidMount(可以类比 vue 中的 mounted)

```
componentDidMount() {
  let appState = this.state.appState || {}
  // 缺点
  //fn1()
  //fn2()
  //fn3()
  // 这里任何代码都可以修改appState的值, 出现问题的时候 debug 起来就非常困难，这就是老生常谈的尽量避免全局变量
  // 让我们来想办法解决这个问题，我们可以学习 React.js 团队的做法，把事情搞复杂一些，提高数据修改的门槛：模块（组件）之间可以共享数据，也可以改数据。但是我们约定，这个数据并不能直接改，你只能执行某些我允许的某些修改，而且你修改的必须大张旗鼓地告诉我(引入dispatch)
  this.renderApp(appState)
}
```

#### function(这里可以类比 vue 中的 methods)

```
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
```

#### 引入 dispatch

// 我们定义一个函数，叫 dispatch，它专门负责数据的修改(所有对 appState 的修改都要经过这个函数)

```
dispatch (action) {
  switch (action.type) {
    case 'UPDATE_TITLE_TEXT':
    appState.title.text = action.text
    break
  case 'UPDATE_TITLE_COLOR':
    appState.title.color = action.color
    break
  default:
    break
  }
}
```

#### render(这里可以类比 vue 的模板语法{{}}或者 render 函数)

```
render() {
  return (
    <div>
      <div id="title" />
      <div id="content" />
    </div>
  )
}
```

#### 如果修改 appState

```
dispatch({ type: 'UPDATE_TITLE_TEXT', text: '《React.js 小书》' }) // 修改标题文本
dispatch({ type: 'UPDATE_TITLE_COLOR', color: 'blue' }) // 修改标题颜色
```

我只需要在 dispatch 的 switch 的第一个 case 内部打个断点就可以调试出来了

之前的修改 appState

![](https://huzidaha.github.io/static/assets/img/posts/CA34AC20-F3C0-438F-AD64-66C5E0986669.png)

现在修改 appState

![](https://huzidaha.github.io/static/assets/img/posts/7536BBF9-6563-4FD5-8359-28D3A5254EE7.png)

#### 代码（1）

```
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
    this.dispatch({ type: 'UPDATE_TITLE_TEXT', text: '《React.js 小书》' }) // 修改标题文本
    this.dispatch({ type: 'UPDATE_TITLE_COLOR', color: 'blue' }) // 修改标题颜色
    this.renderApp(appState)
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
  dispatch(action) {
    let appState = this.state.appState || {}
    switch (action.type) {
      case 'UPDATE_TITLE_TEXT':
        appState.title.text = action.text
        break
      case 'UPDATE_TITLE_COLOR':
        appState.title.color = action.color
        brea k
      default:
        break
    }
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
```

### (二) 抽离 store 和监控数据变化

#### 抽离 store

构建一个函数 createStore，用来专门生产这种 state 和 dispatch 的集合，这样其他的页面也可以用这种模式了

```
function createStore (state, stateChanger) {
  const getState = () => state
  const dispatch = (action) => stateChanger(state, action)
  return { getState, dispatch }
}

componentDidMount() {
    let appState = this.state.appState || {}
    // 这里任何代码都可以修改appState
    // this.dispatch({ type: 'UPDATE_TITLE_TEXT', text: '《React.js 小书》' }) // 修改标题文本
    // this.dispatch({ type: 'UPDATE_TITLE_COLOR', color: 'blue' }) // 修改标题颜色
    let store = this.createStore(appState, this.stateChange)
    this.renderApp(store.getState())
    store.dispatch({ type: 'UPDATE_TITLE_TEXT', text: '《React.js 小书》' }) // 修改标题文本
    store.dispatch({ type: 'UPDATE_TITLE_COLOR', color: 'blue' }) // 修改标题颜色
    this.renderApp(store.getState()) // 把新的数据渲染到页面上
  }
```

#### 监控数据变化

上面的代码有一个问题，我们每次通过 dispatch 修改数据的时候，其实只是数据发生了变化，如果我们不手动调用 renderApp，页面上的内容是不会发生变化的。但是我们总不能每次 dispatch 的时候都手动调用一下 renderApp，我们肯定希望数据变化的时候程序能够智能一点地自动重新渲染数据，而不是手动调用。

```
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
```

### (二)引入新旧 state 对比，reducer

##### 增加新旧 state 对比，避免不必要的更新

- 这里每次的 dispatch 都会引起不必要的更新

```
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
    store.dispatch({ type: 'UPDATE_TITLE_COLOR', color: 'blue' }) // 修改标题颜色,所有的都会更新
  }
```

- 考虑增加 oldState，如果新旧值相同就不更新

```
renderTitle(title, oldTitle = {}) {
    if (title === oldTitle) {
      return
    }
    console.log('renderTitle.......')
    const titleDOM = document.getElementById('title')
    titleDOM.innerHTML = title.text
    titleDOM.style.color = title.color
  }
```

- 这里用到了对象的解构赋值

```
onst obj = { a: 1, b: 2}
const obj2 = { ...obj, b: 3, c: 4} // => { a: 1, b: 3, c: 4 }，覆盖了 b，新增了 c


stateChange(state, action) {
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
```

图解
![](http://huzidaha.github.io/static/assets/img/posts/C8A1EB09-2D4E-442E-AD6D-E4997B4AF1C1.png)

#### 代码（2-1 对比 新旧 state）

```
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

  stateChange(state, action) {
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

  createStore(state, stateChange) {
    let listeners = []
    const getState = () => state
    const subscribe = listener => listeners.push(listener)
    const dispatch = action => {
      state = stateChange(state, action) // 这里覆盖原来的对象
      console.log(state)
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
```

#### 使用 reducer

- 纯函数

一个函数的返回结果只依赖于它的参数，并且在执行过程里面没有副作用，我们就把这个函数叫做纯函数。

纯函数：一个函数的返回结果只依赖于它的参数。

```
const a = 1
const foo = (b) => a + b
foo(2) // => 3 这个不是纯函数，结果跟a有关系
```

```
const a = 1
const foo = (x, b) => x + b
foo(1, 2) // => 3
```

纯函数 ： 一个函数执行过程对产生了外部可观察的变化那么就说这个函数是有副作用的

```
const a = 1
const foo = (obj, b) => {
  obj.x = 2
  return obj.x + b
}
const counter = { x: 1 }
foo(counter, 2) // => 4
counter.x // => 2
这个修改了外部的变量
```

```
const foo = (b) => {
  const obj = { x: 1 }
  obj.x = 2
  return obj.x + b
}
这个虽然也会改变变量的值，但是影响的内部的变量，外部程序根本观察不到，是一个纯函数
```

- 为神魔要了解 什么是纯函数

为什么要煞费苦心地构建纯函数？因为纯函数非常“靠谱”，执行一个纯函数你不用担心它会干什么坏事，它不会产生不可预料的行为，也不会对外部产生影响。不管何时何地，你给它什么它就会乖乖地吐出什么。如果你的应用程序大多数函数都是由纯函数组成，那么你的程序测试、调试起来会非常方便。

#### 参考资料

- [vue 通信](https://juejin.im/post/59ec95006fb9a0451c398b1a)

- [理解 Redux](https://www.zhihu.com/question/41312576)
