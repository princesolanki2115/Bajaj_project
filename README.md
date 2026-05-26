# 🎫 DeskFlow — Support Ticket Triage Board

A modern, production-ready MERN stack application for managing support tickets with a Kanban-style triage board. Built with React, Node.js, Express, and MongoDB Atlas.

![DeskFlow Banner](https://img.shields.io/badge/DeskFlow-Support%20Ticket%20Triage-6366f1?style=for-the-badge&logo=react&logoColor=white)

## 🚀 Live Demo

- **Frontend (Netlify):** [https://deskflow-triage.netlify.app](https://deskflow-triage.netlify.app)
- **Backend API (Render):** [https://deskflow-backend.onrender.com/api](https://deskflow-backend.onrender.com/api)

## ✨ Features

### Core Features
- 📋 **Kanban Board** — 4-column board (Open, In Progress, Resolved, Closed)
- 🎯 **Drag & Drop** — Move tickets between columns with dnd-kit
- 🔄 **Status Transitions** — Enforced workflow rules (forward and limited backward transitions)
- ⏰ **SLA Tracking** — Automatic SLA breach detection based on priority
- 📊 **Real-time Stats** — Dashboard showing ticket counts and breach alerts

### UI/UX Features
- 🌙 **Dark/Light Mode** — Toggle with persistent preference
- 💎 **Glassmorphism Design** — Modern frosted glass card effects
- 🎨 **Gradient Backgrounds** — Beautiful color gradients throughout
- ✨ **Framer Motion Animations** — Smooth transitions and micro-interactions
- 📱 **Fully Responsive** — Works on desktop, tablet, and mobile
- 🔍 **Advanced Filters** — Search, priority, status, SLA breach filters
- 🗑️ **Confirmation Modals** — Safe delete with confirmation dialogs
- 🍞 **Toast Notifications** — Instant feedback for all actions

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas |
| **State Management** | React Context API + useReducer |
| **HTTP Client** | Axios |
| **Drag & Drop** | @dnd-kit |
| **Animations** | Framer Motion |
| **Icons** | React Icons |
| **Notifications** | React Hot Toast |
| **Deployment** | Netlify (Frontend), Render (Backend) |

## 📁 Project Structure

```
deskflow/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── errorHandler.js    # Global error handler
│   ├── models/
│   │   └── Ticket.js          # Ticket schema with SLA virtuals
│   ├── routes/
│   │   └── tickets.js         # API routes
│   ├── utils/
│   │   └── transitions.js     # Status transition validation
│   ├── .env.example
│   ├── package.json
│   └── server.js              # Express server entry
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── ticketApi.js   # Axios API client
│   │   ├── components/
│   │   │   ├── Board.jsx          # Kanban board with DnD
│   │   │   ├── Column.jsx         # Board column
│   │   │   ├── CreateTicketModal.jsx
│   │   │   ├── DeleteConfirmModal.jsx
│   │   │   ├── Filters.jsx        # Search & filter bar
│   │   │   ├── Navbar.jsx         # Header with theme toggle
│   │   │   ├── SkeletonLoader.jsx # Loading skeletons
│   │   │   ├── StatsStrip.jsx     # Stats dashboard
│   │   │   └── TicketCard.jsx     # Ticket card component
│   │   ├── context/
│   │   │   ├── ThemeContext.jsx   # Dark/light mode
│   │   │   └── TicketContext.jsx  # Global state management
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── .gitignore
└── README.md
```

## 🏗️ Setup Instructions

### Prerequisites
- Node.js >= 14.0.0
- npm >= 6.0.0
- MongoDB Atlas account (free tier)

### 1. Clone the Repository
```bash
git clone https://github.com/princesolanki23/deskflow-triage-board.git
cd deskflow-triage-board
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/deskflow?retryWrites=true&w=majority
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Start the backend:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
```

Create a `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

### 4. MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address (or 0.0.0.0/0 for development)
5. Get the connection string and add to backend `.env`

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/tickets` | Create a new ticket |
| `GET` | `/api/tickets` | Get all tickets (with filters) |
| `GET` | `/api/tickets/stats` | Get ticket statistics |
| `PATCH` | `/api/tickets/:id` | Update ticket status |
| `DELETE` | `/api/tickets/:id` | Delete a ticket |

### Query Parameters (GET /api/tickets)
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status |
| `priority` | string | Filter by priority |
| `breached` | boolean | Filter SLA breached tickets |
| `search` | string | Search by subject |

## 🔄 Status Transition Rules

### Forward Transitions (Allowed)
```
open → in_progress → resolved → closed
```

### Backward Transitions (Allowed, one step only)
```
resolved → in_progress
closed → resolved
```

### Disallowed Transitions
- `open → resolved` ❌
- `open → closed` ❌
- `in_progress → closed` ❌

## ⏰ SLA Response Time Targets

| Priority | Target |
|----------|--------|
| 🔴 Urgent | 1 hour |
| 🟠 High | 4 hours |
| 🟡 Medium | 24 hours |
| 🟢 Low | 72 hours |

## 🚀 Deployment

### Backend → Render
1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Set root directory to `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variables:
   - `MONGODB_URI`
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://deskflow-triage.netlify.app`

### Frontend → Netlify
1. Create a new site on [Netlify](https://netlify.com)
2. Connect your GitHub repository
3. Set base directory to `frontend`
4. Build command: `npm run build`
5. Publish directory: `frontend/dist`
6. Add environment variable:
   - `VITE_API_URL=https://your-render-backend.onrender.com/api`

## 👤 Author

- **Name:** Prince Solanki
- **Email:** princesolanki230449@acropolis.in
- **Roll Number:** 0827cs231191

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using the MERN Stack
