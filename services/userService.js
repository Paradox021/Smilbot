// service for user

const getUser = async (user) => {
    const res = await fetch("http://localhost:3000/user/id", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    const newUser = await res.json()
    return newUser
}

const addBalance = async (userId, amount) => {
    const res = await fetch("http://localhost:3000/user/" + userId + "/balance/" + amount, {
        method: "POST"
    })
    if (!res.ok) {
        console.log(await res.json())
        return
    }
    const user = await res.json()
    return user
}

const removeBalance = async (userId, amount) => {
    const res = await fetch("http://localhost:3000/user/" + userId + "/balance/" + amount, {
        method: "DELETE"
    })
    if (!res.ok) {
        console.log(await res.json())
        return
    }
    const user = await res.json()
    return user
}

const addCard = async (userId, cardId) => {
    const res = await fetch("http://localhost:3000/user/" + userId + "/card/" + cardId, {
        method: "POST"
    })
    if (!res.ok) {
        console.log(await res.json())
        return
    }
    const user = await res.json()
    return user
}

const removeCard = async (userId, cardId) => {
    const res = await fetch("http://localhost:3000/user/" + userId + "/card/" + cardId, {
        method: "DELETE"
    })
    if (!res.ok) {
        console.log(await res.json())
        return
    }
    const user = await res.json()
    return user
}

const dailyBalance = async (id) => {
    const res = await fetch("http://localhost:3000/user/" + id + "/dailyBalance", {
        method: "POST"
    })
    return res
}

const getMyCards = async (userId) => {
    const res = await fetch("http://localhost:3000/user/" + userId + "/cards")
    if (!res.ok) {
        console.log(await res.json())
        return
    }
    const cards = await res.json()
    return cards
}

export { getUser, addBalance, removeBalance, addCard, removeCard, dailyBalance, getMyCards }

