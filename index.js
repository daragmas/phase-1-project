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

const makeBrewLi = (brewery) =>{
    let li = document.createElement('li')
    li.innerText = brewery.name
    let collapseDiv = document.createElement('div')
    collapseDiv.classList.add('hidden')

    let BrewInfoUl = document.createElement('ul')
    let BrewInfo



    li.addEventListener('click',()=>{})
}

/*address_2: null
address_3: null
brewery_type: "contract"
city: "New York"
country: "United States"
county_province: null
created_at: "2021-10-23T02:24:55.243Z"
id: "harlem-brewing-co-new-york"
latitude: "40.8058068"
longitude: "-73.94532799"
name: "Harlem Brewing Co"
phone: "8885596735"
postal_code: "10027-5623"
state: "New York"
street: "2 W 123rd St"
updated_at: "2021-10-23T02:24:55.243Z"
website_url: "http://www.harlembrewingcompany.com"*/

zipCodeForm.addEventListener('submit', async (e)=>{
    e.preventDefault()
    zip = zipCodeForm['zipcode-input'].value //put this in do/while so it doesn't continue if you enter letters or number too long to be a zip code
    let latLong = await getLatLong(zip)
    let breweries = await getBreweries(latLong)
    console.log(breweries)
    breweries.map((brewery)=>makeBrewLi(brewery))
})


/* 
{
    name : brewery.name
    collapsible-content:[
        {address: brewery.address}
    ]
}

brewery[collapsible-conent].map((key,value) => { 
    make line item
    li
}
*/