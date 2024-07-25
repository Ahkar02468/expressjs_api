import { Router } from 'express'
import { validationResult, matchedData, checkSchema } from 'express-validator'
import { validateGetMethod } from '../utils/validateForGetFilter.mjs';
import { createUserValidationSchema } from '../utils/validationSchema.mjs'
import { userResolveToGetId } from '../utils/middlewares.mjs';
import { mockUsers } from '../utils/mockData.mjs';
import session from 'express-session';

const router = Router()
//,checkSchema(validateGetMethod)
router.get('/api/users', (request, response) => {
     // console.log(request.session)
     console.log(request.session.id)
     request.sessionStore.get(request.session.id, (err, sessionData) => {
          if(err){
               console.log(err)
               throw err
          }
          console.log("Session Data: ",sessionData)
     })
     const result = validationResult(request)
     if(!result.isEmpty()) return response.status(400).send({err: result.array()})
     // const confirmData = matchedData(request)
     // console.log(confirmData)
     const {query: {filter, value}} = request
     if(filter && value){
          response.status(200).send(mockUsers.filter(user => user[filter].includes(value)))
     }else{
          response.status(200).send(mockUsers)
     }
})

router.get('/api/users/:id',userResolveToGetId, (request, response) => {
     const { getIndexToUpdate } = request
     const user = mockUsers[getIndexToUpdate]
     if(!user) return response.sendStatus(404)
     return response.send(user)
})

router.post('/api/users', checkSchema(createUserValidationSchema), (request, response) => {
     const result = validationResult(request)
     if(!result.isEmpty()) return response.status(400).send({err: result.array()})
     const confirmData = matchedData(request)
     // console.log(confirmData)
     // const {body} = request
     const newUser = {id: mockUsers[mockUsers.length - 1].id + 1, ...confirmData}
     mockUsers.push(newUser)
     response.status(201).send(newUser)
})

router.put('/api/users/:id',userResolveToGetId, (request, response) => {
     const { body, getIndexToUpdate } = request
     mockUsers[getIndexToUpdate] = {id: mockUsers[getIndexToUpdate].id, ...body};
     response.status(200).send(mockUsers[getIndexToUpdate]);
})

router.patch('/api/users/:id',userResolveToGetId, (request, response) => {
     const { body, getIndexToUpdate } = request;
     mockUsers[getIndexToUpdate] = {...mockUsers[getIndexToUpdate], ...body}
     response.status(200).send(mockUsers[getIndexToUpdate])
})

router.delete('/api/users/:id',userResolveToGetId, (request, response) => {
     const {getIndexToUpdate} = request
     mockUsers.splice(getIndexToUpdate, 1)
     return response.sendStatus(200)
})

export default router