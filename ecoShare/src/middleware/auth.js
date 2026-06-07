const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

const SECRET = process.env.JWT_SECRET || "ecoshare_secret_2024";

function gerarToken(usuario) {
  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, nome: usuario.nome },
    SECRET,
    { expiresIn: '30d' },
  );
  return token;
}

function autenticar(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/auth/login");
  }
  try {
    const dados = jwt.verify(token, SECRET);
    req.usuario = dados;
    next();
  } catch (err) {
    res.clearCookie("token");
    return res.redirect("/auth/login");
  }
}

function pegaUsuario(req, res, next) {
  const token = req.cookies.token;
  if (token) {
    try {
      const dados = jwt.verify(token, SECRET);
      req.usuario = dados;
      const usuario = Usuario.findById(dados.id);
      res.locals.usuarioLogado = usuario || null;
    } catch (err) {
      res.locals.usuarioLogado = null;
    }
  } else {
    res.locals.usuarioLogado = null;
  }
  next();
}

module.exports = { gerarToken, autenticar, pegaUsuario };
