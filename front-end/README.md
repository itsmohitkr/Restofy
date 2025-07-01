# Restofy Frontend

A modern, responsive React application for restaurant management built with React 18, Tailwind CSS, and modern web technologies.

## 🚀 Features

- **Authentication System**: Secure login and signup with JWT tokens
- **Dashboard**: Overview with charts, stats, and quick actions
- **Restaurant Management**: CRUD operations for restaurants
- **Table Management**: Manage restaurant tables and their status
- **Menu Management**: Create and manage menu items with categories
- **Reservation System**: Handle customer reservations with status tracking
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Beautiful interface with Tailwind CSS and Lucide icons
- **Form Validation**: Client-side validation with React Hook Form
- **Toast Notifications**: User feedback with react-hot-toast
- **Protected Routes**: Role-based access control

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks and functional components
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Performant forms with validation
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Toast notifications
- **Recharts** - Chart components for data visualization
- **Framer Motion** - Animation library
- **Date-fns** - Date utility library

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd front-end
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENV=development
```

### Backend Connection

The frontend is configured to connect to the backend at `http://localhost:3001` (proxy configuration in `package.json`).

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.js       # Main layout with sidebar
│   └── RestaurantModal.js # Modal for restaurant CRUD
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication context
├── pages/              # Page components
│   ├── Dashboard.js    # Main dashboard
│   ├── Login.js        # Login page
│   ├── Signup.js       # Signup page
│   ├── Restaurants.js  # Restaurant listing
│   ├── RestaurantDetail.js # Restaurant details
│   ├── Tables.js       # Table management
│   ├── Menu.js         # Menu management
│   └── Reservations.js # Reservation management
├── App.js              # Main app component
├── index.js            # App entry point
└── index.css           # Global styles
```

## 🎨 Design System

### Colors
- **Primary**: Blue shades (#0ea5e9)
- **Success**: Green shades (#22c55e)
- **Warning**: Yellow shades (#f59e0b)
- **Error**: Red shades (#ef4444)
- **Secondary**: Gray shades (#64748b)

### Components
- **Cards**: Consistent card design with shadows
- **Buttons**: Multiple button variants (primary, secondary, success, warning, error)
- **Forms**: Styled form inputs with validation states
- **Modals**: Reusable modal components
- **Tables**: Responsive table designs

## 🔐 Authentication

The app uses JWT-based authentication with the following features:

- **Login**: Email and password authentication
- **Signup**: User registration with validation
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Token Management**: Automatic token refresh and logout
- **User Context**: Global user state management

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## 🔌 API Integration

The frontend integrates with the Restofy backend API:

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verifyToken` - Verify authentication

### Restaurant Endpoints
- `GET /api/restaurants` - Get all restaurants
- `POST /api/restaurants` - Create restaurant
- `GET /api/restaurants/:id` - Get restaurant details
- `PUT /api/restaurants/:id` - Update restaurant
- `DELETE /api/restaurants/:id` - Delete restaurant

### Table Endpoints
- `GET /api/restaurants/:id/tables` - Get restaurant tables
- `POST /api/restaurants/:id/tables` - Create table
- `PUT /api/tables/:id` - Update table
- `DELETE /api/tables/:id` - Delete table

### Menu Endpoints
- `GET /api/restaurants/:id/menu` - Get restaurant menu
- `POST /api/restaurants/:id/menu` - Add menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item

### Reservation Endpoints
- `GET /api/restaurants/:id/reservations` - Get reservations
- `POST /api/restaurants/:id/reservations` - Create reservation
- `PUT /api/reservations/:id` - Update reservation
- `DELETE /api/reservations/:id` - Delete reservation

## 🎯 Key Features

### Dashboard
- Overview statistics
- Revenue charts
- Table status visualization
- Recent activity feed
- Quick action buttons

### Restaurant Management
- Restaurant listing with search
- Add/edit restaurant details
- Restaurant information display
- Quick stats and metrics

### Table Management
- Table status tracking (Available, Occupied, Reserved)
- Capacity management
- Location-based organization
- Status change functionality

### Menu Management
- Menu item CRUD operations
- Category-based organization
- Price management
- Availability toggling

### Reservation System
- Date-based reservation viewing
- Status management (Confirmed, Pending, Cancelled)
- Customer information tracking
- Special requests handling

## 🧪 Testing

The application includes testing setup with:
- Jest for unit testing
- React Testing Library for component testing
- User event simulation

## 📦 Build and Deploy

### Production Build
```bash
npm run build
```

### Deployment
The app can be deployed to:
- Vercel
- Netlify
- AWS S3
- Any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Updates

Stay updated with the latest features and improvements by:
- Following the repository
- Checking the changelog
- Reading the release notes

---

**Restofy Frontend** - Modern restaurant management made simple and beautiful. 