# EcoShare — Plataforma de Compartilhamento de Recursos Sustentáveis

> Projeto Acadêmico | Node.js + Express + Sequelize + EJS + JWT

## Visão Geral

O **EcoShare** é uma plataforma web de economia colaborativa onde usuários podem compartilhar bens, ferramentas e equipamentos com sua comunidade local, reduzindo o desperdício e promovendo o consumo sustentável.

## Tecnologias

Backend: Node.js + Express
ORM: Sequelize
Banco de dados: SQLite (desenvolvimento)
Views: EJS (Embedded JavaScript)
Autenticação: JWT (JSON Web Tokens) + bcryptjs
Deploy: Vercel

## Entidades e Relacionamentos

```
Usuario (1) ──── (N) Recurso
Usuario (1) ──── (N) Solicitacao
Recurso  (1) ──── (N) Solicitacao
```

### Entidades

- **Usuario** — id, nome, email, senha (hash), cidade, bio, pontos
- **Recurso** — id, titulo, descricao, categoria, disponivel, localizacao, usuarioId
- **Solicitacao** — id, mensagem, status, dataInicio, dataFim, recursoId, solicitanteId

## Funcionalidades

Cadastro e login com JWT (armazenado em cookie httpOnly)
CRUD completo de Recursos
Solicitação de empréstimo com aprovação/rejeição
Sistema de pontos por compartilhamento concluído
Filtro por categoria, disponibilidade e busca por nome
Dados protegidos por middleware de autenticação

## Integrantes

**Integrante 1**: Weslley <br>
**Github**: @wesllnathws / https://github.com/wesllnathws <br>
**Responsabilidades**: Views & CSS <Br>
**Arquivos**: views/ e public/css/main.css <br>
**Commits**: ajusta layout das páginas, muda cores, melhora cards, adiciona responsividade.

**Integrante 2**: Glauber <br>
**Github**: Binhu01 / https://github.com/Binhu01 <br>
**Responsabilidades**: Rotas & Controllers
**Arquivos**: routes/ e controllers/ <br>
**Commits**: adiciona validações, corrige redirects, ajusta lógica dos controllers.

**Integrante 3**: Vinicius <br>
**Github**: @vinymoura / https://github.com/vinymouraa <br>
**Responsabilidades**: Models, Auth & Deploy <br>
**Arquivos**: models/, middleware/auth.js, vercel.json, config database.js <br>
**Commits**: cria schema do banco, implementa JWT, configura seed, ajusta vercel.
