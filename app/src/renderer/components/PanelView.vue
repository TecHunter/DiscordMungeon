<template>
  <div class='main full'>
    <header>
      <h1 style="margin-bottom: 0px; padding-bottom: 0px;">Mungeon Panel</h1>
      <p>For best results, maximize this window</p>
    </header>
    <mungeon-panel ref="mungeonPanel"></mungeon-panel>
  </div>
</template>

<script>
import MungeonPanel from './PanelView/MungeonPanel';
export default {
  components: {
    MungeonPanel
  },
  name: 'panel',
  created() {
    if (window.bot.readyAt == null) {
      router.push('/');
    }
  }
};
</script>

<style scoped>
img {
  margin-top: -25px;
  width: 450px;
}
</style>