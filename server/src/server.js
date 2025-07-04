import express from "express"
import dotenv from "dotenv"
import logger from "./config/logger.js"
import authRoutes from "./routes/authRoutes.js"

dotenv.config()

const app = express()
app.use(express.json())
app.use(authRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    logger.info(`Server running on PORT:${PORT}`)
})

