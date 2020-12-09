const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')
const weatherImage = document.querySelector('#weather-icon')

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()
    
    messageOne.textContent = 'Loading...'
    messageTwo.textContent = ''
    weatherImage.setAttribute('src', '')
    weatherImage.style.display = 'none'

    const address = search.value

    fetch('/weather?address=' + encodeURIComponent(address)).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                messageOne.textContent = data.error
                return 
            }
            weatherImage.setAttribute('src', data.weather.icon)
            weatherImage.style.display = 'inline'
            messageOne.textContent = `${data.weather.location} (${data.weather.country})`
            messageTwo.textContent = `${data.weather.description}. In ${data.location.name} it is currently (${data.weather.time}) ${data.weather.temperature}° out which feels like ${data.weather.temperatureFeelsLike}° out.`
            return
        })
    })
})