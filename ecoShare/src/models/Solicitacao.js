const { query, run, get } = require("./db");

const Solicitacao = {
  findById: function (id) {
    const sol = get(
      `
      SELECT s.*,
        r.titulo as recursoTitulo, r.usuarioId as recursoDonoId, r.id as recursoId2,
        u.nome as solicitanteNome, u.email as solicitanteEmail
      FROM solicitacoes s
      LEFT JOIN recursos r ON s.recursoId = r.id
      LEFT JOIN usuarios u ON s.solicitanteId = u.id
      WHERE s.id = ?
    `,
      [id],
    );

    if (!sol) return null;

    return {
      ...sol,
      recurso: {
        id: sol.recursoId2,
        titulo: sol.recursoTitulo,
        usuarioId: sol.recursoDonoId,
      },
      solicitante: { nome: sol.solicitanteNome, email: sol.solicitanteEmail },
    };
  },

  byRecurso: function (recursoId) {
    const resultado = query(
      `
      SELECT s.*, u.nome as solicitanteNome, u.cidade as solicitanteCidade
      FROM solicitacoes s
      LEFT JOIN usuarios u ON s.solicitanteId = u.id
      WHERE s.recursoId = ?
      ORDER BY s.createdAt DESC
    `,
      [recursoId],
    );

    return resultado.map(function (s) {
      return {
        ...s,
        solicitante: { nome: s.solicitanteNome, cidade: s.solicitanteCidade },
      };
    });
  },

  bySolicitante: function (userId) {
    const resultado = query(
      `
      SELECT s.*,
        r.titulo as recursoTitulo, r.categoria as recursoCategoria, r.id as recursoId2,
        u.nome as donoNome, u.cidade as donoCidade
      FROM solicitacoes s
      LEFT JOIN recursos r ON s.recursoId = r.id
      LEFT JOIN usuarios u ON r.usuarioId = u.id
      WHERE s.solicitanteId = ?
      ORDER BY s.createdAt DESC
    `,
      [userId],
    );

    return resultado.map(function (s) {
      return {
        ...s,
        recurso: {
          id: s.recursoId2,
          titulo: s.recursoTitulo,
          categoria: s.recursoCategoria,
          dono: { nome: s.donoNome, cidade: s.donoCidade },
        },
      };
    });
  },

  create: function ({
    recursoId,
    mensagem,
    dataInicio,
    dataFim,
    solicitanteId,
  }) {
    const resultado = run(
      "INSERT INTO solicitacoes (recursoId, mensagem, dataInicio, dataFim, solicitanteId) VALUES (?,?,?,?,?)",
      [recursoId, mensagem, dataInicio, dataFim, solicitanteId],
    );
    return Solicitacao.findById(resultado.lastInsertRowid);
  },

  updateStatus: function (id, status) {
    run(
      `UPDATE solicitacoes SET status = ?, updatedAt = datetime('now') WHERE id = ?`,
      [status, id],
    );
    return Solicitacao.findById(id);
  },
};

module.exports = Solicitacao;
