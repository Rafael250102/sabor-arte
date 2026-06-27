import { Mongo } from "../database/mongo.js"
import { ObjectId } from "mongodb"
import crypto from 'crypto'

const collectionName = 'users'

export default class UsersDataAccess {

    // Retorna todos os usuários cadastrados
    // ⚠️ Atenção: inclui password e salt — considere projetar esses campos para fora na resposta
    async getUsers() {
        const result = await Mongo.db
        .collection(collectionName)
        .find({ })
        .toArray()

        return result
    }

    // Remove um usuário pelo ID
    async deleteUser(userId) {
        const result = await Mongo.db
        .collection(collectionName)
        .findOneAndDelete({ _id: new ObjectId(userId) })

        return result
    }

    // Atualiza os dados de um usuário
    // Se uma nova senha for informada, ela é hasheada antes de salvar
    async updateUser(userId, userData) {
        if (userData.password) {
            // Gera novo salt e deriva o hash da nova senha
            const salt = crypto.randomBytes(16)

            // CORREÇÃO: transformado em Promise para garantir que o resultado
            // seja retornado corretamente ao controller.
            // Antes, o 'return result' estava dentro do callback assíncrono
            // e nunca chegava ao chamador.
            const hashedPassword = await new Promise((resolve, reject) => {
                crypto.pbkdf2(userData.password, salt, 310000, 16, 'sha256', (error, hash) => {
                    if (error) reject(new Error('Erro ao gerar hash da senha'))
                    else resolve(hash)
                })
            })

            // Substitui a senha em texto puro pelo hash e adiciona o novo salt
            userData = { ...userData, password: hashedPassword, salt }
        }

        // Atualiza o usuário no banco (com ou sem nova senha)
        const result = await Mongo.db
        .collection(collectionName)
        .findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { $set: userData }
        )

        return result
    }
}