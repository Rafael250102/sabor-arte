import { useState } from "react";

// URL base da API — usa variável de ambiente se disponível, senão cai no localhost
// Para produção: crie um arquivo .env com VITE_API_URL=https://seudominio.com
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Serviço de autenticação: login, signup e logout
// Corrigido: nome começa com letra minúscula mas é usado como hook (com useState)
// Considere renomear para useAuthServices para seguir a convenção de hooks do React
export default function authServices() {
    const [authLoading, setAuthLoading] = useState(false);
    const url = `${API_URL}/auth`; // Corrigido: era hardcoded como localhost:3000

    // Realiza o login do usuário e salva os dados no localStorage em caso de sucesso
    const login = async (formData) => {
        setAuthLoading(true);
        try {
            const response = await fetch(`${url}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            // Persiste os dados do usuário no localStorage para manter a sessão
            if (result.success && result.body?.user) {
                localStorage.setItem('auth', JSON.stringify(result.body.user));
            }
            return result; // Retorna o resultado para o componente tratar feedback ao usuário

        } catch (error) {
            console.error("Erro no login:", error);
            return { success: false, body: { text: "Erro de conexão" } };
        } finally {
            setAuthLoading(false);
        }
    };

    // Realiza o cadastro do usuário e salva os dados no localStorage em caso de sucesso
    const signup = async (formData) => {
        setAuthLoading(true);
        try {
            const response = await fetch(`${url}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            // Persiste os dados do usuário no localStorage para manter a sessão
            if (result.success && result.body?.user) {
                localStorage.setItem('auth', JSON.stringify(result.body.user));
            }
            return result; // Retorna o resultado para o componente tratar feedback ao usuário

        } catch (error) {
            console.error("Erro no signup:", error);
            return { success: false, body: { text: "Erro de conexão" } };
        } finally {
            setAuthLoading(false);
        }
    };

    // Remove os dados de autenticação do localStorage (encerra a sessão)
    const logout = () => {
        localStorage.removeItem('auth');
    };

    return { login, signup, logout, authLoading };
}
