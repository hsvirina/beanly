import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import { App } from './App';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { PlaceDetailsPage } from './pages/PlaceDetailsPage';
import { ProfilePage } from './pages/ProfilePage';
import { GlobalProvider } from './store/GlobalContext';
import { AuthProvider } from './store/AuthContext';
import { AuthPage } from './pages/AuthPage/AuthPage';


export const Root = () => {
  return (
    <GlobalProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<HomePage />} />
              <Route path="catalog" element={<CatalogPage />} />
              <Route path="catalog/:id" element={<PlaceDetailsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="auth" element={<AuthPage />} />  {/* <-- сюда */}
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </GlobalProvider>
  );
};
