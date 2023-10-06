import { productModel } from "./models/product.model.js";

class ProductManager {
  async addProduct(product) {
    try{
      if (await this.validateCode(product.code)) {
        console.log ("Error, el codigo existe");

        return false;
      } else {
        await productModel.create(product)
        console.log ("Producto agregado");

        return true;
      }
    } catch (error) {
      return false;
    }
  }

  async updateProduct(id, product){
    try {
      if (this.validateId(id)) {
        if(await this.getProductById(id)) {
          await productModel.updateOne({_id:id}, product);
          console.log("Producto actualizado");

          return true;
        }
      }
      return false;
    } catch (error) {
      console.log("Not found")

      return false;
    }
  }

  async deleteProduct(id){
    try {
      if (this.validateId(id)) {
        if (await this.getProductById(id)) {
          await productModel.deleteOne({_id:id});
          console.log("Producto eliminado!");

          return true;
        }
      }

      return false;
    } catch (error) {
      console.log("Not found!");

      return false;
    }
  }
  
  async getProducts(params) {
    if (params) {
      let { limit, page, query, sort } = params
      limit = limit ? limit : 9;
      page = page ? page : 1;
      sort = sort ? (sort == "asc" ? 1 : -1) : 0;
      query = query || {};

      let queryFilter = {};
      if (query && typeof query === 'string') {
          queryFilter.category = query.replace('category:', '');
      }

      let products = await productModel.paginate(query, {limit:limit, page:page, sort:{price:sort}});
      let status = products ? "success" : "error";

      let prevLink = products.hasPrevPage ? "http://localhost:8080/products?limit=" + limit + "&page=" + products.prevPage : null;
      let nextLink = products.hasNextPage ? "http://localhost:8080/products?limit=" + limit + "&page=" + products.nextPage : null;
      
      products = {status:status, payload:products.docs, totalPages:products.totalPages, prevPage:products.prevPage, nextPage:products.nextPage, page:products.page, hasPrevPage:products.hasPrevPage, hasNextPage:products.hasNextPage, prevLink:prevLink, nextLink:nextLink};

      return products;

    } else {
      if (params) {
          return productModel.find().limit(limit).lean()
      } else {
          return productModel.find().lean();
      }
    }
    
  }

  async getProductById(id) {    
      if(this.validateId(id)){
        return await productModel.findOne({_id:id}).lean() || null;
      } else {
        console.log("Not Found!");

        return null;
      }
  }

  validateId(id) {
    return id.length === 24 ? true : false;
  }

  async validateCode(code) {
    const product = await productModel.findOne({ code: code });
    if (product) {
        return product;
    } else {
        return false;
    }
}
}
 
export default ProductManager;