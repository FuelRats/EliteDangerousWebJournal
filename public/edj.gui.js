/* globals document, edjdata */
const edjGui = {
	updateGui() {
		edjGui.write_cmdr_position();
		edjGui.can_synthesize_lifesupport();
		edjGui.update_fuel_level();
		edjGui.irc_friendly_text();
	},
	write_cmdr_position() {
		if (edjdata.player.cmdr != null) {
			document.getElementById("cmdrname").innerText = `CMDR ${
				edjdata.player.cmdr.Commander
			}`;
		}
		const playerPos = edjGui.get_cmdr_position();
		if (playerPos.length > 0) {
			document.getElementById(
				"location"
			).innerText = `in ${playerPos.join(", ")}`;
		} else {
			document.getElementById("location").innerText =
				"at an unknown position";
		}
	},
	can_synthesize_lifesupport() {
		if (edjdata.cansynthesizelifesupport != null) {
			document.getElementById(
					"canSynthOxygen"
				).innerHTML = edjdata.cansynthesizelifesupport ?
				"You can synthesize at least one full life-support refill" :
				"You do not have enough iron or nickel to manufacture a full life-support refill";
		} else if (edjdata.canopyBreached != null) {
			let strings = [];
			if (edjdata.canopyBreached) strings.push("Canopy is breached!");
			else strings.push("Canopy is not breached!");
			if (edjdata.oxygenRemaining != null) {
				strings.push(
					"Oxygen remaining: " +
					edjdata.oxygenRemaining / 1000 +
					" seconds"
				);
			}
			document.getElementById("canSynthOxygen").innerHTML = strings.join(
				"<br />"
			);
		}
	},
	update_fuel_level() {
		let fuelWidth =
			(edjdata.player.fuel.current / edjdata.player.fuel.max) * 100;
		if (fuelWidth > 100) {
			fuelWidth = 100;
		}

		document.getElementById("fuelBar").style.width = `${fuelWidth}%`;
	},
	get_cmdr_position() {
		const items = [];
		if (
			edjdata.player.pos.StarSystem !== null &&
			edjdata.player.pos.StarSystem !== ""
		) {
			items.push(edjdata.player.pos.StarSystem);
		}

		if (
			edjdata.player.pos.Body !== null &&
			edjdata.player.pos.Body !== ""
		) {
			items.push(edjdata.player.pos.Body);
		}

		return items;
	},
	irc_friendly_text() {
		document.querySelector('.irc-friendly').innerText = `CMDR ${edjdata.player.cmdr.Commander} [${edjdata.player.platform}] in ${this.get_cmdr_position().join(", ")}`;
	}
};