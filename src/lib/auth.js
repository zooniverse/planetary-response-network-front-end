import xhr from 'xhr';
import url from 'url';
import config from '../config.json'

const ROOT = url.format(config)

class Auth {
	login() {
		window.location = config.apiRoot+'/auth/login?redirect='+ROOT+'/jobs';
	}

	logout() {
		window.location = config.apiRoot+'/auth/logout?redirect='+ROOT;
	}

	getUser(done) {
		return new Promise((resolve, reject) => {
			xhr({
				url: config.apiRoot+'/auth/me',
				withCredentials: true
			}, (err, resp, profile) => {
				if (err) {
					reject(err);
				} else {
					resolve(JSON.parse(profile));
				}
			});
		});
	}
}

export default new Auth();
