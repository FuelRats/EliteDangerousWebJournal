/* global module */
'use strict'

class CompanionApiClient {
  constructor(accessToken) {
    this.AccessToken = accessToken
  }

  async fetchProfile() {
    const profile = await this.fetchData('profile')
    return profile
  }

  async fetchMarket() {
    const market = await this.fetchData('market')
    return market
  }

  async fetchShipyard() {
    const shipyard = await this.fetchData('shipyard')
    return shipyard
  }

  async fetchTodaysJournal() {
    const journal = await this.fetchData('journal');
    return journal;
  }

  async fetchData(endpoint) {
    const result = await fetch(`https://companion.orerve.net/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${this.AccessToken}`,
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