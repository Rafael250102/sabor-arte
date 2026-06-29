import { useState } from "react";
import { useCartContext } from "../../contexts/useCartContext";
import styles from './page.module.css';
import { LuBadgeMinus } from 'react-icons/lu';
import ConfirmOrderPopup from "../../components/confirmOrderPopup/confirmOrderPopup";
import useOrderServices from "../../services/order";
import { Link, useNavigate } from 'react-router-dom';
import ConfirmDeleteModal from '../../components/modals/confirmDeleteModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function Cart() {
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useCartContext();
    const { sendOrder } = useOrderServices();
    const navigate = useNavigate();

    const authData = JSON.parse(localStorage.getItem('auth') || "{}");

    const [confirmPopupOpen, setConfirmPopupOpen] = useState(false);
    const [removeModalOpen, setRemoveModalOpen] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);

    const handleOpenPopup = (e) => {
        e.preventDefault();
        setConfirmPopupOpen(true);
    };

    const handleConfirmOrder = async (orderData) => {
        try {
            const fullOrderData = {
                userId: authData?.user?._id || authData?._id,
                pickupTime: orderData.pickupTime,
                paymentMethod: orderData.paymentMethod,
                items: cartItems.map((item) => ({
                    plateId: item._id,
                    quantity: item.quantity
                }))
            };

            const result = await sendOrder(fullOrderData);

            if (result?.success || result?.insertedCount > 0 || result?.acknowledged) {
                setConfirmPopupOpen(false);
                clearCart();
                navigate('/profile', { replace: true });
            } else {
                alert("Erro ao salvar o pedido.");
            }
        } catch (error) {
            console.error("Erro completo:", error);
            alert("Erro de conexão.");
        }
    };

    const handleOpenRemoveModal = (item) => {
        setItemToRemove(item);
        setRemoveModalOpen(true);
    };

    const handleConfirmRemove = () => {
        if (itemToRemove) {
            removeFromCart(itemToRemove._id);
        }
        setRemoveModalOpen(false);
        setItemToRemove(null);
    };

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
                
                <div className={styles.itemsListContainer}>
                    {cartItems.map((item) => {
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
                                    <div className={styles.placeholderImage}>🍽️</div>
                                )}
                                
                                <div className={styles.itemContent}>
                                    <h2>{item.name}</h2>
                                    {/* Corrigido: span em vez de p para evitar display:flex do index.css */}
                                    <span>{item.description}</span>
                                    
                                    <div className={styles.priceInfo}>
                                        <span><strong>Preço unitário:</strong> R$ {item.price?.toFixed(2) || '0.00'}</span>
                                        <span><strong>Subtotal:</strong> R$ {(item.price * item.quantity)?.toFixed(2) || '0.00'}</span>
                                    </div>

                                    <div className={styles.portionContainer}>
                                        <span>Porções:</span>
                                        <span>{item.quantity}</span>
                                        <div className={styles.portionBtns}>
                                            <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                                            <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                                        </div>
                                    </div>
                                    
                                    <button className={styles.removeBtn} onClick={() => handleOpenRemoveModal(item)}>
                                        <LuBadgeMinus/> Remover do Carrinho
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className={styles.totalContainer}>
                    <h3>Total do Pedido: R$ {cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</h3>
                </div>

                <button className={styles.confirmBtn} onClick={handleOpenPopup}>
                    Confirme seu Pedido!
                </button>
            </div>

            <ConfirmOrderPopup 
                open={confirmPopupOpen} 
                onClose={() => setConfirmPopupOpen(false)} 
                onConfirm={handleConfirmOrder}
            />

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
