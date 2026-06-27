import styles from './plateCard.module.css'

// URL base da API — usa variável de ambiente se disponível, senão cai no localhost
// Para produção: crie um arquivo .env com VITE_API_URL=https://seudominio.com
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Card de prato exibido na listagem do cliente
// Props:
//   plateData → objeto com name, price, imgUrl do prato
export default function PlateCard({ plateData }) {
    // Monta a URL completa da imagem:
    // - Se já for uma URL absoluta (http/https), usa diretamente
    // - Se for um caminho relativo do backend (/imgs/plates/...), adiciona a base da API
    // - Se não houver imagem, retorna null para exibir o fallback
    const imageUrl = plateData.imgUrl 
        ? (plateData.imgUrl.startsWith('http') 
            ? plateData.imgUrl 
            : `${API_URL}${plateData.imgUrl}`) // Corrigido: era hardcoded como localhost:3000
        : null;

    return (
        <div className={styles.cardContainer}>
            {imageUrl ? (
                <img 
                    src={imageUrl} 
                    alt={plateData.name || "Prato"} 
                    className={styles.plateImage}
                    onError={(e) => {
                        // Se a imagem falhar ao carregar, exibe um placeholder
                        e.target.onerror = null;
                        e.target.src = '/imgs/placeholder.jpg';
                    }}
                />
            ) : (
                <div className={styles.noImage}>Sem imagem</div>
            )}

            <div className={styles.cardContent}>
                <h4>{plateData.name}</h4>
                <h3 className={styles.price}>
                    R$ {Number(plateData.price).toFixed(2)}
                </h3>
            </div>
        </div>
    )
}
