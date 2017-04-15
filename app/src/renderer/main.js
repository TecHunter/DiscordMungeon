import Vue from 'vue';
import Electron from 'vue-electron';
import Resource from 'vue-resource';
import Router from 'vue-router';
import {ipcRenderer} from 'electron';

import App from './App';
import routes from './routes';

import 'materialize-css/bin/materialize.css';
import 'materialize-css/bin/materialize.js';

import Hljs from 'highlight.js/lib/index.js';
import 'highlight.js/styles/default.css';
import audioHit from './assets/hit.ogg';
import audioClick from './assets/click.ogg';
import audioVictory from './assets/victory.ogg';

import Discord from 'discord.js';
import bluebird from 'bluebird';
Vue.use(Electron);
Vue.use(Resource);
Vue.use(Router);
Vue.config.debug = true;

const router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes
});

window.router = router;
window.hljs = Hljs;
window.bot = new Discord.Client();
window.Promise = bluebird;
window.ipcRenderer = ipcRenderer;

ipcRenderer.on('message', function (event, text) {
  alert(text);
});

/* eslint-disable no-new */
new Vue({
  router,
  ...App
}).$mount('#app');
