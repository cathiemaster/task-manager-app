const mongoose = require("mongoose");
const validator = require("validator");

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});

/**
 * Validation:
 *  - required key word 
 *  - validate() function 
 *  - npm validator package
 */

/*  const User = mongoose.model("User", {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error("Not a valid email");
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(val) {
            if (val.toLowerCase().includes("password")) {
                throw new Error("Not valid password");
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(val) {
            if (val < 0) {
                throw new Error("Age must be positive number");
            }
        }
    }
});

const user = new User({
    name: "Catherine   ",
    email: "cmaster@umd.edu",
    password: "1234567"
    //age: 24
});

user.save().then((user) => {
    console.log("saved");
}).catch((err) => {
    console.log("Error!!", err);
});

/*const Task = mongoose.model("Task", {
    description: {
        type: String,
        required: true,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    }
});

const task = new Task({
    description: "wash dishes",
    completed: false
});

task.save().then((task) => {
    console.log("saved");
}).catch((err) => {
    console.log("Error!!", err);
});*/