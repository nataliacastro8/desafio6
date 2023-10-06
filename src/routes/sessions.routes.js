import express from "express";
import UserManager from "../dao/UserManager.js";
import passport from "passport";


const router = express.Router();
const UM = new UserManager();

router.get("/login", async (req, res) => {
    console.log(`req.query: ${JSON.stringify(req.query)}`);
    let { user, pass } = req.query;
    const userLogged = await UM.login(user, pass, req);
    console.log(user, pass);
    if (userLogged) {
        res.send({ status: "OK", message: userLogged });
    } else {
        res.status(401).send({ status: "Error", message: "No se pudo loguear el Usuario!" });
    }
});

router.post("/register", passport.authenticate("register", {failureRedirect:"/failregister"}), async (req, res) => {
    const userRegistered = await UM.addUser(req.body);

    if (userRegistered) {
        res.send({ status: "OK", message: userRegistered });
    } else {
        res.status(401).send({ status: "Error", message: "No se pudo registrar el Usuario!" });
    }
});

router.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/profile');
        }
        setTimeout(() => {
            res.redirect('/login');
        }, 1500);
    });
});

router.get("/github", passport.authenticate("github", {scope:["user:email"]}), async (req, res) => {});

router.get("/githubcallback", passport.authenticate("github", {failureRedirect:"/login"}), async (req, res) => {
    req.session.user = req.user;
    req.session.loggedIn = true;
    res.redirect("/products");
});

export default router;