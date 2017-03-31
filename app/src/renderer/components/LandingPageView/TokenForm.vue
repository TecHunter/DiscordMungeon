<template>
  <form class='col s12'>
    <div class='row'>
      <button type="button" class='btn btn-floating btn-flat' v-on:click="toggleVisible()">
            <i class="material-icons teal-text visible-button">{{ visibleicon }}</i>
          </button>
    </div>
    <div class='row'>
      <div class='input-field col s12' v-bind:hidden="!visible">
        <input id="token-input" v-model="token" type="text">
        <label for="token-input">Token</label>
      </div>
      <div class='input-field col s12' v-bind:hidden="visible">
        <p class='center flow-text'>Token Hidden</p>
      </div>
    </div>
    <div class='row'>
      <div class='col s12'>
        <button type="button" class='waves-effect waves-light btn full' v-on:click="login()">Log In</button>
      </div>
    </div>
    <p class='red-text center flow-text' v-html="formatErrors()"></p>
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
        window.bot = new Discord.Client();
        window.bot.on('ready', () => {
          router.push('panel');
        });
        localStorage.setItem('token', this.token);
        this.makeError('Logging In...');
        window.bot.login(this.token).catch(err => {
          this.makeError('Invalid Token');
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
      errors: []
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
