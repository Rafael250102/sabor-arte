import express from 'express'
import multer from 'multer'
import path from 'path'
import PlatesControllers from '../controllers/plates.js'
 
const platesRouter = express.Router()
const platesControllers = new PlatesControllers()
 
// Configuração do Multer para upload de imagens de pratos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Define a pasta de destino das imagens enviadas
        cb(null, 'public/imgs/plates/')
    },
    filename: (req, file, cb) => {
        // Gera nome único para evitar colisões entre arquivos
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueName + path.extname(file.originalname))
    }
})
 
const upload = multer({ storage: storage })
 
// GET /plates → Retorna todos os pratos (admin)
platesRouter.get('/', async (req, res) => {
    const { body, success, statusCode } = await platesControllers.getPlates()
    res.status(statusCode).send({ body, success, statusCode })
})
 
// GET /plates/availables → Retorna apenas pratos disponíveis (cliente final)
platesRouter.get('/availables', async (req, res) => {
    const { body, success, statusCode } = await platesControllers.getAvailablePlates()
    res.status(statusCode).send({ body, success, statusCode })
})
 
// POST /plates → Cadastra um novo prato com imagem opcional
platesRouter.post('/', upload.single('image'), async (req, res) => {
    const { body, success, statusCode } = await platesControllers.addPlate(req.body, req.file)
    res.status(statusCode).send({ body, success, statusCode })
})
 
// PUT /plates/:id → Atualiza um prato existente (imagem opcional)
platesRouter.put('/:id', upload.single('image'), async (req, res) => {
    const { body, success, statusCode } = await platesControllers.updatePlate(req.params.id, req.body, req.file)
    res.status(statusCode).send({ body, success, statusCode })
})
 
// DELETE /plates/:id → Remove um prato pelo ID
platesRouter.delete('/:id', async (req, res) => {
    const { body, success, statusCode } = await platesControllers.deletePlate(req.params.id)
    res.status(statusCode).send({ body, success, statusCode })
})
 
export default platesRouter