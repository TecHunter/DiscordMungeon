<template>
  <div class='main full'>
    <header>
      <h1 style="margin-bottom: 0px; padding-bottom: 0px;">Mungeon Panel</h1>
      <p>For best results, maximize this window</p>          
    </header>
    <invalid v-bind:hidden="inGuild"></invalid>
    <mungeon-panel v-bind:hidden="!inGuild" ref="mungeonPanel"></mungeon-panel>
  </div>
</template>

<script>
import Invalid from './PanelView/Invalid';
import MungeonPanel from './PanelView/MungeonPanel';
  export default {
    components: {
        Invalid, MungeonPanel
    },
    name: 'panel',
    created() {
        if (window.bot.readyAt == null) {
            router.push('/');
        }
    },
    data: () => ({
        inGuild: window.bot.guilds.get('296046067420758017') != undefined
    })
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
  }
</style>
