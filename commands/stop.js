export const stop = (message, args, client) => {
    if (!message.member.voice.channel) {
        message.channel.send(`${message.author} you must be in a voice channel to do this! `);
        message.delete()
        return;
    }
    try {
        client.distube.stop(message);
        message.channel.send("Stopped the queue!");
        message.delete()
    } catch (e) {
        console.error(e.name, e.message)
    }
}