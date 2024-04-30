//Importaciones
import express, { urlencoded, json } from "express"
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
app.use(express.static(__dirname + '/public'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
/* app.use(express.static(path.join(__dirname, "public"))) */



//Declaración de endpoints
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)





app.listen(PORT, () => {
    console.log(`Server UP: Server running on port ${PORT}`)
})