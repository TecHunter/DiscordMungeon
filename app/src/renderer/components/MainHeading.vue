<template>
    <div id='header'>
        <p class='flow-text left headerInfo'>v{{version}}</p>
        <p class='flow-text left headerInfo'
           v-if='headerInfo != ""'>| {{headerInfo}}</p>
        <button class='waves-effect waves-light btn left'
                v-if='updateReady'
                v-on:click='doUpdate'>Update</button>
        <button class='waves-effect waves-light btn left'
                v-if='updateNotFound'
                v-on:click='updateCheck'>Check for Updates</button>
        <button class='status-bar-button right'
                v-on:click='close'><i class="material-icons">close</i></button>
        <button class='status-bar-button right'
                v-on:click='toggleMaximize'><i class="material-icons">{{!fullscreen ? 'fullscreen' : 'fullscreen_exit'}}</i></button>
        <button class='status-bar-button right'
                v-on:click='minimize'><i class="material-icons">minimize</i></button>
    </div>
</template>

<script>
import packa from '../../../package.json';
export default {
    components: {
    },
    name: 'main-heading',
    created() {
        ipcRenderer.on('updateHeader', (observer, text) => {
            this.headerInfo = text;
        });

        ipcRenderer.on('updateNotFound', () => {
            this.headerInfo = 'No update found';
            setTimeout(() => {
                this.headerInfo = '';
                this.updateNotFound = true;
            }, 5000)
        });

        ipcRenderer.on('updateReady', () => {
            this.headerInfo = 'Update ready:';
            this.updateReady = true;
        });

        this.fullscreen = ipcRenderer.sendSync('isMaximized');
    },
    data: () => ({
        headerInfo: '',
        fullscreen: false,
        updateReady: false,
        updateNotFound: false,
        version: packa.version,

    }),
    methods: {
        toggleMaximize() {
            this.fullscreen = ipcRenderer.sendSync('toggleMaximize');
        },
        close() {
            ipcRenderer.sendSync('close');
        },
        minimize() {
            ipcRenderer.sendSync('minimize');
        },
        updateCheck() {
            this.updateNotFound = false;
            this.updateReady = false;
            ipcRenderer.sendSync('checkUpdates');
        },
        doUpdate() {
            this.updateReady = false;
            ipcRenderer.sendSync('performUpdate');
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

.headerInfo {
    margin: 4px;
}

.updateCheck,
.btn {
    -webkit-app-region: no-drag;
    margin: 4px;
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