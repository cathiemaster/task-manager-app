// const express = require("express");
//const bcrypt = require("bcryptjs")
//const jwt = require("jsonwebtoken");
// require("./db/mongoose");
// const userRoute = require("./routes/user-route");
// const taskRoute = require("./routes/task-route");

const app = require("./app");

// const app = express();
// app.use(express.json());

/**
 *  Middleware: 
 *      - without middleware: new request --> run route handler 
 *      - with middleware: new request --> do something --> run route handler
 */
/* app.use((req, res, next) => {
    //console.log(req.method, req.path);

    if (req.method == "GET") {
        res.send("GET Requests are disabled");
    } else {
        next();
    }
});*/

/* app.use((req, res, next) => {
    res.status(503).send("Requests under maintenence");
})*/

// app.use(userRoute);
// app.use(taskRoute);

const port = process.env.PORT | 3000;

app.listen(port, () => {
    console.log("Server is running on port ", port);
});

/**
 *      - 8 passes through hash algorithm is a good difference between speed/security
 *      - encryption algorithms are two-way, hashing algorithms are one-way
 */
/* const testFunc = async () => {
    const pwd = "ABCdef12"
    const hashedPwd = await bcrypt.hash(pwd, 8);

    //const isMatch = await bcrypt.compare(pwd, hashedPwd)

    console.log(`${pwd} ${hashedPwd}`);
}

testFunc()*/

/**
 *  JSON Web Tokens
 *      - Uses a value and a key to sign the value with that key (like RSA)
 *      - Returned token contains:
 *          {header (metadata, algorithm).payload.signature}
 *      - Verification: Returns the original payload if verified, else throws error
 *      - Set "expired" field
 */

/* const testFunc = async () => {
    const token = jwt.sign({ _id: "123456" }, "thisismynewcourse", { expiresIn: "10 days" })
    const payload = jwt.verify(token, "thisismynewcourse");
    //console.log(`${token}\n${payload}`)
}

testFunc(); */

/* const pet = {
    name: "Hal"
}

console.log(JSON.stringify(pet)) */

/**
 * Connecting two databases using references and virtual properties
 */

/* const Task = require("./models/task");
const User = require("./models/user")

const main = async () => {
    //const task = await Task.findById("61e723c5302433b39eae6684");
    //await task.populate("user").execPopulate();
    //console.log(task.user);

    const user = await User.findById("61e717e1774a06b25e033b11");
    await user.populate("tasks").execPopulate();
    console.log(user.tasks);
}

main() */

/**
 *      Using Multer library
 *      - Library used for uploading images through express
 *      - Contains middleware for HTTP requests like upload.single() to upload singular images
 */

/* const multer = require("multer");
const upload = multer({
    //dest: "images",
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(doc)|(docx)$/)) {
            return cb(new Error("Upload a PDF"));
        }

        cb(undefined, true);

        //cb(new Error("File must be a PDF"))
        //cb(undefined, true)
        //cb(undefine, false) --> don't use this
    }
});

const errorMiddleware = (req, res, next) => {
    throw new Error("From errorMiddleware");
}

app.post("/upload", upload.single("upload"), async (req, res) => {
    // buffer is only accessible when "dest" field is not set
    req.user.avatar = req.file.buffer;
    await req.user.save();

    res.send("Uploaded file!")
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
}); */

//app.post("/upload", errorMiddleware, (req, res) => {
//    res.send("Uploaded file!")
//}, (error, req, res, next) => {
//    res.status(400).send({ error: error.message });
//});