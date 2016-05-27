import xhr from 'xhr';
import querystring from 'querystring';
import {host} from '../config.js'

const SUPPORTED_TYPES = [
	'jobs',
	'projects',
	'subject-sets'
];

class PrnClient {

	get(type, query) {
		if (SUPPORTED_TYPES.indexOf(type) === -1) return Promise.reject('Unknown type');
		let qs = query ? '?'+querystring.stringify(query) : '';

		return new Promise((resolve, reject) => {
			xhr({
				url: host+'/'+type+qs,
				withCredentials: true
			}, (err, resp, items) => {
				if (err) reject(err)
				if (resp.statusCode < 200 || resp.statusCode >= 400) {
					return reject(resp.body)
				}
				try {
					items = JSON.parse(resp.body)
				} catch(e) {
					return reject(e)
				}
				resolve(items)
			});
		});
	}

	post(type, query) {
		console.log('QUERY = ', query);

		if (SUPPORTED_TYPES.indexOf(type) === -1) return Promise.reject('Unknown type');
		let qs = '/'+query;
		return new Promise((resolve, reject) => {
			xhr.post({
				url: host+'/'+type+qs,
				withCredentials: true
			}, (err, resp, items) => {
				if (err) reject(err)
				if (resp.statusCode < 200 || resp.statusCode >= 400) {
					return reject(resp.body)
				}
				try {
					items = JSON.parse(resp.body)
				} catch(e) {
					return reject(e)
				}
				resolve(items)
			});
		});

	}

	delete(type, query) {
		if (SUPPORTED_TYPES.indexOf(type) === -1) return Promise.reject('Unknown type');
		let qs = '/'+query;
		return new Promise((resolve, reject) => {
			xhr.del({
				url: host+'/'+type+qs,
				withCredentials: true
			}, (err, resp, items) => {
				if (err) reject(err)
				if (resp.statusCode < 200 || resp.statusCode >= 400) {
					return reject(resp.body)
				}
				resolve();
			});
		});
	}
}

export default new PrnClient();
