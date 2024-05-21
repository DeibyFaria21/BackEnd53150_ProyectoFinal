//Importaciones
import { Router } from 'express'
import productModel from '../dao/models/product.model.js'


//Instanciando clase ProductManager
const productsRouterdb = Router()
const managerProduct = new ProductManager()


productsRouterdb.get('/api/products', async (req, res) => {
    try {
        const products = await productModel.find().lean()
        res.render('home',{
            style:'style.css',
            products: products
        })
    } catch (error) {
        console.error('Error al cargar la página de productos:', error)
        res.status(500).render('error', { message: 'Error al cargar la página de prouctos.' })
    }
})

productsRouterdb.get('/api/products/:pid', async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).lean()

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' })
        }

        res.render('productDetail', { product })
    } catch (error) {
        console.error('Error al cargar la página de detalle del producto:', error)
        res.status(500).render('error', { message: 'Error al cargar la página de detalle del producto.' })
    }
})

//Post para Postman:
productsRouterdb.post('/api/products', async (req, res) => {
    let { title, description, code, price, stock, category, thumbnail} = req.body
    console.log(req.body)

    if (!title || !description || !code || !price || !stock || !category ) {
        res.send({ status: "error", error: "Faltan parametros" })
    }

    let result = await productModel.create({ title, description, code, price, stock, status:true, category, thumbnail })
    console.log(result)
    res.send({ result: "success", payload: result })
})

productsRouterdb.get('/api/addProduct', (req, res) => {
    res.render('addProduct',{
        style:'style.css'
    })
})

productsRouterdb.post('/api/addProduct', async (req, res) => {
    try {
        let { title, description, code, price, stock, category, thumbnail } = req.body

        if (!title || !description || !code || !price || !stock || !category || !thumbnail) {
            return res.status(400).json({ error: 'Faltan parámetros' })
        }

        let newProduct = await productModel.create({
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnail,
            status: true
        })

        res.render('addProduct')
    } catch (error) {
        console.error('Error al agregar un nuevo producto:', error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
})

//PUT para Postman:
productsRouterdb.put('/api/products/:pid', async (req, res) => {
    let { pid } = req.params
    let productToReplace = req.body

    if (!productToReplace.title || !productToReplace.description  || !productToReplace.code || !productToReplace.price || !productToReplace.stock || !productToReplace.category || !productToReplace.thumbnail) {
        res.send({ status: "error", error: "Parametros no definidos" })
    }

    let result = await productModel.updateOne({ _id: pid }, productToReplace)
    res.send({ result: "success", payload: result })
})

productsRouterdb.get('/api/products/update/:pid', async (req, res) => {
    try {
        const productById = await productModel.findByIdAndUpdate(req.params.pid).lean()
        res.render('updateProduct', { productById })
    } catch (error) {
        console.log(error.message)
    }
})

productsRouterdb.post('/api/products/update/:pid', async (req, res) => {
    try {
        let { pid } = req.params
        console.log('Datos recibidos para actualizar:', req.body)
        await productModel.findByIdAndUpdate(pid, req.body)
        res.redirect('/api/products')
    } catch (error) {
        console.error('Error al actualizar el producto:', error)
        res.status(500).render('error', { message: 'Error al actualizar el producto.' })
    }
})

//Delete para Postman:
productsRouterdb.delete('/api/products/:pid', async (req, res) => {
    let { pid } = req.params
    let result = await productModel.deleteOne({ _id: pid })
    res.send({ result: "success", payload: result })
})

productsRouterdb.get('/api/products/delete/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        await productModel.findByIdAndDelete(pid)
        res.redirect('/api/products')
    } catch (error) {
        console.error('Error al eliminar el producto:', error)
        res.status(500).render('error', { message: 'Error al eliminar el producto.' })
    }
})

/* export default router; */


//////////////////////////////////////////////////////////////////////////////////


//Ruta de endpoint para obtener el listado de productos con o sin límite
productsRouter.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit)
    const products = await managerProduct.getProducts()
    if (!isNaN(limit) && limit > 0) {
      const limitedProducts = products.slice(0, parseInt(limit))
      console.log(limitedProducts)
      return res.json(limitedProducts)
    }
    res.json(products)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener los productos' })
  }
})


//Ruta de endpoint para obtener un producto especificado por ID del listado de productos
productsRouter.get('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid)
    const product = await managerProduct.getProductById(productId)
    if (!product.pid) {
      return res.json(product)
      /* res.status(404).json({ error: 'Producto no encontrado' }) */
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener el producto' })
  }
})


//Ruta de endpoint para agregar un producto al listado de productos
productsRouter.post('/', async (req, res) => {
  const product = req.body;
  if (!product || Object.values(product).some(value => !value)) {
    return res.status(400).json({ status: "error", error: 'Valores incompletos' });
  }

  try {
    const result = await managerProduct.addProduct(product.title, product.description, product.code, product.price, product.status, product.stock, product.category, product.thumbnail);
    if (typeof result === "string") {
      return res.status(400).json({ status: "error", error: result });
    }
    return res.status(201).json({ status: "success", message: 'Producto creado'/* , product: result */});
  } catch (error) {
    return res.status(500).json({ status: "error", error: 'Error al crear el producto' });
  }
});


//Ruta de endpoint para actualizar un producto especificado del listado de productos
productsRouter.put('/:pid', async (req, res) => {
  const data = req.body
  const productId = parseInt(req.params.pid)
  const products = await managerProduct.getProducts()
  const product = products.find(product => product.id === productId)
  if (!product) {
    return res.status(404).json({
      error: 'Producto para actualización no encontrado'
    })
  }
  product.id = product.id
  product.title = data.title || product.title
  product.description = data.description || product.description
  product.code = data.code || product.code
  product.price = data.price || product.price
  product.status = data.status || product.status
  product.stock = data.stock || product.stock
  product.category = data.category || product.category
  product.thumbnail = data.thumbnail || product.thumbnail
  managerProduct.updateProduct(product.id, data)
  // manager.saveProducts(products)
  return res.json(product)
})


//Ruta de endpoint para eliminar un producto especificado del listado de productos
productsRouter.delete('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid)
  managerProduct.deleteProduct(productId)
  return res.status(204).json({})
})

export default productsRouter;