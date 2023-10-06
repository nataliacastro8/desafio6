import { cartModel } from "./models/cart.model.js"

class CartManager {
    async newCart () {
      console.log ("Cart creada!");

      return await cartModel.create ({products:[]});;
    }

    async getCart(id) {    
        try {
            return await cartModel.findOne({_id:id}) || null;
        } catch(error) {
            console.log("Not found!");

            return null;
        }
    }

    async getCarts() {    
        return await cartModel.find().lean();
    }

    async addProduct(cid, pid) {
        try {
            if (await cartModel.exists({_id:cid, products:{$elemMatch:{product:pid}}})) {
                await cartModel.updateOne({_id:cid, products:{$elemMatch:{product:pid}}}, {$inc:{"products.$.quantity":1}}, {new:true, upsert:true});
            } else {
                await cartModel.updateOne({_id:cid}, {$push:{products:{"product":pid, "quantity":1}}}, {new:true, upsert:true});
            }

            console.log("Producto agregado!");

            return true;
        } catch (error) {
            console.log("Not found!");
                
            return false;
        }
    }

    async updateProducts(cid, products) {
        try {
            await cartModel.updateOne({_id:cid}, {products:products}, {new:true, upsert:true});
            console.log("Producto actualizado!");

            return true;
        } catch (error) {
            console.log("Not found!");
            
            return false;
        }
    }

    async updateQuantity(cid, pid, quantity) {
        try {
            await cartModel.updateOne({_id:cid, products:{$elemMatch:{product:pid}}}, {$set:{"products.$.quantity":quantity}});
            console.log("Producto actualizado!");

            return true;
        } catch (error) {
            console.log("Not found!");
            
            return false;
        }
    }

    async deleteProduct(cid, pid) {
        try {
            await cartModel.updateOne({_id:cid}, {$pull:{products:{product:pid}}});
            console.log("Producto eliminado!");

            return true;
        } catch (error) {
            console.log("Not found!");
                
            return false;
        }
        }

    async deleteProducts(cid) {
        try {
            await cartModel.updateOne({_id:cid}, {products:[]});
            console.log("Producto eliminado!");

            return true;
        } catch (error) {
        console.log("Not found!");
                
        return false;
        }
    }
}

export default CartManager;

