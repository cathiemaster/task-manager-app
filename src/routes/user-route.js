const express = require("express");
const multer = require("multer")
const auth = require("../middleware/auth");
const sharp = require("sharp")
const User = require("../models/user");


const router = new express.Router();

router.post("/users", async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();

        res.status(201).send({ user, token });
    } catch (e) {
        console.log(e)
        res.status(400).send(e);
    }

    /* user.save().then(() => {
        res.status(200).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    }); */

    //res.send("testing");
});

router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken()

        res.send({
            user,
            token
        });
    } catch (e) {
        res.status(400).send();
    }
});

router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token;
        });

        await req.user.save();
        res.send("You have logged out")
    } catch (e) {
        res.status(500).send()
    }
});

router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send("You have logged out of all accounts")
    } catch (e) {
        res.status(500).send()
    }
});

router.get("/users", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.status(500).send();
    }

    /* User.find({}).then((users) => {
        res.send(users);
    }).catch((e) => {
        res.status(500).send();
    }); */
});

router.get("/users/me", auth, async (req, res) => {
    res.send(req.user);
});

/* router.get("/users/:id", async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send();
        }

        res.send(user);
    } catch (e) {
        res.status(500).send();
    }
}); */

/**
 * PATCH - used to make partial changes to an existing resource
 *      - The findByIdAndUpdate property bypasses mongoose's "save" function
 */
/* router.patch("/users/:id", async (req, res) => {
    const updateKeys = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];
    const isValidOp = updateKeys.every((update) => allowedUpdates.includes(update));

    if (!isValidOp) {
        return res.status(400).send({ "error": "Invalid updates!!" })
    }

    try {
        const user = await User.findById(req.params.id);
        updateKeys.forEach((key) => user[key] = req.body[key]);

        await user.save()
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!user) {
            return res.status(404).send();
        }

        res.send(user)
    } catch (e) {
        console.log(e)
        res.status(400).send();
    }
}); */

router.patch("/users/me", auth, async (req, res) => {
    const updateKeys = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];
    const isValidOp = updateKeys.every((update) => allowedUpdates.includes(update));

    if (!isValidOp) {
        return res.status(400).send({ "error": "Invalid updates!!" })
    }

    try {
        updateKeys.forEach((key) => req.user[key] = req.body[key]);
        await req.user.save();

        res.send(req.user)
    } catch (e) {
        console.log(e)
        res.status(400).send();
    }
});

/**
 * Allows admin to delete any user by ID
 */
/* router.delete("/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send()
        }

        res.send(user);
    } catch (e) {
        res.status(400).send();
    }
}); */

/**
 * Allows user to delete themselves 
 */
router.delete("/users/me", auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch (e) {
        res.status(400).send();
    }
});

const upload = multer({
    //dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg)|(jpeg)$/)) {
            return cb(new Error("Upload a JPG/JPEG"));
        }

        cb(undefined, true);

    }
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    // buffer is only accessible when "dest" field is not set
    //console.log(req.file.buffer)
    //req.user.avatar = req.file.buffer;

    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();

    res.status(200).send("Uploaded avatar pic!!")
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();

    res.status(200).send("Deleted avatar pic!!")
});

router.get("/users/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error("Unable to find user");
        }

        res.set("Content-Type", "image/png");
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send("Error");
    }
});

module.exports = router;