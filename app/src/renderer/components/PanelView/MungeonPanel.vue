<template>
    <div class="container full"
         style="padding-bottom: 0; margin-bottom: 0">
        <a v-on:click="toggleMute"
           class="muteButton btn-floating btn-large waves-effect waves-light red"><i class="material-icons">{{ muted ? 'volume_off' : 'volume_up' }}</i></a>
    
        <div class="row">
            <div class="col s8">
                <div class="row">
                    <div class="col s12">
                        <div class="progress">
                            <div class="determinate"
                                 v-bind:style="'width: ' + commands.shop.percent + '%'"></div>
                        </div>
                        <div class="row">
                            <div class="col s4">
                                <button class="btn full"
                                        v-on:click="doShop()"
                                        v-bind:disabled="commands.shop.percent < 100 || disabled">Buy</button>
                            </div>
                            <div class="col s6 input-field">
                                <label for="buyItem">Item</label>
                                <input type="text"
                                       id="buyItem"
                                       v-model="buyItem">
                            </div>
                            <div class="col s2 input-field">
                                <label for="buyQuantity">Quantity</label>
                                <input type="number"
                                       id="buyQuantity"
                                       v-model="buyQuantity">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col s12">
                        <div class="hljs-workspace"
                             v-html="hljsOutput">
                        </div>
                    </div>
    
                </div>
            </div>
            <div class="col s4">
                <div class="row">
                    <div class="col s12">
                        <div class="progress">
                            <div class="determinate"
                                 v-bind:style="'width: ' + commands.adventure.percent + '%'"></div>
                        </div>
                        <div class="row">
                            <div class="col s6">
                                <button class="btn full"
                                        v-on:click="doCommand('adventure')"
                                        v-bind:disabled="commands.adventure.percent < 100 || disabled">Adventure</button>
                            </div>
                            <div class="col s6">
                                <button class="btn full"
                                        v-on:click="doCommand('adventure', 1)"
                                        v-bind:disabled="commands.adventure.percent < 100 || disabled">Run</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col s6">
                        <div class="progress">
                            <div class="determinate"
                                 v-bind:style="'width: ' + commands.heal.percent + '%'"></div>
                        </div>
                        <button class="btn full"
                                v-on:click="doCommand('heal')"
                                v-bind:disabled="commands.heal.percent < 100 || disabled">Heal</button>
                    </div>
                    <div class="col s6">
                        <div class="progress">
                            <div class="determinate"
                                 v-bind:style="'width: ' + commands.pheal.percent + '%'"></div>
                        </div>
                        <button class="btn full"
                                v-on:click="doCommand('pheal')"
                                v-bind:disabled="commands.pheal.percent < 100 || disabled">Heal Pet</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col s12">
                        <div class="progress">
                            <div class="determinate"
                                 v-bind:style="'width: ' + commands.gather.percent + '%'"></div>
                        </div>
                        <button class="btn full"
                                v-on:click="gather"
                                v-bind:disabled="disabled">gather</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col s6">
                        <div class="progress">
                            <div class="determinate"
                                 v-bind:style="'width: ' + commands.inv.percent + '%'"></div>
                        </div>
                        <button class="btn full"
                                v-on:click="doCommand('inv')"
                                v-bind:disabled="disabled">Inventory</button>
                    </div>
                    <div class="col s6">
                        <div class="progress">
                            <div class="determinate"
                                 v-bind:style="'width: ' + commands.stats.percent + '%'"></div>
                        </div>
                        <button class="btn full"
                                v-on:click="doCommand('stats')"
                                v-bind:disabled="disabled">Stats</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col s12">
                        <div class="file-field input-field">
                            <input v-on:click="doCustom"
                                   type="button"
                                   class="btn"
                                   value=">"
                                   v-bind:disabled="disabled">
                            <div class="file-path-wrapper">
                                <input type="text"
                                       placeholder="Command"
                                       v-model="customCommand">
                            </div>
                        </div>
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
            if (msg.guild == undefined && msg.author.id == this.drpg) console.log(msg.content);
            if (msg.guild == undefined && msg.author.id == this.drpg && this.awaitResponse == true) {
                for (let message of this.cooldownMessages) {
                    if (message.test(msg.content)) {
                        msg.cooldown = msg.content.match(message)[1];
                        break;
                    }
                }

                msg.acknowledge();

                this.awaitResolve(msg);
                this.awaitResponse = false;
                if (this.automateOutput)
                    this.hljsOutput = parseHljs(msg.content);

            }
        });
    },

    data() {
        return {
            buyItem: '',
            buyQuantity: '',
            muted: false,
            cooldownMessages: [
                /You're too tired to do that .+ \((\d+) seconds\)/,
                /You need to rest, .+ \((\d+) seconds\)/,
                /Recovering .+'s stamina in (\d+) seconds./
            ],
            audioHit: new Audio('audio/hit.ogg'),
            audioVictory: new Audio('audio/victory.ogg'),
            audioCooldown: new Audio('audio/click.ogg'),
            bot: window.bot,
            timers: {},
            channel: window.bot.users.get('170915625722576896'),
            awaitResponse: false,
            automateOutput: true,
            Promise: window.Promise,
            drpg: '170915625722576896',
            hljsOutput: '',
            disabled: false,
            customCommand: '',
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
                        } else {
                            if (!msg.content.endsWith('Type `#!adventure 1` to run, or `#!adventure 2` to continue.')) {
                                this.audioVictory.play();
                            } else
                                this.audioHit.play();
                        }
                    }
                },
                gather: {
                    commands: ['#!forage', '#!mine', '#!chop', '#!fish'],
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
                shop: {
                    command: '#!buy',
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
        awaitMessage(disable = true) {
            return new Promise((resolve, reject) => {
                if (disable) this.disabled = true;
                let timer = setTimeout(() => {
                    this.awaitResolve = undefined;
                    this.awaitResponse = false;
                    if (disable) this.disabled = false;
                    reject(new Error('Query expired after 10 seconds'));
                }, 10000);
                this.awaitResponse = true;
                this.awaitResolve = function (msg) {
                    clearTimeout(timer);
                    if (disable) this.disabled = false;
                    resolve(msg);
                };
            });
        },
        gather() {
            this.commands.gather.percent = 0;
            this.disabled = true;
            let lines = [];
            let timestamp;
            let cooldown;
            this.automateOutput = false;
            this.Promise.each(this.commands.gather.commands, command => {
                return new Promise((resolve, reject) => {
                    this.awaitMessage(false).then(msg => {
                        lines.push(msg.content);
                        timestamp = msg.createdTimestamp;
                        if (msg.cooldown) cooldown = msg.cooldown;
                        resolve();
                    }).catch(reject);
                    this.channel.send(command).catch(reject);
                });
            }).then(() => {
                this.disabled = false;
                this.automateOutput = true;
                if (!cooldown)
                    this.commands.gather.lastTime = timestamp +
                        this.commands.gather.cooldown;
                else
                    this.commands.gather.lastTime = timestamp +
                        this.commands.gather.cooldown -
                        (this.commands.gather.cooldown - (cooldown * 1000));
                if (!this.timers.gather)
                    this.timers.gather = setInterval(() => {
                        if (this.getProgress('gather')) {
                            clearInterval(this.timers.gather);
                            delete this.timers.gather;
                        }
                    }, 100);
                this.hljsOutput = lines.join('<br>');
                if (!this.muted && this.commands.gather.sfx != undefined) {
                    this.commands.gather.sfx(lines);
                }
            }).catch(err => {
                this.commands.gather.lastTime = 0;
                this.automateOutput = true;
                this.commands.gather.percent = 100;
                this.hljsOutput = `An error has occured:<br>${err.message}`;
            });
        },
        doCustom() {
            if (this.customCommand != '') {
                if (!this.customCommand.startsWith('#!'))
                    this.customCommand = '#!' + this.customCommand;
                this.awaitMessage().then(msg => {

                }).catch(err => {
                    this.hljsOutput = `An error has occured:<br>${err.message}`;
                });
                this.channel.send(this.customCommand);
            }
        },
        doShop() {
            this.doCommand('shop', this.buyItem + ' ' + this.buyQuantity);
        },
        doCommand(type, extra = '') {
            this.commands[type].percent = 0;
            this.awaitMessage().then(msg => {
                if (!msg.cooldown)
                    this.commands[type].lastTime = msg.createdTimestamp +
                        this.commands[type].cooldown;
                else
                    this.commands[type].lastTime = msg.createdTimestamp +
                        this.commands[type].cooldown -
                        (this.commands[type].cooldown - (msg.cooldown * 1000));
                if (!this.timers[type])
                    this.timers[type] = setInterval(() => {
                        if (this.getProgress(type)) {
                            clearInterval(this.timers[type]);
                            delete this.timers[type];
                        }
                    }, 100);
                if (!this.muted && this.commands[type].sfx != undefined) {
                    this.commands[type].sfx(msg);
                }
            }).catch(err => {
                this.commands[type].lastTime = 0;
                this.commands[type].percent = 100;
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
    top: 61px;
    left: 5px;
}

.hljs-workspace {
    background: rgba(0, 0, 0, 0.075);
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

input::-webkit-input-placeholder {
    color: #666;
}

input,
.input-field {
    margin: 0
}
</style>
