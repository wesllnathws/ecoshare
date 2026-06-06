const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");

router.get("/login", auth.paginaLogin);
router.post("/login", auth.login);
router.get("/cadastro", auth.paginaCadastro);
router.post("/cadastro", auth.cadastro);
router.get("/logout", auth.logout);

module.exports = router;
