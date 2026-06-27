import { CircularProgress } from '@mui/material'
import styles from './page.module.css'

// Componente de tela de carregamento — exibido enquanto dados são buscados
// Usa o CircularProgress do MUI com cor herdada do contexto (verde via index.css)
export default function Loading() {
    return (
        <div className={styles.loadingPageContainer}>
            Carregando...
            <CircularProgress color='inherit'/>
        </div>
    )
}
