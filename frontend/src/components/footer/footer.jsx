import styles from './footer.module.css'
import { Link } from 'react-router-dom'
import { FaMapMarkerAlt, FaFacebookSquare, FaInstagram, FaWhatsapp } from "react-icons/fa"

export default function Footer() {
    return (
        <footer className={styles.footerContainer}>
            <img src='/imgs/saborarte.png'></img>
            <div className={styles.socialButtonsContainer}>
                <button className={styles.socialButton}><FaInstagram /> Instagram</button>
                <button className={styles.socialButton}><FaFacebookSquare /> Facebook</button>
                <button className={styles.socialButton}><FaWhatsapp /> Whatsapp</button>
                <button className={styles.socialButton}><FaMapMarkerAlt />Location</button>
            </div>
            <div className={styles.autoria}>
                <h3>Desenvolvido por Rafael Queiroz.</h3>
                <a href="https://github.com/Rafael250102" target='_blank' className={styles.link}>Veja meus projetos!</a>
            </div>
        </footer>
    )
}