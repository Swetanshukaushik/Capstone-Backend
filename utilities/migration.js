const bcrypt = require("bcrypt");
const UserModel = require("../model/UserModel");
require("../utilities/connectWithDB");
async function UpdateModelUtil(model) {
    const allTheElements = await model.find();
    console.log(allTheElements)
    for (let i = 0; i < allTheElements.length; i++) {
        let entity = allTheElements[i];
        entity.password = await bcrypt.hash(entity.password, 10);
        delete entity.confirmPassword;
        await entity.save();
    }
}

UpdateModelUtil(UserModel).then(()=>{
    console.log("User Model update task is completed");
}).catch(console.log)


