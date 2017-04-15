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
</style>
