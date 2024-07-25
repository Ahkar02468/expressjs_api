import express from 'express';
import allRoutes from './routes/allRoutes.mjs'

const app = express();
app.use(express.json())
app.use(allRoutes)

//order matters in middleware case
const loginMiddleware = (request, response, next) => {
     console.log(`${request.method} - ${request.url}`)
     next()
}

const PORT = process.env.PORT || 3000;

// app.use(loginMiddleware)
app.get('/', loginMiddleware, (request, response) => {
     response.status(201).send({message: 'hello json'})
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})