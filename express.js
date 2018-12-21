require("dotenv").config();
var URLSearchParams = require("url").URLSearchParams;
require("es6-promise").polyfill();
require("isomorphic-fetch");

const express = require("express");
const serveStatic = require("serve-static");
const session = require("express-session");
var FileStore = require("session-file-store")(session);

const { version } = require("./package.json");
const revision = require("child_process")
	.execSync("git rev-parse --short HEAD")
	.toString()
	.trim();

const app = express();

const CompanionApiClient = require("./companion-api-client").CompanionApiClient;

app.set("etag", false);
app.set("trust proxy", 1);
app.set("view engine", "ejs");
app.use(
	session({
		store: new FileStore({
			secret: process.env.SESSION_SECRET
		}),
		secret: process.env.COOKIE_SIGN_KEY,
		cookie: { secure: undefined },
		resave: false,
		saveUninitialized: true
	})
);

const port = 8700;

app.use(serveStatic("public"));

app.get("/", (req, res) => {
	res.render("index", {
		version: `${version}-${revision}`
	});
});

app.use((req, res, next) => {
	res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
	next();
});

function RandomState() {
	return rand(20, "-journalreader");
}

function rand(length, current) {
	current = current ? current : "";
	return length
		? rand(
				--length,
				"0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".charAt(
					Math.floor(Math.random() * 60)
				) + current
		  )
		: current;
}

app.get("/frontierAuth", (req, res) => {
	const randomState = RandomState();
	const redirectUrl = `${req.protocol}://${req.get("host")}/callback`;

	res.redirect(
		`https://auth.frontierstore.net/auth?state=${randomState}&response_type=code&approval_prompt=auto&redirect_uri=${redirectUrl}&client_id=${
			process.env.FRONTIER_CLIENT_ID
		}`
	);
});

app.get("/callback", async (req, res, next) => {
	var code = req.query.code;
	var state = req.query.state;

	var dataParams = new URLSearchParams();

	dataParams.append("grant_type", "authorization_code");
	dataParams.append("code", code);
	dataParams.append("client_id", process.env.FRONTIER_CLIENT_ID);
	dataParams.append("client_secret", process.env.FRONTIER_CLIENT_SECRET);
	dataParams.append("state", state);
	dataParams.append(
		"redirect_uri",
		`${req.protocol}://${req.get("host")}/callback`
	);

	let result = await fetch("https://auth.frontierstore.net/token", {
		method: "POST",
		body: dataParams,
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		}
	})
		.then(function(response) {
			if (response.status == 200) return response.json();
			res.json(res.json());
			return;
		})
		.then(function(blob) {
			return blob;
		});

	if (!!result.message) {
		res.json(result);
		return;
	}

	req.session.frontierToken = result;
	req.session.save(err => {
		console.log(err);
	});

	res.redirect("/");
});

app.get("/fetchPosition", async (req, res) => {
	if (!!req.session.frontierToken) {
		let companionClient = new CompanionApiClient(
			req.session.frontierToken.access_token
		);
		let resp = await companionClient.FetchProfile();
		res.json(resp);
		return;
	}
	res.json({ message: "Not logged in", error: true });
});

app.listen(port);
