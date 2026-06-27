import { Dialog } from "@mui/material";
import styles from './modals.module.css';

// Modal de confirmação antes de excluir um item
// Props:
//   open      → controla visibilidade do dialog
//   onClose   → callback para fechar sem excluir
//   onConfirm → callback chamado ao confirmar a exclusão
//   itemName  → nome do item a ser excluído (disponível para uso futuro no texto)
//   itemType  → tipo do item, ex: "prato", "usuário" (padrão: "item")
export default function ConfirmDeleteModal({ 
    open, 
    onClose, 
    onConfirm, 
    itemName,
    itemType = "item" 
}) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <div className={styles.confirmDeleteContent}>
                <h3>🗑️ Confirmar Exclusão</h3>
                
                <p>
                    Tem certeza que deseja excluir?
                </p>
                
                {/* Aviso em vermelho reforçando que a ação é irreversível */}
                <p className={styles.deleteWarning}>
                    Esta ação não pode ser desfeita!
                </p>

                <div className={styles.buttons}>
                    <button 
                        onClick={onClose} 
                        className={styles.cancelBtn}
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className={styles.deleteBtn}
                    >
                        Sim, Excluir
                    </button>
                </div>
            </div>
        </Dialog>
    );
}
