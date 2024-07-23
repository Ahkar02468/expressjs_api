import express from 'express';
import {query, validationResult, body, matchedData, checkSchema} from 'express-validator'
import {createUserValidationSchema} from '../utils/validationSchema.mjs'
const app = express();
app.use(express.json())
//order matters in middleware case
const loginMiddleware = (request, response, next) => {
     console.log(`${request.method} - ${request.url}`)
     next()
}

const userResolveToGetId = (request, response, next) => {
     const { params: {id}} = request;
     const parseId = parseInt(id);
     if(isNaN(parseId)) return response.status(400).send({msg: 'Bad request. Invalid ID.'});
     const getIndexToUpdate = mockUsers.findIndex(user => user.id === parseId);
     if(getIndexToUpdate === -1) return response.sendStatus(404);
     request.getIndexToUpdate = getIndexToUpdate;
     next()
}

// app.use(loginMiddleware)

const PORT = process.env.PORT || 3000;

const mockUsers = [
     {id:1, name: 'john doe', displayName: 'JD'},
     {id:2, name: 'Black Jack', displayName: 'jack'},
     {id:3, name: 'Tom Hanks', displayName: 'Tom'},
     {id:4, name: 'Jones Herry', displayName: 'Jones'},
     {id:5, name: 'Kelly James', displayName: 'Kelly'}
]

app.get('/', loginMiddleware, (request, response) => {
     response.status(201).send({message: 'hello json'})
})

app.get('/api/users',
     query('filter')
     .isString()
     .notEmpty()
     .withMessage('Must not be empty')
     .isLength({min: 3, max: 10})
     .withMessage('Length must be between 3 and 10.')
     ,(request, response) => {
     const result = validationResult(request)
     console.log(result)
     const {query: {filter, value}} = request
     if(filter && value){
          response.send(mockUsers.filter(user => user[filter].includes(value)))
     }
     response.status(200).send(mockUsers)
})

app.post('/api/users', checkSchema(createUserValidationSchema),
     (request, response) => {
     const result = validationResult(request)
     if(!result.isEmpty()) return response.status(400).send({err: result.array()})
     const confirmData = matchedData(request)
     console.log(confirmData)
     // const {body} = request
     const newUser = {id: mockUsers[mockUsers.length - 1].id + 1, ...confirmData}
     mockUsers.push(newUser)
     response.status(201).send(newUser)
})

app.get('/api/products', (request, response) => {
     response.status(201).send([
          {id:1, name:'Coca C000la', price: 10.70}
     ])
})

app.get('/api/users/:id',userResolveToGetId, (request, response) => {
     const { getIndexToUpdate } = request
     const user = mockUsers[getIndexToUpdate]
     if(!user) return response.sendStatus(404)
     return response.send(user)
})

app.put('/api/users/:id',userResolveToGetId, (request, response) => {
     const { body, getIndexToUpdate } = request
     mockUsers[getIndexToUpdate] = {id: mockUsers[getIndexToUpdate].id, ...body};
     response.status(200).send(mockUsers[getIndexToUpdate]);
})

app.patch('/api/users/:id',userResolveToGetId, (request, response) => {
     const { body, getIndexToUpdate } = request;
     mockUsers[getIndexToUpdate] = {...mockUsers[getIndexToUpdate], ...body}
     response.status(200).send(mockUsers[getIndexToUpdate])
})

app.delete('/api/users/:id',userResolveToGetId, (request, response) => {
     const {getIndexToUpdate} = request
     mockUsers.splice(getIndexToUpdate, 1)
     return response.sendStatus(200)
})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})