"use strict";

const request = require('postman-request')

const weatherstack = (latitude, longitude, callback) => {
    const weatherstackURL = 'http://api.weatherstack.com/current?access_key=be4c4ab774c40196f8ede4bcbb73335e&query=' + encodeURIComponent(latitude) + ',' + encodeURIComponent(longitude)

    request({url: weatherstackURL, json: true}, (error, {body} = {}) => {
        if (error) {
            callback('ERROR: Unable to connect to weather services.', undefined)
        } else if (body.success === false) {
            callback('ERROR: Unable to fetch weather for the provided location.', undefined)
        } else {
            const weather = {
                time: body.current.observation_time,
                temperature: body.current.temperature,
                temperatureFeelsLike: body.current.feelslike,
                location: body.location.name,
                country: body.location.country,
                description: body.current.weather_descriptions.join(' and ')
            }
            callback(undefined, weather)
        }
    })
}

module.exports = weatherstack