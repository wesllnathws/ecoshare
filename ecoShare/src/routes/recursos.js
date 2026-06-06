const express = require("express");
const router = express.Router();
const rc = require("../controllers/recursosController");
const sc = require("../controllers/solicitacoesController");
const { autenticar } = require("../middleware/auth");

router.get("/", rc.listar);
router.get("/:id", rc.detalhe);

router.get("/meus", autenticar, rc.meus);
router.get("/novo", autenticar, rc.paginaCriar);
router.post("/novo", autenticar, rc.criar);
router.get("/:id/editar", autenticar, rc.paginaEditar);
router.post("/:id/editar", autenticar, rc.editar);
router.post("/:id/deletar", autenticar, rc.deletar);

router.post("/solicitar", autenticar, sc.criar);
router.get("/minhas/solicitacoes", autenticar, sc.minhasSolicitacoes);
router.post("/solicitacao/:id/status", autenticar, sc.atualizarStatus);

module.exports = router;
