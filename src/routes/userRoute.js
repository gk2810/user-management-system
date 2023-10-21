let CMS_route = require("express").Router();
let { CMS_authenticate } = require("../middleware/userAuthentication");
let { CMS_create, CMS_login, CMS_getstatus, CMS_getusers, CMS_getuser, CMS_updateuser, CMS_removeuser } = require("../controller/users")

CMS_route.post("/", CMS_authenticate, CMS_create);
CMS_route.post("/login", CMS_login);
CMS_route.get("/status", CMS_authenticate, CMS_getstatus);
CMS_route.get("/", CMS_authenticate, CMS_getusers);
CMS_route.get("/:userId", CMS_authenticate, CMS_getuser);
CMS_route.put("/:userId", CMS_authenticate, CMS_updateuser)
CMS_route.delete("/:userId", CMS_authenticate, CMS_removeuser)

module.exports = CMS_route; 