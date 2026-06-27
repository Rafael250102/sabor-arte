import { useState } from "react";
import { useCartContext } from "../../contexts/useCartContext";
import styles from './page.module.css';
import { LuBadgeMinus } from 'react-icons/lu';
import ConfirmOrderPopup from "../../components/confirmOrderPopup/confirmOrderPopup";
import useOrderServices from "../../services/order";
import { Link, useNavigate } from 'react-router-dom';
import ConfirmDeleteModal from '../../components/modals/confirmDeleteModal';

// URL base da API — usa variável de ambiente se disponível, senão cai no localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function Cart() {
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useCartContext();
    const { sendOrder } = useOrderServices();
    const navigate = useNavigate();

    // Lê os dados do usuário autenticado do localStorage
    const authData = JSON.parse(localStorage.getItem('auth') || "{}");

    // Estados dos modais de confirmação
    const [confirmPopupOpen, setConfirmPopupOpen] = useState(false);
    const [removeModalOpen, setRemoveModalOpen] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);

    // Abre o popup de confirmação do pedido
    const handleOpenPopup = (e) => {
        e.preventDefault();
        setConfirmPopupOpen(true);
    };

    // Monta e envia o pedido completo ao backend
    const handleConfirmOrder = async (orderData) => {
        try {
            const fullOrderData = {
                // Suporta tanto o formato { user: { _id } } quanto { _id } do localStorage
                userId: authData?.user?._id || authData?._id,
                pickupTime: orderData.pickupTime,
                paymentMethod: orderData.paymentMethod,
                items: cartItems.map((item) => ({
                    plateId: item._id,
                    quantity: item.quantity
                }))
            };

            const result = await sendOrder(fullOrderData);

            // Aceita diferentes formatos de resposta de sucesso da API
            if (result?.success || result?.insertedCount > 0 || result?.acknowledged) {
                setConfirmPopupOpen(false);
                clearCart(); // Esvazia o carrinho após o pedido ser confirmado
                navigate('/profile', { replace: true });
            } else {
                alert("Erro ao salvar o pedido.");
            }
        } catch (error) {
            console.error("Erro completo:", error);
            alert("Erro de conexão.");
        }
    };

    // Abre o modal de confirmação antes de remover um item do carrinho
    const handleOpenRemoveModal = (item) => {
        setItemToRemove(item);
        setRemoveModalOpen(true);
    };

    // Confirma a remoção do item selecionado e fecha o modal
    const handleConfirmRemove = () => {
        if (itemToRemove) {
            removeFromCart(itemToRemove._id);
        }
        setRemoveModalOpen(false);
        setItemToRemove(null);
    };

    // Exibe tela vazia se o carrinho não tiver itens
    if (!cartItems || cartItems.length === 0) {
        return (
            <div className={styles.cartEmpty}>
                <h1>Seu carrinho está vazio...</h1>
                <button>
                    <Link className={styles.cartEmptyBtn} to={'/plates'}>
                        Veja nossas especialidades!
                    </Link>
                </button>
            </div>
        );
    }

    return (
        <>
            <div className={styles.pageContainer}>
                <h1>Seus itens:</h1>
                
                <section>
                    <div className={styles.itemsListContainer}>
                        {cartItems.map((item) => {
                            // Monta URL completa da imagem (mesmo padrão do PlateCard)
                            // Corrigido: era hardcoded como localhost:3000
                            const imageUrl = item.imgUrl 
                                ? (item.imgUrl.startsWith('http') 
                                    ? item.imgUrl 
                                    : `${API_URL}${item.imgUrl}`)
                                : null;

                            return (
                                <div className={styles.itemContainer} key={item._id}>
                                    {imageUrl ? (
                                        <img src={imageUrl} alt={item.name} />
                                    ) : (
                                        <div className={styles.placeholderImage}></div>
                                    )}
                                    
                                    <div className={styles.itemContent}>
                                        <h2>{item.name}</h2>
                                        <p>{item.description}</p>
                                        
                                        <div className={styles.priceInfo}>
                                            <p><strong>Preço unitário:</strong> R$ {item.price?.toFixed(2) || '0.00'}</p>
                                            <p><strong>Subtotal:</strong> R$ {(item.price * item.quantity)?.toFixed(2) || '0.00'}</p>
                                        </div>

                                        {/* Controles de quantidade do item */}
                                        <div className={styles.portionContainer}>
                                            <p>Porções:</p>
                                            <p>{item.quantity}</p>
                                            <div className={styles.portionBtns}>
                                                <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                                                <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                                            </div>
                                        </div>
                                        
                                        {/* Abre modal de confirmação antes de remover */}
                                        <button className={styles.removeBtn} onClick={() => handleOpenRemoveModal(item)}>
                                            <LuBadgeMinus/> Remover do Carrinho
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Total calculado somando preço × quantidade de cada item */}
                <div className={styles.totalContainer}>
                    <h3>Total do Pedido: R$ {cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</h3>
                </div>

                <button className={styles.confirmBtn} onClick={handleOpenPopup}>
                    Confirme seu Pedido!
                </button>
            </div>

            {/* Popup de confirmação com horário e forma de pagamento */}
            <ConfirmOrderPopup 
                open={confirmPopupOpen} 
                onClose={() => setConfirmPopupOpen(false)} 
                onConfirm={handleConfirmOrder}
            />

            {/* Modal de confirmação de remoção de item */}
            <ConfirmDeleteModal 
                open={removeModalOpen}
                onClose={() => {
                    setRemoveModalOpen(false);
                    setItemToRemove(null);
                }}
                onConfirm={handleConfirmRemove}
                itemName={itemToRemove?.name}
                itemType="item"
            />
        </>
    );
}
