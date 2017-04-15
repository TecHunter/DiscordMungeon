<template>
    <div id='header'>
        <button class='status-bar-button right'
                v-on:click='close'><i class="material-icons">close</i></button>
        <button class='status-bar-button right'
                v-on:click='toggleMaximize'><i class="material-icons">{{isMaximized() ? 'fullscreen' : 'fullscreen_exit'}}</i></button>
        <button class='status-bar-button right'
                v-on:click='minimize'><i class="material-icons">minimize</i></button>
    </div>
</template>

<script>
export default {
    components: {
    },
    name: 'main-heading',
    created() {
    },
    data: () => ({
        fullscreen: false
    }),
    methods: {
        isMaximized() {
            return ipcRenderer.sendSync('isMaximized');
        },
        toggleMaximize() {
            this.fullscreen = ipcRenderer.sendSync('toggleMaximize');
        },
        close() {
            ipcRenderer.sendSync('close');
        },
        minimize() {
            return ipcRenderer.sendSync('minimize');
        }
    }
};
</script>

<style scoped>
.status-bar-button {
    height: 40px;
    width: 40px;
    margin: 4px;
    box-shadow: none;
    border: 0;
    z-index: 500;
    -webkit-app-region: no-drag;
    background: transparent;
    color: rgba(255, 255, 255, 0.7);
}

.status-bar-button:hover {
    color: rgba(255, 255, 255, 0.9);
}

#header {
    -webkit-app-region: drag;
    height: 48px;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.3);
}

#header .row {
    margin: 0;
    padding: 0;
}
</style>