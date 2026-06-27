import { Mongo } from "../database/mongo.js"
import { ObjectId } from "mongodb"

const collectionName = 'orders'

export default class OrdersDataAccess {

        // Retorna todos os pedidos com itens, detalhes dos pratos, dados do usuário e total calculado
    async getOrders() {
        const result = await Mongo.db
        .collection(collectionName)
        .aggregate([
            {
                $lookup: {
                    from: 'orderItems',
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'orderItems'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $project: {
                    'userDetails.password': 0,
                    'userDetails.salt': 0
                }
            },
            { $unwind: '$orderItems' },
            {
                $lookup: {
                    from: 'plates',
                    localField: 'orderItems.plateId',
                    foreignField: '_id',
                    as: 'orderItems.itemDetails'
                }
            },
            {
                $group: {
                    _id: '$_id',
                    userDetails: { $first: '$userDetails' },
                    orderItems: { $push: '$orderItems' },
                    pickupStatus: { $first: '$pickupStatus' },
                    pickupTime: { $first: '$pickupTime' },
                    paymentMethod: { $first: '$paymentMethod' },     // ← Adicionado
                    total: {
                        $sum: {
                            $multiply: [
                                '$orderItems.quantity',
                                { $arrayElemAt: ['$orderItems.itemDetails.price', 0] }
                            ]
                        }
                    }
                }
            }
        ])
        .toArray()

        return result
    }

    // Retorna os pedidos de um usuário específico
    async getOrdersByUserId(userId) {
        const result = await Mongo.db
        .collection(collectionName)
        .aggregate([
            {
                $match: { userId: new ObjectId(userId) }
            },
            {
                $lookup: {
                    from: 'orderItems',
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'orderItems'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $project: {
                    'userDetails.password': 0,
                    'userDetails.salt': 0
                }
            },
            { $unwind: '$orderItems' },
            {
                $lookup: {
                    from: 'plates',
                    localField: 'orderItems.plateId',
                    foreignField: '_id',
                    as: 'orderItems.itemDetails'
                }
            },
            {
                $group: {
                    _id: '$_id',
                    userDetails: { $first: '$userDetails' },
                    orderItems: { $push: '$orderItems' },
                    pickupStatus: { $first: '$pickupStatus' },
                    pickupTime: { $first: '$pickupTime' },
                    paymentMethod: { $first: '$paymentMethod' },     // ← Adicionado
                    total: {
                        $sum: {
                            $multiply: [
                                '$orderItems.quantity',
                                { $arrayElemAt: ['$orderItems.itemDetails.price', 0] }
                            ]
                        }
                    }
                }
            }
        ])
        .toArray()

        return result
    }

    // Cria um novo pedido e insere os itens na coleção orderItems
    async addOrder(orderData) {
        // Separa os itens do restante dos dados do pedido
        const { items, ...orderDataRest } = orderData

        // === VALIDAÇÃO DO PAYMENT METHOD ===
        if (!orderDataRest.paymentMethod) {
            throw new Error('Forma de pagamento é obrigatória')
        }

        const validPaymentMethods = ['pix', 'dinheiro', 'cartao_credito', 'cartao_debito', 'voucher']
        
        if (!validPaymentMethods.includes(orderDataRest.paymentMethod)) {
            throw new Error('Forma de pagamento inválida')
        }

        // Define campos automáticos do pedido
        orderDataRest.createdAt = new Date()
        orderDataRest.pickupStatus = 'Pendente'
        orderDataRest.userId = new ObjectId(orderDataRest.userId)

        // Insere o pedido principal (agora com paymentMethod)
        const newOrder = await Mongo.db
            .collection(collectionName)
            .insertOne(orderDataRest)       
        
        if (!newOrder.insertedId) {
            throw new Error('Pedido não pôde ser inserido')
        }

        // Converte os IDs dos itens para ObjectId e vincula ao pedido criado
        items.forEach((item) => {
            item.plateId = new ObjectId(item.plateId)
            item.orderId = new ObjectId(newOrder.insertedId)
        })

        // Insere todos os itens do pedido de uma vez
        const result = await Mongo.db
            .collection('orderItems')
            .insertMany(items)

        return result
    }

    // Remove um pedido e todos os seus itens do banco
    async deleteOrder(orderId) {
        // Primeiro remove os itens vinculados ao pedido
        const itemsToDelete = await Mongo.db
        .collection('orderItems')
        .deleteMany({ orderId: new ObjectId(orderId) })

        // Depois remove o pedido em si
        const orderToDelete = await Mongo.db
        .collection(collectionName)
        .findOneAndDelete({ _id: new ObjectId(orderId) })

        return { itemsToDelete, orderToDelete }
    }

    // Atualiza campos de um pedido (ex: status, horário de retirada)
    async updateOrder(orderId, orderData) {
        const result = await Mongo.db
        .collection(collectionName)
        .findOneAndUpdate(
            { _id: new ObjectId(orderId) },
            { $set: orderData }
        )

        return result
    }
}