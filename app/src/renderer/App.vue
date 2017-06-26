<template>
  <div class="container">
    <div id="#app" class='row' style='margin-bottom: 0'>
      <div class='background'></div>
  
      <main-heading></main-heading>
      <div id='main-content'>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import store from 'renderer/vuex/store';
import MainHeading from 'renderer/components/MainHeading';

export default {
  components: { MainHeading },
  store
};

</script>

<style>
@import url(https://fonts.googleapis.com/css?family=Lato:300);
@import url('https://fonts.googleapis.com/css?family=Baloo+Bhaina');
@import url('https://fonts.googleapis.com/css?family=Muli');
* {
  margin: 0;
  padding: 0;
}

#main-content {
  margin-top: 56px;
}

p,
div {
  font-family: 'Muli', sans-serif;
}

html,
body,
#app {
  height: 100%;
  margin: 0;
  margin-bottom: 0 !important;
  padding: 0;
}

body {
  align-items: top;
  display: flex;
  font-family: Lato, Helvetica, sans-serif;
  justify-content: center;
  text-align: center;
}

.background {
  background: radial-gradient( ellipse at center, rgba(255, 255, 255, 0.8) 0%, rgba(229, 229, 229, 0.4) 100%), url('assets/bg.png');
  background-size: 100% 100%;
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  z-index: -9999;
}

h1 {
  font-family: 'Baloo Bhaina', cursive;
}

.full {
  width: 100%;
}

pre code {
  background-color: rgba(240, 240, 240, 0.25);
  border-radius: 5px;
  color: #000;
  font-weight: bold;
  padding: 3px 6px;
  margin: 0 3px;
  display: block;
  text-align: left;
  white-space: pre-wrap;
}

code {
  background-color: rgba(240, 240, 240, 0.25);
  border-radius: 3px;
  font-weight: bold;
  padding: 3px 6px;
}
</style>
