import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LadingPage'; // Certifique-se de que o nome do arquivo é LandingPage.jsx

// Opcional: Importar estilos globais se houverem
// import './App.css'; 

function App() {
  return (
    // Usa Router para que a aplicação possa ser expandida futuramente com rotas
    <Router>
      <Routes>
        {/* Rota Principal: Renderiza a Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Você pode adicionar rotas futuras aqui, como "/termos" ou "/privacidade" */}
        {/* <Route path="/termos" element={<Termos />} /> */}
        
        {/* Rota de fallback (Opcional) */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}

export default App;