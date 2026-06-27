import { useState, useEffect } from "react";
import styles from './page.module.css';
import PlateModal from './plateModal';
import ConfirmDeleteModal from '../../../components/modals/confirmDeleteModal';
import SuccessModal from "../../../components/modals/successModal";

// URL base da API — usa variável de ambiente se disponível, senão cai no localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function AdminPlates() {
    const [plates, setPlates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPlate, setEditingPlate] = useState(null); // null = novo prato, objeto = edição

    // Estados do modal de exclusão
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [plateToDelete, setPlateToDelete] = useState(null);

    // Estados do modal de sucesso
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Busca todos os pratos da API
    const fetchPlates = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/plates`); // Corrigido: era hardcoded
            const data = await response.json();
            setPlates(data.body || data || []);
        } catch (error) {
            console.error("Erro ao carregar pratos:", error);
        } finally {
            setLoading(false);
        }
    };

    // Carrega os pratos ao montar o componente
    useEffect(() => {
        fetchPlates();
    }, []);

    // Abre o modal de cadastro (plate = null) ou edição (plate = objeto do prato)
    const handleOpenModal = (plate = null) => {
        setEditingPlate(plate);
        setModalOpen(true);
    };

    // Fecha o modal e limpa o prato em edição
    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingPlate(null);
    };

    // Exibe o modal de sucesso com a mensagem informada e recarrega a lista de pratos
    const showSuccess = (message) => {
        setSuccessMessage(message);
        setSuccessModalOpen(true);
        fetchPlates();
    };

    // Abre o modal de confirmação de exclusão para o prato selecionado
    const handleDeleteClick = (plate) => {
        setPlateToDelete(plate);
        setDeleteModalOpen(true);
    };

    // Confirma a exclusão do prato e exibe feedback de sucesso ou erro
    const handleConfirmDelete = async () => {
        if (!plateToDelete) return;

        try {
            const res = await fetch(`${API_URL}/plates/${plateToDelete._id}`, { // Corrigido: era hardcoded
                method: 'DELETE' 
            });
            
            if (res.ok) {
                showSuccess("🗑️ Prato excluído com sucesso!");
            } else {
                alert("Erro ao excluir o prato.");
            }
        } catch (error) {
            console.error(error);
            alert("Erro de conexão com o servidor.");
        } finally {
            // Sempre fecha o modal e limpa o estado, mesmo em caso de erro
            setDeleteModalOpen(false);
            setPlateToDelete(null);
        }
    };

    return (
        <div className={styles.platesContainer}>
            <div className={styles.header}>
                <h1>Gerenciar Pratos</h1>
                {/* Botão de cadastro de novo prato — passa null para o modal */}
                <button className={styles.addButton} onClick={() => handleOpenModal()}>
                    + Novo Prato
                </button>
            </div>

            {loading ? (
                <p>Carregando pratos...</p>
            ) : (
                <div className={styles.tableContainer}>
                    <table className={styles.platesTable}>
                        <thead>
                            <tr>
                                <th>Imagem</th>
                                <th>Nome</th>
                                <th>Categoria</th>
                                <th>Preço</th>
                                <th>Disponível</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {plates.map(plate => (
                                <tr key={plate._id}>
                                    <td>
                                        {plate.imgUrl ? (
                                            <img 
                                                src={`${API_URL}${plate.imgUrl}`} // Corrigido: era hardcoded
                                                alt={plate.name} 
                                                className={styles.plateImg} 
                                                onError={(e) => {
                                                    // Oculta a imagem se o arquivo não for encontrado
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <span style={{color: '#999', fontSize: '0.9rem'}}>Sem imagem</span>
                                        )}
                                    </td>
                                    <td>{plate.name}</td>
                                    <td>{plate.category}</td>
                                    <td>R$ {Number(plate.price).toFixed(2)}</td>
                                    <td>
                                        {/* Exibe badge colorido de disponibilidade */}
                                        <span className={plate.available ? styles.available : styles.unavailable}>
                                            {plate.available ? "✅ Sim" : "❌ Não"}
                                        </span>
                                    </td>
                                    <td>
                                        {/* Abre o modal com os dados do prato para edição */}
                                        <button className={styles.editBtn} onClick={() => handleOpenModal(plate)}>
                                            Editar
                                        </button>
                                        {/* Abre o modal de confirmação de exclusão */}
                                        <button 
                                            className={styles.deleteBtn} 
                                            onClick={() => handleDeleteClick(plate)}
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal de cadastro/edição de prato */}
            <PlateModal 
                open={modalOpen} 
                onClose={handleCloseModal} 
                plate={editingPlate} 
                onSuccess={showSuccess}
            />

            {/* Modal de confirmação antes de excluir */}
            <ConfirmDeleteModal 
                open={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setPlateToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                plateName={plateToDelete?.name}
            />

            {/* Modal de feedback de sucesso após ação */}
            <SuccessModal 
                open={successModalOpen}
                onClose={() => setSuccessModalOpen(false)}
                message={successMessage}
            />
        </div>
    );
}
