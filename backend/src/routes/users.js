import express from 'express'
import UsersControllers from '../controllers/users.js'
 
const usersRouter = express.Router()
const usersControllers = new UsersControllers()
 
// GET /users → Retorna todos os usuários (uso administrativo)
usersRouter.get('/', async (req, res) => {
    const { body, success, statusCode } = await usersControllers.getUsers()
    res.status(statusCode).send({ body, success, statusCode })
})
 
// DELETE /users/:id → Remove um usuário pelo ID
usersRouter.delete('/:id', async (req, res) => {
    const { body, success, statusCode } = await usersControllers.deleteUser(req.params.id)
    res.status(statusCode).send({ body, success, statusCode })
})
 
// PUT /users/:id → Atualiza dados de um usuário (nome, email, senha, etc.)
usersRouter.put('/:id', async (req, res) => {
    const { body, success, statusCode } = await usersControllers.updateUser(req.params.id, req.body)
    res.status(statusCode).send({ body, success, statusCode })
})
 
export default usersRouter