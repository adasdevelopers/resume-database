const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
	// Get token from header

	// Verify token
	try {
		const token = req.header("token");
		// Check if not token
		if (token===undefined) {
			return res.status(403).json({ msg: "authorization denied" });
		}
		//it is going to give use the user id (user:{id: user.id})
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		req.user = payload.user;
		next();
	} catch (err) {
		//res.status(401).json({ msg: "Token is not valid" });
	}
};
