import PlatesDataAccess from '../dataAccess/plates.js'
import { ok, serverError } from '../helpers/httpResponse.js'
 
export default class PlatesControllers {
    constructor() {
        // Instancia a camada de acesso a dados de pratos
        this.dataAccess = new PlatesDataAccess()
    }
 
    // Retorna todos os pratos cadastrados (inclusive indisponíveis)
    async getPlates() {
        try {
            const plates = await this.dataAccess.getPlates()
            return ok(plates)
        } catch (error) {
            return serverError(error)
        }
    }
 
    // Retorna apenas os pratos marcados como disponíveis (para o cliente final)
    async getAvailablePlates() {
        try {
            const plates = await this.dataAccess.getAvailablePlates()
            return ok(plates)
        } catch (error) {
            return serverError(error)
        }
    }
 
    // Cadastra um novo prato, com imagem opcional via upload
    async addPlate(plateData, imageFile) {
        try {
            const result = await this.dataAccess.addPlate(plateData, imageFile)
            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }
 
    // Atualiza um prato existente, com possibilidade de trocar a imagem
    async updatePlate(plateId, plateData, imageFile) {
        try {
            const result = await this.dataAccess.updatePlate(plateId, plateData, imageFile)
            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }
 
    // Remove um prato pelo ID
    async deletePlate(plateId) {
        try {
            const result = await this.dataAccess.deletePlate(plateId)
            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }
}