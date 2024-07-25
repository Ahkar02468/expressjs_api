import { Router } from "express";

const router = Router()

router.get('/api/products', (request, response) => {
     console.log(request.headers.cookie);
     console.log(request.cookies);
     console.log(request.signedCookies.hello);
     if(request.signedCookies.hello && request.signedCookies.hello === 'world'){
          return response.send([
               {id:1, name:'Coca Cooooola', price: 10.70}
          ])
     }
     return response.send({msg: 'Sorry, you need the correct coookie!!'})
})

export default router