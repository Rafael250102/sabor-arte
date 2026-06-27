import styles from './page.module.css';
import Dessert from '../../components/icons/dessert';
import NaturalFood from '../../components/icons/naturalFood';
import Vegetable from '../../components/icons/vegetable';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookSquare, FaWhatsapp } from "react-icons/fa";

export default function Home() {
    return (
        <main className={styles.main}>
            
            {/* HERO COM IMAGEM */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>Bem-vindo ao <span>Sabor &amp; Arte</span></h1>
                    <p>
                        Um espaço onde a gastronomia ganha vida através da criatividade, 
                        do sabor e da experiência. Transformamos cada prato em um momento especial.
                    </p>
                </div>
            </section>

            {/* CARDS CENTRALIZADOS */}
            <section className={styles.foodSection}>
                <div className={styles.card}>
                    <div className={styles.iconCircle}><NaturalFood /></div>
                    <h3>Excelência no dia a dia</h3>
                    <p>Descubra nossa seleção diária de pratos exclusivos para dar um toque fresco e requintado.</p>
                </div>

                <div className={styles.card}>
                    <div className={styles.iconCircle}><Vegetable /></div>
                    <h3>Ingredientes de primeira escolha</h3>
                    <p>Selecionamos cuidadosamente ingredientes excepcionais para garantir qualidade superior.</p>
                </div>

                <div className={styles.card}>
                    <div className={styles.iconCircle}><Dessert /></div>
                    <h3>Para todos os gostos</h3>
                    <p>Explore um mundo de sabores com nossa ampla variedade, criada para agradar toda a família.</p>
                </div>

                <div className={styles.buttonContainer}>
                    <Link to="/plates" className={styles.ctaButton}>
                        Ver nossos pratos
                    </Link>
                </div>
            </section>

            {/* REDES SOCIAIS */}
            <section className={styles.contactSection}>
                <h2>Fique por dentro das novidades!</h2>
                <p>
                    Siga-nos nas redes sociais e acompanhe nossas criações culinárias, 
                    eventos especiais e surpresas gastronômicas.
                </p>
                
                <div className={styles.socialIcons}>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <FaInstagram size={36} />
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <FaFacebookSquare size={36} />
                    </a>
                    <a href="https://wa.me" target="_blank" rel="noopener noreferrer">
                        <FaWhatsapp size={36} />
                    </a>
                </div>
            </section>
        </main>
    );
}