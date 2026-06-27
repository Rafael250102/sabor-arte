import Navbar from "./components/navbar/navbar"
import { Outlet } from "react-router-dom"
import Footer from "./components/footer/footer"
import { CartProvider } from "./contexts/useCartContext"
import AdminButton from "./components/adminButton/adminButton"

// Componente raiz da aplicação — define o layout base para todas as rotas do cliente
// O CartProvider envolve tudo para que o carrinho seja acessível em qualquer página
export default function App() {
  return (
      <>
          <CartProvider>
            <Navbar />
              <main>
                {/* Outlet renderiza a página correspondente à rota atual */}
                <Outlet />
              </main>
              <Footer />
              {/* Botão flutuante de acesso ao painel admin */}
              <AdminButton/>
          </CartProvider>
      </>
  )
}
