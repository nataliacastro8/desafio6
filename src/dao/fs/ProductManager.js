import fs from "fs";

class ProductManager {
  constructor() {
    this.products = []; 
    this.path= "Products.json";
    this.createFile();
  }

  createFile(){
    if(!fs.existsSync(this.path)){
        fs.writeFileSync(this.path, JSON.stringify(this.products));
    }
  }

  addProduct(product) {
    if (this.validateCode(product.code)) {
      console.log("El code del producto ya existe");

      return false;
    } else {
      const producto = {id:this.generateId(), title:product.title, description:product.description, code:product.code, price:product.price, status:product.status, stock:product.stock, category:product.category, thumbnail:product.thumbnail };
      this.products = JSON.parse(fs.readFileSync(this.path, "utf-8"));
      this.products.push(producto);
      fs.writeFileSync(this.path, JSON.stringify(this.products));
      console.log("Producto agregado!")

      return true;
    }
  }


  updateProduct(id, product){
    this.products = JSON.parse(fs.readFileSync(this.path, "utf-8"));
    let pos = this.products.findIndex(item => item.id === id);

    if (pos > -1){
        this.products[pos].title = product.title;
        this.products[pos].description = product.description;
        this.products[pos].code = product.code;
        this.products[pos].price = product.price;
        this.products[pos].status = product.status;
        this.products[pos].stock = product.stock;
        this.products[pos].category = product.category;
        this.products[pos].thumbnail = product.thumbnail;
        
        fs.writeFileSync(this.path, JSON.stringify(this.products));
        console.log("Update Product")

        return true;
    } else{
        console.log("Not found")

        return false;
    }
  }

  deleteProduct(id){
    this.products = JSON.parse(fs.readFileSync(this.path, "utf-8"));
    let pos = this.products.findIndex(item => item.id === id);

    if (pos > -1){
        this.products.splice(pos, 1); (0,1)
        fs.writeFileSync(this.path, JSON.stringify(this.products));
        console.log("Producto N* " + id + " eliminado!")

        return true;
    } else{
        console.log("Not found")

        return false;
    }
  }

  getProducts() {
    let products = JSON.parse(fs.readFileSync(this.path, "utf-8"));

    return products;
}

  getProductById(id) {    
    this.products = JSON.parse(fs.readFileSync(this.path, "utf-8"));

    return this.products.find(item => item.id === id) || "Not Found";
  }

  validateCode (code) {
    return this.products.some(item => item.code === code); 
  }

  generateId() {
    let max = 0;
    let products = this.getProducts();

    products.forEach(item => {
      if (item.id > max){
        max = item.id;
      }

    });

    return max+1;
  }
}

export default ProductManager;

