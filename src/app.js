"use strict";

const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const weatherstack = require('./utils/weatherstack')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express.js config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Pipo'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Pipo'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Pipo',
        message: 'This is a helpful message... isn\'t it?'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    // Check if address are already coords
    const isCoordinates = req.query.address.match(/(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)/) !== null

    if (isCoordinates) {
        const latitude = parseFloat(req.query.address.split(',')[0])
        const longitude = parseFloat(req.query.address.split(',')[1])
        
        weatherstack(latitude, longitude, (error, weather) => {
            if (error) {
                return res.send({error})
            }
            
            return res.send({
                weather,
                location: {
                    name: req.query.address,
                    latitude,
                    longitude
                },
                address: req.query.address
            })
        })
    } else {
        geocode(req.query.address, (error, {latitude, longitude, name:locationName} = {}) => {
            if (error) {
                console.log(error)
                return res.send({error})
            }
    
            weatherstack(latitude, longitude, (error, weather) => {
                if (error) {
                    return res.send({error})
                }
                
                return res.send({
                    weather,
                    location: {
                        name: locationName,
                        latitude,
                        longitude
                    },
                    address: req.query.address
                })
            })
        })
    }

    
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('error', {
        title: '404 Error',
        name: 'Pipo',
        errorMessage: 'Help article not found.'
    })
})

app.get('*', (req, res) => {
    res.render('error', {
        title: '404 Error',
        name: 'Pipo',
        errorMessage: 'Page not found.'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})