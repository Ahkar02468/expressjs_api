import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/mockData.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { comparePassword, hashPassword } from "../utils/helper.mjs";

passport.serializeUser((id, done) => {
     console.log(`Serialize: ${id}`)
     done(null, id)
})

passport.deserializeUser(async (id, done) => {
     console.log((`Deserialize ID: ${id}`))
     try {
          const findUser = await User.findById(id)
          console.log(findUser)
          if(!findUser) throw new Error('User ID is not exist.')
          done(null, findUser)
     } catch (error) {
          done(error, null)
     }
})

export default passport.use(
     new Strategy(async (username, password, done) => {
          try {
               const findUser = await User.findOne({ username })
               if(!findUser) throw new Error('User not found.')
               if(comparePassword(hashPassword(password), findUser.password)) throw new Error('Invalid Credentials.')
               done(null, findUser)
          } catch (error) {
               done(error, null)
          }
     })
)