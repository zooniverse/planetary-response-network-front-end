import xhr from 'xhr';
import {host, client} from '../config.js' // get PRN host

class Auth {
	login() {

		window.location = host+'/auth/login?redirect='+client+'/jobs';
	}

	logout() {
		window.location = host+'/auth/logout?redirect='+client+'/jobs';
	}

	getUser(done) {
		return new Promise((resolve, reject) => {
			xhr({
				url: host+'/auth/me',
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
