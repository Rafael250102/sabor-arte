import { useEffect, useState } from "react"
import { TextField } from "@mui/material"
import styles from './page.module.css'
import authServices from "../../services/auth"
import { useNavigate } from "react-router-dom"
import { LuLogIn } from "react-icons/lu";

export default function Auth() {
    const [formType, setFormType] = useState('login')  // Controla se exibe o form de login ou cadastro
    const [formData, setFormData] = useState({})
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    
    const { login, signup, authLoading } = authServices()
    const navigate = useNavigate()

    // Redireciona para o perfil se o usuário já estiver autenticado
    useEffect(() => {
        const authData = JSON.parse(localStorage.getItem('auth') || "{}")
        if (authData && authData._id) {
            navigate('/profile', { replace: true })
        }
    }, [navigate])

    // Alterna entre os formulários de login e cadastro, limpando os estados
    const handleChangeFormType = () => {
        setFormData({})
        setError("")
        setSuccess("")
        setFormType(formType === 'login' ? 'signup' : 'login')
    }

    // Atualiza os campos do formulário dinamicamente pelo atributo name do input
    const handleFormDataChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    // Processa o envio do formulário de login ou cadastro
    const handleSubmitForm = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        try {
            let result

            if (formType === 'login') {
                result = await login(formData)
            } else {
                // Validação local de confirmação de senha antes de enviar ao servidor
                if (formData.password !== formData.confirmPassword) {
                    setError("As senhas não coincidem!")
                    return
                }
                result = await signup(formData)
            }

            if (result?.success) {
                if (formType === 'signup') {
                    // Após cadastro bem-sucedido, orienta o usuário a fazer login
                    setSuccess("Cadastro realizado com sucesso! Agora faça login.")
                    setFormType('login')
                } else {
                    // Após login bem-sucedido, persiste o usuário e redireciona para o perfil
                    localStorage.setItem('auth', JSON.stringify(result.body.user))
                    navigate('/profile', { replace: true })
                }
            } else {
                // Tratamento de erros com base no status HTTP e no texto da resposta
                const status = result?.statusCode || result?.body?.statusCode
                const text = (result?.body?.text || "").toLowerCase()

                if (status === 409 || 
                    text.includes("already") || 
                    text.includes("cadastrado") || 
                    text.includes("exists") ||
                    text.includes("duplicate")) {
                    
                    setError("Este e-mail já está cadastrado. Tente fazer login.")
                } else {
                    setError(result?.body?.text || "Erro ao processar solicitação")
                }
            }
        } catch (err) {
            console.error("Erro completo:", err)
            setError("Erro de conexão com o servidor. Tente novamente.")
        }
    }

    // Exibe feedback de carregamento enquanto a requisição de auth está em andamento
    if (authLoading) {
        return <h2>Carregando...</h2>
    }

    return (
        <div className={styles.authPageContainer}>
            <div className={styles.loginBox}>
                <h1>🔐{formType === 'login' ? 'Login' : 'Cadastro'}</h1>

                {/* Botão para alternar entre os formulários de login e cadastro */}
                <button onClick={handleChangeFormType} className={styles.createButton}>
                    {formType === 'login' 
                        ? 'Você não tem uma conta? Clique aqui' 
                        : 'Já tem uma conta? Clique aqui'}
                </button>

                {/* Mensagens de erro e sucesso exibidas acima do formulário */}
                {error && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.success}>{success}</p>}

                <form onSubmit={handleSubmitForm} className={styles.form}>
                    {/* Campo de nome completo — exibido apenas no cadastro */}
                    {formType === 'signup' && (
                        <TextField 
                            required
                            label="Nome Completo"
                            name="fullname"
                            onChange={handleFormDataChange}
                            className={styles.input}
                        />
                    )}
                    <TextField 
                        required
                        label="Email"
                        type="email"
                        name="email"
                        onChange={handleFormDataChange}
                        className={styles.input}
                    />
                    <TextField 
                        required
                        label="Senha"
                        type="password"
                        name="password"
                        onChange={handleFormDataChange}
                        className={styles.input}
                    />
                    {/* Campo de confirmação de senha — exibido apenas no cadastro */}
                    {formType === 'signup' && (
                        <TextField 
                            required
                            label="Confirmar Senha"
                            type="password"
                            name="confirmPassword"
                            onChange={handleFormDataChange}
                        />
                    )}
                    <button type="submit" className={styles.submitButton}>
                        {formType === 'login' ? 'Login' : 'Cadastrar'} <LuLogIn />
                    </button>
                </form>

                <button
                    onClick={() => navigate('/')}
                    className={styles.backButton}
                >
                    ← Voltar para o site
                </button>
            </div>
        </div>
    )
}
