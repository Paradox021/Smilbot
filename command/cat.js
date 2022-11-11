import { getCat } from "../services/catService.js"
export const cat = message => {
    getCat().then(imageUrl => message.channel.send({files:[imageUrl]}))
}