import { useEffect, useState, useMemo } from "react"
import platesServices from "../../services/plates"
import Loading from "../loading/page"
import PlateCard from "../../components/plateCard/plateCard"
import styles from './page.module.css'
import PlatePopup from "../../components/platePopup/platePopup"
import { useCartContext } from "../../contexts/useCartContext"

// Página de listagem de pratos disponíveis com filtro por categoria
export default function Plates() {
    const { getAvailablePlates, platesList, platesLoading } = platesServices()
    const [plateSelected, setPlateSelected] = useState(null)       // Prato clicado para abrir no popup
    const [selectedCategory, setSelectedCategory] = useState("Todos")
    const { addToCart } = useCartContext()

    // Busca os pratos disponíveis ao montar o componente
    useEffect(() => {
        getAvailablePlates()
    }, [])

    // Extrai as categorias únicas dos pratos e adiciona "Todos" no início
    // useMemo evita recalcular toda vez que o componente re-renderizar
    const categories = useMemo(() => {
        const uniqueCategories = ["Todos", ...new Set(platesList.map(p => p.category))]
        return uniqueCategories
    }, [platesList])

    // Filtra os pratos pela categoria selecionada
    // "Todos" retorna a lista completa sem filtro
    const filteredPlates = useMemo(() => {
        if (selectedCategory === "Todos") return platesList
        return platesList.filter(plate => plate.category === selectedCategory)
    }, [platesList, selectedCategory])

    // Abre o popup de detalhes do prato clicado
    const handlePlateSelected = (plate) => {
        setPlateSelected(plate)        
    }

    // Fecha o popup de detalhes
    const handleClosePopup = () => {
        setPlateSelected(null)
    }

    // Adiciona o prato ao carrinho e fecha o popup
    const handleAddToCart = (itemToAdd) => {
        addToCart(itemToAdd)
        handleClosePopup()
    }

    // Exibe tela de carregamento enquanto os pratos são buscados
    if (platesLoading) {
        return <Loading />
    }

    return (
        <>
            <div className={styles.pageContainer}>
                <h1>Nossos Pratos</h1>

                {/* Botões de filtro por categoria — gerados dinamicamente */}
                <div className={styles.categoryFilters}>
                    {categories.map(category => (
                        <button
                            key={category}
                            // Aplica classe de ativo na categoria selecionada
                            className={`${styles.categoryBtn} ${selectedCategory === category ? styles.activeCategory : ''}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Grid de cards de pratos filtrados */}
                <div className={styles.platesGrid}>
                    {filteredPlates?.length > 0 ? (
                        filteredPlates.map((plate) => (
                            <div 
                                key={plate._id} 
                                className={styles.cardWrapper}
                                onClick={() => handlePlateSelected(plate)}
                            >
                                <PlateCard plateData={plate} />
                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <p>Nenhum prato disponível nesta categoria.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Popup de detalhes do prato — renderizado apenas quando um prato está selecionado */}
            {plateSelected && (
                <PlatePopup 
                    plateData={plateSelected} 
                    onClose={handleClosePopup} 
                    onAddToCart={handleAddToCart}
                />
            )}
        </>
    );
}
