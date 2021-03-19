const express = require('express')
const mongoose = require('mongoose')
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './config/dev.env') })
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser')
const { requireAuth, checkUser } = require('./middleware/authMiddleware')
const hbs = require('hbs')

const app = express()

app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

app.set('view engine' , 'hbs')
hbs.registerPartials(__dirname+'/views/partials')



const port = process.env.PORT
mongoose.connect(process.env.DB_URI,{
    useCreateIndex:true,
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then((result)=>{
    app.listen(port,() =>{
        console.log("server is up and running")
    })
}).catch((err)=>{
    console.log(err)
})

app.get('*', checkUser);
app.get('/', (req ,res)=>{
    res.render('home',{user:res.user})
})
app.get('/juices',requireAuth,(req,res)=>{

    res.render('juices')  
})
app.use(authRoutes)