import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productSchema = new mongoose.Schema({
    title:String,
    description:String,
    code:String,
    price:Number,
    status:Boolean,
    stock:Number,
    category:String,
    thumbnail:Array
});

productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model("products", productSchema);