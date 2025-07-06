import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../store/AuthContext';

export const ProfilePage: React.FC = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="profilePage">
      <h2>Привет, юзер!</h2>
      <button onClick={handleLogout} className="profilePage__logout-button">
        Выйти
      </button>
    </div>
  );
};