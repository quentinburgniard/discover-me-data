const express = require('express')
const app = express()

const cors = require('cors');

const request = require('request')

require('dotenv').config()

const apiCache = require('apicache')

app.use(cors({ origin: 'https://quentinburgniard.com' }))

let cache = apiCache.middleware
app.use(cache('1 day'))

app.set('STRAVA_REFRESH_TOKEN', process.env.STRAVA_REFRESH_TOKEN)

app.get('/deezer', function (req, res) {
    //https://api.deezer.com/playlist/4465758108
    res.json({ message: 'hooray! welcome to our api!' })
})

app.get('/github', function (req, res) {
    const opts = {
        url: 'https://api.github.com/users/quentinburgniard',
        headers: {
            'User-Agent': 'discover-me'
        },
        json: true
    }
    request(opts, function (error, response, body) {
        var github = {
            repos: body.public_repos
        }
        res.json(github)
    })
})

app.get('/strava', function (req, res) {
    request.post('https://www.strava.com/oauth/token', {
        form: {
            grant_type: 'refresh_token',
            client_id: process.env.STRAVA_CLIENT_ID,
            client_secret: process.env.STRAVA_CLIENT_SECRET,
            refresh_token: app.get('STRAVA_REFRESH_TOKEN')
        },
        json: true
    }, function (error, response, body) {
        var accessToken = body.access_token

        app.set('STRAVA_REFRESH_TOKEN', body.refresh_token)

        const opts = {
            url: 'https://www.strava.com/api/v3/athletes/' + process.env.STRAVA_ATHLETE_ID + '/stats',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            json: true
        }
        request(opts, function (error, response, body) {
            var strava = {
                distance: (body.recent_run_totals.distance/1000).toFixed(1),
                count: body.recent_run_totals.count
            }
            console.log(body)
            res.json(strava)
        })
    })
})

app.listen(80, () => console.log('Server is up'))