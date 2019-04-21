/* global require */
'use strict'

require('dotenv').config()
const {
  URLSearchParams,
} = require('url')
require('es6-promise').polyfill()
/* eslint-disable import/no-unassigned-import */
require('isomorphic-fetch')
/* eslint-enable */

const express = require('express')
const serveStatic = require('serve-static')
const session = require('express-session')
const MemoryStore = require('memorystore')(session)

const revision = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString()
  .trim()

const {
  version,
} = require('./package.json')

const app = express()

const {
  CompanionApiClient,
} = require('./companion-api-client')

app.set('etag', false)
app.set('trust proxy', 1)
app.set('view engine', 'ejs')
app.use(
  session({
    store: new MemoryStore({
      secret: process.env.SESSION_SECRET,
    }),
    secret: process.env.COOKIE_SIGN_KEY,
    cookie: {
      secure: undefined,
    },
    resave: false,
    saveUninitialized: true,
  })
)

const randomCharacters = 20
const httpStatusSuccess = 200
const port = 8700

app.use(serveStatic('public'))

app.get('/', (req, res) => {
  res.render('index', {
    version: `${version}-${revision}`,
  })
})

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
  next()
})

const rand = function rand (length, current) {
  const _current = current || ''
  if (length) {
    const newLength = length - 1
    return rand(newLength, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.charAt(Math.floor(Math.random() * 60)) + _current)
  }
  return current
}

const randomState = function randomState () {
  return rand(randomCharacters, '-journalreader')
}

app.get('/frontierAuth', (req, res) => {
  const _randomState = randomState()
  const redirectUrl = `${req.protocol}://${req.get('host')}/callback`

  res.redirect(
    `https://auth.frontierstore.net/auth?state=${_randomState}&response_type=code&approval_prompt=auto&redirect_uri=${redirectUrl}&client_id=${
      process.env.FRONTIER_CLIENT_ID
    }`
  )
})

app.get('/callback', async (req, res) => {
  const {
    code,
  } = req.query
  const {
    state,
  } = req.query

  const dataParams = new URLSearchParams()

  dataParams.append('grant_type', 'authorization_code')
  dataParams.append('code', code)
  dataParams.append('client_id', process.env.FRONTIER_CLIENT_ID)
  dataParams.append('client_secret', process.env.FRONTIER_CLIENT_SECRET)
  dataParams.append('state', state)
  dataParams.append(
    'redirect_uri',
    `${req.protocol}://${req.get('host')}/callback`
  )

  const result = await fetch('https://auth.frontierstore.net/token', {
    method: 'POST',
    body: dataParams,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then((response) => {
      if (response.status === httpStatusSuccess) {
        return response.json()
      }
      return res.json(response)
    })
    .then((blob) => blob)

  if (result.message) {
    res.json(result)
    return
  }

  req.session.frontierToken = result

  const userProfile = await fetch('https://auth.frontierstore.net/me', {
    headers: {
      Authorization: `Bearer ${result.access_token}`,
    },
  })
    .then((resp) => resp.json())
    .catch((err) => console.error(err))
  req.session.userProfile = userProfile

  req.session.save((err) => {
    console.log(err)
  })

  res.redirect('/')
})

app.get('/getPlatform', (req, res) => {
  if (req.session.userProfile) {
    let platform = 'unknown'

    const profile = req.session.userProfile

    if (profile.allowedDownloads.length === 0) {
      res.json('none')
      return
    }

    if (!profile.platform) {
      if (Boolean(profile.firstname) && profile.firstname === 'Playstation 4') {
        platform = 'PS4'
      }
      res.json(platform)
      return
    }

    switch (profile.platform) {
      case 'xbox':
        platform = 'XB'
        break
      case 'steam':
      case 'frontier':
        platform = 'PC'
        break
      case 'psn':
        platform = 'PS4'
        break
      default:
        platform = 'unknown'
        break
    }

    res.json(platform)
    return
  }

  res.json({
    message: 'Not logged in',
    error: true,
  })
})

app.get('/fetchPosition', async (req, res) => {
  if (req.session.frontierToken) {
    const companionClient = new CompanionApiClient(
      req.session.frontierToken.access_token
    )
    const resp = await companionClient.fetchProfile()
    res.json(resp)
    return
  }
  res.json({
    message: 'Not logged in',
    error: true,
  })
})

app.get('/fetchJournal', async (req, res) => {
  if (req.session.userProfile) {
    const companionClient = new CompanionApiClient(
      req.session.frontierToken.access_token
    )
    const resp = await companionClient.fetchTodaysJournal()
    res.json({
      journal: resp,
    })
    return
  }
  res.json({
    message: 'Not logged in',
    error: true,
  })
})

app.listen(port)
