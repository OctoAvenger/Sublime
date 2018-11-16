//Defines bot/prefix and languages used.
const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
const bot = new Discord.Client();
const prefix = "$";

bot.on('ready', () => {
    bot.user.setStatus('available')
    bot.user.setPresence({
        game: {
            name: `commands. Try ".help"`,
            type: 2
        }
    });
});

//Message Commands Sublime can proform.
bot.on("message", (message) => {
if (message.content == prefix + "help") {
        message.channel.send({embed: {
            author: {
                name: `My commands are as follows:`,
                icon_url: bot.user.avatarURL
              },
            color: 0xFFFFFF,
            fields: [
            { name: `General Commands:`, value: ".suggest - `.suggest [suggestion]`", inline: true},
            { name: `Moderation Commads:`, value: ".ar - `.ar @[user] [role]`\n.rr - `.rr @[user] [role]`\n.delete - `.delete [number]`\n.mute - `.mute @[user] [reason]`\n.unmute - `.unmute @[user] [reason]`\n.inspect - `.inspect @[user] [reason]`\n.forgive - `.forgive @[user] [reason]`\n.kick - `.kick @[user] [reason]`\n.ban - `.ban @[user] [reason]`", inline: true},
            ]
          }
        });
    }
    if (message.content.startsWith(prefix + 'suggest')) {
        message.delete(1000);
        let embed = {embed: {
            author: {
                name: `${message.member.user.username} | ${message.member.user.username}#${message.member.user.discriminator}`,
                icon_url: message.member.user.avatarURL
              },
            color: 0xF1DA75,
            fields: [
            { name: `Suggestion:`, value: message.content.slice(9, message.content.length), inline: true}
            ]
          }
        }
        message.channel.send(embed).then(sentEmbed => {
            sentEmbed.react("👍")
            const filter = (reaction, user) => reaction.emoji.name === '👍' && user.id === '421725581952942081'
            message.awaitReactions(filter, { time: 35000 })
            .then(sentEmbed.react("👎"))
        })
    }
    //Moderation commands
    if (message.content.startsWith(prefix + 'delete')) {
        if(!message.member.roles.some(r=>["Divine ✨"].includes(r.name)))
        return message.reply("Sorry, you don't have permissions to use this!");
            const logs = message.member.guild.channels.find('name', 'delete-log');
            message.delete(100).then(() => {
            message.channel.bulkDelete(message.content.slice(8, message.content.length)).then(() => {
            message.reply(`Successfully deleted \`${message.content.slice(8, message.content.length)}\` messages`).then(msg => msg.delete(3000));
            logs.send({embed: {
                title: "Deleted Messages:\n\n",
                color: 0x5a5a5a,
                fields: [
                    { name: "Deleted By:", value: `${message.member.user.username}#${message.member.user.discriminator}\n\nUser ID: ${message.member.user.id}`, inline: true},
                    { name: "Messages Deleted:", value: `${message.content.slice(8, message.content.length)}`, inline: true}
                ]
                }
            });
            })}).catch(err => {
            message.reply(`I was unable to delete \`${message.content.slice(8, message.content.length)}\` messages. \`${err}\``);
        });
      }
    if (message.content.startsWith(prefix + "ar")) {
        const user = message.mentions.users.first();
        if(!message.member.roles.some(r=>["Divine ✨"].includes(r.name)))
            return message.reply("Sorry, you don't have permissions to use this!");
            if (user) {
                const logs = message.member.guild.channels.find('name', 'role-log');
                let role = message.guild.roles.find("name", message.content.slice(8 + user.id.length, message.content.length));
                const member = message.guild.member(user);
                if (member) {
                    member.addRole(role).then(() => {
                    message.reply(`Successfully added \`${message.content.slice(8 + user.id.length, message.content.length)}\` to ${member.user.username}.`);
                    logs.send({embed: {
                        title: "User was given role:\n\n",
                        color: 0x66ba67,
                        fields: [
                           { name: "Username:", value: `${member.user.username}#${member.user.discriminator}\n\nUser ID: ${member.id}`, inline: true},
                           { name: "Role:", value: role.name, inline: true},
                        ]
                    }
                });
            }).catch(err => {
                message.reply(`I was unable to add \`${message.content.slice(8 + user.id.length, message.content.length)}\` to ${member.user.username}. Please make sure that role exists and that you have permission to add it.`);
            });
            }
            else {
                message.reply('That user doesn\'t exist!');
            }
              } else {
                message.reply('That\'s nice but who do you want to add the role to?');
            }
    }
    if (message.content.startsWith(prefix + "rr")) {
        const user = message.mentions.users.first();
        if(!message.member.roles.some(r=>["Divine ✨"].includes(r.name)))
            return message.reply("Sorry, you don't have permissions to use this!");
            if (user) {
                const logs = message.member.guild.channels.find('name', 'role-log');
                let role = message.guild.roles.find("name", message.content.slice(8 + user.id.length, message.content.length));
                const member = message.guild.member(user);
                if (member) {
                    member.removeRole(role).then(() => {
                    message.reply(`Successfully removed \`${message.content.slice(8 + user.id.length, message.content.length)}\` from ${member.user.username}.`);
                    logs.send({embed: {
                        title: "User had role removed:\n\n",
                        color: 0xaa3333,
                        fields: [
                           { name: "Username:", value: `${member.user.username}#${member.user.discriminator}\n\nUser ID: ${member.id}`, inline: true},
                           { name: "Role:", value: role.name, inline: true},
                        ]
                    }
                });
            }).catch(err => {
                message.reply(`I was unable to remove \`${message.content.slice(8 + user.id.length, message.content.length)}\` from ${member.user.username}. Please make sure that role exists and that you have permission to remove it.`);
            });
            }
            else {
                message.reply('That user doesn\'t exist!');
            }
              } else {
                message.reply('That\'s nice but who do you want to take the role from?');
            }
    }
    if (message.content.startsWith(prefix + 'unmute')) {
        const user = message.mentions.users.first();
        if(!message.member.roles.some(r=>["Divine ✨"].includes(r.name)))
        return message.reply("Sorry, you don't have permissions to use this!");
        if (user) {
            const member = message.guild.member(user);
            const logs = member.guild.channels.find('name', 'mod-log');
            if (member) {
                let muted = message.guild.roles.find("name", "Muted");
                member.removeRole(muted).then(() => {
                message.reply(`Successfully unmuted ${user}`);
                if (message.content.slice(11 + user.id.length, message.content.length) < 0) {
                    reason = "None given";
                }
                else {
                    reason = message.content.slice(11 + user.id.length, message.content.length);
                }
                logs.send({embed: {
                    title: "User unmuted:\n\n",
                    color: 0x5a5a5a,
                    fields: [
                        { name: "Username:", value: `${member.user.username}#${member.user.discriminator}\n\nUser ID: ${member.id}`, inline: true},
                        { name: "Reason:", value: reason, inline: true},
                    ]
                    }
                });
                }).catch(err => {
                message.reply('I was unable to unmute the member. `' + err + '`');
            });
        }   else {
        message.reply('That user doesn\'t exist!');
        }
    } else {
        message.reply('That\'s nice but who do you want to unmute?');
    }
    }
    if (message.content.startsWith(prefix + 'mute')) {
        const user = message.mentions.users.first();
        if(!message.member.roles.some(r=>["Divine ✨"].includes(r.name)))
        return message.reply("Sorry, you don't have permissions to use this!");
        if (user) {
            const member = message.guild.member(user);
            const logs = member.guild.channels.find('name', 'mod-log');
            if (member) {
                let muted = message.guild.roles.find("name", "Muted");
                member.addRole(muted).then(() => {
                message.reply(`Successfully muted ${user}`);
                if (message.content.slice(10 + user.id.length, message.content.length) < 0) {
                    reason = "None given";
                }
                else {
                    reason = message.content.slice(10 + user.id.length, message.content.length);
                }
                logs.send({embed: {
                    title: "User muted:\n\n",
                    color: 0x5a5a5a,
                    fields: [
                        { name: "Username:", value: `${member.user.username}#${member.user.discriminator}\n\nUser ID: ${member.id}`, inline: true},
                        { name: "Reason:", value: reason, inline: true},
                    ]
                    }
                });
                }).catch(err => {
                message.reply('I was unable to mute the member. `' + err + '`');
            });
        }   else {
        message.reply('That user doesn\'t exist!');
        }
    } else {
        message.reply('That\'s nice but who do you want to mute?');
    }
    }
    if (message.content.startsWith(prefix + 'inspect')) {
        const user = message.mentions.users.first();
        if(!message.member.roles.some(r=>["Divine ✨"].includes(r.name)))
        return message.reply("Sorry, you don't have permissions to use this!");
        if (user) {
            const member = message.guild.member(user);
            const logs = member.guild.channels.find('name', 'mod-log');
            let timeout = message.guild.channels.find("name", "limbo");
            if (member) {
                let inspect = message.guild.roles.find("name", "damned ⛓");
                member.addRole(inspect).then(() => {
                message.reply(`Successfully put ${user} into Limbo`);
                timeout.send(`${user} you have been placed in Limbo for \`${message.content.slice(13 + user.id.length, message.content.length)}\` you are going to have to speak with a moderator about your behavior before you will be able to chat anywhere else.`)
                if (message.content.slice(13 + user.id.length, message.content.length) < 0) {
                    reason = "None given";
                }
                else {
                    reason = message.content.slice(13 + user.id.length, message.content.length);
                }
                logs.send({embed: {
                    title: "User put in limbo:\n\n",
                    color: 0xe5e5e5,
                    fields: [
                        { name: "Username:", value: `${member.user.username}#${member.user.discriminator}\n\nUser ID: ${member.id}`, inline: true},
                        { name: "Reason:", value: reason, inline: true},
                    ]
                    }
                });
                }).catch(err => {
                message.reply('I was unable to put the member in limbo `' + err + '`');
            });
        }   else {
        message.reply('That user doesn\'t exist!');
        }
    } else {
        message.reply('That\'s nice but who do you want to put in limbo?');
    }
    }
    if (message.content.startsWith(prefix + 'forgive')) {
        const user = message.mentions.users.first();
        if(!message.member.roles.some(r=>["Divine ✨"].includes(r.name)))
        return message.reply("Sorry, you don't have permissions to use this!");
        if (user) {
            const member = message.guild.member(user);
            const logs = member.guild.channels.find('name', 'mod-log');
            if (member) {
                let timeout = message.guild.roles.find("name", "damned ⛓");
                member.removeRole(damned).then(() => {
                message.reply(`Successfully forgave ${user}`);
                if (message.content.slice(12 + user.id.length, message.content.length) < 0) {
                    reason = "None given";
                }
                else {
                    reason = message.content.slice(12 + user.id.length, message.content.length);
                }
                logs.send({embed: {
                    title: "User Forgiven:\n\n",
                    color: 0x5a5a5a,
                    fields: [
                        { name: "Username:", value: `${member.user.username}#${member.user.discriminator}\n\nUser ID: ${member.id}`, inline: true},
                        { name: "Reason:", value: reason, inline: true},
                    ]
                    }
                });
                }).catch(err => {
                message.reply('I was unable to forgive the member. `' + err + '`');
            });
        }   else {
        message.reply('That user doesn\'t exist!');
        }
    } else {
        message.reply('That\'s nice but who do you want to forgive?');
    }
    }
    if (message.content.startsWith(prefix + 'kick')) {
        const user = message.mentions.users.first();
        if(!message.member.roles.some(r=>["Nephilim 👼🏻", "Creator 👁"].includes(r.name)))
        return message.reply("Sorry, you don't have permissions to use this!");
        if (user) {
            const member = message.guild.member(user);
            const logs = member.guild.channels.find('name', 'mod-log');
            if (member) {
                member.kick(message.content).then(() => {
                message.reply(`Successfully kicked ${user}`);
                if (message.content.slice(10 + user.id.length, message.content.length) < 0) {
                    reason = "None given";
                }
                else {
                    reason = message.content.slice(10 + user.id.length, message.content.length);
                }
                logs.send({embed: {
                    title: "User kicked:\n\n",
                    color: 0xaa3333,
                    fields: [
                        { name: "Username:", value: `${member.user.username}#${member.user.discriminator}\n\nUser ID: ${member.id}`, inline: true},
                        { name: "Reason:", value: reason, inline: true},
                    ]
                    }
                });
                }).catch(err => {
                message.reply('I was unable to kick the member. `' + err + '`');
            });
        }   else {
          message.reply('That user doesn\'t exist!');
        }
      } else {
        message.reply('That\'s nice but who do you want to kick?');
      }
    }
    if (message.content.startsWith(prefix + 'ban')) {
        const user = message.mentions.users.first();
        if(!message.member.roles.some(r=>"Creator 👁".includes(r.name)))
        return message.reply("Sorry, you don't have permissions to use this!");
        if (user) {
            const member = message.guild.member(user);
            const logs = member.guild.channels.find('name', 'mod-log');
            if (member) {
                member.ban(`I don\'t know ask the moderator that banned him.`).then(() => {
                message.reply(`Successfully banned ${user}`);
                if (message.content.slice(9 + user.id.length, message.content.length) < 0) {
                    reason = "None given";
                }
                else {
                    reason = message.content.slice(9 + user.id.length, message.content.length);
                }
                logs.send({embed: {
                    title: "User banned:\n\n",
                    color: 0xaa3333,
                    fields: [
                        { name: "Username:", value: `${member.user.username}#${member.user.discriminator}\n\nUser ID: ${member.id}`, inline: true},
                        { name: "Reason:", value: reason, inline: true},
                    ]
                    }
                });
                }).catch(err => {
                message.reply('I was unable to ban the member. `' + err + '`');
            });
        }   else {
          message.reply('That user doesn\'t exist!');
        }
      } else {
        message.reply('That\'s nice but who do you want to ban?');
      }
    }
});

bot.on('guildMemberAdd', member => {
    const logs = member.guild.channels.find('name', 'join-log')
    logs.send({embed: {
        title: "User joined:\n\n",
        color: 0x66ba67,
        fields: [
            { name: "Username:", value: `${member.user.username}#${member.user.discriminator}`, inline: true},
            { name: "Joined server:", value: `${member.joinedAt}`, inline: true},
            { name: "Joined Discord:", value: `${member.user.createdAt}\n\nUser ID: ${member.id}`, inline: true}
        ]
      }
    });
  });
bot.on('guildMemberRemove', member => {
    const logs = member.guild.channels.find('name', 'join-log')
    logs.send({embed: {
        title: "User left:\n\n",
        color: 0xaa3333,
        fields: [
            { name: "Username:", value: `${member.user.username}#${member.user.discriminator}\n\nUser ID: ${member.id}`, inline: true},
            { name: "Left server:", value: `${member.removedAt}`, inline: true},
        ]
        }
    });
});


//Bot login Token.
bot.login(process.env.BOT_TOKEN);
