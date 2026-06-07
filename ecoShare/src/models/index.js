const { db } = require("./db");
const bcrypt = require("bcryptjs");

db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    cidade TEXT NOT NULL,
    bio TEXT DEFAULT '',
    pontos INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS recursos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    categoria TEXT NOT NULL,
    disponivel INTEGER DEFAULT 1,
    localizacao TEXT NOT NULL,
    imagem TEXT DEFAULT '',
    usuarioId INTEGER NOT NULL,
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS solicitacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mensagem TEXT NOT NULL,
    status TEXT DEFAULT 'pendente',
    dataInicio TEXT NOT NULL,
    dataFim TEXT NOT NULL,
    recursoId INTEGER NOT NULL,
    solicitanteId INTEGER NOT NULL,
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (recursoId) REFERENCES recursos(id) ON DELETE CASCADE,
    FOREIGN KEY (solicitanteId) REFERENCES usuarios(id) ON DELETE CASCADE
  );
`);

const total = db.prepare("SELECT COUNT(*) as n FROM usuarios").get().n;

if (total === 0) {
  const senha = bcrypt.hashSync("123456", 10);

  const u1 = db
    .prepare(
      "INSERT INTO usuarios (nome, email, senha, cidade, bio, pontos) VALUES (?,?,?,?,?,?)",
    )
    .run(
      "Ana Silva",
      'ana@eco.com',
       hash1, 'São Paulo - SP', 'Apaixonada por sustentabilidade e consumo consciente alem de ser vegana',
       40,
    );

  const u2 = db
    .prepare(
      "INSERT INTO usuarios (nome, email, senha, cidade, bio, pontos) VALUES (?,?,?,?,?,?)",
    )
    .run(
      "Carlos Mendes",
      "carlos@eco.com",
      senha,
      "Curitiba - PR",
      "Engenheiro e maker",
      20,
    );

  const inserirRecurso = db.prepare(
    "INSERT INTO recursos (titulo, descricao, categoria, localizacao, usuarioId) VALUES (?,?,?,?,?)",
  );

  inserirRecurso.run(
    "Furadeira Bosch",
    "Furadeira de impacto 650W com brocas incluídas. Ótima para reformas e trabalhos em casa.",
    "ferramenta",
    "São Paulo - SP",
    u1.lastInsertRowid,
  );
  inserirRecurso.run(
    "Bicicleta Urbana 21 Marchas",
    "Bike em ótimo estado com cestinha frontal. Ideal para deslocamento diário na cidade.",
    "veiculo",
    "São Paulo - SP",
    u1.lastInsertRowid,
  );
  inserirRecurso.run(
    "Projetor Epson HD",
    "Projetor 3000 lúmens, resolução HD com cabo HDMI e controle remoto incluídos.",
    "eletronico",
    "Curitiba - PR",
    u2.lastInsertRowid,
  );
  inserirRecurso.run(
    "Kit de Jardinagem Completo",
    "Conjunto com pá, ancinho, regador 10L e luvas de proteção para hortas e jardins.",
    "jardim",
    "Curitiba - PR",
    u2.lastInsertRowid,
  );

  console.log("dados iniciais inseridos no banco");
}

console.log("banco de dados pronto");
module.exports = { db };
