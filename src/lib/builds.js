import xhr from 'xhr'
import config from '../config.json'

/**
* Rudimentary store for fetching/caching user builds
* TODO replace with something prebuilt
*/
class Builds {
	constructor() {
	}

	findAll(callback) {
		xhr(config.server+'/builds', (err, resp, builds) => {
			if (err) callback(err)
			try {
				builds = JSON.parse(builds)
			} catch(e) {
				return callback(e)
			}
			this._records = builds
			callback(null, builds)
		})
	}

	findById(id, callback) {
		this.findAll((err, builds) => {
			let build = builds.filter(build => {
				return build.id === id
			})
			if (build.length) {
				callback(null, build[0])
			} else {
				callback(new Error('No build with id ' + id + ' found'))
			}
		})
	}
}

export default new Builds()
