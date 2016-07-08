export function tryCatchMiddleware(middleware) {
  return (req, res, next) => {
    const promise = middleware(req, res, next)
    if (promise.catch) {
      promise.catch(e => next(e))
    }
  }
}
