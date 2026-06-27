import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// Páginas do Cliente
import Home from './pages/home/page.jsx'
import Cart from './pages/cart/page.jsx'
import Profile from './pages/profile/page.jsx'
import Plates from './pages/plates/page.jsx'
import Auth from './pages/auth/page.jsx'

// Páginas do Admin
import AdminLogin from './pages/admin/login/page.jsx'
import AdminLayout from './pages/admin/layout/adminLayout.jsx'
import AdminDashboard from './pages/admin/dashboard/page.jsx'
import AdminPlates from './pages/admin/plates/page.jsx'
import AdminOrders from './pages/admin/orders/page.jsx'
import AdminUsers from './pages/admin/users/page.jsx'

// Define todas as rotas da aplicação
const router = createBrowserRouter([
  {
    // Rota raiz — usa o App como layout base (Navbar + Footer + Outlet)
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },           // Página inicial
      { path: '/cart', element: <Cart /> },        // Carrinho de compras
      { path: '/profile', element: <Profile /> },  // Perfil do usuário
      { path: '/plates', element: <Plates /> },    // Listagem de pratos
      { path: '/auth', element: <Auth /> },        // Login / cadastro do cliente
    ]
  },
  // Rota de login do admin — sem o layout padrão (sem Navbar/Footer)
  {
    path: '/admin/login',
    element: <AdminLogin />
  },
  // Rotas do painel admin — usam o AdminLayout como base
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: 'dashboard', element: <AdminDashboard /> }, // Visão geral e métricas
      { path: 'plates', element: <AdminPlates /> },       // Gerenciamento de pratos
      { path: 'orders', element: <AdminOrders /> },       // Gerenciamento de pedidos
      { path: 'users', element: <AdminUsers /> },         // Gerenciamento de usuários
    ]
  }
])

// Renderiza a aplicação no elemento #root do index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
