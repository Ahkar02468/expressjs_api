import bcrypt from 'bcrypt'

const saltRound = 10

export const hashPassword = password => {
     const salt = bcrypt.genSaltSync(saltRound)
     return bcrypt.hashSync(password, salt)
}

export const comparePassword = (plain, hash) => {
     return bcrypt.compareSync(plain, hash)
}

