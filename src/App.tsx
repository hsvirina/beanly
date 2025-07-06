import './styles/main.scss';
import './App.scss';

import { Outlet } from "react-router-dom";
import { Header } from "./modules/shared/Header";
import { Footer } from "./modules/shared/Footer";

export const App = () => {
  return (
    <>
      <header className="App__header">
        <div className="App__header-wrapper">
          <Header />
        </div>
      </header>

      <div className="App">
        <main className="App__content">
          <Outlet />
        </main>
      </div>

      <footer className="App__footer">
        <div className="App__footer-wrapper">
          <Footer />
        </div>
      </footer>
    </>
  );
};