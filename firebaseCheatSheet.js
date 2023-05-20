
// gets the value of BackendVarName and saves it to NewVar
db.ref("BackendVarName").once("value").then((snapshot) => {
    var NewVar = snapshot.val()
    console.log(NewVar)
})


// sets BackendVarName to NewVar
db.ref(BackendVarName).set(NewVar)


// sets NewVar to the value of BackendVarName everytime it changes
db.ref(BackendVarName).on("value", (snapshot) => {
    var NewVar = snapshot.val()
})