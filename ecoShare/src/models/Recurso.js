const { query, run, get } = require("./db");

const Recurso = {
  findAll: function ({ where = {}, orderBy = "createdAt DESC" } = {}) {
    let sql = `
      SELECT r.*, u.nome as donoNome, u.cidade as donoCidade
      FROM recursos r
      LEFT JOIN usuarios u ON r.usuarioId = u.id
    `;
    const params = [];
    const filtros = [];

    if (where.categoria) {
      filtros.push("r.categoria = ?");
      params.push(where.categoria);
    }
    if (where.disponivel !== undefined) {
      filtros.push("r.disponivel = ?");
      params.push(where.disponivel ? 1 : 0);
    }
    if (where.busca) {
      filtros.push("r.titulo LIKE ?");
      params.push(`%${where.busca}%`);
    }
    if (where.usuarioId) {
      filtros.push("r.usuarioId = ?");
      params.push(where.usuarioId);
    }

    if (filtros.length > 0) {
      sql += " WHERE " + filtros.join(" AND ");
    }
    sql += " ORDER BY r." + orderBy;

    const resultado = query(sql, params);

    return resultado.map(function (r) {
      return {
        ...r,
        disponivel: r.disponivel === 1,
        dono: { nome: r.donoNome, cidade: r.donoCidade },
      };
    });
  },

  findById: function (id) {
    const r = get(
      `
      SELECT r.*, u.nome as donoNome, u.cidade as donoCidade, u.id as donoId
      FROM recursos r
      LEFT JOIN usuarios u ON r.usuarioId = u.id
      WHERE r.id = ?
    `,
      [id],
    );

    if (!r) return null;

    return {
      ...r,
      disponivel: r.disponivel === 1,
      dono: { id: r.donoId, nome: r.donoNome, cidade: r.donoCidade },
    };
  },

  create: function ({
    titulo,
    descricao,
    categoria,
    localizacao,
    imagem = "",
    usuarioId,
  }) {
    const resultado = run(
      "INSERT INTO recursos (titulo, descricao, categoria, localizacao, imagem, usuarioId) VALUES (?,?,?,?,?,?)",
      [titulo, descricao, categoria, localizacao, imagem, usuarioId],
    );
    return Recurso.findById(resultado.lastInsertRowid);
  },

  update: function (id, campos) {
    const chaves = Object.keys(campos);
    const vals = chaves.map(function (k) {
      return k === "disponivel" ? (campos[k] ? 1 : 0) : campos[k];
    });
    const setClause = chaves.map((k) => `${k} = ?`).join(", ");
    run(
      `UPDATE recursos SET ${setClause}, updatedAt = datetime('now') WHERE id = ?`,
      [...vals, id],
    );
    return Recurso.findById(id);
  },

  delete: function (id) {
    return run("DELETE FROM recursos WHERE id = ?", [id]);
  },
};

module.exports = Recurso;
