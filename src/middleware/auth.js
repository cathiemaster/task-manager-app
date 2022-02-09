const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const tokenRes = jwt.verify(token, "thisismynewcourse");
        const user = await User.findOne({
            _id: tokenRes._id,
            "tokens.token": token
        });

        if (!user) {
            throw new Error()
        }

        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        res.status(401).send("Authenticate Correctly");
    }
};

module.exports = auth;