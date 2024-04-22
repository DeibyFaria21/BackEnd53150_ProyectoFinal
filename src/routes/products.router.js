const express = require("express")
const router = express.Router()

const products = []

router.get("/products", (req, res)=>{
    res.json(products)
})

router.post("/products", (req, res)=>{
    const newProduct = req.body
    products.push(newProduct)
    res.json({message: "Producto agregado"})
})

module.exports = router