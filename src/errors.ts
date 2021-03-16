class HarkeInvalidUrl extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'HarkeInvalidUrl'
	}
}

export {
  HarkeInvalidUrl
}
