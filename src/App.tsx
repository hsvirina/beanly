import './styles/main.scss';
import './App.scss';

import { Outlet } from "react-router-dom";
import { Header } from "./modules/shared/Header";
import { Footer } from "./modules/shared/Footer";
import { useEffect } from 'react';
import axios from 'axios';


export const App = () => {
  useEffect(() => {
    axios.get('http://ec2-54-221-160-23.compute-1.amazonaws.com/api/cafes')
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Помилка:', error);
      });
  }, []);

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
