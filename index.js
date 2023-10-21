const CMS_express = require("express");
const CMS_mongoose = require("mongoose");
require("dotenv").config()
const CMS_app = CMS_express();
const CMS_port = process.env.PORT

CMS_app.use(CMS_express.json());
CMS_app.use(CMS_express.urlencoded({ extended: true }));

require("./src/routes/route")(CMS_app)

CMS_mongoose.connect(process.env.MONGODB_URL)
    .then(console.log("DB connected"))
    .catch((err) => {
        console.log("error ", err);
    })

CMS_app.listen(CMS_port, () => {
    console.log(`server is running on ${CMS_port}`);
})