const Solicitacao = require("../models/Solicitacao");
const Recurso = require("../models/Recurso");
const Usuario = require("../models/Usuario");

exports.criar = function (req, res) {
  const { recursoId, mensagem, dataInicio, dataFim } = req.body;

  const recurso = Recurso.findById(recursoId);

  if (!recurso) return res.redirect("/recursos");
  if (recurso.usuarioId === req.usuario.id)
    return res.redirect(`/recursos/${recursoId}`);

  if (new Date(dataFim) <= new Date(dataInicio)) {
    return res.redirect(`/recursos/${recursoId}`);
  }

  Solicitacao.create({
    recursoId,
    mensagem,
    dataInicio,
    dataFim,
    solicitanteId: req.usuario.id,
  });
  res.redirect(`/recursos/${recursoId}`);
};

exports.minhasSolicitacoes = function (req, res) {
  const solicitacoes = Solicitacao.bySolicitante(req.usuario.id);
  res.render("recursos/solicitacoes", {
    solicitacoes,
    titulo: "Minhas Solicitações",
  });
};

exports.atualizarStatus = function (req, res) {
  const { id } = req.params;
  const { status } = req.body;

  const sol = Solicitacao.findById(id);

  if (!sol || sol.recurso.usuarioId !== req.usuario.id) {
    return res.redirect("/recursos/meus");
  }

  Solicitacao.updateStatus(id, status);

  if (status === "aprovada") {
    Recurso.update(sol.recursoId, { disponivel: false });
  }

  if (status === "concluida" || status === "recusada") {
    Recurso.update(sol.recursoId, { disponivel: true });
    if (status === "concluida") {
      const dono = Usuario.findById(sol.recurso.usuarioId);
      if (dono) Usuario.update(dono.id, { pontos: dono.pontos + 10 });
    }
  }

  res.redirect("/recursos/meus");
};
