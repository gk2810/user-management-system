let CMS_userRoute = require("./userRoute")

module.exports = function (app) {
    app.use("/users", CMS_userRoute)
}