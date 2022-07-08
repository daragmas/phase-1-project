const zipCodeForm = document.getElementById('zipcode-form')
const breweryList = document.getElementById('brewery-list')
const favSelector = document.getElementById('fav-selector')

let lat
let long
let zip
let faves

const getData = async (url) => {
    req = await fetch(url)
    return res = await req.json()
}

const getLatLong = async (zip) => {
    const zipCodeApiUrl = `https://api.zippopotam.us/us/${zip}`
    const latAndLong = await getData(zipCodeApiUrl)
    latLong = [latAndLong.places[0].latitude, latAndLong.places[0].longitude]
    // long = latAndLong.places[0].longitude
    return latLong
}

const getBreweries = async (latLong) => {
    const breweryApiUrl = `https://api.openbrewerydb.org/breweries?by_dist=${latLong[0]},${latLong[1]}&per_page=3`
    return breweriesData = await getData(breweryApiUrl)
}

const makeBrewLi = (brewery) => {

    let collapsibleInfo = [
        { 'address': `${brewery.street}, ${brewery.city}, ${brewery.state}` },
        { 'phone': brewery.phone },
        { 'url': brewery.website_url }
    ]

    let li = document.createElement('li')
    li.innerText = brewery.name
    let collapseDiv = document.createElement('ul')
    collapseDiv.classList.add('hidden')

    collapsibleInfo.map((item) => {
        let key = Object.keys(item)
        let infoLi = document.createElement('li')
        infoLi.textContent = `${key} : ${item[key]}`
        collapseDiv.appendChild(infoLi)
    })

    li.addEventListener('click',()=>{
        collapseDiv.classList.toggle('hidden')
    })

    li.appendChild(collapseDiv)
    breweryList.appendChild(li)
    li.addEventListener('click', () => { })
}

zipCodeForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    breweryList.innerHTML=''
    zip = zipCodeForm['zipcode-input'].value //put this in do/while so it doesn't continue if you enter letters or number too long to be a zip code
    let latLong = await getLatLong(zip)
    let breweries = await getBreweries(latLong)
    breweries.map((brewery) => makeBrewLi(brewery))
})


document.addEventListener('load',async ()=>{
    faves = await fetch('http://localhost:3000')
    

})