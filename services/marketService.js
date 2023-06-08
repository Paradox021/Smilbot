import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

export const getAllOffers = async (serverId) => {
    // se envia la peticion con el id del servidor
    const res = await fetch(`${process.env.BACKEND_URL}/market/${serverId}/offers`)
    const offers = await res.json()
    return offers
}

export const addOffer = async (offer) => {
    // se envia la peticion con el id del servidor
    const res = await fetch(`${process.env.BACKEND_URL}/market/${offer.serverId}/offers`, {
        method: 'POST',
        body: JSON.stringify(offer),
        headers: { 'Content-Type': 'application/json' },
    })

    return res
}

export const buyOffer = async (offer) => {
    // se envia la peticion con el id del servidor
    const res = await fetch(`${process.env.BACKEND_URL}/market/${offer.serverId}/offers/${offer.offerId}/buy`, {
        method: 'POST',
        body: JSON.stringify(offer),
        headers: { 'Content-Type': 'application/json' },
    })

    return res
}

export const removeOffer = async (offer) => {
    // se envia la peticion con el id del servidor
    const res = await fetch(`${process.env.BACKEND_URL}/market/${offer.serverId}/offers/${offer.offerId}`, {
        method: 'DELETE',
        body: JSON.stringify(offer),
        headers: { 'Content-Type': 'application/json' },
    })

    return res
}