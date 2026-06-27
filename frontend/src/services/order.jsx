import { useState } from "react"

// URL base da API — usa variável de ambiente se disponível, senão cai no localhost
// Para produção: crie um arquivo .env com VITE_API_URL=https://seudominio.com
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Serviço de pedidos: busca pedidos do usuário e envia novos pedidos
export default function useOrderServices() {
    const [orderLoading, setOrderLoading] = useState(false)
    const [refetchOrders, setRefetchOrders] = useState(true) // Controla se deve buscar pedidos novamente
    const [ordersList, setOrdersList] = useState([])

    const url = `${API_URL}/orders` // Corrigido: era hardcoded como localhost:3000

    // Busca os pedidos de um usuário específico pelo ID
    // Usa .then() encadeado (estilo Promise) para compatibilidade com o fluxo existente
    const getUserOrders = (userId) => {
        setOrderLoading(true)
        
        fetch(`${url}/userorders/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        })
        .then((response) => {
            // Verifica se a resposta HTTP foi bem-sucedida antes de parsear
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then((result) => {
            // Atualiza a lista de pedidos ou limpa em caso de falha na API
            if(result.success) {
                setOrdersList(result.body || []);
            } else {
                setOrdersList([]);
            }
        })
        .finally(() => {
            setOrderLoading(false)
            setRefetchOrders(false) // Indica que os pedidos já foram carregados
        })
    }

    // Envia um novo pedido para a API
    const sendOrder = async (orderData) => {
        setOrderLoading(true);

        try {
            const response = await fetch(`${url}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();
            return result;

        } catch (error) {
            console.error("Erro no sendOrder:", error);
            return { success: false };
        } finally {
            setOrderLoading(false);
        }
    };

    return { getUserOrders, orderLoading, refetchOrders, ordersList, sendOrder }
}
