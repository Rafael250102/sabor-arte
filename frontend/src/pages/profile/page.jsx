import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authServices from "../../services/auth";
import useOrderServices from "../../services/order";
import styles from './page.module.css';
import { LuLogOut } from "react-icons/lu";
import { Link } from "react-router-dom";
import Loading from "../loading/page";

// Página de perfil do usuário — exibe dados do usuário e histórico de pedidos com filtro por status
export default function Profile() {
    const { logout } = authServices();
    const { getUserOrders, orderLoading, ordersList } = useOrderServices();
    
    const navigate = useNavigate();
    const [selectedStatus, setSelectedStatus] = useState("Todos"); // Filtro de status ativo

    // Lê e normaliza os dados do usuário do localStorage
    // Suporta tanto o formato { user: { _id } } quanto { _id }
    const authDataRaw = localStorage.getItem('auth');
    const authData = authDataRaw ? JSON.parse(authDataRaw) : null;
    const user = authData?.user || authData;

    const fullname = user?.fullname || user?.name || "Usuário";
    const email = user?.email || "";
    const userId = user?._id;

    // Busca os pedidos do usuário ao montar o componente
    // Se não houver userId, redireciona para o login
    useEffect(() => {
        if (userId) {
            getUserOrders(userId);
        } else {
            navigate('/auth', { replace: true });
        }
    }, [userId]);

    // Remove os dados de auth e redireciona para a home ao sair
    const handleLogout = () => {
        logout();
        navigate('/', { replace: true });
    };

    // Aplica o filtro de status à lista de pedidos
    // "Todos" retorna a lista completa sem filtro
    const filteredOrders = selectedStatus === "Todos" 
        ? ordersList 
        : ordersList.filter(order => order.pickupStatus === selectedStatus);

    // Formata o valor interno do método de pagamento para exibição legível
    const formatPaymentMethod = (method) => {
        const labels = {
            pix: "Pix",
            dinheiro: "Dinheiro",
            cartao_credito: "Cartão de Crédito",
            cartao_debito: "Cartão de Débito",
            voucher: "Voucher (VA/VR)"
        };
        return labels[method] || method; // Retorna o valor original se não encontrar mapeamento
    };

    // Exibe tela de loading enquanto os pedidos são buscados
    if (orderLoading) {
        return <Loading />;
    }

    return (
        <div className={styles.ordersContainer}>
            {/* Cabeçalho com nome, email e botão de logout */}
            <div className={styles.header}>
                <div>
                    <h1>{fullname}</h1>
                    <p className={styles.email}>{email}</p>
                </div>
                
                <button onClick={handleLogout} className={styles.logoutBtn}>
                    Logout <LuLogOut />
                </button>
            </div>

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

            {/* Lista de pedidos filtrados */}
            <div className={styles.ordersList}>
                {filteredOrders?.length > 0 ? (
                    filteredOrders.map((order) => (
                        <div key={order._id} className={styles.orderCard}>
                            <div className={styles.orderHeader}>
                                <h3>Pedido #{order._id?.slice(-6)}</h3>
                                {/* Classe de status dinâmica para colorização (pendente/concluído/cancelado) */}
                                <span className={`${styles.status} ${styles[order.pickupStatus.toLowerCase()]}`}>
                                    {order.pickupStatus}
                                </span>
                            </div>

                            <p><strong>Horário de Retirada:</strong> {order.pickupTime}</p>
                            <p><strong>Forma de Pagamento:</strong> {formatPaymentMethod(order.paymentMethod)}</p>
                            <p><strong>Total do Pedido:</strong> R$ {order.total?.toFixed(2) || '0.00'}</p>

                            {/* Lista dos itens do pedido com quantidade e nome do prato */}
                            <div className={styles.orderItems}>
                                {order.orderItems?.map((item, index) => (
                                    <div key={index}>
                                        {item.quantity}x {item.itemDetails?.[0]?.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    // Mensagem exibida quando não há pedidos no filtro selecionado
                    <div className={styles.noOrders}>
                        Você não tem pedidos ainda.
                        <Link to="/plates" className={styles.platesLink}>
                            Clique aqui e veja nossas especialidades!
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
