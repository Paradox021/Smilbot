// service for user


const getUser = async (userId) => {
    const res = await fetch("http://localhost:3000/user/" + userId)
    const user = await res.json()
    return user
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

export { getUser, addBalance, removeBalance, addCard, removeCard }

