import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import { i18n } from './plugins/i18n'

createApp(App)
    .use(i18n)
    .mount('#app')
