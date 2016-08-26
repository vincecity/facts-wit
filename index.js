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

const actions = {
  send(request, response) {
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;
    return new Promise(function(resolve, reject) {
      console.log('sending...', JSON.stringify(response));
      return resolve();
    });
  },
  getNewsResults({context, entities}) {
	  
    return new Promise(function(resolve, reject) {
      
		var intent = firstEntityValue(entities, 'intent');
		var tags  = firstEntityValue(entities, 'news_type');
		var query  = firstEntityValue(entities, 'query');
		var location = firstEntityValue(entities, 'location');
		var datetime  = firstEntityValue(entities, 'datetime');
        var guardianKey = "api-key=fd0993a0-9bde-4750-b8bd-4ce40e9e6a73";
		"q=1%20years%20a%20slave&page-size=1&format=json&tag=film/film,tone/reviews&from-date=2010-01-01&show-tags=contributor&show-fields=starRating,headline,thumbnail,short-url&order-by=relevance&show-blocks=all&api-key=test"
			
	  var url = ["http://content.guardianapis.com/search?"];
	  
	  if (intent) {
	  	context.intent = intent;
		delete context.intent;
	  }
	  
	  
	  //4 if query, add this to request
	  var urlQuery = null;
	  if (query) {
		  context.query = query;
		  urlQuery = "q="+encodeURI(query);
	  }
	  
	  //1 if location, add this to request
	  
	  if (location) {
		  context.location = location;
  			delete context.location;
		  
		  urlQuery += encodeURI(" "+location);
		 
	  }
	  if (urlQuery) { url.push(urlQuery); }
	  //2 if tags, add this to request
	  if (tags) {
		  var urlTags = "tags="+encodeURI(tags);
		  if (urlTags) { url.push(urlTags) }
	  }
	  
	  //3 if datetime, add this to request
	  
	  if (datetime) {
	  }
	  
	  
	  
	  //make full url
	  if (url.length > 1) {
		  url.push(guardianKey);
	  	  var urlStr = url.join("&");
	  	  console.log(urlStr);
		  var response = null
		  getContent(urlStr).then(data => {
		  		console.log(JSON.stringify(data))
			  	response = data
			  	context.news_title = response.results[0].webTitle
			    return resolve(context);
		  	}
		  )
		  
	  }
	  
	  //5 send request to guardian's API and look at the response
		//if no result, set noResults
		//if result, set newsTitle
      return resolve(context);
    });
  },
};

const client = new Wit({accessToken, actions});
interactive(client);



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


