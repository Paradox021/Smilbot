export function getInspirationalQuote(){
    return fetch("https://type.fit/api/quotes")
    .then(response => response.json())
    .then(data => data[Math.floor(Math.random() * 1500)])
}