import OrdersDataAccess from '../dataAccess/orders.js'
import { ok, serverError } from '../helpers/httpResponse.js'
 
export default class OrdersControllers {
    constructor() {
        // Instancia a camada de acesso a dados de pedidos
        this.dataAccess = new OrdersDataAccess()
    }
 
    // Busca todos os pedidos com itens, usuário e total calculado
    async getOrders() {
        try {
            const orders = await this.dataAccess.getOrders()
            return ok(orders)
        } catch (error) {
            return serverError(error)
        }
    }
 
    // Busca os pedidos de um usuário específico pelo ID
    async getOrdersByUserId(userId) {
        try {
            const orders = await this.dataAccess.getOrdersByUserId(userId)
            return ok(orders)
        } catch (error) {
            return serverError(error)
        }
    }
 
    // Cria um novo pedido com seus itens
    async addOrder(orderData) {
        try {
            const result = await this.dataAccess.addOrder(orderData)
            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }
 
    // Remove um pedido e seus itens pelo ID
    async deleteOrder(orderId) {
        try {
            const result = await this.dataAccess.deleteOrder(orderId)
            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }
 
    // Atualiza um pedido (ex: status de retirada)
    async updateOrder(orderId, orderData) {
        try {
            const result = await this.dataAccess.updateOrder(orderId, orderData)
            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }
}