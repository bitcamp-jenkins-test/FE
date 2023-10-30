const createProxyMiddleware = require('http-proxy-middleware')
module.exports = app => {
  app.use(
    createProxyMiddleware(
      ['/api', '/socket.io'],
      {
        target: 'http://carrothunder.store:80',
        changeOrigin: true,
        ws: true,
        router: {
          '/socket.io': 'ws://carrothunder.store:80'
        }
      }
    )
  )
}