let CMS_jwt = require("jsonwebtoken")
require("dotenv").config();

exports.CMS_authenticate = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ msg: "not authorized" })
        }
        let CMS_TOKEN = req.headers.authorization.split(" ");
        if (CMS_TOKEN[0] !== "Bearer") {
            return res.status(401)
        }
        CMS_TOKEN = CMS_TOKEN[1];
        CMS_jwt.verify(CMS_TOKEN, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ msg: "Invalid Token" })
            }
            req.user = user
            next();
        })
    } catch (error) {
        console.log("error ", error);
        return res.status(500).json({ msg: error.message })
    }
}