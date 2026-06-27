import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./page.module.css";

// URL base da API — usa variável de ambiente se disponível, senão cai no localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Página de login exclusiva para administradores
// Verifica se o usuário autenticado tem role === "admin" antes de liberar o acesso
export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Processa o login do admin — verifica credenciais e role na resposta
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/auth/login`, { // Corrigido: era hardcoded
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success && data.body?.user?.role === "admin") {
                // Persiste o token e os dados do admin no localStorage
                localStorage.setItem("adminToken", data.body.token);
                localStorage.setItem("adminData", JSON.stringify(data.body.user));
                navigate("/admin/dashboard", { replace: true });
            } else {
                // Bloqueia acesso se o usuário não tiver role de admin
                setError("Acesso Negado. Você não tem permissão de administrador.");
            }
        } catch (err) {
            setError("Erro ao conectar com o servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.adminLoginContainer}> 
            <div className={styles.loginBox}>
                <h1>🔐 Painel Administrativo</h1>
                <p className={styles.subtitle}>Acesso restrito aos administradores!</p>

                {/* Mensagem de erro exibida após tentativa de login inválida */}
                {error && <p className={styles.error}>{error}</p>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="email"
                        placeholder="Email do administrador"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                    />
                    {/* Botão desabilitado durante o carregamento para evitar duplo envio */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={styles.submitButton}
                    >
                        {loading ? "Entrando..." : "Entrar como Administrador"}
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
    );
}
