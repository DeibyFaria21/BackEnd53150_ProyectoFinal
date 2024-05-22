//Importaciones
import { Router } from 'express'
import cartModel from '../dao/models/cart.model.js'


//Instanciando Router
const cartsRouterdb = Router()


//Postman
cartsRouterdb.post('/carts', async (req, res) => {
    try {
        const result = await cartModel.create({})
        res.send({ result: 'success', payload: result })
    } catch (error) {
        console.log(error)
    }
})

//Postman Metodo GET/:cid
cartsRouterdb.get('/carts/:cid', async (req, res) => {
    try {
        let {cid} = req.params
        if(!cid){
           res.send({ status: 'error', error: 'Es necesario el ID de carrito' })
        }
        let result = await cartModel.findById({_id: cid})
        res.send({ result: 'success', payload: result })
   } catch (error) {
       console.log(error)
   }
})

//Postman Metodo POST/:cid/product/:pid
cartsRouterdb.post('/carts/:cid/product/:pid', async (req, res) => {
    try {
        /* const {cid, pid} = req.params; */
        const cid = req.params.cid;
        const pid = req.params.pid;
        let cart = await cartModel.findById(cid)
        if(!cart){
            res.send({status: 'error', error: 'El carrito buscado no se encontró'})
        }
        const boughtProduct = cart.products.find(item => item.productId.toString() === pid);
        if(!boughtProduct){
            cart.products.push({productId:pid, quantity:1})
        }else{
            boughtProduct.quantity++
        }
        await cart.save();
        res.send({ status: 'success', message: 'Producto agregado/actualizado en el carrito' });
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: 'error', error: 'Error al agregar el producto al carrito' });
    }
})

export default cartsRouterdb;