const createProxyMiddleware = require('http-proxy-middleware')
module.exports = app => {
  app.use(
    createProxyMiddleware(
      ['/api', '/socket.io'],
      {
        target: 'http://223.130.132.158:80',
        changeOrigin: true,
        ws: true,
        router: {
          '/socket.io': 'ws://223.130.132.158:80'
        }
      }
    )
  )
}
