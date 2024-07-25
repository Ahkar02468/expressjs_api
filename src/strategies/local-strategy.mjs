import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/mockData.mjs";

passport.serializeUser((user, done) => {
     console.log(`Serialize: ${user}`)
     done(null, user.id)
})

passport.deserializeUser((id, done) => {
     console.log((`Deserialize ID: ${id}`))
     try {
          const findUser = mockUsers.find(user => user.id === id)
          if(!findUser) throw new Error('User ID is not exist.')
          done(null, findUser)
     } catch (error) {
          done(error, null)
     }
})

export default passport.use(
     new Strategy((username, passport, done) => {
          console.log(`Username: ${username}`)
          console.log(`Password: ${passport}`)
          try {
               const findUser = mockUsers.find(user => user.username === username)
               if(!findUser) throw new Error('User not found.')
               if(findUser.password !== passport) throw new Error('Invalid Credentials.')
               done(null, findUser)
          } catch (error) {
               done(error, null)
          }
     })
)