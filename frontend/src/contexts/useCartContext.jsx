import { createContext, useContext, useState } from "react";

// Cria o contexto do carrinho — compartilhado entre todos os componentes filhos do CartProvider
const CartContext = createContext();

// Provider que envolve a aplicação e disponibiliza o estado e as funções do carrinho
export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    // Adiciona um item ao carrinho
    // Se o item já existir (mesmo _id), soma a quantidade ao invés de duplicar
    const addToCart = (itemToAdd) => {
        setCartItems(prev => {
            const existingItem = prev.find(item => item._id === itemToAdd._id);

            if (existingItem) {
                // Item já está no carrinho → atualiza a quantidade
                return prev.map(item =>
                    item._id === itemToAdd._id
                        ? { ...item, quantity: item.quantity + (itemToAdd.quantity || 1) }
                        : item
                );
            } else {
                // Item novo → adiciona ao final do carrinho
                return [...prev, { 
                    ...itemToAdd, 
                    quantity: itemToAdd.quantity || 1 
                }];
            }
        });
    };

    // Atualiza a quantidade de um item específico pelo ID
    // Ignora valores menores que 1 para evitar quantidades inválidas
    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        setCartItems(prev =>
            prev.map(item =>
                item._id === itemId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    // Remove um item do carrinho pelo ID
    const removeFromCart = (itemId) => {
        const cartItemsSanitized = cartItems.filter((item) => {
            return item._id !== itemId
        })

        setCartItems(cartItemsSanitized)
        // Alternativa mais concisa (equivalente):
        // setCartItems(prev => prev.filter(item => item._id !== itemId));
    };

    // Substitui todos os itens do carrinho por uma nova lista
    // Útil para sincronizar o carrinho com dados externos
    const updatedCartItems = (items) => {
        setCartItems(items)
    }

    // Esvazia o carrinho completamente (usado após finalizar o pedido)
    const clearCart = () => {
        setCartItems([])
    }

    return (
        // Disponibiliza o estado e todas as funções do carrinho para os componentes filhos
        <CartContext.Provider value={{ 
            cartItems, 
            addToCart, 
            updateQuantity, 
            removeFromCart,
            updatedCartItems,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

// Hook customizado para consumir o contexto do carrinho
// Lança erro se usado fora do CartProvider
export const useCartContext = () => {
    const context = useContext(CartContext);
    
    if (!context) {
        throw new Error('useCartContext deve ser usado dentro de um CartProvider');
    }

    return context;
};
