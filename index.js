const zipCodeForm = document.getElementById('zipcode-form')
const breweryList = document.getElementById('brewery-list')
const favSelector = document.getElementById('fav-selector')
const mainTitle = document.getElementById('main-title')
const favSection = document.getElementById('fav-section')
const favesUrl = 'http://localhost:3000/favorites'

let lat
let long
let zip
let faves
let currentID

const getData = async (url) => {
    req = await fetch(url)
    return res = await req.json()
}

const getLatLong = async (zip) => {
    const zipCodeApiUrl = `https://api.zippopotam.us/us/${zip}`
    const latAndLong = await getData(zipCodeApiUrl)
    latLong = [latAndLong.places[0].latitude, latAndLong.places[0].longitude]
    return latLong
}

const getBreweries = async (latLong) => {
    const breweryApiUrl = `https://api.openbrewerydb.org/breweries?by_dist=${latLong[0]},${latLong[1]}&per_page=3`
    return breweriesData = await getData(breweryApiUrl)
}

const makeBrewLi = (brewery) => {
    let faveDbInfo = {
        'name': brewery.name,
        'address': `${brewery.street}, ${brewery.city}, ${brewery.state}`,
        'phone': brewery.phone,
        'url': brewery.website_url
    }

    let collapsibleInfo = [
        { 'address': `${brewery.street}, ${brewery.city}, ${brewery.state}` },
        { 'phone': brewery.phone },
        { 'url': brewery.website_url }
    ]
    
    let li = document.createElement('li')
    li.innerText = brewery.name
    let collapseDiv = document.createElement('ul')
    collapseDiv.classList.add('hidden')

    const collapseBtn = document.createElement('span')
    collapseBtn.innerText = ' + '
    collapseBtn .classList.toggle('active')
    li.append(collapseBtn)
    
    collapsibleInfo.map((item) => {
        let key = Object.keys(item)
        let infoLi = document.createElement('li')
        infoLi.textContent = `${key} : ${item[key]}`
        collapseDiv.appendChild(infoLi)
    })
    
    collapseBtn.addEventListener('click', () => {
        collapseDiv.classList.toggle('hidden')
    })
    
    let faveBtn = document.createElement('ion-icon')
    faveBtn.name = "heart"
    
    faveBtn.addEventListener('click', async () => {
        if (!(faveBtn.classList.contains('liked'))) {
            faveBtn.classList.toggle('liked')
            fetch(favesUrl, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(faveDbInfo)
            })
        }
        else{
            let deleteThisFave = await getData(`http://localhost:3000/favorites?name=${faveDbInfo.name}`)
            let deleteID = deleteThisFave[0].id
            faveBtn.classList.toggle('liked')
            fetch(`http://localhost:3000/favorites/${deleteID}`, {
                method: 'DELETE'
            })
        }
        setTimeout(() => { popFavesList() }, 500)
    })
    
    li.append(faveBtn, collapseDiv)
    breweryList.appendChild(li)
    li.addEventListener('click', () => { })
}

zipCodeForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    mainTitle.classList.remove('hidden')
    breweryList.classList.remove('hidden')
    breweryList.innerHTML = ''
    zip = zipCodeForm['zipcode-input'].value //put this in do/while so it doesn't continue if you enter letters or number too long to be a zip code
    try{
        let latLong = await getLatLong(zip)
        let breweries = await getBreweries(latLong)
    breweries.map((brewery) => makeBrewLi(brewery))}
    catch{
        alert('Invalid Zip Code. US Zip codes only (for now)')
    }
})

const popFavesList = async () => {
    favSelector.innerHTML = ''
    faves = await getData('http://localhost:3000/favorites')
    faves.map((fave) => {
        let faveOption = document.createElement('option')
        faveOption.innerText = fave.name
        favSelector.appendChild(faveOption)
    })
}

const popFaveSection = (faveBrewObj) => {
    const favDiv = document.createElement('div')
    favDiv.setAttribute('id', 'fav-container')
    const favBrewTitle = document.createElement('h1')
    const favBrewPhone = document.createElement('p')
    const favBrewAddress = document.createElement('p')
    const favBrewWeb = document.createElement('a')
    favBrewAddress.innerText = faveBrewObj[0].address
    favBrewPhone.innerText = faveBrewObj[0].phone
    favBrewWeb.href = faveBrewObj[0].url
    favBrewWeb.textContent = 'Visit Website'
    favBrewTitle.innerText = faveBrewObj[0].name
    favDiv.append(favBrewTitle, favBrewAddress, favBrewPhone, favBrewWeb)
    favSection.append(favDiv)
}


favSelector.addEventListener('change',async(e)=>{
    let selectedFav = e.target.value
    let val = await getData(`http://localhost:3000/favorites?name=${selectedFav}`)
    popFaveSection(val)
})

popFavesList()
