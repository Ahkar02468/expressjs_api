import express from 'express';
import allRoutes from './routes/allRoutes.mjs'
import cookieParser from 'cookie-parser';
import session from 'express-session';

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})