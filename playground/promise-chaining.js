require("../src/db/mongoose");
const User = require("../src/models/user");
const Task = require("../src/models/task")

//61de258884eaca5cf506304f

/*User.findByIdAndUpdate("61de258884eaca5cf506304f", { age: 25 }).then((user) => {
    console.log(user);
    return User.countDocuments({ age: 25 })
}).then((res) => {
    console.log(res);
}).catch((e) => {
    console.log(e);
})*/

/* const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age: age });
    const count = await User.countDocuments({ age: age });
    return count;
}

updateAgeAndCount("61de258884eaca5cf506304f", 2).then((count) => {
    console.log("count: ", count)
}).catch((e) => {
    console.log(e)
}) */


const deleteTaskAndCount = async (id) => {
    await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({ completed: false });
    return count;
}

deleteTaskAndCount("61de0336428edb576c076621").then((count) => {
    console.log("count: ", count)
}).catch((e) => {
    console.log(e)
})
