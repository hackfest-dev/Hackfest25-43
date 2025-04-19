const express = require("express");
const router = express.Router();
const { uploadPwDCertificate } = require("../controllers/pwdController");

router.post("/upload", uploadPwDCertificate);

module.exports = router;
