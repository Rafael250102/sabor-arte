import { Outlet, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { Drawer } from '@mui/material';
import styles from './adminLayout.module.css';

export default function AdminLayout() {
    const navigate = useNavigate();
    const adminData = JSON.parse(localStorage.getItem("adminData") || "{}");
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        navigate("/admin/login", { replace: true });
    };

    return (
        <div className={styles.adminContainer}>
            {/* ===== Sidebar Desktop ===== */}
            <div className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2>Admin</h2>
                    <p>{adminData.fullname || "Administrador"}</p>
                </div>

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

            {/* ===== Conteúdo Principal ===== */}
            <div className={styles.mainContent}>
                <header className={styles.header}>
                    <h1>Painel Administrativo</h1>
                    {/* Corrigido: <span> em vez de <p> para evitar display:flex do index.css */}
                    <span className={styles.welcomeText}>Bem-vindo, {adminData.fullname}</span>
                    {/* data-hamburger permite seletor no index.css sem depender do nome da classe */}
                    <button
                        data-hamburger="true"
                        className={styles.menuButton}
                        onClick={() => setDrawerOpen(true)}
                    >
                        ☰
                    </button>
                </header>

                <div className={styles.pageContent}>
                    <Outlet />
                </div>
            </div>

            {/* ===== Drawer Mobile ===== */}
            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <div className={styles.drawerContent}>
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
