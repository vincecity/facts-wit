{% raw %}


'use strict';

let Wit = null;
let interactive = null;
try {
	// if running from repo
	Wit = require('../').Wit;
	interactive = require('../').interactive;
} catch (e) {
	Wit = require('node-wit').Wit;
	interactive = require('node-wit').interactive;
}

const accessToken = (() => {
	if (process.argv.length !== 3) {
		console.log('usage: node examples/quickstart.js <wit-access-token>');
		process.exit(1);
	}
	return process.argv[2];
})();




// Quickstart example
// See https://wit.ai/ar7hur/quickstart

const firstEntityValue = (entities, entity) => {
	const val = entities && entities[entity] &&
	Array.isArray(entities[entity]) &&
	entities[entity].length > 0 &&
	entities[entity][0].value
	;
	if (!val) {
		return null;
	}
	return typeof val === 'object' ? val.value : val;
};



let send = function(request, response) {
	const {sessionId, context, entities} = request;
	const {text, quickreplies} = response;
	return new Promise(function(resolve, reject) {
		console.log('sending...', JSON.stringify(response));
		return resolve();
	});
}


var ctx = undefined;
let getNewsResults = function({context, entities}) {
	console.log("context...", JSON.stringify(context));
	ctx = context
	return new Promise(function(resolve, reject) {
		var intent = firstEntityValue(entities, 'intent');
		var tags  = firstEntityValue(entities, 'news_type');
		var query  = firstEntityValue(entities, 'query');
		var location = firstEntityValue(entities, 'location');
		var datetime  = firstEntityValue(entities, 'datetime');

		var guardianKey = "api-key=fd0993a0-9bde-4750-b8bd-4ce40e9e6a73";
		var urlChunks = ["http://content.guardianapis.com/search?page-size=1"];

		//1if intent, updates context
		if (intent) {context.intent = intent; }

		//2 if query, add this to request
		var urlQuery = "q=";
		if (query) {
			context.query = query;
			urlQuery += (encodeURI(query+" "));
		}
		//3 if location, add this to request
		if (location) {
			delete context.location;
			urlQuery += (encodeURI(location));
		}
		//if url integrity == , add this to request
		if (urlQuery) { urlChunks.push(urlQuery); }

		//4 if tags, add this to request
		if (tags) {
			var urlTags = "tags="+encodeURI(tags);
			if (urlTags) { urlChunks.push(urlTags) }
		}

		//3 if datetime, TBD
		if (datetime) { }

		//make full url String
		if (urlChunks.length > 1) {
			urlChunks.push(guardianKey);
			var urlStr = urlChunks.join("&");
			console.log(urlStr);


		}
		console.log("context...", JSON.stringify(context));
		resolve(urlStr)
		//5 send request to guardian's API and look at the response
		//if no result, set noResults
		//if result, set newsTitle

	}).then(getContent).then(sendBackCtx);
}
const actions = {send, getNewsResults};

const client = new Wit({accessToken, actions});
interactive(client);



const sendBackCtx = function(data) {
	return new Promise((resolve, reject) => {
		//console.log(" réponse : ",JSON.stringify(data));
		ctx.news_title = JSON.parse(data).response.results[0].webTitle;
		//console.log(" ctx : ",JSON.stringify(ctx));
		return resolve(ctx);
	})
}


const getContent = function(url) {
	// return new pending promise
	return new Promise((resolve, reject) => {
		// select http or https module, depending on reqested url
		const lib = url.startsWith('https') ? require('https') : require('http');
		const request = lib.get(url, (response) => {
			// handle http errors
			if (response.statusCode < 200 || response.statusCode > 299) {
				reject(new Error('Failed to load page, status code: ' + response.statusCode));
			}
			// temporary data holder
			const body = [];
			// on every content chunk, push it to the data array
			response.on('data', (chunk) => body.push(chunk));
			// we are done, resolve promise with those joined chunks
			response.on('end', () => resolve(body.join('')));
		});
		// handle connection errors of the request
		request.on('error', (err) => reject(err))
	})
};

{% endraw %}
