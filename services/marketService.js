import fetch from "node-fetch";

export const getAllOffers = async (serverId) => {
    // se envia la peticion con el id del servidor
    const res = await fetch(`http://localhost:3000/market/${serverId}/offers`)
    const offers = await res.json()
    return offers
}