import { createEmbedHelp } from "../utils/embedCreator.js";

const commands = [ 
    {
       name:'.play | .p [name of the song or url of the youtube video]',
       value:'This command is used to play music in a voice channel. Users can provide a song name or a YouTube link, and the bot will search for and play the requested song.'
    },
    {
       name:'.stop | .leave',
       value:'This command stops the current music playback and clears the queue, causing the bot to leave the voice channel.'
    },
    {
       name:'.skip',
       value:'This command skips the currently playing song and proceeds to the next song in the queue.'
    },
    {
       name:'.queue | .q',
       value:'This command displays the current music queue, showing the upcoming songs to be played.'
    },
    {
       name:'.dailybalance',
       value:'This command adds 100 coins to the user balance.'
    },
    {
       name:'.getcard',
       value:'This command buys a random card for 100 coins'
    },
    {
       name:'.createcard [cardName] [type] [description] [attach image]',
       value:'This command allows admins to create a custom card.'
    },
    {
       name:'.balance',
       value:'This command displays the user\'s current balance.'
    },
    {
       name:'.mycards',
       value:'This command shows your own collection of cards.'
    },
    {
       name:'.show [userMention]',
       value:'This command shows the user\'s collection of cards.'
    },
    {
      name:'.cards',
      value:'This command displays all the available cards.'
    },
    {
       name:'.market',
       value:'This command displays all the available card offers in the market.'
    },
    {
       name:'.sell [cardName]',
       value:'This command allows users to add a card to the market for selling.'
    },
    {
       name:'.buy [offerId]',
       value:'This command allows users to buy an offer.'
    },
    {
       name:'.remove [offerId]',
       value:'This command allows users to remove his offer.'
    },
]

const help = async (message) => {
    message.reply(createEmbedHelp(0x00569D, commands));
}

export { help }