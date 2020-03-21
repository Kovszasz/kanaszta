module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  "devServer": {
    "proxy": {
        '/socket.io': {
            "target": '0.0.0.0:3001',
            "ws": true,
            "changeOrigin": true,
        }
    }
}
}
