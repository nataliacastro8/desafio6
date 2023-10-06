import express from "express";
import ProductManager from "../dao/ProductManager.js"
import CartManager from "../dao/CartManager.js";

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

const checkSession = (req, res, next) => {
    if (req.session && req.session.user) {
        console.log("Inicio de sesion");
        next();
    } else {
        res.redirect("/login");
    }
};

const checkAuth = (req, res, next) => {
console.log(req.session.user);

    if (req.session && req.session.user) {
        console.log("Usuario verificado, redirigiendo a /profile");
        res.redirect("/products");
    } else {
        next();
    }
};

router.get("/", checkSession, async (req, res) => {
    const products = await productManager.getProducts();
    res.render("home", { products });
});

router.get("/products", checkSession, async (req, res) => {
    const products = await productManager.getProducts(req.query);
    const user = req.session.user;
    res.render("products", { products, user });
});

router.get("/products/:pid", checkSession, async (req, res) => {
    const pid = req.params.pid;
    const product = await productManager.getProductById(pid);

    res.render("product", { product });
});

router.get("/realtimeproducts", checkSession, (req, res) => {
    res.render("realtimeProducts");
});

router.get("/chat", checkSession, (req, res) => {
    res.render("chat");
});

router.get("/carts", checkSession, async (req, res) => {
    const carts = await cartManager.getCarts();
    res.render("carts", { carts });
});

router.get("/cart/:cid", checkSession, async (req, res) => {
    const cid = req.params.cid;
    const cart = await cartManager.getCart(cid);

    if (cart) {
        res.render("cart", { products: cart.products });
    } else {
        res.status(400).send({ status: "error", message: "Error! No se encuentra el ID de Carrito!" });
    }
});

router.get("/login", checkAuth, async (req, res) => {
    await res.render("login");
});

router.get("/register", checkAuth, async (req, res) => {
    await res.render("register");
});

router.get("/profile", checkSession, async (req, res) => {
    const userData = await req.session.user;
    res.render("profile", { user: userData });
});



export default router;