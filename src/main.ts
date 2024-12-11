import {createApp} from 'vue'
import './assets/style.css'
import './index.css'
import App from './App.vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { createHead } from '@vueuse/head';

const app = createApp(App);
app.component('VueDatePicker', VueDatePicker);

const head = createHead();
app.use(head);

app.mount('#app');
