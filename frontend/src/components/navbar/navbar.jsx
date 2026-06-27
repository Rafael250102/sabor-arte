import styles from './navbar.module.css'
import { LuShoppingCart, LuUser, LuMenu } from "react-icons/lu"
import { Drawer } from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router-dom'

// Navbar principal com versão desktop (links visíveis) e mobile (drawer lateral)
export default function Navbar() {
    const [openMenu, setOpenMenu] = useState(false)

    // Alterna abertura/fechamento do drawer mobile
    const handleOpenMenu = () => {
        setOpenMenu(!openMenu)
    }
 
    return (
        <nav className={styles.navbarContainer}>

            {/* ===== Versão Desktop: links visíveis na barra ===== */}
            <div className={styles.navbarItems}>
                <Link to={'/'}>
                    <img className={styles.logo} src="/imgs/saborarte.png" alt="Logo Sabor Arte" />  
                </Link>              
                <div className={styles.navbarLinksContainer}>
                    <Link to={'/'} className={styles.navbarLink}>🏡 Página Inicial</Link>
                    <Link to={'/plates'} className={styles.navbarLink}>🍽️ Pratos</Link>
                    <Link to={'/cart'}>
                        <LuShoppingCart className={styles.navbarLink} />
                    </Link>
                    <Link to={'/profile'}>
                        <LuUser className={styles.navbarLink} />
                    </Link>                  
                </div>
            </div>

            {/* ===== Versão Mobile: logo + ícone de carrinho + hambúrguer ===== */}
            <div className={styles.mobileNavbarItems}>
                <Link to={'/'}>            
                    <img className={styles.logo} src="/imgs/saborarte.png" alt="Logo Sabor Arte" />
                </Link>
                <div className={styles.mobileNavbarBtns}>
                    <Link to={'/cart'}>
                        <LuShoppingCart className={styles.navbarLink} />
                    </Link>
                    {/* Ícone hambúrguer — abre o drawer lateral */}
                    <LuMenu className={styles.navbarLink} onClick={handleOpenMenu}/>
                </div>
            </div>

            {/* ===== Drawer lateral (menu mobile) — abre pela direita ===== */}
            <Drawer
                anchor='right'
                open={openMenu}
                onClose={handleOpenMenu}
            >
                <div className={styles.drawer}>
                    {/* Cada link fecha o drawer ao ser clicado */}
                    <Link to='/' className={styles.drawerLink} onClick={handleOpenMenu}>
                        🏠 Página Inicial
                    </Link>
                    <Link to='/plates' className={styles.drawerLink} onClick={handleOpenMenu}>
                        🍽️ Pratos
                    </Link>
                    <Link to='/profile' className={styles.drawerLink} onClick={handleOpenMenu}>
                        👤 Perfil
                    </Link>
                </div>
            </Drawer>
        </nav>
    )
}
