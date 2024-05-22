//Importaciones
import { Router } from 'express'
import productModel from '../dao/models/product.model.js'


//Instanciando Router
const productsRouterdb = Router()


//Handlebars
productsRouterdb.get('/products', async (req, res) => {
    try {
        const products = await productModel.find().lean()
        res.render('home',{products})
        /* res.json(products) */
    } catch (error) {
        console.error('No se encontró el archivo de productos:', error)
    }
})

//Handlebars
productsRouterdb.get('/products/:pid', async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).lean()
        if (!product) {
            return res.status(404).json({ error: 'Producto no existe' })
        }
        res.render('detail', { product })
        /* res.send(product) */
    } catch (error) {
        console.error('Error al encontrar el producto', error)
        res.status(500).render('error', { message: 'Error al encontrar el producto' })
    }
})

//Postman
productsRouterdb.post('/products', async (req, res) => {
    let { title, description, code, price, stock, category, thumbnail} = req.body
    console.log(req.body)
    if (!title || !description || !code || !price || !stock || !category || !thumbnail) {
        res.send({status: "error", error: "Todos los campos son obligatorios"})
    }
    let result = await productModel.create({title, description, code, price, status:true, stock, category, thumbnail})
    console.log(result)
    res.send({ result: "success", payload: result })
})

//Handlebars
/* productsRouterdb.get('/addProduct', (req, res) => {
    res.render('addProduct',{})
}) */

//Handlebars
/* productsRouterdb.post('/addProduct', async (req, res) => {
    try {
        let { title, description, code, price, stock, category, thumbnail } = req.body

        if (!title || !description || !code || !price || !stock || !category || !thumbnail) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' })
        }
        let newProduct = await productModel.create({
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnail
        })
        res.render('addProduct')
    } catch (error) {
        console.error('Error al agregar un nuevo producto:', error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
}) */

//Postman
productsRouterdb.put('/products/:pid', async (req, res) => {
    let { pid } = req.params
    let updateProduct = req.body

    if (!updateProduct.title || !updateProduct.description  || !updateProduct.code || !updateProduct.price || !updateProduct.status || !updateProduct.stock || !updateProduct.category || !updateProduct.thumbnail) {
        res.send({ status: "error", error: "Debe completar los campos obligatorios" })
    }
    let result = await productModel.updateOne({ _id: pid }, updateProduct)
    res.send({ result: "success", payload: result })
})

//Handlebars
/* productsRouterdb.get('/products/update/:pid', async (req, res) => {
    try {
        const productById = await productModel.findByIdAndUpdate(req.params.pid).lean()
        res.render('updateProduct', { productById })
    } catch (error) {
        console.log(error.message)
    }
})

productsRouterdb.post('/products/update/:pid', async (req, res) => {
    try {
        let { pid } = req.params
        console.log('Datos recibidos para actualizar:', req.body)
        await productModel.findByIdAndUpdate(pid, req.body)
        res.redirect('/api/products')
    } catch (error) {
        console.error('Error al actualizar el producto:', error)
        res.status(500).render('error', { message: 'Error al actualizar el producto.' })
    }
}) */

//Postman
productsRouterdb.delete('/products/:pid', async (req, res) => {
    let { pid } = req.params
    let result = await productModel.deleteOne({ _id: pid })
    res.send({ result: "success", payload: result })
})

/* productsRouterdb.get('/products/delete/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        await productModel.findByIdAndDelete(pid)
        res.redirect('/api/products')
    } catch (error) {
        console.error('Error al eliminar el producto:', error)
        res.status(500).render('error', { message: 'Error al eliminar el producto.' })
    }
}) */

export default productsRouterdb;