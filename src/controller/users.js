const CMS_users = require("../model/userModel");
const CMS_bcrypt = require("bcrypt");
const CMS_jwt = require("jsonwebtoken");
require("dotenv").config();
const CMS_mongoose = require("mongoose")

//  route for CRUD of users
exports.CMS_create = async (req, res) => {
    try {
        let CMS_user = req.user;
        let CMS_DB_user = await CMS_users.findOne({ email: CMS_user.email });
        let CMS_userDetails = req.body;
        // user can't create user
        if (CMS_DB_user.role == "USER") {
            return res.status(403).json({ msg: "Permission Denied" });
        }
        //  admin only create users
        if (CMS_DB_user.role !== "SUPERADMIN" && (CMS_userDetails.role == "ADMIN" || CMS_userDetails.role == "SUPERADMIN")) {
            return res.status(403).json({ msg: "Permission Denied" });
        }
        CMS_userDetails.password = CMS_bcrypt.hashSync(CMS_userDetails.password, 10);
        let CMS_User = await CMS_users.create(CMS_userDetails);
        return res.status(200).json(CMS_User);

    } catch (error) {
        console.log("error ", error);
        return res.status(500).json({ msg: error.message })
    }
}
exports.CMS_updateuser = async (req, res) => {
    try {
        let CMS_user_id = new CMS_mongoose.Types.ObjectId(req.params.userId)
        let CMS_user = req.user;
        let CMS_update_user = req.body;
        // only superadmin can change role and verification_status of other users 
        if (CMS_user.role == "USER" || (!CMS_user.role == "SUPERADMIN" && (CMS_update_user.role || CMS_update_user.verification_statusb))) {
            return res.status(403).json({ msg: "Permission Denied" })
        }
        if (CMS_update_user.password) {
            CMS_update_user.password = await CMS_bcrypt.hash(CMS_update_user.password, 10)
        }
        let CMS_updated_user = await CMS_users.updateOne({ _id: CMS_user_id }, CMS_update_user);
        return res.status(200).json(CMS_updated_user);
    } catch (error) {
        console.log("error ", error);
        return res.status(500).json({ msg: error.message })
    }
}
exports.CMS_removeuser = async (req, res) => {
    try {
        let CMS_DB_user = req.user;
        //  only superadmin can remove other users
        if (CMS_DB_user.role !== "SUPERADMIN") {
            return res.status(403).json({ msg: "Permission Denied" });
        }
        let CMS_userId = new CMS_mongoose.Types.ObjectId(req.params.userId)
        let CMS_delUser = await CMS_users.findByIdAndDelete(CMS_userId);
        if (!CMS_delUser) {
            return res.status(404).json({ msg: "user not found or deleted" })
        } else {
            return res.status(200).json({})
        }
    } catch (error) {
        console.log("error ", error);
        return res.status(500).json({ msg: error.message })
    }
}
exports.CMS_getusers = async (req, res) => {
    try {
        let CMS_user_role = req.user.role;
        //  user can only view own profile not profile of others
        if (CMS_user_role == "USER") {
            return res.status(403).json({ msg: "Permission Denied" })
        }
        let CMS_DB_users = await CMS_users.find();
        if (!CMS_DB_users.length) {
            return res.status(404).json({ msg: "no user found" })
        } else {
            return res.status(200).json({ users: CMS_DB_users });
        }
    } catch (error) {
        console.log("error ", error);
        return res.status(500).json({ msg: error.message })
    }
}
exports.CMS_getuser = async (req, res) => {
    try {
        //  user can only view own profile not profile of others
        if (req.user.role === "USER") {
            return res.status(403).json({ msg: "Permission Denied" })
        }
        let CMS_user_id = new CMS_mongoose.Types.ObjectId(req.params.userId);
        let DB_user = await CMS_users.findOne({ _id: CMS_user_id });
        if (!DB_user) {
            return res.status(404).json({ "msg": "User not found" });
        } else {
            return res.status(200).json({ user: DB_user });
        }
    } catch (error) {
        console.log("error ", error);
        return res.status(500).json({ msg: error.message })
    }
}

//  getstatus route  
exports.CMS_getstatus = async (req, res) => {
    try {
        let CMS_user = req.user;
        let CMS_DB_user = await CMS_users.findOne({ email: CMS_user.email });
        if (CMS_DB_user.status == "ACTIVE") {
            return res.status(200).json({ status: "ACTIVE" })
        } else {
            return res.status(200).json({ status: "DEACTIVE" })
        }
    } catch (error) {
        console.log("error ", error);
        return res.status(500).json({ msg: error.message })
    }
}

// login route
exports.CMS_login = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ msg: "please provide all required data" })
        }
        let CMS_email = req.body.email;
        let CMS_password = req.body.password;
        let CMS_user = await CMS_users.findOne({ email: CMS_email })
        if (!CMS_user) {
            return res.status(404).json({ msg: "user not found with this mail" });
        }
        // if status of user is not ACTIVE then not able to login
        if (CMS_user.status == "DEACTIVE") {
            return res.status(400).json({ msg: "user is DEACTIVE" })
        }
        let CMS_isMatched = CMS_bcrypt.compareSync(CMS_password, CMS_user.password);
        if (!CMS_isMatched) {
            return res.status(401).json({ msg: "enter valid password" });
        } else {
            let CMS_TOKEN = CMS_jwt.sign({ _id: CMS_user._id, email: CMS_user.email, role: CMS_user.role }, process.env.JWT_SECRET, { expiresIn: "24h" });
            return res.status(200).json({ token: CMS_TOKEN })
        }

    } catch (error) {
        console.log("error ", error);
        return res.status(500).json({ msg: error.message })
    }
}