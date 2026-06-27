# 🍽️ Sabor & Arte — Sistema Web para Restaurante

> Plataforma completa de pedidos online para restaurante, com interface para clientes e painel administrativo.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Demonstração](#demonstração)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Banco de Dados](#banco-de-dados)
- [Como Rodar Localmente](#como-rodar-localmente)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Deploy](#deploy)
- [Autor](#autor)

---

## 📌 Visão Geral

O **Sabor & Arte** é um sistema web full-stack desenvolvido para gerenciar pedidos de um restaurante. A plataforma oferece duas interfaces distintas:

- **Cliente** — navegação pelo cardápio, montagem do carrinho, realização de pedidos com horário de retirada e acompanhamento do histórico.
- **Administrador** — painel completo para gerenciamento de pratos, pedidos e usuários, com dashboard de métricas e gráficos de faturamento.

**Status:** ✅ Funcional — desenvolvido com foco em usabilidade, responsividade e organização de código.

---

## 🚀 Tecnologias

### Frontend
| Tecnologia | Uso |
|---|---|
| React 18 + Vite | Framework e build tool |
| React Router DOM v6 | Roteamento client-side |
| CSS Modules | Estilização modular por componente |
| Material UI (MUI) | Componentes de UI (Dialogs, TextField, Drawer) |
| Chart.js + react-chartjs-2 | Gráfico de faturamento no dashboard |
| react-icons | Ícones (LuShoppingCart, FaInstagram, etc.) |
| Context API | Gerenciamento de estado global do carrinho |
| Fetch API | Comunicação com o backend |

### Backend
| Tecnologia | Uso |
|---|---|
| Node.js + Express.js | Servidor e rotas REST |
| MongoDB (driver nativo) | Banco de dados NoSQL |
| Passport.js + JWT | Autenticação e autorização |
| PBKDF2 (crypto nativo) | Hash seguro de senhas |
| Multer | Upload de imagens dos pratos |
| dotenv | Gerenciamento de variáveis de ambiente |

---

## 📁 Estrutura do Projeto

```
sabor-arte/
├── backend/
│   ├── src/
│   │   ├── auth/           # Estratégia Passport + rotas de login/signup
│   │   ├── controllers/    # Camada de controle (orders, plates, users)
│   │   ├── dataAccess/     # Queries MongoDB (aggregations, CRUD)
│   │   ├── database/       # Conexão com MongoDB
│   │   ├── helpers/        # Respostas HTTP padronizadas
│   │   ├── routes/         # Definição das rotas REST
│   │   └── index.js        # Entry point do servidor
│   ├── public/
│   │   └── imgs/
│   │       └── plates/     # Imagens dos pratos (geradas pelo Multer)
│   ├── .env                # Variáveis de ambiente (não versionado)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── adminButton/
    │   │   ├── confirmOrderPopup/
    │   │   ├── footer/
    │   │   ├── icons/          # SVGs (Dessert, NaturalFood, Vegetable)
    │   │   ├── modals/         # ConfirmDeleteModal, SuccessModal
    │   │   ├── navbar/
    │   │   ├── plateCard/
    │   │   └── platePopup/
    │   ├── contexts/
    │   │   └── useCartContext.jsx  # Context API do carrinho
    │   ├── pages/
    │   │   ├── admin/
    │   │   │   ├── dashboard/  # Métricas + gráfico de faturamento
    │   │   │   ├── layout/     # Sidebar + estrutura do painel
    │   │   │   ├── login/      # Login exclusivo do admin
    │   │   │   ├── orders/     # Listagem e gestão de pedidos
    │   │   │   ├── plates/     # CRUD de pratos + upload de imagem
    │   │   │   └── users/      # Listagem e exclusão de usuários
    │   │   ├── auth/           # Login e cadastro do cliente
    │   │   ├── cart/           # Carrinho de compras
    │   │   ├── home/           # Página inicial
    │   │   ├── loading/        # Componente de loading
    │   │   ├── plates/         # Cardápio com filtro por categoria
    │   │   └── profile/        # Perfil e histórico de pedidos
    │   ├── services/
    │   │   ├── auth.js         # Login, signup, logout
    │   │   ├── order.js        # Buscar e enviar pedidos
    │   │   └── plates.js       # Buscar pratos disponíveis
    │   ├── App.jsx
    │   ├── App.module.css
    │   ├── main.jsx
    │   └── index.css
    ├── public/
    └── package.json
```

---

## ✅ Funcionalidades

### 👤 Cliente
- Cadastro e login com validação de senha
- Página inicial com hero, diferenciais e links para redes sociais
- Cardápio com filtro por categoria e popup de detalhes do prato
- Carrinho com controle de quantidade, remoção com confirmação e cálculo de total
- Confirmação de pedido com escolha de horário de retirada e forma de pagamento
- Perfil com histórico de pedidos filtrado por status (Pendente, Concluído, Cancelado)

### 🔧 Administrador
- Login isolado em `/admin/login` com verificação de role
- **Dashboard:** cards de métricas (pedidos, faturamento, pratos ativos, clientes) e gráfico de barras
- **Pratos:** cadastro, edição e exclusão com upload de imagem, controle de disponibilidade e ingredientes
- **Pedidos:** listagem completa com filtro por status, marcação como Concluído ou Cancelado
- **Usuários:** listagem com data de cadastro e exclusão com confirmação

---

## 🗄️ Banco de Dados

O projeto usa **MongoDB** com 4 coleções principais:

| Coleção | Descrição |
|---|---|
| `users` | Clientes e administradores (role: customer / admin) |
| `plates` | Pratos com nome, preço, categoria, ingredientes e imagem |
| `orders` | Pedidos com status, horário de retirada e forma de pagamento |
| `orderItems` | Itens de cada pedido vinculados por `orderId` |

Os pedidos usam **MongoDB Aggregation Pipeline** para juntar `orders` + `orderItems` + `plates` + `users` em uma única query, calculando o total automaticamente.

---

## ⚙️ Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- MongoDB local ou conta no [MongoDB Atlas](https://www.mongodb.com/atlas)

### 1. Clone o repositório

```bash
git clone https://github.com/Rafael250102/sabor-arte.git
cd sabor-arte
```

### 2. Configure e rode o Backend

```bash
cd backend
npm install
```

Crie o arquivo `.env` na pasta `backend/` (veja a seção [Variáveis de Ambiente](#variáveis-de-ambiente)).

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`.

### 3. Configure e rode o Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

### 4. Crie o primeiro administrador

Com o backend rodando, faça uma requisição POST para criar o admin inicial:

```bash
curl -X POST http://localhost:3000/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{"fullname": "Administrador", "email": "admin@saborarte.com", "password": "suasenha"}'
```

> ⚠️ Remova ou proteja a rota `/auth/create-admin` após criar o admin em produção.

---

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` dentro da pasta `backend/`:

```env
MONGO_CS=mongodb+srv://usuario:senha@cluster.mongodb.net/
MONGO_DB_NAME=saborarte
JWT_SECRET=uma_chave_longa_e_aleatoria_aqui
```

Crie um arquivo `.env` dentro da pasta `frontend/`:

```env
VITE_API_URL=http://localhost:3000
```

> Em produção, substitua `VITE_API_URL` pela URL do seu backend hospedado.

---

## 🌐 Deploy

O projeto está preparado para deploy nas seguintes plataformas:

| Parte | Plataforma sugerida |
|---|---|
| Backend | [Railway](https://railway.app) ou [Render](https://render.com) |
| Frontend | [Vercel](https://vercel.com) ou [Netlify](https://netlify.com) |
| Banco de Dados | [MongoDB Atlas](https://www.mongodb.com/atlas) |

Lembre-se de configurar as variáveis de ambiente nas plataformas escolhidas e atualizar o `VITE_API_URL` com a URL pública do backend.

---

## 👨‍💻 Autor

Desenvolvido por **Rafael Queiroz**

[![GitHub](https://img.shields.io/badge/GitHub-Rafael250102-181717?style=flat&logo=github)](https://github.com/Rafael250102)
