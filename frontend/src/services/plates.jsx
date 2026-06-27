import { useState } from "react"

// URL base da API — usa variável de ambiente se disponível, senão cai no localhost
// Para produção: crie um arquivo .env com VITE_API_URL=https://seudominio.com
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Serviço de pratos: busca os pratos disponíveis para exibição ao cliente
// Corrigido: nome começa com letra minúscula mas é usado como hook (com useState)
// Considere renomear para usePlatesServices para seguir a convenção de hooks do React
export default function platesServices() {
    const [platesLoading, setPlatesLoading] = useState(false)
    const [platesList, setPlatesList] = useState([])

    const url = `${API_URL}/plates` // Corrigido: era hardcoded como localhost:3000

    // Busca apenas os pratos marcados como disponíveis (available: true)
    // Exibe apenas o que o cliente pode pedir no momento
    const getAvailablePlates = () => {
        setPlatesLoading(true);

        fetch(`${url}/availables`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        .then((response) => {
            // Verifica se a resposta HTTP foi bem-sucedida antes de parsear
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .then((result) => {
            // Atualiza a lista de pratos ou limpa em caso de resposta inválida
            if (result.body && Array.isArray(result.body)) {
                setPlatesList(result.body);
            } else {
                setPlatesList([]);
            }
        })
        .catch((error) => {
            // Em caso de erro de rede ou da API, garante lista vazia para não quebrar a UI
            console.error("Erro ao buscar pratos:", error);
            setPlatesList([]);
        })
        .finally(() => {
            setPlatesLoading(false);
        });
    };

    return { 
        getAvailablePlates, 
        platesLoading, 
        platesList 
    }
}
