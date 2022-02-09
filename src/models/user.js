const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = new mongoose.Schema(
    {
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
            unique: true,
            validate(val) {
                if (!validator.isEmail(val)) {
                    throw new Error("Not a valid email");
                }
            }
        },
        password: {
            type: String,
            //required: true,
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
        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }],
        avatar: {
            type: Buffer
        },
    }, {
    timestamps: true
}
);

/**
 *  virtual -> allows for virtual attributes connecting databases 
 */
userSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "user"
});

/**
 *      - Static functions are on the entire schema model 
 *      - Method functions are on individual instances of that model/class
 *      - As long as the token is valid, the user stays logged in 
 *          - Fix: track the tokens for a user, so they can log in from different devices and invalidating one token does not log them out of every device
 */

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email: email });
    if (!user) {
        throw new Error("User Does Not Exist");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Unable to Login");
    }

    return user;
}

/**
 *  When an obj is sent in the Response, Express internally calls "JSON.toStringify". The .toJSON function can be defined to modify the obj sent in the response. Just need to return an object.
 */
userSchema.methods.toJSON = function () {
    const userObj = this.toObject();
    delete userObj.password;
    delete userObj.tokens;
    delete userObj.avatar;

    return userObj;
}

/**
 *      - Need to use named "function" because arrow functions don't offer a binding for "this" keyword
 */

userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, "thisismynewcourse");
    this.tokens = this.tokens.concat({ token });
    await this.save();

    return token;
}

/**
 * Middleware to has the plaintext password 
 */
userSchema.pre("save", async function (next) {
    console.log("saving...")

    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8);
    }

    /**
     *  Need the next() function call so the .pre processes stops execution
     */
    next()
});

/**
 * Middleware to delete user tasks when user is removed 
 */
userSchema.pre("remove", async function (next) {
    await Task.deleteMany({ user: this._id });
    next()
})

const User = mongoose.model("User", userSchema);

module.exports = User;