import { useState, useEffect } from "react";
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import styles from './page.module.css';

// Registra os componentes necessários do Chart.js para o gráfico de barras
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// URL base da API — usa variável de ambiente se disponível, senão cai no localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        completedOrders: 0,
        totalRevenue: 0,
        completedRevenue: 0,
        activePlates: 0,
        totalUsers: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Busca todos os dados necessários para o dashboard
    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Busca pedidos, pratos e usuários para montar os cards de métricas
            const ordersRes = await fetch(`${API_URL}/orders`); // Corrigido: era hardcoded
            const ordersData = await ordersRes.json();
            const orders = ordersData.body || [];

            const platesRes = await fetch(`${API_URL}/plates`); // Corrigido: era hardcoded
            const platesData = await platesRes.json();
            const plates = platesData.body || [];

            const usersRes = await fetch(`${API_URL}/users`); // Corrigido: era hardcoded
            const usersData = await usersRes.json();
            const users = usersData.body || [];

            // Filtra apenas pedidos com status "Concluído" para os cards de faturamento
            const completedOrders = orders.filter(o => o.pickupStatus === "Concluído");

            // Calcula faturamento total e de pedidos concluídos somando o campo total de cada pedido
            const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
            const completedRevenue = completedOrders.reduce((sum, o) => sum + (o.total || 0), 0);

            setStats({
                totalOrders: orders.length,
                completedOrders: completedOrders.length,
                totalRevenue,
                completedRevenue,
                activePlates: plates.filter(p => p.available).length, // Conta apenas pratos disponíveis
                totalUsers: users.length,
            });

            // Exibe apenas os 5 pedidos mais recentes na seção de últimos pedidos
            setRecentOrders(orders.slice(0, 5));

        } catch (error) {
            console.error("Erro ao carregar dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    // Carrega os dados ao montar o componente
    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Configuração dos dados do gráfico de barras de faturamento
    const revenueChartData = {
        labels: ['Total', 'Concluídos'],
        datasets: [{
            label: 'Faturamento (R$)',
            data: [stats.totalRevenue, stats.completedRevenue],
            backgroundColor: ['#2E7D32', '#1e5c24'],
            borderRadius: 8,
        }]
    };

    if (loading) return <p>Carregando dashboard...</p>;

    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <h1>Dashboard</h1>
                <p>Visão geral do sistema • Hoje: {new Date().toLocaleDateString('pt-BR')}</p>
            </div>

            {/* Cards de métricas gerais do sistema */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <h3>Total de Pedidos</h3>
                    <h2>{stats.totalOrders}</h2>
                </div>
                <div className={styles.statCard}>
                    <h3>Pedidos Concluídos</h3>
                    <h2>{stats.completedOrders}</h2>
                </div>
                <div className={styles.statCard}>
                    <h3>Faturamento Total</h3>
                    <h2>R$ {stats.totalRevenue.toFixed(2)}</h2>
                </div>
                <div className={styles.statCard}>
                    <h3>Faturamento Concluído</h3>
                    <h2>R$ {stats.completedRevenue.toFixed(2)}</h2>
                </div>
                <div className={styles.statCard}>
                    <h3>Pratos Ativos</h3>
                    <h2>{stats.activePlates}</h2>
                </div>
                <div className={styles.statCard}>
                    <h3>Clientes</h3>
                    <h2>{stats.totalUsers}</h2>
                </div>
            </div>

            {/* Gráfico de barras comparando faturamento total vs concluído */}
            <div className={styles.chartSection}>
                <h2>Faturamento</h2>
                <div className={styles.chartContainer}>
                    <Bar data={revenueChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
            </div>

            {/* Lista dos 5 pedidos mais recentes */}
            <div className={styles.section}>
                <h2>Últimos Pedidos</h2>
                <div className={styles.recentOrders}>
                    {recentOrders.length > 0 ? (
                        recentOrders.map(order => (
                            <div key={order._id} className={styles.orderItem}>
                                <div>
                                    <strong>Pedido #{order._id.slice(-6)}</strong>
                                    <p>{order.userDetails?.[0]?.fullname}</p>
                                </div>
                                <div className={styles.orderRight}>
                                    <span className={styles.status}>{order.pickupStatus}</span>
                                    <p>{order.pickupTime}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Nenhum pedido recente.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
