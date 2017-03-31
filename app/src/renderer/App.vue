<template>
  <div class="container">
    <div id="#app" class='row'>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import store from 'renderer/vuex/store';
  export default {
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

  p, div {
    font-family: 'Muli', sans-serif;
  }
  
  html,
  body {
    height: 100%;
  }
  
  body {
    align-items: top;
    background: radial-gradient( ellipse at center, rgba(255, 255, 255, 0.8) 0%, rgba(229, 229, 229, 0.4) 100%), url('assets/bg.png');
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    font-family: Lato, Helvetica, sans-serif;
    justify-content: center;
    text-align: center;
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
  }
  code {
    background-color: rgba(240, 240, 240, 0.25);
    border-radius: 3px;
    font-weight: bold;
    padding: 3px 6px;
  }
    
</style>
