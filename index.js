const zipCodeForm = document.getElementById('zipcode-form')
const breweryList = document.getElementById('brewery-list')


let lat
let long
let zip





const getData = async (url)=>{
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

zipCodeForm.addEventListener('submit', async (e)=>{
    e.preventDefault()
    zip = zipCodeForm['zipcode-input'].value //put this in do/while so it doesn't continue if you enter letters or number too long to be a zip code
    let latLong = await getLatLong(zip)
    let breweries = await getBreweries(latLong)
    console.log(breweries)
})