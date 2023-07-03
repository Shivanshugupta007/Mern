const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticate = require('./../middleware/authenticate');
const cookieParser = require("cookie-parser");
router.use(cookieParser());

require('../db/conn');
const User = require('../model/userSchema');

router.post("/register", async (req, res) => {

    const { name, email, phone, work, password, cpassword } = req.body;

    if (!name || !email || !phone || !work || !password || !cpassword || password != cpassword) {
        return res.status(422).json({ error: "Enter All Required Fields" });
    }

    try {

        const userExists = await User.findOne({ email: email })

        if (userExists) {
            return res.status(422).json({ error: "Email Already Registered" });
        } else if (password != cpassword) {
            return res.status(422).json({ error: "Password Don't Match" });
        } else {

            const user = User({ name, email, phone, work, password, cpassword });

            await user.save();

            res.status(201).json({ message: "User Registered Successfull" });

        }
    } catch (err) {
        console.log(err);
        res.send("Error in Step 1st");
    }

});

router.post("/signin", async (req, res) => {

    try {
        let token;
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: "Enter All Fields" });
        }
        else {
            const userLogin = await User.findOne({ email: email });

            if (userLogin) {

                const isMatch = await bcrypt.compare(password, userLogin.password);

                if (!isMatch) {
                    res.status(400).json({ error: "Invalid Details" });
                } else {
                    token = await userLogin.generateAuthToken();

                    res.cookie("jwtoken", token, {
                        expires: new Date(Date.now() + 25892000000),
                        httpOnly: true
                    });
                    res.json({ message: "Signin Successfull" });
                }
            } else {
                res.status(400).json({ error: "Invalid Details" });
            }
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Invalid" });
    }

});

router.get("/getdata", authenticate, (req, res) => {

    res.send(req.rootUser);
});

router.post("/contact", authenticate, async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        if (!name || !email || !phone || !message) {
            console.log("Error in Inserting");
            return json({ error: "Please Fill All Fields" });
        }

        const userContact = await User.findOne({ _id: req.userID });

        if (userContact) {

            const userMessage = await userContact.addMessage(name, email, phone, message);

            res.status(201).json({ message: "Feedback Added" });
        }

    } catch (err) {
        console.log(err);
    }
});

router.post("/views", authenticate, async (req, res) => {
    try {
        const view = req.body.views;

        if (!view) {
            return json({ error: "Please Fill All Fields" });
        }

        const userPost = await User.findOne({ _id: req.userID });

        if (userPost) {

            const userView = await userPost.addView(view);

            res.status(201).json({ message: "Post Added" });
        }

    } catch (err) {
        console.log(err);
    }
});

router.get("/logout", (req, res) => {
    res.clearCookie('jwtoken', { path: '/' });
    res.status(200).send('User Logout');
});

module.exports = router;
