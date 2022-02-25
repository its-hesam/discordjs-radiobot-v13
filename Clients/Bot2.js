const { Client, MessageEmbed , version } = require('discord.js');
const voiceDiscord = require(`@discordjs/voice`);
const { Database } = require('beta.db');
const db = new Database("./db/role.json");
const radio = require(`../botconfig/radiostation.json`);
const {
    ownerid,
    prefix,
    tokenBot2,
    channelToJoinbot2,
  } = require('../botconfig/config.json');
/**
 * Bot 2
 * @param {Client} client 
 */
module.exports = async (client) => {

  client.once("ready", () => {
    console.log(`Connected to ${client.user.id}\n- Bot 2`);
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
            channelId: channelToJoinbot2,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
            selfDeaf: true,
        });
        const player = voiceDiscord.createAudioPlayer();
        const resource = voiceDiscord.createAudioResource(radio["2"]); //Radio javan
       
        player.play(resource);
       connection.subscribe(player);
       player.on(voiceDiscord.AudioPlayerStatus.Idle, () => {
        connection.destroy();
        message.reply(`:x:**Radio Station Has Been Destroyed!**`)
    });
    message.reply(`📻**Radio Started - RADIO JAVAN - Bot 2**`)
    }

    //restart bot 
   if(command == `reset`){
    if (message.author.id !== `${ownerid}`) return message.reply(`:x: **You Dont Have permission to use this command!** `);
    message.reply(`**Start Restarting Bot 2**`)
    client.destroy();
    client.login(token);
    message.channel.send(`✅ **Bot 2 was successfully restarted**`)
   }
// disconnect bot 
     if(command == `dc`){
	      if(message.author.id !== ownerid && !message.member.roles.cache.has(role))return message.reply(`:x: **You Dont Have permission to use this command! , you need <@&${role}> role**`)
    connection.destroy();
    message.reply('✅ **Bot 2 was successfully Disconnected** ')
     }

})
    
   client.login(tokenBot2);

}