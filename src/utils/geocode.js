"use strict";

const request = require('postman-request')

const geocode = (address, callback) => {
    const mapboxURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?access_token=pk.eyJ1IjoicGlwb2J0eiIsImEiOiJja2llb2s3ZDAxMGhlMnRyczdvem1lYzVyIn0.smFEXWcRqeAXeCbB62LSaA&limit=1'

    request({url: mapboxURL, json: true}, (error, {body}) => {
        if (error) {
            callback('ERROR: Unable to connect to location services.', undefined)
        } else if (!body.features || body.features.length === 0) {
            callback(`ERROR: Unable to find location "${address}". Try another search.`, undefined)
        } else {
            const location = {
                name: body.features[0].place_name,
                longitude: body.features[0].center[0],
                latitude: body.features[0].center[1]
            }
            callback(undefined, location)
        }
    })
}

module.exports = geocode