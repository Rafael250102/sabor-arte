import UsersDataAccess from "../dataAccess/users.js"
import { ok, serverError } from '../helpers/httpResponse.js'
 
export default class UsersControllers {
    constructor() {
        // Instancia a camada de acesso a dados de usuários
        this.dataAccess = new UsersDataAccess()
    }
 
    // Retorna todos os usuários cadastrados
    async getUsers() {
        try {
            const users = await this.dataAccess.getUsers()
            return ok(users)
        } catch (error) {
            return serverError(error)
        }
    }
 
    // Remove um usuário pelo ID
    async deleteUser(userId) {
        try {
            const result = await this.dataAccess.deleteUser(userId)
            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }
 
    // Atualiza dados de um usuário (com re-hash de senha se necessário)
    async updateUser(userId, userData) {
        try {
            const result = await this.dataAccess.updateUser(userId, userData)
            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }
}