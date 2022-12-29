
const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5001


app.use(cors())
app.use(express.json())

console.log(process.env.DB_USER, process.env.DB_PASS)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3jlrk4o.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const tasksCollection = client.db("todo-app").collection("tasks")

       
        
        app.post("/task", async (req, res) => {
            const task = req.body
            console.log(task)
            const date = Date()
            const result = await tasksCollection.insertOne({ ...task, date: date })
            // console.log(result)
            res.send(result)
        })
        
        app.get('/completeTask/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email)
            console.log("ami")
            const query = { UserEmail: email ,completed:true}
            const tasks = await tasksCollection.find(query).toArray()
            // console.log(tasks)
            res.send(tasks)
          })
        app.get('/task/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email)
            console.log("ami")
            const query = { UserEmail: email ,completed:false}
            const tasks = await tasksCollection.find(query).toArray()
            // console.log(tasks)
            res.send(tasks)
          })
        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const task = req.body;
            console.log(task)
            console.log(id)
            console.log("ami")
            const query ={_id:ObjectId(id)}
            const updateDoc={
                $set:{
                    title:task.title,
                    image:task.image,
                    des:task.des
                }
            }
            const result = await tasksCollection.updateOne(query,updateDoc)
            console.log(result,"K63ab397bcfeac7668da613ef")
            res.send(result)
          })


        app.put('/status/:id', async (req, res) => {
            const id = req.params.id;
            const filter={_id:ObjectId(id)}
            const task=await tasksCollection.findOne(filter)
            console.log(task)
          
          const complete= task.completed ? false : true
            console.log(id)
            console.log(complete)
            console.log("ami")
            const query ={_id:ObjectId(id)}
            const updateDoc={
                $set:{
                    completed:complete
                }
            }
            const result = await tasksCollection.updateOne(query,updateDoc)
            console.log(result)
            res.send(result)
          })


          
        app.put('/comment/:id', async (req, res) => {
            const id = req.params.id;
            const filter={_id:ObjectId(id)}
            const task=await tasksCollection.findOne(filter)
            console.log(task)
          //   const status=req.body.task
          //   console.log(status)

          //   console.log(status)
          const comment=req.body.comment
            console.log(id)
            // console.log(complete)
            console.log(task)
            console.log(task.comment)
            const query ={_id:ObjectId(id)}
            const updateDoc={
                $set:{
                 
                    comment:[...task.comment,comment]
                }
            }
            const result = await tasksCollection.updateOne(query,updateDoc)
            console.log(result)
            res.send(result)
          })
        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            // const task = req.body;
            // console.log(task)
            console.log(id)
            console.log("ami")
            const query ={_id:ObjectId(id)}
            
            const result = await tasksCollection.deleteOne(query)
            console.log(result)
            res.send(result)
          })
    }
    finally {

    }
}

run().catch(er => console.error(er))


app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})