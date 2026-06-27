import express from 'express'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { Mongo } from '../database/mongo.js'

const collectionName = 'users'
const authRouter = express.Router()

// Segredo JWT lido da variável de ambiente (nunca hardcode em produção!)
const JWT_SECRET = process.env.JWT_SECRET || 'secret'

// ====================== PASSPORT CONFIG ======================
// Configura a estratégia de autenticação local (email + senha)
// O campo de login é 'email' em vez do padrão 'username'
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, callback) => {
    try {
        // Busca o usuário pelo email no banco
        const user = await Mongo.db.collection(collectionName).findOne({ email })
        if (!user) {
            return callback(null, false, { message: 'Usuário não encontrado' })
        }

        // Garante compatibilidade com o salt armazenado como Buffer ou binário do MongoDB
        const salt = user.salt?.buffer || user.salt
        if (!salt) {
            return callback(null, false, { message: 'Erro na conta do usuário' })
        }

        // Gera o hash da senha informada usando o salt do usuário para comparação
        crypto.pbkdf2(password, salt, 310000, 32, 'sha256', (err, hashedPassword) => {
            if (err) return callback(err)

            // Garante compatibilidade com a senha armazenada como Buffer ou binário do MongoDB
            const storedPassword = user.password?.buffer || user.password

            // Comparação segura contra timing attacks
            if (!crypto.timingSafeEqual(storedPassword, hashedPassword)) {
                return callback(null, false, { message: 'Senha incorreta' })
            }

            // Remove dados sensíveis antes de retornar o usuário autenticado
            const { password: _, salt: __, ...safeUser } = user
            return callback(null, safeUser)
        })
    } catch (error) {
        console.error("Erro na autenticação:", error)
        return callback(error)
    }
}))

// ====================== SIGNUP ======================
// Cadastra um novo usuário com role 'customer'
authRouter.post('/signup', async (req, res) => {
    try {
        const { fullname, email, password } = req.body

        // Verifica se o email já está em uso
        const existing = await Mongo.db.collection(collectionName).findOne({ email })
        if (existing) {
            return res.status(409).json({ success: false, body: { text: 'Email já cadastrado' } })
        }

        // Gera salt aleatório e deriva o hash da senha com PBKDF2
        const salt = crypto.randomBytes(16)
        const hashedPassword = await new Promise((resolve, reject) => {
            crypto.pbkdf2(password, salt, 310000, 32, 'sha256', (err, hash) => {
                err ? reject(err) : resolve(hash)
            })
        })

        // Insere o novo usuário no banco com role padrão 'customer'
        const result = await Mongo.db.collection(collectionName).insertOne({
            fullname: fullname || email.split('@')[0], // Usa parte do email se nome não for informado
            email,
            password: hashedPassword,
            salt,
            role: 'customer',
            createdAt: new Date()
        })

        // Busca o usuário recém-criado e remove dados sensíveis antes de retornar
        const user = await Mongo.db.collection(collectionName).findOne({ _id: result.insertedId })
        const { password: _, salt: __, ...safeUser } = user

        // Gera o token JWT para autenticação imediata após o cadastro
        const token = jwt.sign(safeUser, JWT_SECRET)

        res.status(201).json({
            success: true,
            body: { text: 'Cadastro realizado!', user: safeUser, token }
        })
    } catch (error) {
        res.status(500).json({ success: false, body: { text: error.message } })
    }
})

// ====================== CRIAR ADMIN ======================
// ⚠️ ATENÇÃO: Esta rota deve ser protegida ou removida em produção!
// Sugestão: adicionar um middleware que verifica um token de admin ou uma chave secreta no header
authRouter.post('/create-admin', async (req, res) => {
    try {
        const { email, password, fullname } = req.body;

        // Verifica se o email já está cadastrado
        const existing = await Mongo.db.collection('users').findOne({ email });
        if (existing) {
            return res.status(400).json({ success: false, body: { text: 'Usuário já existe' } });
        }

        // Gera salt e hash da senha do administrador
        const salt = crypto.randomBytes(16);
        const hashedPassword = await new Promise((resolve, reject) => {
            crypto.pbkdf2(password, salt, 310000, 32, 'sha256', (err, hash) => {
                err ? reject(err) : resolve(hash);
            });
        });

        // Insere o admin com role 'admin'
        const result = await Mongo.db.collection('users').insertOne({
            fullname: fullname || "Administrador",
            email,
            password: hashedPassword,
            salt,
            role: "admin",
            createdAt: new Date()
        });

        res.json({
            success: true,
            body: { text: 'Administrador criado com sucesso!', id: result.insertedId }
        });
    } catch (err) {
        res.status(500).json({ success: false, body: { text: err.message } });
    }
});

// ====================== LOGIN ======================
// Autentica o usuário via Passport (estratégia local) e retorna um token JWT
authRouter.post('/login', (req, res) => {
    passport.authenticate('local', (error, user) => {
        if (error || !user) {
            return res.status(401).json({
                success: false,
                body: { text: 'Credenciais inválidas' }
            })
        }

        // Gera o token JWT com os dados do usuário (sem senha/salt)
        const token = jwt.sign(user, JWT_SECRET)

        res.json({
            success: true,
            body: {
                text: 'Login realizado com sucesso!',
                user,
                token
            }
        })
    })(req, res)
})

export default authRouter