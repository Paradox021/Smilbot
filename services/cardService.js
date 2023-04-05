import FormData from "form-data"
import fetch from "node-fetch"


// 0.5% chance of getting a mythic card
// 2% chance of getting a legendary card
// 10% chance of getting a epic card
// 30% chance of getting a rare card
// 57.5% chance of getting a common card
const getCard = () => {
    const roll = Math.random() * 1000
    if (roll < 5) {
        return getMythicCard()
    }
    if (roll < 25) {
        return getLegendaryCard()
    }
    if (roll < 125) {
        return getEpicCard()
    }
    if (roll < 425) {
        return getRareCard()
    }
    return getCommonCard()
}

const getMythicCard = () => fetch("http://localhost:3000/card/mythic").then(res => res.json())
const getLegendaryCard = () => fetch("http://localhost:3000/card/legendary").then(res => res.json())
const getEpicCard = () => fetch("http://localhost:3000/card/epic").then(res => res.json())
const getRareCard = () => fetch("http://localhost:3000/card/rare").then(res => res.json())
const getCommonCard = () => fetch("http://localhost:3000/card/common").then(res => res.json())

const createCard = async (message, args) => {

    const formData = new FormData();

    const imageUrl = message.attachments.first().url
    const imageName = imageUrl.split('/').pop()
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.buffer();
    formData.append('image', imageBuffer, imageName);

    formData.append('data', JSON.stringify({
        name: args[0],
        type: args[1],
        description: args[2],
        author: message.author.username
    }))

     
    const res = await fetch("http://localhost:3000/card", {
        method: "POST",
        body: formData
    })

    if (!res.ok) {
        console.log(await res.json())
        return
    }

    const newCard = await res.json()

    return newCard
}

export { getCard, createCard }



