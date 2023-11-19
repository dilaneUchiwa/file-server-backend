require('dotenv').config();
const express=require('express');;
const discoveryRouter=require('./presentation/routes/discovery_router');
const readRouter=require('./presentation/routes/read_router');
const path = require('path');
const cors=require('cors');

const app=express();


app.use(express.json());
app.use(cors())
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'../public/index.html'));
})
app.use('/discovery',discoveryRouter);
app.use('/read',readRouter);


app.listen(process.env.PORT,()=>console.log(`server is listening on port ${process.env.PORT}`));