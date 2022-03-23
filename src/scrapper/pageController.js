const pageScraper = require('./pageScraper');
async function scrapeAll(browserInstance, params){
  
	let browser;
	try{
		browser = await browserInstance;
		await pageScraper.scraper(browser, params);	
		
	}
	catch(err){
		console.log("Could not resolve the browser instance => ", err);
	}
}

module.exports = (browserInstance, params) => scrapeAll(browserInstance, params);
