function checkLoggedIn(req, res, next) {
	const isLoggedIn = false
	if (!isLoggedIn) {
		return res.status(401).json({
			error: 'You must login',
		})
	}
	next()
}

module.exports = {
	checkLoggedIn,
}
