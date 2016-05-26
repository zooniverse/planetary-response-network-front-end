import xhr from 'xhr';
import {server} from '../config.json'


class Auth {
	login() {
		window.location = server+'/auth/login?redirect=https://localhost:3443/jobs';
	}

	logout() {
		window.location = server+'/auth/logout?redirect=https://localhost:3443';
	}

	getUser(done) {
		return new Promise((resolve, reject) => {
			xhr({
				url: server+'/auth/me',
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
