require("./models/index");

const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const { pegaUsuario } = require("./middleware/auth");

console.log("servidor iniciando...");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(pegaUsuario);

app.get("/", (req, res) => res.render("home", { titulo: "EcoShare" }));
app.use("/auth", require("./routes/auth"));
app.use("/recursos", require("./routes/recursos"));

app.use((req, res) =>
  res.status(404).render("404", { titulo: "Página não encontrada" }),
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌿 EcoShare em http://localhost:${PORT}`));

module.exports = app;
