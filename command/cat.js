import { getCat } from "../services/catService"
export const cat = message => {
    getCat().then(imageUrl => message.channel.send({files:[imageUrl]}))
}