export const skip = async message => {
    if (!message.member.voice.channel) {
        message.channel.send(`${message.author} you must be in a voice channel to do this! `);
        message.delete()
        return;
    }

    try {

        if(client.distube.getQueue(message).songs.length <= 1){
            message.channel.send("Mmm.. . soo basicly. . ther e no morr songs to skip...")
            message.delete()
            return
        }
        
        await client.distube.skip(message);
        message.channel.send("Song skipped!");
        message.delete()
    } catch (e) {
        console.error(e.name, e.message)
    }
}