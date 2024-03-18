// service for user

const getUser = async (user) => {
    const res = await fetch(process.env.BACKEND_URL+"/user/id", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${process.env.BOT_BEARER_TOKEN}`
        },
        body: JSON.stringify(user)
    })
    const newUser = await res.json()
    return newUser
}

const addBalance = async (userId, amount) => {
    const res = await fetch(process.env.BACKEND_URL+"/user/" + userId + "/balance/" + amount, {
        method: "POST",
        headers:{
            'Authorization': `Bearer ${process.env.BOT_BEARER_TOKEN}`
        }
    })
    if (!res.ok) {
        console.log(await res.json())
        return
    }
    const user = await res.json()
    return user
}

const removeBalance = async (userId, amount) => {
    const res = await fetch(process.env.BACKEND_URL+"/user/" + userId + "/balance/" + amount, {
        method: "DELETE",
        headers:{
            'Authorization': `Bearer ${process.env.BOT_BEARER_TOKEN}`
        }
    })
    if (!res.ok) {
        console.log(await res.json())
        return
    }
    const user = await res.json()
    return user
}

const addCard = async (userId, cardId) => {
    const res = await fetch(process.env.BACKEND_URL+"/user/" + userId + "/card/" + cardId, {
        method: "POST",
        headers:{
            'Authorization': `Bearer ${process.env.BOT_BEARER_TOKEN}`
        }
    })
    if (!res.ok) {
        console.log(await res.json())
        return
    }
    const user = await res.json()
    return user
}

const removeCard = async (userId, cardId) => {
    const res = await fetch(process.env.BACKEND_URL+"/user/" + userId + "/card/" + cardId, {
        method: "DELETE",
        headers:{
            'Authorization': `Bearer ${process.env.BOT_BEARER_TOKEN}`
        }
    })
    if (!res.ok) {
        console.log(await res.json())
        return
    }
    const user = await res.json()
    return user
}

const dailyBalance = async (id) => {
    const res = await fetch(process.env.BACKEND_URL+"/user/" + id + "/dailyBalance", {
        method: "POST",
        headers:{
            'Authorization': `Bearer ${process.env.BOT_BEARER_TOKEN}`
        }
    })
    return res
}

const getMyCards = async (userId) => {
    const res = await fetch(process.env.BACKEND_URL+"/user/" + userId + "/cards", {
        headers:{
            'Authorization': `Bearer ${process.env.BOT_BEARER_TOKEN}`
        }
    
    })
    if (!res.ok) {
        console.log(await res.json())
        return
    }
    const cards = await res.json()
    return cards
}

export { getUser, addBalance, removeBalance, addCard, removeCard, dailyBalance, getMyCards }

