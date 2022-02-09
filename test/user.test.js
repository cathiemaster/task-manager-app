const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/models/user");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: "Randy",
    email: "randy1@gmail.com",
    password: "randy123",
    tokens: [{
        token: jwt.sign({ _id: userOneId }, "thisismynewcourse")
    }]
};

beforeEach(async () => {
    await User.deleteMany();
    await new User(userOne).save();
});

afterEach(() => {

})

test("test", () => {
    //console.log("yay");
})

test("test-new-user-signup", async () => {
    const response = await request(app).post("/users").send(
        {
            name: "Catherine",
            email: "catherine11@gmail.com",
            password: "1234567"
        }
    ).expect(201);

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Assertions about the response 
    expect(response.body).toMatchObject({
        user: {
            name: 'Catherine',
            email: 'catherine11@gmail.com'
        },
        token: user.tokens[0].token
    });
});

test("test-login-existing-user", async () => {
    const response = await request(app).post("/users/login").send(
        {
            email: userOne.email,
            password: userOne.password
        }
    ).expect(200);

    // Check the existing user's login token
    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token);
});

test("test-login-nonexisting-user", async () => {
    await request(app).post("/users/login").send(
        {
            email: userOne.email,
            password: userOne.password + "456"
        }
    ).expect(400);
});

test("test-get-user-profile", async () => {
    await request(app)
        .get("/users/me")
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test("test-get-unauthenticated-user-profile", async () => {
    await request(app)
        .get("/users/me")
        .send()
        .expect(401)
});

test("test-delete-user-account", async () => {
    await request(app)
        .delete("/users/me")
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    // Assert user was removed
    const user = await User.findById(userOneId);
    expect(user).toBeNull();
});

test("test-delete-unauthenticated-user-account", async () => {
    await request(app)
        .delete("/users/me")
        .send()
        .expect(401)
});

test("test-upload-avatar-img", async () => {
    await request(app)
        .post("/users/me/avatar")
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'test/fixtures/profile-pic.jpg')
        .expect(200);

    // Use the .toEqual() comparator for checking equality between objects b/c .toBe() comparator does not check references 
    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test("test-update-valid-user-fields", async () => {
    await request(app)
        .patch("/users/me")
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: "Jess"
        })
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user.name).toBe("Jess");
});

test("test-update-invalid-user-fields", async () => {
    await request(app)
        .patch("/users/me")
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: "New Jersey"
        })
        .expect(400);
});