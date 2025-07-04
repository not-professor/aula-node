const { config } = require("dotenv")
const path = require("path")
const express = require("express")
const cors = require('cors')
const { PrismaClient } = require("./generated")

config()

const app = express()
const prisma = new PrismaClient()

app.set("view engine", "ejs")
app.set("views", __dirname + "/views")

app.use(express.static(path.join(__dirname, "..", "public")))
app.use(express.urlencoded())
app.use(cors({
    origin: true
}))

app.get("/", (req, res) => {
    return res.render("index")
})

app.post("/comentario", async (req, res) => {
    const nome = req.body.nome
    const comentario = req.body.comentario

    await prisma.comentarios.create({
        data: {
            nomeUsuario: nome,
            texto: comentario
        }
    })

    return res.redirect("/comentarios")
})


app.get("/comentarios", async (req, res) => {
    const comentarios = await prisma.comentarios.findMany()

    return res.render("comentarios", {
        comentarios
    })
})


app.listen(process.env.PORT, () => {
    console.log(`Aplicação rodando na porta ${process.env.PORT}`)
})