const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })
module.exports = {
   devServer: {
      proxy: {
        '^/api': {
          // target: 'http://localhost:3080',
          target: 'https://task-manager-lzi3.onrender.com',
          changeOrigin: true
        },
      }
    }
  }
