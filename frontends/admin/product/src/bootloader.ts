import { createApp } from 'vue';
import App from './App.vue';

import { createRedux } from './redux/storePlugin';
import { store } from 'store/Store';
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import * as BiIcons from 'oh-vue-icons/icons/bi';
import * as FaIcons from 'oh-vue-icons/icons/fa';
import * as IoIcons from 'oh-vue-icons/icons/io';

const Fa = Object.values({ ...FaIcons });
const Bi = Object.values({ ...BiIcons });
const Io = Object.values({ ...IoIcons });

addIcons(...Fa, ...Bi, ...Io);

import 'main/index.scss';

const mount = (el: string | Element) => {
  createApp(App)
    .use(createRedux(store))
    .component('v-icon', OhVueIcon)
    .mount(el);
};

if (process.env.NODE_ENV) {
  const devRoot = document.querySelector('#_product-dev-root');

  if (devRoot) {
    mount(devRoot);
  }
}

export { mount };
