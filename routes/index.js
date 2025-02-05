const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const UserController = require("../controller/user.controller");

router.post("/user/create", upload.single("file"), UserController.CreateUser);
router.get("/user/:username", UserController.GetUserInformation);
router.get("/image/:image", UserController.GetImage);

module.exports = router;
