import express, { query } from 'express';
const app = express();
app.use(express.json())

const PORT = process.env.PORT || 3000;

const mockUsers = [
     {id:1, name: 'john doe', displayName: 'JD'},
     {id:2, name: 'Black Jack', displayName: 'jack'},
     {id:3, name: 'Tom Hanks', displayName: 'Tom'},
     {id:4, name: 'Jones Herry', displayName: 'Jones'}
]

app.get('/', (request, response) => {
     response.status(201).send({message: 'hello jsosn'})
})

app.get('/api/users', (request, response) => {
     // console.log(request.query)
     const {query: {filter, value}} = request
     if(filter && value){
          response.send(mockUsers.filter(user => user[filter].includes(value)))
     }
     response.status(200).send(mockUsers)
})

app.post('/api/users', (request, response) => {
     // console.log(request.body)
     const {body} = request
     const newUser = {id: mockUsers[mockUsers.length - 1].id + 1, ...body}
     mockUsers.push(newUser)
     response.status(201).send(newUser)
})

app.get('/api/products', (request, response) => {
     response.status(201).send([
          {id:1, name:'Coca C000la', price: 10.70}
     ])
})

app.get('/api/users/:id', (request, response) => {
     console.log(request.params)
     const parseId = parseInt(request.params.id)
     if(isNaN(parseId)) return response.status(400).send({msg: 'Bad request. Invalid ID.'})
     const user = mockUsers.find(user => user.id === parseId)
     if(!user) return response.sendStatus(404)
     return response.send(user)
})

app.put('/api/users/:id', (request, response) => {
     const { params: {id}, body } = request;
     const parseId = parseInt(id)
     if(isNaN(parseId)) return response.status(400).send({msg: 'Bad request. Invalid ID.'});
     const getIndexToUpdate = mockUsers.findIndex(user => user.id === parseId);
     if(getIndexToUpdate === -1) return response.sendStatus(404);
     mockUsers[getIndexToUpdate] = {id: parseId, ...body};
     response.status(200).send(mockUsers[getIndexToUpdate]);
})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})