import express from 'express'
import OrdersControllers from '../controllers/orders.js'
 
const ordersRouter = express.Router()
const ordersControllers = new OrdersControllers()
 
// GET /orders → Retorna todos os pedidos com itens e total calculado
ordersRouter.get('/', async (req, res) => {
    const { body, success, statusCode } = await ordersControllers.getOrders()
    res.status(statusCode).send({ body, success, statusCode })
})
 
// GET /orders/userorders/:id → Retorna os pedidos de um usuário específico
ordersRouter.get('/userorders/:id', async (req, res) => {
    try {
        const { body, success, statusCode } = await ordersControllers.getOrdersByUserId(req.params.id)
        res.status(statusCode).send({ body, success, statusCode })
    } catch (error) {
        console.error("Erro no controller:", error)
        res.status(500).send({
            success: false,
            statusCode: 500,
            body: [],
            message: error.message
        })
    }
})
 
// POST /orders → Cria um novo pedido com os itens enviados no body
ordersRouter.post('/', async (req, res) => {
    const { body, success, statusCode } = await ordersControllers.addOrder(req.body)
    res.status(statusCode).send({ body, success, statusCode })
})
 
// DELETE /orders/:id → Remove um pedido e seus itens pelo ID
ordersRouter.delete('/:id', async (req, res) => {
    const { body, success, statusCode } = await ordersControllers.deleteOrder(req.params.id)
    res.status(statusCode).send({ body, success, statusCode })
})
 
// PUT /orders/:id → Atualiza um pedido (ex: mudar status de retirada)
ordersRouter.put('/:id', async (req, res) => {
    const { body, success, statusCode } = await ordersControllers.updateOrder(req.params.id, req.body)
    res.status(statusCode).send({ body, success, statusCode })
})
 
export default ordersRouter