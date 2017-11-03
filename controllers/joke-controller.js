var Joke = require("../models/joke.js")
const fetch = require("node-fetch")
const { get } = require("https")
const { URL } = require("url")

class JokeController {
	constructor() {
		this.services = this.getServices()
	}

	getServices() {
		let response = ""
		return new Promise((resolve, reject) => {
			get("https://krdo-joke-registry.herokuapp.com/api/services", res => {
				res.on("data", b => response += b.toString())
					.on("end", () => {
						console.log(URL)
						const services = JSON.parse(response).map((service) => {
							try {
								const address = new URL(service.address)
								return { name: service.name, address }
							}
							catch (error) {
								console.error(error)
								return null
							}
						}).filter(Boolean)

						console.log(services)

						resolve(services)
					})
			})
		})
	}

	get(id) {
		return Joke.findOne({ _id: id }, { setup: 1, punchline: 1, _id: 0 })
	}

	getAll() {
		return this.services.then(services => {
			console.log(services)
			const jokes = []
			for (var service of services) {
				jokes.push(fetch(service.address + "api/jokes").then(res => res.json()).then(jokes => {
					return { 
						name: service.name || "Anonyme JOKES",
						jokes: jokes.map(joke => ({
							setup: joke.Setup || joke.setup,
							punchline: joke.Punchline || joke.punchline
						}))
					}
				}))
			}

			return Promise.all(jokes)
		})
	}

	create(joke) {
		var joke = new Joke(joke);
		return joke.save()
	}
}

module.exports = JokeController