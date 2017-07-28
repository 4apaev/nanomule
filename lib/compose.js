module.exports = compose

//const compose = (...stack) => stack.reduce((cb, next) => (...args) => cb(next(...args)))


function compose(arr) {

  return (ctx, next) => {

    let index = -1
    return dispatch(0)

    function dispatch(i) {
      if (i <= index)
        return Promise.reject(new Error('next() called multiple times'))

      index = i

      let fn = arr[ i ]

      if (i === arr.length)
        fn = next

      if (!fn)
        return Promise.resolve()

      try {
        return Promise.resolve(fn(ctx, function next() {
          return dispatch(i + 1)
        }))
      } catch(e) {
        return Promise.reject(e)
      }
    }
  }
}
