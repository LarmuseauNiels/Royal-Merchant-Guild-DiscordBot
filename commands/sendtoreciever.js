module.exports = {
    name: "sendtoreciever",
    desc: "send message to your gift reciever for Secret santa",
    example: "\\sendtoreciever your package will arive tommorow",
    alias: ["str","SendToReciever","sendtr","sendtor","sendtoreceiver"],
    run: (client, message, args) => {
        let text = message.content.slice(message.content.indexOf(" ") + 1);
        client.DBconnection.query(
            'Select RecieverID from SSLink where SenderID = ?',message.author.id,
             function (error, results, fields) {
                if(error != null){ console.log(error)}
                if(results != null){
                    client.users.fetch(results[0].RecieverID).then(reciever => {
                        reciever.send("Secret santa: '"+ text+ "'");
                        message.reply("Send '" + text + "' to " + reciever.username);
                    }).catch(error => {
                        console.log(error)
                        message.reply("Send this to niels: " + error);
                    });
                }
                else{
                    message.reply("Failed to send message");
                }
            });
    }
};
