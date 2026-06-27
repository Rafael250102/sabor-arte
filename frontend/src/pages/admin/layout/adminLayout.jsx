import { Outlet, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { Drawer } from '@mui/material';
import styles from './adminLayout.module.css';

// Layout base do painel admin — sidebar fixa no desktop, drawer no mobile
export default function AdminLayout() {
    const navigate = useNavigate();
    // Lê os dados do admin autenticado do localStorage
    const adminData = JSON.parse(localStorage.getItem("adminData") || "{}");
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Remove os dados do admin do localStorage e redireciona para o login
    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        navigate("/admin/login", { replace: true });
    };

    return (
        <div className={styles.adminContainer}>
            {/* ===== Sidebar Desktop (posicionada à direita via flex-direction: row-reverse) ===== */}
            <div className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2>Admin</h2>
                    <p>{adminData.fullname || "Administrador"}</p>
                </div>

                {/* Links de navegação do painel admin */}
                <nav className={styles.nav}>
                    <Link to="/admin/dashboard" className={styles.navLink}>📊 Dashboard</Link>
                    <Link to="/admin/plates"    className={styles.navLink}>🍽️ Gerenciar Pratos</Link>
                    <Link to="/admin/orders"    className={styles.navLink}>📦 Pedidos</Link>
                    <Link to="/admin/users"     className={styles.navLink}>👥 Usuários</Link>
                </nav>

                <button onClick={handleLogout} className={styles.logoutBtn}>
                    Sair do Sistema
                </button>
            </div>

            {/* ===== Área de conteúdo principal ===== */}
            <div className={styles.mainContent}>
                <header className={styles.header}>
                    <h1>Painel Administrativo</h1>
                    <span className={styles.welcomeText}>Bem-vindo, {adminData.fullname}</span>
                    {/* Botão hambúrguer — visível apenas no mobile */}
                    <button 
                        className={styles.menuButton}
                        onClick={() => setDrawerOpen(true)}
                    >
                        ☰
                    </button>
                </header>
                
                <div className={styles.pageContent}>
                    {/* Outlet renderiza a página correspondente à rota admin atual */}
                    <Outlet />
                </div>
            </div>

            {/* ===== Drawer lateral Mobile (abre pela direita) ===== */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                <div className={styles.drawerContent}>
                    {/* Cada link fecha o drawer ao ser clicado */}
                    <Link to="/admin/dashboard" className={styles.navLink} onClick={() => setDrawerOpen(false)}>📊 Dashboard</Link>
                    <Link to="/admin/plates"    className={styles.navLink} onClick={() => setDrawerOpen(false)}>🍽️ Gerenciar Pratos</Link>
                    <Link to="/admin/orders"    className={styles.navLink} onClick={() => setDrawerOpen(false)}>📦 Pedidos</Link>
                    <Link to="/admin/users"     className={styles.navLink} onClick={() => setDrawerOpen(false)}>👥 Usuários</Link>
                    
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        Sair do Sistema
                    </button>
                </div>
            </Drawer>
        </div>
    );
}
