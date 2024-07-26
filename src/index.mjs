import express, { response } from 'express';
import allRoutes from './routes/allRoutes.mjs'
import cookieParser from 'cookie-parser';
import session from 'express-session';
import {mockUsers} from './utils/mockData.mjs';
import passport from 'passport';
import './strategies/local-strategy.mjs'
import mongoose from 'mongoose'
// import { MongoClient } from 'mongodb';

// const uri = 'mongodb://127.0.0.1:27017/express_server';
// const client = new MongoClient(uri);

// client.connect()
//   .then(() => console.log('Connected to database..'))
//   .catch(err => console.log(`Error ${err}`));

mongoose
     .connect('mongodb+srv://ahkarshwebaw:WgYPeu8mbPx7B4G0@express-server.pia2bmv.mongodb.net/express_server?retryWrites=true&w=majority&appName=express-server')
     .then(() => console.log('Connected to database..'))
     .catch((err) => console.log(`Error ${err}`))

const app = express();
app.use(express.json());
app.use(cookieParser("helloworld"))
app.use(session({
    secret: "ak the dev",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 * 60 }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(allRoutes);

//order matters in middleware case
const loginMiddleware = (request, response, next) => {
     console.log(`${request.method} - ${request.url}`)
     next();
}

const PORT = process.env.PORT || 3000;

// app.use(loginMiddleware)
app.get('/', loginMiddleware, (request, response) => {
     console.log(request.session)
     console.log(request.session.id)
     request.session.visted = true
     response.cookie("hello", "world", {maxAge: 600000, signed: true})
     response.status(201).send({message: 'hello json'});
});

app.post('/api/auth', passport.authenticate("local"), (request, response) => {
     response.sendStatus(200)
})

app.get('/api/auth/status',async (request, response) => {
     console.log(request.session)
     return request.user ? response.status(200).send(request.session) : response.sendStatus(401)
})

// app.post('/api/cart', (request, response) => {
//      if(!request.session.user) return response.status(401).send({msg: "Unauthorized..."})
//      const {body: item} = request
//      const { cart } = request.session
//      if(cart){
//           cart.push(item)
//      }else{
//           request.session.cart = [item]
//      }
//      response.status(201).send(item)
// })

// app.get('/api/cart', (request, response) => {
//      if(!request.session.user) return response.status(401).send({msg: "Unauthorized..."})
//      return response.send(request.session.cart ?? [])
// })


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})