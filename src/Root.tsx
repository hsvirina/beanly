import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { App } from './App';


export const Root = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<HomePage />} />
          </Route>
        </Routes>
      </Router>

  );
};
