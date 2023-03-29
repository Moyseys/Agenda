require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose')

//conexão mongo
const connectString = process.env.connectString;
mongoose.connect(connectString)// {userNewUrlParser: true, useUnifiedTopology:true}
    .then((msg) => {
        console.log('Conectado com o banco de dados')
        app.emit('pronto')
    })
    .catch(e => console.log(e))



const path = require('path')
const helmet = require('helmet')
const csrf = require('csurf') 
const routes = require("./routes")

const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
const {middlewareGlobal, checjkError, crsfMiddleware} = require('./src/middlewares/middleware')

app.use(helmet())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'public')))

const sessionOptions = session({
    secret:'jdçkfbçsdkbbdçfsbdf^dF^Ç><GDFG',
    store: MongoStore.create({mongoUrl: process.env.connectString}),
    resave: false,
    saveUninitialize: false,
    cookie:{
        maxAge: 1000 * 60 *60 * 24 * 7,
        httpOnly: true
    }
})

app.use(sessionOptions)
app.use(flash())

//view
app.set('views', path.resolve(__dirname, 'src', 'views'))
app.set('view engine', 'ejs')
//csrf
app.use(csrf())
//middlewares
app.use(middlewareGlobal)
app.use(crsfMiddleware)
app.use(checjkError)
//app.use('ROTA', middlewareGlobal) a variavel global so estara disponivel nessa ROTA
app.use(routes)

app.on('pronto', () => {
    app.listen(3000,() => {
    console.log('Server is runing: http://localhost:3000');
    })
})
