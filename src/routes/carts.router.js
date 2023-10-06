import { Router } from "express";
import CartManager from "../dao/CartManager.js"

const cartsRouter = Router();
const cartManager = new CartManager();

cartsRouter.post ("/", async (req, res) => {
    const cart = await cartManager.newCart();

    if(cart){
        res.send({status:"ok", message: "Carrito creado correctamente", id:cart._id});
    } else {
        res.status(500).send({status:"error", message: "Error! No se creo el carrito"});
    }
});

cartsRouter.get("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const cart = await cartManager.getCart(cid);

    if (cart){
        res.send({products:cart.products});
    }else{
        res.status(400).send({status:"error", message: "Error! No se encontro el ID del carrito"});
    }
});

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const result = await cartManager.addProduct(cid, pid);

    if(result) {
        res.send({status:"ok", message: "El producto se agrego correctamente"});
       } else {
        res.status(400).send({status:"error", message: "Error! No se agrego el producto al carrito"});
       }
});

cartsRouter.put("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const products = req.body.products;
    const result = await cartManager.updateProducts(cid, products);

    if (result) {
        res.send({status:"ok", message:"Producto agregado!"});
    } else {
        res.status(400).send({status:"error", message:"Error! No se agrego el producto al carrito!"});
    }
});

cartsRouter.put("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;
    const result = await cartManager.updateQuantity(cid, pid, quantity);

    if (result) {
        res.send({status:"ok", message:"Producto actualizado!"});
    } else {
        res.status(400).send({status:"error", message:"Error! No se actualizo el producto del carrito!"});
    }
});

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const result = await cartManager.deleteProduct(cid, pid);

    if (result) {
        res.send({status:"ok", message:"Producto eliminado!"});
    } else {
        res.status(400).send({status:"error", message:"Error! No se elimino el producto del carrito!"});
    }
});

cartsRouter.delete("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const result = await cartManager.deleteProducts(cid);

    if (result) {
        res.send({status:"ok", message:"Carrito vacio!"});
    } else {
        res.status(400).send({status:"error", message:"Error! No se pudo vaciar el Carrito!"});
    }
});
export default cartsRouter;