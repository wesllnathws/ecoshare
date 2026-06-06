const Recurso = require("../models/Recurso");
const Solicitacao = require("../models/Solicitacao");

exports.listar = function (req, res) {
  const { categoria, busca, disponivel } = req.query;
  const where = {};

  if (categoria) where.categoria = categoria;
  if (busca) where.busca = busca;
  if (disponivel === "true") where.disponivel = true;
  else if (disponivel === "false") where.disponivel = false;

  const recursos = Recurso.findAll({ where });
  res.render("recursos/listar", {
    recursos,
    filtros: req.query,
    titulo: "Recursos",
  });
};

exports.meus = function (req, res) {
  const recursos = Recurso.findAll({ where: { usuarioId: req.usuario.id } });

  const recursosComSolicitacoes = recursos.map(function (r) {
    return {
      ...r,
      solicitacoes: Solicitacao.byRecurso(r.id),
    };
  });

  res.render("recursos/meus", {
    recursos: recursosComSolicitacoes,
    titulo: "Meus Recursos",
  });
};

exports.paginaCriar = function (req, res) {
  res.render("recursos/form", {
    recurso: null,
    erro: null,
    titulo: "Novo Recurso",
  });
};

exports.criar = function (req, res) {
  const { titulo, descricao, categoria, localizacao, imagem } = req.body;
  try {
    Recurso.create({
      titulo,
      descricao,
      categoria,
      localizacao,
      imagem,
      usuarioId: req.usuario.id,
    });
    res.redirect("/recursos/meus");
  } catch (err) {
    console.error(err);
    res.render("recursos/form", {
      recurso: null,
      erro: "Erro ao criar recurso.",
      titulo: "Novo Recurso",
    });
  }
};

exports.detalhe = function (req, res) {
  const recurso = Recurso.findById(req.params.id);
  if (!recurso) return res.redirect("/recursos");

  const solicitacoes = Solicitacao.byRecurso(recurso.id);
  res.render("recursos/detalhe", {
    recurso: { ...recurso, solicitacoes },
    titulo: recurso.titulo,
  });
};

exports.paginaEditar = function (req, res) {
  const recurso = Recurso.findById(req.params.id);
  if (!recurso || recurso.usuarioId !== req.usuario.id)
    return res.redirect("/recursos/meus");
  res.render("recursos/form", {
    recurso,
    erro: null,
    titulo: "Editar Recurso",
  });
};

exports.editar = function (req, res) {
  const recurso = Recurso.findById(req.params.id);
  if (!recurso || recurso.usuarioId !== req.usuario.id)
    return res.redirect("/recursos/meus");

  const { titulo, descricao, categoria, localizacao, imagem, disponivel } =
    req.body;
  Recurso.update(req.params.id, {
    titulo,
    descricao,
    categoria,
    localizacao,
    imagem,
    disponivel: disponivel === "on",
  });
  res.redirect("/recursos/meus");
};

exports.deletar = function (req, res) {
  const recurso = Recurso.findById(req.params.id);
  if (!recurso) return res.redirect("/recursos/meus");
  if (recurso.usuarioId !== req.usuario.id) return res.redirect("/recursos");
  Recurso.delete(req.params.id);
  res.redirect("/recursos/meus");
};
