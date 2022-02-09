/**
 * C(reate)
 * R(ead)
 * U(pdate)
 * D(elete)
 */

/* const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient; */
const { MongoClient, ObjectId } = require("mongodb");

const url = "mongodb://127.0.0.1:123456";
const dbName = "task-manager";

/*s
const id = new ObjectId()
console.log(id);
*/

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log("Unable to connect");
    }

    /* console.log("whee!!"); */

    const db = client.db(dbName); /* creates new db instance */

    /**
     * CREATE
     */

    /**
     * Insert one user
    db.collection("users").insertOne({
        _id: id,
        name: "John",
        age: 24
    }, (err, res) => {
        if (err) {
            return console.log("Unable to add user");
        }

        console.log(res.insertedId); //v4 does not have res.ops field :( 
    });
     * 
    */


    /**
     * Insert many users
     * 
     *  db.collection("users").insertMany([{
        name: "Jen",
        age: 45
    }, {
        name: "Phoebe",
        age: 22
    }], (err, res) => {
        if (err) {
            return console.log("Unable to add user");
        }
        console.log(res.insertedCount);
    });
    */

    /* db.collection("tasks").insertMany([{
        description: "cook",
        completed: true
    }, {
        description: "clean",
        completed: true
    }, {
        description: "sleep",
        completed: false
    }], (err, res) => {
        if (err) {
            console.log("Unable to create tasks")
        }

        console.log(res.insertedCount);
    }); */

    /**
     * READ
     */

    db.collection("users").findOne({ /*name: "Catherine", age: 13*/ _id: new ObjectId("61da53af1119988a6f3774d7") }, (err, user) => {
        if (err || (user == null)) {
            return console.log("Unable to find user");
        }

        console.log(user);
    });

    /**
     * .find() returns a Cursor object (pointer to that db document)...it has many functions like toArray and count
     */
    db.collection("users").find({ age: 24 }).toArray((err, users) => {
        console.log(users);
    });

    db.collection("users").find({ age: 24 }).count((err, count) => {
        console.log(count);
    });

    /**
     * UPDATE
     *  - Update operators: $set, $rename
     */

    db.collection("users").updateOne({
        _id: new ObjectId("61da53af1119988a6f3774d7")
    }, {
        $set: {
            name: "Jonathan"
        }
    }).then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log("oh no");
    })


    /**
     * DELETE
     */
    db.collection("users").deleteMany({ age: 27 }).then((res) => {
        console.log("deleted!!");
    }).catch((err) => {
        console.log(err);
    })
});