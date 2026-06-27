import { useState, useEffect } from "react";
import styles from './page.module.css';

// URL base da API — usa variável de ambiente se disponível, senão cai no localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState("Todos"); // Filtro de status ativo

    // Busca todos os pedidos da API
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/orders`); // Corrigido: era hardcoded
            const data = await response.json();
            setOrders(data.body || []);
        } catch (error) {
            console.error("Erro ao carregar pedidos:", error);
        } finally {
            setLoading(false);
        }
    };

    // Carrega os pedidos ao montar o componente
    useEffect(() => {
        fetchOrders();
    }, []);

    // Aplica o filtro de status à lista de pedidos
    // "Todos" retorna a lista completa sem filtro
    const filteredOrders = selectedStatus === "Todos" 
        ? orders 
        : orders.filter(order => order.pickupStatus === selectedStatus);

    // Atualiza o status de um pedido e recarrega a lista
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await fetch(`${API_URL}/orders/${orderId}`, { // Corrigido: era hardcoded
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pickupStatus: newStatus })
            });
            fetchOrders(); // Recarrega a lista para refletir a mudança
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
            alert("Erro ao atualizar status do pedido");
        }
    };

    // Formata o valor interno do método de pagamento para exibição legível
    const formatPaymentMethod = (method) => {
        const labels = {
            pix: "Pix",
            dinheiro: "Dinheiro",
            cartao_credito: "Cartão de Crédito",
            cartao_debito: "Cartão de Débito",
            voucher: "Voucher (VA/VR)"
        };
        return labels[method] || method;
    };

    if (loading) return <p>Carregando pedidos...</p>;

    return (
        <div className={styles.ordersContainer}>
            <div className={styles.header}>
                <h1>Gerenciar Pedidos</h1>
                
                {/* Filtros de status — gerados dinamicamente */}
                <div className={styles.filters}>
                    {["Todos", "Pendente", "Concluído", "Cancelado"].map(status => (
                        <button 
                            key={status}
                            // Aplica classe 'active' no filtro selecionado
                            className={selectedStatus === status ? styles.active : ''}
                            onClick={() => setSelectedStatus(status)}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Lista de pedidos filtrados */}
            <div className={styles.ordersList}>
                {filteredOrders.length === 0 ? (
                    <p>Nenhum pedido encontrado.</p>
                ) : (
                    filteredOrders.map(order => (
                        <div key={order._id} className={styles.orderCard}>
                            <div className={styles.orderHeader}>
                                <h3>Pedido #{order._id.slice(-6)}</h3>
                                {/* Classe de status dinâmica para colorização */}
                                <span className={`${styles.status} ${styles[order.pickupStatus.toLowerCase()]}`}>
                                    {order.pickupStatus}
                                </span>
                            </div>
                            
                            <p><strong>Cliente:</strong> {order.userDetails?.[0]?.fullname}</p>
                            <p><strong>Horário de Retirada:</strong> {order.pickupTime}</p>
                            <p><strong>Forma de Pagamento:</strong> {formatPaymentMethod(order.paymentMethod)}</p>
                            <p><strong>Total do Pedido:</strong> R$ {order.total?.toFixed(2) || '0.00'}</p>

                            {/* Itens do pedido com quantidade e nome do prato */}
                            <div className={styles.orderItems}>
                                {order.orderItems?.map((item, index) => (
                                    <div key={index}>
                                        {item.quantity}x {item.itemDetails?.[0]?.name}
                                    </div>
                                ))}
                            </div>

                            {/* Ações disponíveis apenas para pedidos com status "Pendente" */}
                            <div className={styles.actions}>
                                {order.pickupStatus === "Pendente" && (
                                    <>
                                        <button 
                                            onClick={() => updateOrderStatus(order._id, "Concluído")}
                                            className={styles.completeBtn}
                                        >
                                            Marcar como Concluído
                                        </button>
                                        <button 
                                            onClick={() => updateOrderStatus(order._id, "Cancelado")}
                                            className={styles.cancelBtn}
                                        >
                                            Cancelar
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
