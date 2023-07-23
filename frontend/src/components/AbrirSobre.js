import React, { useState } from "react";
import "./Batalla5Cartas.css";
import swal2 from "sweetalert2";
import { useNavigate } from "react-router-dom";

import "./AbrirSobre.css";

const AbrirSobre = () => {
  const apiKey = "28741ca5-7270-449e-9319-8b046277f2ba";

  const navigate = useNavigate();

  const [sobre, setSobre] = useState([]);
  const [setSelected, setSetSelected] = useState("");
  const [sets, setSets] = useState([]);

  const getRandomPokemonCard = async () => {
    const apiUrl = `https://api.pokemontcg.io/v2/cards`;
    const response = await fetch(apiUrl, {
      headers: {
        "X-Api-Key": apiKey,
      },
    });
    const data = await response.json();
    const totalCards = data.data.length;
    const randomIndex = Math.floor(Math.random() * totalCards);
    const randomCard = data.data[randomIndex];
    return randomCard;
  };

  const getAllSets = async () => {
    const apiUrl = `https://api.pokemontcg.io/v2/sets`;
    const response = await fetch(apiUrl, {
      headers: {
        "X-Api-Key": apiKey,
      },
    });
    const data = await response.json();
    const sets = data.data;
    setSets(sets);
  };

  //on page load get the total number of cards from the api and set it to totalCards
  React.useEffect(() => {
    getAllSets();
  }, []);

  const handleDrawTCGPack = async () => {
    const cards = [];
    handleIsLoading();
    for (let i = 0; i < 10; i++) {
      const card = await getRandomPokemonCard();
      cards.push(card);
    }
    setSobre(cards);
  };

  const handleButtonAbrirSobre = () => {
    if (sobre.length === 0) {
      handleDrawTCGPack();
    } else if (sobre.length === 10) {
      swal2
        .fire({
          icon: "warning",
          title: "Si abris otro sobre se perderán las cartas que ya tenés!",
          showCancelButton: true,
          confirmButtonText: "Abrir otro sobre",
          cancelButtonText: "Cancelar",
        })
        .then((result) => {
          if (result.isConfirmed) {
            handleReset();
            handleDrawTCGPack();
          }
        });
    }
  };

  const handleIsLoading = () => {
    swal2.fire({
      title: "Buscando...",
      text: "Ya salen tus cartas! Que pokemon te tocará?",
      timer: 70000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  const warningAbrirOtroSobre = () => {
    if (sobre.length === 0) {
      swal2.fire({
        icon: "warning",
        title: "No tenés cartas!",
        text: "Abrí un sobre primero!",
        showConfirmButton: false,
        timer: 2000,
      });
    } else if (sobre.length === 10) {
      swal2
        .fire({
          icon: "warning",
          title: "Si abris otro sobre se perderán las cartas que ya tenés!",
          showCancelButton: true,
          confirmButtonText: "Abrir otro sobre",
          cancelButtonText: "Cancelar",
        })
        .then((result) => {
          if (result.isConfirmed) {
            swal2.fire({
              title: "Buscando...",
              text: "Ya salen tus cartas! Que pokemon te tocará?",
              timer: 77000,
              timerProgressBar: true,
              showConfirmButton: false,
            });
            handleReset();
            handleDrawTCGPack();
          }
        });
    }
  };

  const warningVolverAlInicio = () => {
    if (sobre.length === 0) {
      swal2
        .fire({
          icon: "warning",
          title: "No abriste ningún sobre aun!",
          text: "Igualmente vas a volver a la pantalla de inicio?",
          showCancelButton: true,
          confirmButtonText: "Volver a la pantalla de inicio",
          cancelButtonText: "Cancelar",
        })
        .then((result) => {
          if (result.isConfirmed) {
            navigate("/");
          }
        });
    } else if (sobre.length === 10) {
      swal2
        .fire({
          icon: "warning",
          title:
            "Si volves a la pantalla de inicio se perderán las cartas que ya tenés!",
          showCancelButton: true,
          confirmButtonText: "Volver a la pantalla de inicio",
          cancelButtonText: "Cancelar",
        })
        .then((result) => {
          if (result.isConfirmed) {
            handleReset();
            navigate("/");
          }
        });
    }
  };

  const handleReset = () => {
    setSobre([]);
  };

  return (
    <div className="container-fluid text-center">
      <p className="textSobre">
        Abrimos un sobre de cartas de Pokemon? dale!
        <br />
        Hace click en el botón "Abrir sobre" y te saldrán 10 cartas al azar de
        cualquier set, asi que Suerte!!!
        <br />
        Fijate que debajo de la carta te va a salir un precio promedio de venta
        en dolares, de esta forma vas a saber si te salió una carta valiosa o
        no.
        <br />
        Tip: Te pido paciencia, ya que las cartas tardan en salir. Gracias!
      </p>
      <button id="openSobre" onClick={handleButtonAbrirSobre}>
        Abrir sobre
      </button>
      <div id="sobreContainer">
        {sobre.map((card) => (
          <div key={card.id}>
            {/* <h3>{card.name}</h3> */}
            <img
              className="cardImage"
              src={card.images.small}
              alt={card.name}
            />
            <div className="cardInfo">
              <div>Nombre: {card.name}</div>
              <div>Nro en la Pokedex: {card.nationalPokedexNumbers}</div>
              <div>Set: {card.set.name}</div>
              <div>Serie: {card.set.series}</div>
              <div>
                Fecha de Lanzamiento:{" "}
                {new Date(card.set.releaseDate).toLocaleDateString("es-AR")}
              </div>
              <div>Total de Impresiones: {card.set.printedTotal}</div>
              <div>Rareza: {card.rarity}</div>
              <div>Tipo: {card.types.join(", ")}</div>
              {/* <div>Puntos HP: {card.hp}</div> */}
              <div>Precio: ${card.cardmarket.prices.averageSellPrice}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="bottomButtons">
        <button id="openAnother" onClick={warningAbrirOtroSobre}>
          Abrir otro sobre
        </button>
        <button id="backToHome" onClick={warningVolverAlInicio}>
          Ir a pantalla de inicio
        </button>
      </div>
    </div>
  );
};

export default AbrirSobre;
