import { useState } from "react";
import { Dialog } from "@mui/material";
import styles from "./platePopup.module.css";

// URL base da API — usa variável de ambiente se disponível, senão cai no localhost
// Para produção: crie um arquivo .env com VITE_API_URL=https://seudominio.com
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Popup de detalhes do prato exibido ao clicar em um PlateCard
// Props:
//   plateData   → dados do prato (name, price, imgUrl, ingredients, description)
//   onClose     → callback para fechar o popup
//   onAddToCart → callback chamado com { ...plateData, quantity } ao adicionar ao carrinho
export default function PlatePopup({ plateData, onClose, onAddToCart }) {
    // Quantidade selecionada pelo usuário (mínimo 1)
    const [quantity, setQuantity] = useState(1);

    // Adiciona o prato ao carrinho com a quantidade escolhida e fecha o popup
    const handleAddToCart = () => {
        onAddToCart({ ...plateData, quantity }); // Passa o prato com a quantidade escolhida
        onClose();
    };

    // Monta a URL completa da imagem (mesma lógica do PlateCard)
    const imageUrl = plateData.imgUrl 
        ? (plateData.imgUrl.startsWith('http') 
            ? plateData.imgUrl 
            : `${API_URL}${plateData.imgUrl}`) // Corrigido: era hardcoded como localhost:3000
        : null;

    return (
        <Dialog open={true} onClose={onClose}>
            <div className={styles.popupContainer}>
                {/* Imagem do prato com fallback para placeholder */}
                {imageUrl ? (
                    <img 
                        src={imageUrl} 
                        alt={plateData.name || "Prato"} 
                        className={styles.plateImage}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/imgs/placeholder.jpg';
                        }}
                    />
                ) : (
                    <div className={styles.noImage}>Sem imagem</div>
                )}
                
                <div className={styles.popupContent}>
                    <h2>{plateData.name}</h2>

                    {/* Lista de ingredientes em tom secundário.
                        Normaliza para string independente do formato recebido (array ou string legada) */}
                    <p className={styles.ingredients}>
                        {Array.isArray(plateData.ingredients) 
                            ? plateData.ingredients.join(", ") 
                            : typeof plateData.ingredients === 'string' 
                                ? plateData.ingredients.replace(/^\[|\]$/g, '').trim() 
                                : ""}
                    </p>

                    <p>{plateData.description}</p>

                    {/* Corrigido: preço formatado com toFixed(2) — ex: "R$ 12.00" em vez de "R$ 12" */}
                    <h2>R$ {Number(plateData.price).toFixed(2)}</h2>

                    {/* Controles de quantidade e botão de adicionar ao carrinho */}
                    <div className={styles.quantityBtns}>
                        {/* Decrementa a quantidade, mínimo 1 */}
                        <button onClick={() => setQuantity(prev => Math.max(1, prev - 1))}>-</button>
                        <h3 className={styles.quantity}>{quantity}</h3>
                        {/* Incrementa a quantidade */}
                        <button onClick={() => setQuantity(prev => prev + 1)}>+</button>
                        <button onClick={handleAddToCart}>
                            Adicionar ao Carrinho
                        </button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}
