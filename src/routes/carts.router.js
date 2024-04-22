const express = require("express")
const router = express.Router()

const carts = []

router.get("/carts", (req, res)=>{
    res.json(carts)
})

router.post("/carts", (req, res)=>{
    const newCart = req.body
    carts.push(newCart)
    res.json({message: "Carrito agregado"})
})

module.exports = router