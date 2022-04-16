import * as VueRouter from 'vue-router';


export const routes: VueRouter.RouteRecordRaw[] = [
  {
    name: 'Panel',
    path: 'panel',
  }
];

export default VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes
});

const fruit = [
  'apple',
  'banana',
  'cherry',
  'durian',
  'grape',
  'kiwi',
  'lemon',
  'mango'
];
