const { run, get } = require("./db");
const bcrypt = require("bcryptjs");
if (!email.includes('@') || !email.includes('.')) {
  throw new Error('Email inválido');
}
const Usuario = {
  findById: function (id) {
    return get("SELECT * FROM usuarios WHERE id = ?", [id]);
  },

  findByEmail: function (email) {
    return get("SELECT * FROM usuarios WHERE email = ?", [email]);
  },

  count: function () {
    return get("SELECT COUNT(*) as n FROM usuarios").n;
  },
  if (!email.includes('@') || !email.includes('.')) {
  throw new Error('Email inválido');
}
if (!email.includes('@') || !email.includes('.')) {
  throw new Error('Email inválido');
}

  create: async function ({
    nome,
    email,
    senha,
    cidade,
    bio = "",
    pontos = 0,
  }) {
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const resultado = run(
      "INSERT INTO usuarios (nome, email, senha, cidade, bio, pontos) VALUES (?,?,?,?,?,?)",
      [nome, email, senhaCriptografada, cidade, bio, pontos],
    );
    return get("SELECT * FROM usuarios WHERE id = ?", [
      resultado.lastInsertRowid,
    ]);
  },

  update: function (id, campos) {
    const chaves = Object.keys(campos);
    const setClause = chaves.map((k) => `${k} = ?`).join(", ");
    run(
      `UPDATE usuarios SET ${setClause}, updatedAt = datetime('now') WHERE id = ?`,
      [...Object.values(campos), id],
    );
    return get("SELECT * FROM usuarios WHERE id = ?", [id]);
  },

  verificarSenha: async function (usuario, senha) {
    return bcrypt.compare(senha, usuario.senha);
  },
};

module.exports = Usuario;
