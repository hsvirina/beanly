import './App.scss';

import { Outlet } from "react-router-dom";
import { Header } from "./modules/shared/Header";
import { Footer } from "./modules/shared/Footer";


export const App = () => {
  return (
    <div className="App">
      <header className="App__header">
        <Header />
      </header>

        <main className="App__content">
        <Outlet />
      </main>

      <footer className="App__footer">
        <Footer />
      </footer>
    </div>
  );
}
