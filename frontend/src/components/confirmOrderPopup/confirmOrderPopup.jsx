import { Dialog } from "@mui/material";
import styles from './confirmOrderPopup.module.css';
import { useState } from "react";
import { TextField } from "@mui/material";

// Popup de confirmação de pedido: coleta horário de retirada e forma de pagamento
// Props:
//   open       → controla visibilidade do dialog
//   onClose    → callback para fechar sem confirmar
//   onConfirm  → callback chamado com { pickupTime, paymentMethod } ao confirmar
export default function ConfirmOrderPopup({ open, onClose, onConfirm }) {
    const [formData, setFormData] = useState({
        pickupTime: "",
        paymentMethod: ""
    });

    // Opções de pagamento exibidas como botões selecionáveis
    const paymentOptions = [
        { value: "pix", label: "Pix", icon: "💰" },
        { value: "dinheiro", label: "Dinheiro", icon: "💵" },
        { value: "cartao_credito", label: "Cartão de Crédito", icon: "💳" },
        { value: "cartao_debito", label: "Cartão de Débito", icon: "💳" },
        { value: "voucher", label: "Voucher (VA/VR)", icon: "🎟️" },
    ];

    // Atualiza campos do formulário dinamicamente pelo atributo name do input
    const handleFormDataChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // Seleciona a forma de pagamento clicada
    const handlePaymentSelect = (method) => {
        setFormData(prev => ({ ...prev, paymentMethod: method }));
    };

    // Valida os campos e envia os dados ao componente pai
    const handleConfirm = (e) => {
        e.preventDefault();

        if (!formData.pickupTime) {
            alert("Por favor, selecione um horário.");
            return;
        }
        if (!formData.paymentMethod) {
            alert("Por favor, selecione uma forma de pagamento.");
            return;
        }

        onConfirm(formData);
        onClose();
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <div className={styles.popupContainer}>
                <h2>Estamos quase lá...</h2>
                <p>Confirme seu pedido para o dia <strong>{new Date().toLocaleDateString('pt-BR')}</strong>.</p>
                <p>Em qual horário você virá buscar seu pedido?</p>

                <form className={styles.formContainer} onSubmit={handleConfirm}>
                    {/* Campo de horário de retirada */}
                    <TextField
                        onChange={handleFormDataChange}
                        required
                        type="time"
                        name="pickupTime"
                        value={formData.pickupTime}
                        fullWidth
                        margin="normal"
                        className={styles.timeContainer}
                    />

                    <p className={styles.paymentTitle}>Forma de Pagamento</p>
                    
                    {/* Renderiza os botões de forma de pagamento dinamicamente */}
                    <div className={styles.paymentOptions}>
                        {paymentOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                // Aplica a classe 'selected' no botão ativo
                                className={`${styles.paymentBtn} ${formData.paymentMethod === option.value ? styles.selected : ''}`}
                                onClick={() => handlePaymentSelect(option.value)}
                            >
                                <span className={styles.paymentIcon}>{option.icon}</span>
                                {option.label}
                            </button>
                        ))}
                    </div>

                    <div className={styles.confirmBtns}>
                        <button 
                            type="button" 
                            className={styles.cancelBtn} 
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit"
                            className={styles.confirmBtn}
                        >
                            Confirmar Pedido
                        </button>
                    </div>
                </form>
            </div>
        </Dialog>
    );
}
