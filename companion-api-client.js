"use strict";

class CompanionApiClient {
	constructor(access_token) {
		this.AccessToken = access_token;
	}

	async FetchProfile() {
		return await this.fetchData("profile");
	}

	async FetchMarket() {
		return await this.fetchData("market");
	}

	async FetchShipyard() {
		return await this.fetchData("shipyard");
	}

	async fetchData(endpoint) {
		let result = await fetch(`https://companion.orerve.net/${endpoint}`, {
			headers: {
				Authorization: `Bearer ${this.AccessToken}`
			}
		}).then(resp => resp.json());

		return result;
	}
}

module.exports = { CompanionApiClient };
