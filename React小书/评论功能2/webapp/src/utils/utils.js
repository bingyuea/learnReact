const LocalStorage = {
  set(key, val) {
    typeof val === 'string'
      ? localStorage.setItem(key, val)
      : localStorage.setItem(key, JSON.stringify(val))
  },
  delete(key) {
    localStorage.getItem(key)
      ? localStorage.removeItem(key)
      : console.log('没有对应的存贮')
  },
  get(key) {
    return localStorage.getItem(key)
      ? typeof JSON.parse(localStorage.getItem(key)) !== 'string'
        ? JSON.parse(localStorage.getItem(key))
        : localStorage.getItem(key)
      : console.log('没有对应的存贮')
  }
}

export default LocalStorage
