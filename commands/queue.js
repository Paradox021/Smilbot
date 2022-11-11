export const queue = message => {
    const queue = client.distube.getQueue(message)
    if (!queue){
        message.channel.send(`There is nothing playing!`)
        message.delete()
        return
    }   
    const q = queue.songs
      .map((song, i) => `${i === 0 ? 'Playing:' : i+"."} ${song.name} - \`${song.formattedDuration}\``)
      .join('\n')
    message.channel.send(`**Server Queue**\n${q}`)
    message.delete()
}