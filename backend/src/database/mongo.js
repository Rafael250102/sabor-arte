import { MongoClient } from 'mongodb'
 
// Objeto singleton que mantém a conexão ativa com o MongoDB
export const Mongo = {
    async connect({ mongoConnectionString, mongoDbName }) {
        try {
            const client = new MongoClient(mongoConnectionString)
 
            await client.connect()
            const db = client.db(mongoDbName)
 
            // Armazena client e db para uso em toda a aplicação
            this.client = client
            this.db = db
 
            return 'Connected to mongo!'
        } catch(error) {
            return { text: 'Error during mongo connection', error }
        }
    }
}