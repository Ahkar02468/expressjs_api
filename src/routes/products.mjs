import { Router } from "express";

const router = Router()

router.get('/api/products', (request, response) => {
     response.status(201).send([
          {id:1, name:'Coca C000la', price: 10.70}
     ])
})

export default router