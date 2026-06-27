import { Dialog } from "@mui/material";
import styles from './modals.module.css';

// Modal genérico de feedback de sucesso
// Props:
//   open    → controla visibilidade do dialog
//   onClose → callback para fechar o modal
//   message → mensagem de sucesso exibida ao usuário
//   title   → título do modal (padrão: "Sucesso!")
export default function SuccessModal({ 
    open, 
    onClose, 
    message, 
    title = "Sucesso!" 
}) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <div className={styles.successModalContent}>
                <h3>🎉 {title}</h3>
                <p>{message}</p>
                
                <div className={styles.buttons}>
                    {/* Botão de fechar reutiliza o estilo saveBtn (verde) */}
                    <button onClick={onClose} className={styles.saveBtn}>
                        OK
                    </button>
                </div>
            </div>
        </Dialog>
    );
}
