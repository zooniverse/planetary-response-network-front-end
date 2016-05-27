import xhr from 'xhr'
import config from '../config.json'

/**
* Rudimentary store for fetching/caching user jobs
* TODO replace with something prebuilt
*/
class Jobs {
	constructor() {
	}

	findAll(callback) {
		xhr({
			url: config.apiRoot+'/jobs',
			withCredentials: true
		}, (err, resp, jobs) => {
			if (err) return callback(err)
			if (resp.statusCode < 200 || resp.statusCode >= 400) {
				err = new Error(resp.body)
				return callback(err)
			}
			try {
				jobs = JSON.parse(jobs)
			} catch(e) {
				return callback(e)
			}
			this._records = jobs
			callback(null, jobs)
		})
	}

	findById(id, callback) {
		this.findAll((err, jobs) => {
			let job = jobs.filter(job => {
				return job.id === id
			})
			if (job.length) {
				callback(null, job[0])
			} else {
				callback(new Error('No job with id ' + id + ' found'))
			}
		})
	}
}

export default new Jobs()
