const express=require("express");
const fs=require("fs");
const app=express();
const port=1000;
const users=require("./MOCK_DATA (1).json")

app.use(express.urlencoded({extended:false}));

app.get("/users", (req, res) => {
    const html = `
    <ul>
        ${users.map(user => (`<li>${user.first_name}</li>`)).join('')}
    </ul>`;
    res.send(html);
});

app
    .route("/api/users")
    .get((req,res)=>{
        return res.json(users)})
    .post((req,res)=>{
        const body=req.body
        users.push({...body,id:users.length + 1});
        fs.writeFile("./MOCK_DATA (1).json",JSON.stringify(users), (err,data)=>{
            return res.json({status:"Success", id:users.length})
        })
    })

app
    .route("/api/users/:id")
    .get((req,res) => {
        const id=Number(req.params.id)
        const user=users.find(user => user.id===id)
        return res.json(user)})
    .patch((req, res) => {
        const id = Number(req.params.id);
        const user = users.find(user => user.id === id);
        Object.assign(user, req.body); 
        fs.writeFile("./MOCK_DATA (1).json", JSON.stringify(users), (err) => {
            if (err) {
                return res.status(500).json({ status: "Error", message: "Could not update user" });
            }
            return res.json({ status: "Success", id: id });
            });
        })
    .delete((req,res)=>{
        const id = Number(req.params.id);
        const user = users.find(user => user.id === id);
        users.pop({user,id:users.length - 1});
        fs.writeFile("./MOCK_DATA (1).json",JSON.stringify(users), (err,data)=>{
            return res.json({status:"Success", id:users.length})
        })
    })

app.get("/api/users/gender/:gender", (req, res) => {
    const gender = req.params.gender;
    const filteredUsers = users.filter(user => user.gender.toLowerCase() === gender.toLowerCase());
    return res.json(filteredUsers);
});


app.listen(port,()=>console.log(`Server started at port ${port}`));