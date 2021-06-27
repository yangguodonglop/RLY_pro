
import Vue from 'vue';
import Antd from 'ant-design-vue';
import App from './App';
import store from '../src/store';
import 'ant-design-vue/dist/antd.css';
import './assets/reset.scss' 
import qs from 'qs';
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
Vue.prototype.$qs = qs
Vue.config.productionTip = false;
const Base64 = require('js-base64').Base64

Vue.use(Antd);
import router from './routerold'


new Vue({
  render: h => h(App),
  router,
  store,
  Base64
}).$mount('#app')
