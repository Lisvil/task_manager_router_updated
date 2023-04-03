import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@braks/vue-flow/dist/style.css'
import LoadingBlock from './components/loading/LoadingBlock.vue'
import BootstrapVue3 from 'bootstrap-vue-3'
// import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
// import 'bootstrap/dist/css/bootstrap.css'
// import BootstrapVue from 'bootstrap/dist/js/bootstrap.bundle.js'
import './style/main.scss'


const app = createApp(App)
app.use(router)
app.use(BootstrapVue3)
// app.use(BootstrapVue)
app.component('LoadingBlock', LoadingBlock)
// createApp(App).use(router).mount('#app')

app.mount('#app')
