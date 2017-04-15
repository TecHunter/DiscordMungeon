export default [
  {
    path: '/',
    name: 'landing-page',
    component: require('components/LandingPageView')
  },
  {
    path: '/panel',
    name: 'panel',
    component: require('components/PanelView')
  },
  {
    path: '*',
    redirect: '/'
  }
];
