import { Router } from "express";
import ProductManager from "../dao/ProductManager.js"

const productsRouter = Router();
const productManager = new ProductManager();


productsRouter.get("/", async (req, res) => {
    const products = await productManager.getProducts(req.query);

    res.send ({products});
});

productsRouter.get("/:pid", async (req, res) => {
    let pid = req.params.pid;
    const products = await productManager.getProductById(pid);
  
    res.send({products});
});

productsRouter.post ("/", async (req, res) => {
    let {title, description, code, price, status, stock, category, thumbnail } = req.body;

    if(!title){
        res.status(400).send({status:"error", message: "Error! No se cargo el campo Title"})
        return false;
    }

    if(!description){
        res.status(400).send({status:"error", message: "Error! No se cargo el campo Description"})
        return false;
    }

    if(!code){
        res.status(400).send({status:"error", message: "Error! No se cargo el campo Code"})
        return false;
    }

    if(!price){
        res.status(400).send({status:"error", message: "Error! No se cargo el campo Price"})
        return false;
    }

    
    status = !status && true;  
    

    if(!stock){
        res.status(400).send({status:"error", message: "Error! No se cargo el campo Stock"})
        return false;
    }
    
    if(!category){
        res.status(400).send({status:"error", message: "Error! No se cargo el campo Category"})
        return false;
    }

    if(!thumbnail){
        res.status(400).send({status:"error", message: "Error! No se cargo el campo Thumbnails"});
        return false;
    }else if ((!Array.isArray(thumbnail)) || (thumbnail.length == 0)){
        res.status(400).send({status:"error", message: "Error debe ingresar al menos una imagen"})
        return false;
    }

    const result = await productManager.addProduct({title, description, code, price, status, stock, category, thumbnail});

    if (result) {
        res.send({status:"ok", message:"El Producto se agregó correctamente!"});
    } else {
        res.status(500).send({status:"error", message:"Error! No se pudo agregar el Producto!"});
    }
        
});

productsRouter.put ("/:pid", async (req, res) => {
    let pid = req.params.pid;
    let {title, description, code, price, status, stock, category, thumbnail } = req.body;

    if(!title){
        res.status(400).send({status:"error", message: "Error! No se cargo el campo Title"})
        return false;
    }

    if(!description){
        res.status(400).send({status:"error", message: "Error! No se cargo el campo Description"})
        return false;
    }

    if(!code){
        res.status(400).send({status:"error", message: "Error! No se cargo el campo Code"})
        return false;
    }

    if(!price){
        res.status(400).send({status:"error", message: "Error! No se cargo el campo Price"})
        return false;
    }

    status = !status && true; 
    
    if(!stock){
        res.status(400).send({status:"error", message: "Error! No se cargo el campo Stock"})
        return false;
    }
    
    if(!category){
        res.status(400).send({status:"error", message: "Error! No se cargo el campo Category"})
        return false;
    }

    if(!thumbnail){
        res.status(400).send({status:"error", message: "Error! No se cargo el campo Thumbnails"})
        return false;
    }else if ((!Array.isArray(thumbnail)) || (thumbnail.length == 0)){
        res.status(400).send({status:"error", message: "Error debe ingresar al menos una imagen"})
        return false;
    }

    const result = await productManager.updateProduct(pid, {title, description, code, price, status, stock, category, thumbnail});

    if (result) {
        res.send({status:"ok", message:"El Producto se actualizó correctamente!"});
    } else {
        res.status(500).send({status:"error", message:"Error! No se pudo actualizar el Producto!"});
    }
        
});

productsRouter.delete ("/:pid", async (req, res) => {
    let pid = req.params.pid;
    const result = await productManager.deleteProduct(pid)

    if (result) {
        res.send({status:"ok", message: "Producto eliminado correctamente"});
    } else {
        res.status(500).send({status:"error", message: "Error! No existe el producto que se quiere eliminar"});
    }

});


export default productsRouter;