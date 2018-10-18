##### 无状态组件 和 有状态组件

```
state 的主要作用是用于组件保存、控制、修改自己的可变状态。state 在组件内部初始化，可以被组件自身修改，而外部不能访问也不能修改。你可以认为 state 是一个局部的、只能被组件自身控制的数据源。state 中状态可以通过 this.setState 方法进行更新，setState 会导致组件的重新渲染

props 的主要作用是让使用该组件的父组件可以传入参数来配置该组件。它是外部传进来的配置参数，组件内部无法控制也无法修改。除非外部组件主动传入新的 props，否则组件的 props 永远保持不变

没有 state 的组件叫无状态组件（stateless component），设置了 state 的叫做有状态组件（stateful component）。因为状态会带来管理的复杂性，我们尽量多地写无状态组件，尽量少地写有状态的组件。这样会降低代码维护的难度，也会在一定程度上增强组件的可复用性。前端应用状态管理是一个复杂的问题，我们后续会继续讨论。
```

##### 事件绑定

```
<button onClick={this.handlePush.bind(this)}>发布</button>

handlePush() {
    if (this.props.onPush) {
      const { userName, content } = this.state
      this.props.onPush({
        userName,
        content
      })
    }
  }
```

##### 状态提升

![](http://huzidaha.github.io/static/assets/img/posts/C547BD3E-F923-4B1D-96BC-A77966CDFBEF.png)

```
遇到这种情况，我们将这种组件之间共享的状态交给组件最近的公共父节点保管，然后通过 props 把状态传递给子组件，这样就可以在组件之间共享数据了

当某个状态被多个组件依赖或者影响的时候，就把该状态提升到这些组件的最近公共父组件中去管理，用 props 传递数据或者函数来管理这种依赖或着影响的行为。

但是在讲解到 Redux 之前，我们暂时采取状态提升的方式来进行管理。
```

##### React 的生命周期

```
componentWillMount：组件挂载开始之前，也就是在组件调用 render 方法之前调用。
componentDidMount：组件挂载完成以后，也就是 DOM 元素已经插入页面后调用。
componentWillUnmount：组件对应的 DOM 元素从页面中删除之前调用


我们一般会把组件的 state 的初始化工作放在 constructor 里面去做；在 componentWillMount 进行组件的启动工作，例如 Ajax 数据拉取、定时器的启动；组件从页面上销毁的时候，有时候需要一些数据的清理，例如定时器的清理，就会放在 componentWillUnmount 里面去做。


shouldComponentUpdate(nextProps, nextState)：你可以通过这个方法控制组件是否重新渲染。如果返回 false 组件就不会重新渲染。这个生命周期在 React.js 性能优化上非常有用。
componentWillReceiveProps(nextProps)：组件从父组件接收到新的 props 之前调用。
componentWillUpdate()：组件开始重新渲染之前调用。
componentDidUpdate()：组件重新渲染并且把更改变更到真实的 DOM 以后调用。
```

##### ref 的使用

```
componentDidMount () {
  this.input.focus()
}
<input ref={(input) => this.input = input} />
```

##### 使用 innerHtml 防止 xss

```
render () {
    return (
      <div
        className='editor-wrapper'
        dangerouslySetInnerHTML={{__html: this.state.content}} />
    )
  }
```

##### 设置样式

```
<h1 style={{fontSize: '12px', color: this.state.color}}>React.js 小书</h1>
```

##### react 的单向数据流

```
React.js 的 context 就是这么一个东西，某个组件只要往自己的 context 里面放了某些状态，这个组件之下的所有子组件都直接访问这个状态而不需要通过中间组件的传递。一个组件的 context 只有它的子组件能够访问，它的父组件是不能访问到的，你可以理解每个组件的 context 就是瀑布的源头，只能往下流不能往上飞。

redux 解决的问题
“模块（组件）之间需要共享数据”，和“数据可能被任意修改导致不可预料的结果”之间的矛盾。
```

##### redux dispatch

![](http://huzidaha.github.io/static/assets/img/posts/CA34AC20-F3C0-438F-AD64-66C5E0986669.png)
![](http://huzidaha.github.io/static/assets/img/posts/7536BBF9-6563-4FD5-8359-28D3A5254EE7.png)

```
我们很难把控每一根指向 appState 的箭头，appState 里面的东西就无法把控。但现在我们必须通过一个“中间人” —— dispatch，所有的数据修改必须通过它，并且你必须用 action 来大声告诉它要修改什么，只有它允许的才能修改：
```

##### 纯函数

- 函数的返回结果只依赖于它的参数

```
纯函数
const a = 1
const foo = (x, b) => x + b
foo(1, 2) // => 3

！纯函数
const a = 1
const foo = (b) => a + b
foo(2) // => 3
```
