//Importaciones
/* import express, { urlencoded, json } from "express" */
import express from "express"
import mongoose from "mongoose"
import __dirname from "./utils.js"
import handlebars from "express-handlebars"
import path from "path"
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"


//Configuración del server
const app = express()
const PORT = 8080



//Declaración de midlewares
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))


mongoose.connect("mongodb+srv://DeibyFaria21:Simple123@cluster0.fc7im6z.mongodb.net/ecomerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log("Conectado a la base de datos")
    })
    .catch(error => console.error("Error en la conexión", error))


//Declaración de endpoints
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)





app.listen(PORT, () => {
    console.log(`Server UP: Server running on port ${PORT}`)
})