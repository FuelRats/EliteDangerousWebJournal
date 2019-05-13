/* global module */
'use strict'

class CompanionApiClient {
  constructor (accessToken) {
    this.AccessToken = accessToken
    this.JournalTries = 0
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
    if(this.JournalTries > 10) {
      return null
    }
    
    const journal = await this.fetchDataAsText('journal')
    if (!journal.completeResult) {
      const antiHammerInterval = 5000
      await new Promise((resolve) => setTimeout(resolve, antiHammerInterval))
      this.JournalTries = this.JournalTries + 1
      return this.fetchTodaysJournal()
    }

    return journal
  }

  async fetchDataAsText (endpoint) {
    const httpOkStatus = 200
    let completeResult = false
    const result = await fetch(`https://companion.orerve.net/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.AccessToken}`,
        'User-agent': 'Fuel Rats Journal Reader https://journal.fuelrats.com. Contact author at: techrats@fuelrats.com'
      },
    })
      .then((resp) => {
        if (resp.status === httpOkStatus) {
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
        'User-agent': 'Fuel Rats Journal Reader https://journal.fuelrats.com. Contact author at: techrats@fuelrats.com'
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
