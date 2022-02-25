const { Client, MessageEmbed , version } = require('discord.js');
const voiceDiscord = require(`@discordjs/voice`);
const { Database } = require('beta.db');
const db = new Database("./db/role.json");
const radio = require(`../botconfig/radiostation.json`);
const {
    ownerid,
    prefix,
    tokenBot3,
    channelToJoinbot3,
  } = require('../botconfig/config.json');
/**
 * Bot 3
 * @param {Client} client 
 */
module.exports = async (client) => {

  client.once("ready", () => {
    console.log(`Connected to ${client.user.id}\n- Bot 3`);
    client.user.setActivity('Edited by Kawasaki', { type: 'WATCHING' }); //You can change type to : LISTENING , COMPETING , PLAYING 
  })

  client.on("messageCreate", message =>{
    if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();
    


    //radio player
    if(command == "radio"){
        const role = db.get('role')
        if(message.author.id !== ownerid && !message.member.roles.cache.has(role))return message.reply(`:x: **You Dont Have permission to use this command! , you need <@&${role}> role**`)
        //Baraye har bot ye station dar nazar gereftm bara hamin args ndre
        const connection = voiceDiscord.joinVoiceChannel({
            channelId: channelToJoinbot3,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
            selfDeaf: true,
        });
        const player = voiceDiscord.createAudioPlayer();
        const resource = voiceDiscord.createAudioResource(radio["15"]); //Pop radio
       
        player.play(resource);
       connection.subscribe(player);
       player.on(voiceDiscord.AudioPlayerStatus.Idle, () => {
        connection.destroy();
        message.reply(`:x:**Radio Station Has Been Destroyed!**`)
    });
    message.reply(`📻**Radio Started - RADIO POP - Bot 3**`)
    }

    //restart bot 
   if(command == `reset`){
    if (message.author.id !== `${ownerid}`) return message.reply(`:x: **You Dont Have permission to use this command!** `);
    message.reply(`**Start Restarting Bot 3**`)
    client.destroy();
    client.login(token);
    message.channel.send(`✅ **Bot 3 was successfully restarted**`)
   }
// disconnect bot 
     if(command == `dc`){
	      if(message.author.id !== ownerid && !message.member.roles.cache.has(role))return message.reply(`:x: **You Dont Have permission to use this command! , you need <@&${role}> role**`)
    connection.destroy();
    message.reply('✅ **Bot 3 was successfully Disconnected** ')
     }

})
    
   client.login(tokenBot3);

}