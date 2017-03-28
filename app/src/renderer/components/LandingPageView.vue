<template>
  <div class='main'>
    <header>
      <h1>Discord Mungeon</h1>
    </header>
    <token-form></token-form>
  </div>
</template>

<script>
  import TokenForm from './LandingPageView/TokenForm';
  export default {
    components: {
      TokenForm
    },
    name: 'landing-page'
  };
</script>

<style scoped>
  img {
    margin-top: -25px;
    width: 450px;
  }
</style>

<style>
  .main {
    top: 0;
  }
  
  html,
  body {
    background: radial-gradient( ellipse at center, rgba(255, 255, 255, 0.8) 0%, rgba(229, 229, 229, 0.4) 100%), url('LandingPageView/assets/bg.png');
    background-size: cover;
  }
</style>
