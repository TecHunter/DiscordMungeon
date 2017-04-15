<template>
  <form class='col s12'>
    <div v-if='!loggingIn'>
      <div class='row'>
        <button type="button"
                class='btn btn-floating btn-flat'
                v-on:click="toggleVisible()">
          <i class="material-icons teal-text visible-button">{{ visibleicon }}</i>
        </button>
      </div>
      <div class='row'>
        <div class='input-field col s12'
             v-bind:hidden="!visible">
          <input id="token-input"
                 v-model="token"
                 type="text">
          <label for="token-input">Token</label>
        </div>
        <div class='input-field col s12'
             v-bind:hidden="visible">
          <p class='center flow-text'>Token Hidden</p>
        </div>
      </div>
      <div class='row'>
        <div class='col s12'>
          <button type="button"
                  class='waves-effect waves-light btn full'
                  v-on:click="login()">Log In</button>
        </div>
      </div>
      <p class='red-text center flow-text'
         v-html="formatErrors()"></p>
      <p class='flow-text'>Note: This is not the token you get from doing <code>#!link</code>. This is your Discord User Token. To get it:</p>
      <div class='row'>
        <div class='col s12'>
          <ol class='left-align flow-text'>
            <li>Open Discord.</li>
            <li>Press <code>ctrl</code>+<code>shift</code>+<code>i</code>.</li>
            <li>Go to the <code>Application</code> tab. You may need to click the <code>>></code> button.</li>
            <li>Select <code>Local Storage</code>.</li>
            <li>Copy the <code>token</code> field to Discord Mungeon.</li>
          </ol>
        </div>
      </div>
    </div>
    <div v-if='loggingIn'>
      <h2>Logging In</h2>
      <div class="preloader-wrapper big active">
        <div class="spinner-layer spinner-blue">
          <div class="circle-clipper left">
            <div class="circle"></div>
          </div>
          <div class="gap-patch">
            <div class="circle"></div>
          </div>
          <div class="circle-clipper right">
            <div class="circle"></div>
          </div>
        </div>
  
        <div class="spinner-layer spinner-red">
          <div class="circle-clipper left">
            <div class="circle"></div>
          </div>
          <div class="gap-patch">
            <div class="circle"></div>
          </div>
          <div class="circle-clipper right">
            <div class="circle"></div>
          </div>
        </div>
  
        <div class="spinner-layer spinner-yellow">
          <div class="circle-clipper left">
            <div class="circle"></div>
          </div>
          <div class="gap-patch">
            <div class="circle"></div>
          </div>
          <div class="circle-clipper right">
            <div class="circle"></div>
          </div>
        </div>
  
        <div class="spinner-layer spinner-green">
          <div class="circle-clipper left">
            <div class="circle"></div>
          </div>
          <div class="gap-patch">
            <div class="circle"></div>
          </div>
          <div class="circle-clipper right">
            <div class="circle"></div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  created() {
    // Set $route values that are not preset during unit testing
    if (process.env.NODE_ENV === 'testing') {
      this.$route = {
        name: 'landing-page',
        path: '/landing-page'
      };
    }
  },
  methods: {
    toggleVisible() {
      this.visible = !this.visible;
      this.visibleicon = this.visible ? 'visibility_off' : 'visibility';
    },
    login() {
      window.bot.destroy();
      window.bot.removeAllListeners('ready');
      window.bot.removeAllListeners('message');
      window.bot.on('ready', () => {
        router.push('panel');
      });
      localStorage.setItem('token', this.token.replace(/"/g, ''));
      this.loggingIn = true;
      window.bot.login(this.token).catch(err => {
        this.makeError('Invalid Token');
        this.loggingIn = false;
      });
    },
    formatErrors() {
      return this.errors.join('<br>');
    },
    makeError(text) {
      this.errors.push(text);
      setTimeout(() => {
        this.errors.shift();
      }, 3000);
    }
  },
  mounted() {
    // Materialize.updateTextFields();
  },
  data: () => ({
    token: localStorage.getItem('token'),
    visible: localStorage.getItem('token') == '',
    visibleicon: this.visible ? 'visibility_off' : 'visibility',
    errors: [],
    loggingIn: false
  })
};
</script>

<style scoped>
code {
  background-color: rgba(40, 56, 76, .5);
  border-radius: 3px;
  color: #fff;
  font-weight: bold;
  padding: 3px 6px;
  margin: 0 3px;
  vertical-align: bottom;
}

p {
  line-height: 24px;
}
</style>
