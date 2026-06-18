import "dotenv/config"

export const port = process.env.PORT || 3000
export const bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10
