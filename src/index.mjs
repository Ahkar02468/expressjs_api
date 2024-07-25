import express, { response } from 'express';
import allRoutes from './routes/allRoutes.mjs'
import cookieParser from 'cookie-parser';
import session from 'express-session';
import {mockUsers} from './utils/mockData.mjs';

const app = express();
app.use(express.json())
app.use(cookieParser("helloworld"))
app.use(session({
    secret: "ak the dev",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 * 60 }
}))
app.use(allRoutes)

//order matters in middleware case
const loginMiddleware = (request, response, next) => {
     console.log(`${request.method} - ${request.url}`)
     next()
}

const PORT = process.env.PORT || 3000;

// app.use(loginMiddleware)
app.get('/', loginMiddleware, (request, response) => {
     console.log(request.session)
     console.log(request.session.id)
     request.session.visted = true
     response.cookie("hello", "world", {maxAge: 600000, signed: true})
     response.status(201).send({message: 'hello json'})
})

app.post('/api/auth', (request, response) => {
     const {body:  {username, password}} = request
     const foundUser = mockUsers.find(user => user.username === username)
     if(!foundUser || foundUser.password !== password) response.status(401).send({msg: "We can't find you..."})
     request.session.user = foundUser
     response.status(200).send(foundUser)
})

app.get('/api/auth/status', (request, response) => {
     request.sessionStore.get(request.sessionID, (err, session) => {
          console.log(session)
     })
     return request.session.user 
     ? response.status(200).send(request.session.user) 
     : response.status(401).send({msg: "You're not authenticated."})
})

app.post('/api/cart', (request, response) => {
     if(!request.session.user) return response.status(401).send({msg: "Unauthorized..."})
     const {body: item} = request
     const { cart } = request.session
     if(cart){
          cart.push(item)
     }else{
          request.session.cart = [item]
     }
     response.status(201).send(item)
})

app.get('/api/cart', (request, response) => {
     if(!request.session.user) return response.status(401).send({msg: "Unauthorized..."})
     return response.send(request.session.cart ?? [])
})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})