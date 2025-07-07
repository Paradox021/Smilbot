import FormData from "form-data"
import fetch from "node-fetch"
import dotenv from "dotenv"
import crypto from "crypto"

dotenv.config()

const getCard = () => {
    // Genera un número aleatorio entre 0 y 999
    const roll = crypto.randomInt(0, 1000); 
    console.log("roll: ", roll);

    if (roll < 5) return getMythicCard(); // 0.5%
    if (roll < 25) return getLegendaryCard(); // 2%
    if (roll < 125) return getEpicCard(); // 10%
    if (roll < 425) return getRareCard(); // 30%
    return getCommonCard(); // 57.5%
};

const getMythicCard = () => fetch(process.env.BACKEND_URL+"/card/mythic").then(res => res.json())
const getLegendaryCard = () => fetch(process.env.BACKEND_URL+"/card/legendary").then(res => res.json())
const getEpicCard = () => fetch(process.env.BACKEND_URL+"/card/epic").then(res => res.json())
const getRareCard = () => fetch(process.env.BACKEND_URL+"/card/rare").then(res => res.json())
const getCommonCard = () => fetch(process.env.BACKEND_URL+"/card/common").then(res => res.json())

const createCard = async (message, args) => {

    const formData = new FormData();

    const imageUrl = message.attachments.first().url
    const imageName = imageUrl.split('/').pop()
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.buffer();
    formData.append('image', imageBuffer, imageName);
    // quitamos los dos primeros argumentos y el resto los juntamos en una sola string
    const desc = args.slice(2).join(' ')
    formData.append('data', JSON.stringify({
        name: args[0],
        type: args[1],
        description: desc,
        author: message.author.username
    }))

     
    const res = await fetch(process.env.BACKEND_URL+"/card", {
        method: "POST",
        body: formData
    })

    if (!res.ok) {
        console.log(await res.json())
        return
    }

    const newCard = await res.json()

    if(newCard.error) return undefined

    return newCard
}

const getAllCards = async () => {
    const res = await fetch(process.env.BACKEND_URL+"/card")
    const cards = await res.json()
    return cards
}

export { getCard, createCard, getAllCards }



