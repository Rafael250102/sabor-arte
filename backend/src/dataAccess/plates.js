import { Mongo } from "../database/mongo.js"
import { ObjectId } from "mongodb"
 
const collectionName = 'plates'
 
export default class PlatesDataAccess {
 
    // Retorna todos os pratos, independente de disponibilidade
    async getPlates() {
        const result = await Mongo.db
            .collection(collectionName)
            .find({})
            .toArray()
        return result
    }
 
    // Retorna apenas pratos com available: true (visíveis para o cliente)
    async getAvailablePlates() {
        const result = await Mongo.db
            .collection(collectionName)
            .find({ available: true })
            .toArray()
        return result
    }
 
    // Cadastra um novo prato, tratando imagem e ingredientes corretamente
    async addPlate(plateData, imageFile) {
        // Usa a URL enviada no body ou gera o caminho a partir do arquivo enviado
        let imgUrl = plateData.imgUrl || null;
        if (imageFile) {
            imgUrl = `/imgs/plates/${imageFile.filename}`;
        }
 
        // Normaliza o campo ingredients para sempre ser um array,
        // independente de como veio no body (string JSON, string separada por vírgula ou array)
        let ingredientsArray = [];
        if (typeof plateData.ingredients === 'string') {
            try {
                ingredientsArray = JSON.parse(plateData.ingredients); // Tenta parsear JSON
            } catch (e) {
                ingredientsArray = plateData.ingredients             // Fallback: separa por vírgula
                    .split(",")
                    .map(i => i.trim())
                    .filter(i => i);
            }
        } else if (Array.isArray(plateData.ingredients)) {
            ingredientsArray = plateData.ingredients;
        }
 
        const newPlate = {
            name: plateData.name,
            description: plateData.description,
            price: Number(plateData.price),        // Garante que o preço é numérico
            category: plateData.category,
            available: plateData.available !== undefined ? Boolean(plateData.available) : true,
            ingredients: ingredientsArray,
            imgUrl: imgUrl,
            createdAt: new Date()
        };
 
        const result = await Mongo.db
            .collection(collectionName)
            .insertOne(newPlate);
 
        return result;
    }
 
    // Atualiza um prato existente, com suporte a nova imagem e normalização de ingredientes
    async updatePlate(plateId, plateData, imageFile) {
        let updateData = { ...plateData };
 
        // Substitui a imagem se um novo arquivo foi enviado
        if (imageFile) {
            updateData.imgUrl = `/imgs/plates/${imageFile.filename}`;
        }
 
        // Normaliza ingredientes caso venham como string (ex: via FormData)
        if (typeof updateData.ingredients === 'string') {
            try {
                updateData.ingredients = JSON.parse(updateData.ingredients);
            } catch (e) {
                updateData.ingredients = updateData.ingredients
                    .split(",")
                    .map(i => i.trim())
                    .filter(i => i);
            }
        }
 
        // Garante que o campo available seja sempre booleano
        if (updateData.available !== undefined) {
            updateData.available = Boolean(updateData.available);
        }
 
        const result = await Mongo.db
            .collection(collectionName)
            .findOneAndUpdate(
                { _id: new ObjectId(plateId) },
                { $set: updateData },
                { returnDocument: 'after' } // Retorna o documento já atualizado
            );
 
        return result;
    }
 
    // Remove um prato pelo ID
    async deletePlate(plateId) {
        const result = await Mongo.db
            .collection(collectionName)
            .findOneAndDelete({ _id: new ObjectId(plateId) });
 
        return result;
    }
}