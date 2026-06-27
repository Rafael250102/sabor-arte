import { useState, useEffect } from "react";
import styles from './page.module.css';
import ConfirmDeleteModal from '../../../components/modals/confirmDeleteModal';
import SuccessModal from '../../../components/modals/successModal';

// URL base da API — usa variável de ambiente se disponível, senão cai no localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados dos modais de confirmação e sucesso
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    // Busca todos os usuários da API
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/users`); // Corrigido: era hardcoded
            const data = await response.json();
            setUsers(data.body || []);
        } catch (error) {
            console.error("Erro ao carregar usuários:", error);
        } finally {
            setLoading(false);
        }
    };

    // Carrega os usuários ao montar o componente
    useEffect(() => {
        fetchUsers();
    }, []);

    // Abre o modal de confirmação para o usuário selecionado
    const handleOpenDeleteModal = (user) => {
        setUserToDelete(user);
        setDeleteModalOpen(true);
    };

    // Confirma e executa a exclusão do usuário selecionado
    const handleConfirmDelete = async () => {
        if (!userToDelete) return;

        try {
            const res = await fetch(`${API_URL}/users/${userToDelete._id}`, { // Corrigido: era hardcoded
                method: 'DELETE' 
            });

            if (res.ok) {
                setDeleteModalOpen(false);
                setSuccessMessage(`Usuário "${userToDelete.fullname}" excluído com sucesso!`);
                setSuccessModalOpen(true);
                fetchUsers(); // Recarrega a lista para refletir a remoção
            } else {
                alert("Erro ao excluir usuário.");
            }
        } catch (error) {
            console.error(error);
            alert("Erro de conexão.");
        }
    };

    // Fecha o modal de sucesso e limpa o usuário em exclusão
    const handleCloseSuccess = () => {
        setSuccessModalOpen(false);
        setUserToDelete(null);
    };

    if (loading) return <p>Carregando usuários...</p>;

    return (
        <div className={styles.usersContainer}>
            <div className={styles.header}>
                <h1>Gerenciar Usuários</h1>
                <p>Total de usuários: {users.length}</p>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.usersTable}>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Data de Cadastro</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.fullname}</td>
                                <td>{user.email}</td>
                                {/* Formata a data de criação para o padrão brasileiro */}
                                <td>{new Date(user.createdAt).toLocaleDateString('pt-BR')}</td>
                                <td>
                                    {/* Abre modal de confirmação antes de excluir */}
                                    <button 
                                        className={styles.deleteBtn}
                                        onClick={() => handleOpenDeleteModal(user)}
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de confirmação de exclusão */}
            <ConfirmDeleteModal 
                open={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setUserToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                itemName={userToDelete?.fullname}
                itemType="usuário"
            />

            {/* Modal de feedback após exclusão bem-sucedida */}
            <SuccessModal 
                open={successModalOpen}
                onClose={handleCloseSuccess}
                message={successMessage}
                title="Usuário excluído!"
            />
        </div>
    );
}
