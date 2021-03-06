/**
 * Created by sridharrajs.
 */

'use strict';

let cheerio = require('cheerio');
let fs = require('fs');
let _ = require('lodash');

class Importer {

	static parse(userId) {
		let filename = __dirname + `/${userId}.html`;
		let data = fs.readFileSync(filename, 'utf8');
		let articles = [];
		let $ = cheerio.load(data);
		let rawLinks = $('a[href]');
		_.each(rawLinks, (article)=> {
			let attribute = article.attribs;
			articles.push({
				url: attribute.href,
				time_added: attribute.time_added
			});
		});
		return articles;
	}

}

module.exports = Importer;