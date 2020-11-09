import Vue from 'vue';
import { app, remote } from 'electron';

import elstore from './packstore.js';


const APP = process.type === 'renderer' ? remote.app : app;
const STORE_PATH = APP.getPath('userData');


Vue.prototype.$elstore = elstore;
console.log('---------------------');
console.log('本地缓存路径:' + STORE_PATH + '下的config.json文件');
console.log('----------------');