import express from 'express'
import cors from 'cors'
import { Mongo } from './database/mongo.js'
import { config } from 'dotenv'
import authRouter from './auth/auth.js'
import usersRouter from './routes/users.js'
import platesRouter from './routes/plates.js'
import ordersRouter from './routes/orders.js'
 
// Carrega as variáveis de ambiente do arquivo .env
config()
 
async function main() {
    const PORT = process.env.PORT || 3000
    const hostname = '0.0.0.0'   // Importante para Render
 
    const app = express()
 
    // Conecta ao MongoDB usando as variáveis de ambiente
    const mongoConnection = await Mongo.connect({
        mongoConnectionString: process.env.MONGO_CS,
        mongoDbName: process.env.MONGO_DB_NAME
    })
    console.log(mongoConnection)
 
    app.use(express.json())  // Habilita parsing de JSON no body das requisições
    app.use(cors())          // Habilita CORS para aceitar requisições do frontend
 
    // Serve arquivos estáticos (imagens dos pratos, etc.) da pasta public/
    app.use(express.static('public'))
 
    // Rota raiz de health check
    app.get('/', (req, res) => {
        res.send({
            success: true,
            statusCode: 200,
            body: 'Welcome to ImpactoTech'
        })
    })
 
    // Registro das rotas da aplicação
    app.use('/auth', authRouter)     // Autenticação (login, signup, create-admin)
    app.use('/users', usersRouter)   // Gerenciamento de usuários
    app.use('/plates', platesRouter) // Gerenciamento de pratos
    app.use('/orders', ordersRouter) // Gerenciamento de pedidos
 
    app.listen(PORT, hostname, () => {
        console.log(`Server running on: http://${hostname}:${PORT}`)
    })
}
 
main()