const { Client, Intents } = require('discord.js');

const Intent = {intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]};

const client1 = new Client(Intent);
const client2 = new Client(Intent);
const client3 = new Client(Intent);
const client4 = new Client(Intent);
const client5 = new Client(Intent);


require('./Clients/MainBot')(client1);
require('./Clients/Bot2')(client2);
require('./Clients/Bot3')(client3);
require('./Clients/Bot4')(client4);
require('./Clients/Bot5')(client5);


/**********************************************************
 * @INFO
 * Bot Coded by ◈ hesam TooVinS#5284 | https://discord.gg/Jhnqm5BHnt
 * Edited by TheKawasaki | https://github.com/thekawasaki
 *********************************************************/
