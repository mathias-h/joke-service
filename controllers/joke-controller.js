var Joke = require("../models/joke.js")
const fetch = require("node-fetch")
const { URL } = require("url")

class JokeController {
	constructor() {
		this.getServices().then(services => {
			this.services = services
		})
	}

	getServices() {
		return fetch("https://krdo-joke-registry.herokuapp.com/api/services").then(res => res.json())
			.then(services => {
				return services.map((service) => {
					try {
						const address = new URL(service.address)
						return { name: service.name, address }
					}
					catch (error) {
						return null
					}
				}).filter(Boolean)
			})
	}

	get(id) {
		return Joke.findOne({ _id: id }, { setup: 1, punchline: 1, _id: 0 })
	}

	getAll() {
		const jokes = []
		for (var service of this.services) {
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
	}

	create(joke) {
		var joke = new Joke(joke);
		return joke.save()
	}
}

module.exports = JokeController