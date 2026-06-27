import { Link } from "react-router-dom";
import styles from './adminButton.module.css';

// Botão flutuante fixo no canto inferior direito para acessar o painel admin
// Visível para qualquer visitante — considere esconder se o usuário não for admin
export default function AdminButton() {
    return (
        <Link
            to="/admin/login"
            className={styles.adminButton}
        >
            🔧 Admin
        </Link>
    );
}
