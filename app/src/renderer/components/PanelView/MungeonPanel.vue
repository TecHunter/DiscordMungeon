<template>
    <div class="container full">
        <a v-on:click="toggleMute" class="muteButton btn-floating btn-large waves-effect waves-light red"><i class="material-icons">{{ muted ? 'volume_off' : 'volume_up' }}</i></a>

        <div class="row">
            <div class="col s8">
            <div class="row"><div class="col s12">
                    <div class="progress">
                        <div class="determinate" v-bind:style="'width: ' + commands.pot.percent + '%'"></div>
                    </div>
                    <div class="row">
                    <div class="col s4"><p class="flow-text">Potions</p></div>
                        <div class="col s2">
                            <button class="btn full" v-on:click="doCommand('pot', 10)" v-bind:disabled="disabled">x10</button>
                        </div>
                        <div class="col s2">
                            <button class="btn full" v-on:click="doCommand('pot', 100)" v-bind:disabled="disabled">x100</button>
                        </div>
                        <div class="col s2">
                            <button class="btn full" v-on:click="doCommand('pot', 1000)" v-bind:disabled="disabled">x1000</button>
                        </div>
                        <div class="col s2">
                            <button class="btn full" v-on:click="doCommand('pot', 10000)" v-bind:disabled="disabled">x10000</button>
                        </div>
                    </div>
                </div></div>
                <div class="row"><div class="col s12">
                    <div class="hljs-workspace" v-html="hljsOutput">
                </div></div>
                
                </div>
            </div>
            <div class="col s4">
                <div class="row">
                    <div class="col s12">
                        <div class="progress">
                            <div class="determinate" v-bind:style="'width: ' + commands.adventure.percent + '%'"></div>
                        </div>
                        <div class="row">
                            <div class="col s6">
                                <button class="btn full" v-on:click="doCommand('adventure')" v-bind:disabled="commands.adventure.percent < 100 || disabled">Adventure</button>
                            </div>
                            <div class="col s6">
                                <button class="btn full" v-on:click="doCommand('adventure', 1)" v-bind:disabled="commands.adventure.percent < 100 || disabled">Run</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col s6">
                        <div class="progress">
                            <div class="determinate" v-bind:style="'width: ' + commands.heal.percent + '%'"></div>
                        </div>
                        <button class="btn full" v-on:click="doCommand('heal')" v-bind:disabled="commands.heal.percent < 100 || disabled">Heal</button>
                    </div>
                    <div class="col s6">
                        <div class="progress">
                            <div class="determinate" v-bind:style="'width: ' + commands.pheal.percent + '%'"></div>
                        </div>
                        <button class="btn full" v-on:click="doCommand('pheal')" v-bind:disabled="commands.pheal.percent < 100 || disabled">Heal Pet</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col s6">
                        <div class="progress">
                            <div class="determinate" v-bind:style="'width: ' + commands.mine.percent + '%'"></div>
                        </div>
                        <button class="btn full" v-on:click="doCommand('mine')" v-bind:disabled="disabled">Mine</button>
                    </div>
                    <div class="col s6">
                        <div class="progress">
                            <div class="determinate" v-bind:style="'width: ' + commands.chop.percent + '%'"></div>
                        </div>
                        <button class="btn full" v-on:click="doCommand('chop')" v-bind:disabled="disabled">Chop</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col s6">
                        <div class="progress">
                            <div class="determinate" v-bind:style="'width: ' + commands.forage.percent + '%'"></div>
                        </div>
                        <button class="btn full" v-on:click="doCommand('forage')" v-bind:disabled="disabled">Forage</button>
                    </div>
                    <div class="col s6">
                        <div class="progress">
                            <div class="determinate" v-bind:style="'width: ' + commands.fish.percent + '%'"></div>
                        </div>
                        <button class="btn full" v-on:click="doCommand('fish')" v-bind:disabled="disabled">Fish</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col s6">
                        <div class="progress">
                            <div class="determinate" v-bind:style="'width: ' + commands.inv.percent + '%'"></div>
                        </div>
                        <button class="btn full" v-on:click="doCommand('inv')" v-bind:disabled="disabled">Inventory</button>
                    </div>
                    <div class="col s6">
                        <div class="progress">
                            <div class="determinate" v-bind:style="'width: ' + commands.stats.percent + '%'"></div>
                        </div>
                        <button class="btn full" v-on:click="doCommand('stats')" v-bind:disabled="disabled">Stats</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        created() {
            // Set $route values that are not preset during unit testing
            if (process.env.NODE_ENV === 'testing') {
                this.$route = {
                    name: 'panel',
                    path: '/panel'
                };
            }

            function parseHljs(text) {
                let reg = new RegExp(/```(.+)\n((?:.|\n|\r)*)\n?```/im);
                while (reg.test(text)) {
                    let replaceWith = '';
                    let matches = text.match(reg);
                    let language = matches[1];
                    let code = matches[2];
                    let res = hljs.highlight(language, code);
                    replaceWith = res.value;
                    text = text.replace(reg, `<pre><code>${replaceWith}</code></pre>`);
                }
                reg = new RegExp(/`((?:.|\n|\r)*?)`/im);
                while (reg.test(text)) {
                    text = text.replace(reg, '<code>$1</code>');
                }
                
                return text;
            }

            this.bot.on('message', msg => {
                if (msg.channel.id == this.channel.id && msg.author.id == this.drpg && this.awaitResponse == true) {
                    let lines = msg.content.split('\n');
                    if (lines[0].includes(this.bot.user.username)
                        || lines[1].includes(this.bot.user.username)) {
                        this.awaitResolve(msg);                            
                        this.awaitResponse = false;
                        this.hljsOutput = parseHljs(msg.content);
                    }
                }
            });
        },
        data() {
            return {
                muted: false,
                audioHit: new Audio('audio/hit.ogg'),
                audioVictory: new Audio('audio/victory.ogg'),
                audioCooldown: new Audio('audio/click.ogg'),
                bot: window.bot,
                channel: window.bot.channels.get('296046273868333058'),
                awaitResponse: false,
                drpg: '170915625722576896',
                hljsOutput: '',
                disabled: false,
                commands: {
                    adventure: {
                        command: '#!adv',
                        cooldown: 15000,
                        lastTime: 0,
                        percent: 100,
                        sfx: (msg) => {
                            let lines = msg.content.split('\n');
                            if (lines.length == 1) {
                                this.audioCooldown.play();
                                this.commands.adventure.lastTime = 0;
                                this.commands.adventure.percent = 100;
                            } else {
                                if (!msg.content.endsWith('Type `#!adventure 1` to run, or `#!adventure 2` to continue.')) {
                                    this.audioVictory.play();
                                } else
                                this.audioHit.play();
                            }
                        }
                    },
                    forage: {
                        command: '#!forage',
                        cooldown: 300000,
                        lastTime: 0,
                        percent: 100
                    },
                    mine: {
                        command: '#!mine',
                        cooldown: 300000,
                        lastTime: 0,
                        percent: 100
                    },
                    fish: {
                        command: '#!fish',
                        cooldown: 300000,
                        lastTime: 0,
                        percent: 100
                    },
                    chop: {
                        command: '#!chop',
                        cooldown: 300000,
                        lastTime: 0,
                        percent: 100
                    },
                    heal: {
                        command: '#!heal auto',
                        cooldown: 10000,
                        lastTime: 0,
                        percent: 100
                    },
                    pheal: {
                        command: '#!pheal auto',
                        cooldown: 10000,
                        lastTime: 0,
                        percent: 100
                    },
                    pot: {
                        command: '#!buy health potion',
                        cooldown: 10000,
                        lastTime: 0,
                        percent: 100
                    },
                    inv: {
                        command: '#!inv',
                        cooldown: 10000,
                        lastTime: 0,
                        percent: 100
                    },
                    stats: {
                        command: '#!stats',
                        cooldown: 10000,
                        lastTime: 0,
                        percent: 100
                    }
                }
            };
        },
        methods: {
            toggleMute() {
                this.muted = !this.muted;
            },
            doCommand(type, extra = '') {
                this.disabled = true;
                this.awaitResponse = true;
                this.commands[type].percent = 0;
                new Promise((resolve, reject) => {
                    let timer = setTimeout(() => {
                        reject(new Error('Query expired after 10 seconds'));
                    }, 10000);
                    
                    this.awaitResolve = function(msg) {
                        clearTimeout(timer);
                        resolve(msg);
                    };
                }).then(msg => {
                    this.disabled = false;
                    this.commands[type].lastTime = msg.createdTimestamp + (this.commands[type].cooldown);                    
                    let timer = setInterval(() => {
                        if (this.getProgress(type)) {
                            clearInterval(timer);
                        }
                    }, 100);
                    if (!this.muted && this.commands[type].sfx != undefined) {
                        this.commands[type].sfx(msg);
                    }
                }).catch(err => {
                    this.commands[type].lastTime = 0;
                    this.commands[type].percent = 100;
                    this.awaitResolve = undefined;
                    this.awaitResponse = false;
                    this.disabled = false;
                    this.hljsOutput = `An error has occured:<br>${err.message}`;
                });
                this.channel.send(this.commands[type].command + ' ' + extra).catch(err => {
                    this.disabled = false;
                    this.awaitResponse = false;
                    this.hljsOutput = `An error has occured:<br>${err.message}`;                    
                });
            },
            getProgress(type) {
                let now = Date.now();
                if (now < this.commands[type].lastTime) {
                    let diff = this.commands[type].lastTime - now;
                    this.commands[type].percent = Math.abs(Math.min((diff / this.commands[type].cooldown) * 100) - 100);
                    return false;
                } else {
                    this.commands[type].percent = 100;
                    return true;
                }
            }
        }
    };
</script>

<style scoped>
    .muteButton {
        position: fixed;
        top: 5px;
        left: 5px;
    }

    .hljs-workspace {
        background: rgba(0,0,0,0.075);
        padding: 5px;
        border-radius: 5px;
    }

    p {
        line-height: 24px;
    }

    button {
        text-align: center;
        padding: 0;
    }
</style>
