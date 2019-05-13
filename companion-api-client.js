/* global module */
'use strict'

const antiHammerInterval = 5000
const httpOkStatus = 200
const httpNoContent = 204
const maxJournalRetries = 10
const userAgent = 'Fuel Rats Journal Reader https://journal.fuelrats.com. Contact author at: techrats@fuelrats.com'

let numberOfRetries = 0

class CompanionApiClient {
  constructor (accessToken) {
    this.AccessToken = accessToken
  }

  async fetchProfile () {
    const profile = await this.fetchData('profile')
    return profile
  }

  async fetchMarket () {
    const market = await this.fetchData('market')
    return market
  }

  async fetchShipyard () {
    const shipyard = await this.fetchData('shipyard')
    return shipyard
  }

  async fetchTodaysJournal () {
    if (numberOfRetries > maxJournalRetries) {
      return null
    }

    const journal = await this.fetchDataAsText('journal')
    if (!journal.completeResult) {
      await new Promise((resolve) => setTimeout(resolve, antiHammerInterval))
      numberOfRetries += 1
      return this.fetchTodaysJournal()
    }

    return journal
  }

  async fetchDataAsText (endpoint) {
    let completeResult = false
    const result = await fetch(`https://companion.orerve.net/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.AccessToken}`,
        'X-User-Agent': userAgent,
      },
    })
      .then((resp) => {
        if (resp.status === httpOkStatus || resp.status === httpNoContent) {
          completeResult = true
        }

        return resp.text()
      })
      .catch((err) => {
        console.error(err)
        return {
          error: true,
          message: err,
        }
      })

    return {
      completeResult,
      result,
    }
  }

  async fetchData (endpoint) {
    const result = await fetch(`https://companion.orerve.net/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.AccessToken}`,
        'X-User-Agent': userAgent,
      },
    })
      .then((resp) => resp.json())
      .catch((err) => {
        console.error(err)
        return {
          error: true,
          message: err,
        }
      })

    return result
  }
}

module.exports = {
  CompanionApiClient,
}
