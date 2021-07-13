const Discord = require("discord.js");
const { listenerCount } = require("events");
const { connect } = require("http2");
const ytdl = require("ytdl-core");
const config = require("./config.json");
const pref = config.pref

const Client = new Discord.Client;

Client.on("ready", async () =>{ 
    Client.user.setStatus("online");
    Client.user.setActivity("&help", {type: "WATCHING"})
});

const prefix = "&";

var list = [];

Client.on("ready", () => {
    console.log("Bot Ready !");
});

Client.on("guildMemberAdd", member => {
    console.log("Un nouveau membre est arrivé");
    let embed = new Discord.MessageEmbed()
    .setColor("#FF0000")
    .setDescription(`<@${member.id}>` + " viens de rejoindre le serveur, il va sûrement rejoindre les **Bloods**")
    .setFooter("Nous sommes maintenant " + member.guild.memberCount)
    .setImage("https://imgur.com/jcrEBHD.png")
    .setTimestamp()
    member.guild.channels.cache.find(channel => channel.id === "863450276148936724").send(embed)
    member.roles.add("863470720896991252");
});



Client.on("guildMemberRemove", member => {
    console.log("Un membre nous a quitté");
    member.guild.channels.cache.find(channel => channel.id === "863450276148936724").send(member.displayName + " **nous a __quitté__ :sob:**");   
});


function playMusic(connection){
    let dispatcher = connection.play(ytdl(list[0], { quality: "highestaudio"}));

    dispatcher.on("finish", () => {
        list.shift();
        dispatcher.destroy();

        if(list.length > 0){
            playMusic(connection);
        }
        else {
            connection.disconnect();
        }
    });

    dispatcher.on("error", err => {
        console.log("erreur de dispatcher : " + err);
        dispatcher.destroy();
        connection.disconnect();
    })
}


Client.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type == "dm") return; 

    if(message.content === prefix + "playlist"){
        let msg = "**FILE D'ATTENTE !**\n";
        for(var i = 0;i < list.length;i++){
            let name;
           let getinfo = await
           ytdl.getBasicInfo(list[i]);
           name = getinfo.videoDetails.title;

            msg += "> " + i + " - " + name + "\n";
        }
        message.channel.send(msg);
    }

    else if(message.content.startsWith(prefix + "play")){
        if(message.member.voice.channel){
            let args = message.content.split(" ");

            if(args[1] == undefined || !args[1].startsWith("https://www.youtube.com/watch?v=")){
                message.reply("Impossible de lire la vidéo.");
            }
            else{
                if(list.length > 0){
                    list.push(args[1]);
                    message.reply("Vidéo ajouté à la liste.");
                }
                else{
                    list.push(args[1]);
                    message.reply("Vidéo ajouté à la liste.")

                    message.member.voice.channel.join().then(connection => {
                        playMusic(connection);

                        connection.on("disconnect", () => {
                            list = [];
                        })
                    
                    }).catch(err => {
                        message.reply("Erreur lors de la connexion : " + err);
                    })
                }
            }
        }
    }

    
    //&arme
    if(message.content == prefix + "arme"){
        let embed = new Discord.MessageEmbed()
        .setColor("#FF0000")
        .setTitle("**Tarifs armes __Castillo__**")
        .setAuthor("Armes", "https://imgur.com/G34CHF6.png")
        .setThumbnail("https://imgur.com/5ewPit1.png")
        .addField("\u200B", "\u200B", false)
        .addField("Pétoire", "33 000$", true)
        .addField("Berreta", "45 000$", true)
        .addField("Calibre.50", "80 000$", true)
        message.channel.send(embed)
    }
    
    //&cheh
    if(message.content == prefix + "cheh"){
        message.channel.send("CHEH ! Ta le seum hein.")
    }
    
    //&ninho
    if(message.content == prefix + "ninho"){
        message.channel.send("Salit c'est Ninho !")
    }
    
    //&help
    if(message.content == prefix + "help"){
        message.channel.send("Alors tout d'abord j'ai été créé par **__AppleJuuicee__**,\nmon préfix est &.\nVoici la liste de mes commandes :\n**__&bloods__** \n**__&families__** \n**__&ninho__** \n**__&play__** \n**__&playlist__** \n(Des autres sont en cours ^^) ")
    }

    //&families
    if(message.content == prefix + "families"){
        message.channel.send("**On baise tous les Families**")
    }
    
    //&bloods
    if(message.content == prefix + "bloods"){
        message.channel.send("**BLOODS GANG !**");
    }

    if(message.content == "Bien et toi"){
        message.channel.send("Bien, je continue d'évoluer tel un pokémon xD")
    }

    if(message.content == "Tu fais quoi ?"){
        message.channel.send("Moi ? J'attends, mon développeur est en train de m'améliorer ^^")
    }

    if(message.content == "Salut"){
        message.reply("Hey !");
        message.channel.send("Comment ça va ?");
    }    
});


Client.login(config.token);