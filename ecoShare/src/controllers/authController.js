const Usuario = require("../models/Usuario");
const { gerarToken } = require("../middleware/auth");

exports.paginaLogin = function (req, res) {
  res.render("auth/login", { erro: null, titulo: "Entrar" });
};

exports.paginaCadastro = function (req, res) {
  res.render("auth/cadastro", { erro: null, titulo: "Cadastrar" });
};

exports.login = async function (req, res) {
  const { email, senha } = req.body;
  try {
    const usuario = Usuario.findByEmail(email);
    if (!usuario || !(await Usuario.verificarSenha(usuario, senha))) {
      return res.render("auth/login", {
        erro: "Email ou senha inválidos.",
        titulo: "Entrar",
      });
    }
    const token = gerarToken(usuario);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.redirect("/recursos");
  } catch (err) {
    console.error(err);
    res.render("auth/login", {
      erro: "Erro interno. Tente novamente.",
      titulo: "Entrar",
    });
  }
};

exports.cadastro = async function (req, res) {
  const { nome, email, senha, cidade } = req.body;

  if (!nome || !email || !senha || !cidade) {
    return res.render("auth/cadastro", {
      erro: "Todos os campos são obrigatórios.",
      titulo: "Cadastrar",
    });
  }

  if (senha.length < 6) {
    return res.render("auth/cadastro", {
      erro: "A senha deve ter no mínimo 6 caracteres.",
      titulo: "Cadastrar",
    });
  }

  try {
    const existe = Usuario.findByEmail(email);
    if (existe) {
      return res.render("auth/cadastro", {
        erro: "Email já cadastrado.",
        titulo: "Cadastrar",
      });
    }
    const usuario = await Usuario.create({ nome, email, senha, cidade });
    const token = gerarToken(usuario);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.redirect("/recursos");
  } catch (err) {
    console.error(err);
    res.render("auth/cadastro", {
      erro: "Erro ao criar conta.",
      titulo: "Cadastrar",
    });
  }
};

exports.logout = function (req, res) {
  res.clearCookie("token");
  res.redirect("/");
};
