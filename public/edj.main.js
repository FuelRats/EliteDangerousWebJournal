/* global edjGui */
"use strict"; // eslint-disable-next-line no-var

function _objectSpread(target) {
	for (let i = 1; i < arguments.length; i++) {
		var source = arguments[i] != null ? arguments[i] : {};
		let ownKeys = Object.keys(source);
		if (typeof Object.getOwnPropertySymbols === "function") {
			ownKeys = ownKeys.concat(
				Object.getOwnPropertySymbols(source).filter(function(sym) {
					return Object.getOwnPropertyDescriptor(
						source,
						sym
					).enumerable;
				})
			);
		}
		ownKeys.forEach(function(key) {
			_defineProperty(target, key, source[key]);
		});
	}
	return target;
}

function _defineProperty(obj, key, value) {
	if (key in obj) {
		Object.defineProperty(obj, key, {
			value,
			enumerable: true,
			configurable: true,
			writable: true
		});
	} else {
		obj[key] = value;
	}
	return obj;
}

let windowIsActive = true;
window.addEventListener("blur", function() {
	windowIsActive = false;
});
window.addEventListener("focus", function() {
	windowIsActive = true;
});

function isWindowActive() {
	const isHidden = document.visibilityState === "hidden";
	return isHidden || windowIsActive;
}

const edjdata = {
	player: {
		cmdr: null,
		rank: {
			cqc: {
				rank: 0,
				progress: 0
			},
			combat: {
				rank: 0,
				progress: 0
			},
			empire: {
				rank: 0,
				progress: 0
			},
			explore: {
				rank: 0,
				progress: 0
			},
			federation: {
				rank: 0,
				progress: 0
			},
			trade: {
				rank: 0,
				progress: 0
			}
		},
		pos: {
			StarSystem: null,
			Docked: true,
			Body: null,
			BodyType: null,
			StarPos: null,
			Scoopable: null,
			Supercruise: null
		},
		fuel: {
			current: null,
			max: null
		},
		materials: {
			Raw: [],
			Manufactured: []
		}
	},
	gamemode: null,
	cansynthesizelifesupport: false,
	canopyBreached: null,
	oxygenRemaining: null,
	hasJournalEntries: false
};
let positionInterval = null;
document.querySelector(".winpathButton").addEventListener("click", () => {
	edj.copyFilePath("#winpath");
});

const getPlatform = async function getPlatform() {
	const result = await fetch(`/getPlatform?_=${new Date().getTime()}`).then(
		resp => resp.json()
	);
	return result;
};

const _CAPIUpdateData = function _CAPIUpdateData(result) {
	if (edjdata.player.cmdr === null) {
		edjdata.player.cmdr = _objectSpread(
			{
				Commander: result.commander.name
			},
			result.commander
		);
	} // We don't see cargo, so we can't make that prediction.
	// edjdata.cansynthesizelifesupport = null

	edjdata.player.pos.StarSystem = result.lastSystem.name; // Ignoring this for now, since it gives false positives if you travel in the same system after undocking
	// edjdata.player.pos.Body = result.lastStarport.name

	edjdata.canopyBreached = result.ship.cockpitBreached;
	edjdata.oxygenRemaining = result.ship.oxygenRemaining;
	edjGui.updateGui();
};

const getPlayerJournal = async function getPlayerJournal() {
	if (isWindowActive()) {
		const result = await fetch(
			`/fetchJournal?_=${new Date().getTime()}`
		).then(resp => resp.json());

		if (Boolean(result.error) && result.error) {
			return;
		}

		if (!result.journal.result) {
			return;
		}

		edjdata.hasJournalEntries = true;

		edj.fileOnLoad(result.journal.result);
	}
};

const getUpdatedPosition = async function getUpdatedPosition() {
	if (isWindowActive()) {
		const result = await fetch(
			`/fetchPosition?_=${new Date().getTime()}`
		).then(resp => resp.json());

		if (Boolean(result.error) && result.error) {
			clearInterval(positionInterval);
			return;
		}

		_CAPIUpdateData(result);

		await getPlayerJournal();
	}
};

const positionUpdateInterval = 30000;

const checkIsLoggedIn = async function checkIsLoggedIn() {
	if (isWindowActive()) {
		const result = await fetch(
			`/fetchPosition?_=${new Date().getTime()}`
		).then(resp => resp.json());

		if (Boolean(result.error) && result.error) {
			return;
		}

		edjdata.player.platform = await getPlatform();

		_CAPIUpdateData(result);

		await getPlayerJournal();
		positionInterval = setInterval(() => {
			getUpdatedPosition();
		}, positionUpdateInterval);
	}
};

checkIsLoggedIn();
