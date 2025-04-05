import React from "react";
import { useNavigate } from "react-router-dom";
import "../Estilos/Home.css";
import logo from "../resources/CLAIRITYWHITEMONO.png";
import home from "../resources/home_back_image.png";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page-container">
      <div className="home-page-content">
      <img src="https://ambystomadev.uteq.edu.mx/Content/assets/Logo_uteq_color.png"  />
      <p className="home-page-tagline">
          
        </p>
        <div className="home-page-buttons">
          <button className="home-page-btn" onClick={() => navigate("/login")}>
            Iniciar sesión
          </button>
          <button className="home-page-btn" onClick={() => navigate("/signup")}>
            Crear cuenta
          </button>
         
        </div>
      </div>
      <div className="home-page-image-container">
        <img src={home} alt="Ilustración fondo" className="home-page-image" />
      </div>
    </div>
  );
}

export default Home;
