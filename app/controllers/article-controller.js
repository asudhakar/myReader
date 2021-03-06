/**
 * Created by sridharrajs on 1/11/16.
 */

'use strict';
let async = require('async');
let mongoose = require('mongoose');
let wrapper = require('mongoose-callback-wrapper');

let articleModelSchema = require('../models/article');
let articleModel = mongoose.model('article');

const SCROLL_LIMIT = 10;

function computeSkipCount(pageNo) {
	if (pageNo === 0) {
		return pageNo;
	} else {
		return pageNo * SCROLL_LIMIT;
	}
}

let add = function (article, cb) {
	let item = new articleModel({
		url: article.url,
		userId: article.userId,
		title: article.title,
		tags: article.tag
	});
	item.save((err, newDoc) => {
		if (err) {
			cb(err);
		} else {
			cb(null, newDoc._doc);
		}
	});
};

let addArticles = function (articles, cb) {
	async.forEach(
		articles,
		function (article, callback) {
			let newArticle = new articleModel({
				url: article.url,
				userId: article.userId,
				title: article.title,
				tags: article.tag
			});
			newArticle.save((err) => {
				if (err) {
					return callback(err);
				}
				callback(null, 'success');
			});
		},
		function (err) {
			if (err) {
				return cb(err);
			}
			return cb(null, '+1');
		}
	);
};

let getArticles = function (item, cb) {
	let wrappedCallback = wrapper.wrap(cb, articleModelSchema.getAttributes());
	let query = articleModel
		.find({
			userId: item.userId,
			active: true
		})
		.limit(SCROLL_LIMIT)
		.sort({
			time_added: -1
		})
		.skip(computeSkipCount(item.pageNo));
	query.exec(wrappedCallback);
};

let getArticleCount = (item, cb)=> {
	let wrappedCallback = wrapper.wrap(cb);
	articleModel
		.count({
			userId: item.userId,
			active: true
		}, wrappedCallback);
};

function deleteArticle(articleId, cb) {
	let wrappedCallback = wrapper.wrap(cb);
	let query = {
		_id: articleId
	};
	let change = {
		active: false
	};
	let upsert = {
		upsert: false
	};
	articleModel.findOneAndUpdate(query, change, upsert, wrappedCallback);
}

module.exports = {
	add,
	addArticles,
	getArticles,
	deleteArticle,
	getArticleCount
};