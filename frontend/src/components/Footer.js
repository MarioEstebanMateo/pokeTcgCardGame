import React from "react";

import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer container-fluid text-center">
      <p>
        Juego de Cartas Coleccionables de Batalla por Mario
        <br />
        Aviso Legal: Proyecto de fans no afiliado a Nintendo, The Pokémon
        Company ni entidades oficiales. Todas las marcas, logotipos e imágenes
        son propiedad de sus respectivos dueños. Imágenes de cartas usadas bajo
        términos de uso justo y la API de Pokémon TCG Developers.
        <br />
        Este sitio es sin fines comerciales, sin monetización ni publicidad.
        Fines de entretenimiento únicamente. Apoya el juego oficial comprando
        cartas originales.
        <br />
        Nota: Precios mostrados son referenciales y no implican venta de
        productos.
      </p>
    </div>
  );
};

export default Footer;
