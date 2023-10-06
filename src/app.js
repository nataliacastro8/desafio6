import express from "express";
import __dirname from "./utils.js";
import expressHandlebars from "express-handlebars";
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access'
import {Server} from "socket.io";
import mongoose from "mongoose";
import ProductManager from "./dao/ProductManager.js"
import ChatManager from "./dao/ChatManager.js"
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import sessionsRouter from "./routes/sessions.routes.js";
import viewsRouter from "./routes/views.routers.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.config.js";

const app = express();
const PORT = 8080;
app.use(cookieParser());
app.use(session({
  store:MongoStore.create({
      mongoUrl:"mongodb+srv://nbcastro8:Nati123@nataliacastro.kowfojh.mongodb.net/ecommerce?retryWrites=true&w=majority",
      mongoOptions:{useNewUrlParser:true, useUnifiedTopology:true},
      ttl:10000
  }),
  secret:"S3cr3t0",
  resave:false,
  saveUninitialized:false
}));
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

const httpServer = app.listen(PORT, () => {
  console.log("Servidor Activo en el puerto: " + PORT);
});

const socketServer = new Server(httpServer);
const productManager = new ProductManager();
const chatManager = new ChatManager();

app.set("views", __dirname + "/views");
app.engine('handlebars', expressHandlebars.engine({
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set("view engine", "handlebars");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use("/img", express.static(__dirname + "/public/img"))
app.use("/api/products/", productsRouter);
app.use("/api/carts/", cartsRouter);
app.use("/api/sessions/", sessionsRouter);
app.use("/", viewsRouter);

mongoose.connect("mongodb+srv://nbcastro8:Nati123@nataliacastro.kowfojh.mongodb.net/ecommerce?retryWrites=true&w=majority");

socketServer.on("connection", async (socket) => {
  console.log("Nueva conexion");

  const products = await productManager.getProducts();
  socket.emit("realTimeProducts", products);

  socket.on("nuevoProducto", async(data) => {
    const product = {title:data.title, description:"", code:"", price:data.price, status:"", stock:10, category:"", thumbnail:data.thumbnail}
    await productManager.addProduct(product);
    const products = await productManager.getProducts();
    socket.emit("realTimeProducts", products);
  });

  socket.on("eliminarProducto", async (data) => {
    await productManager.deleteProduct(parseInt(data));
    const products = await productManager.getProducts();
    socket.emit("realTimeProducts", products);
  });

  socket.on("newMessage", async (data) => {
    chatManager.createMessage(data);
    const messages = await chatManager.getMessages();
    socket.emit("messages", messages);
  });
});