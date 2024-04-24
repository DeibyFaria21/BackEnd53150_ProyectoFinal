//Importaciones
const express = require("express")
const path = require("path")
/* const ProductManager = require("./productManager.js") */
const productsRouter = require("./routes/products.router.js")
const cartsRouter = require("./routes/carts.router.js")


//Configuración del server
const app = express()
const PORT = 8080


//Declaración de midlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
/* app.use(express.static(path.join(__dirname, "public"))) */


/* const managerProduct = new ProductManager() */


app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

/* app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, "public", "index.html"))
}) */


app.listen(PORT, () => {
    console.log(`Server UP: Server running on port ${PORT}`)
})