import React, { useState, useEffect } from "react";
import axios from "axios";
import swal2 from "sweetalert2";
import { useNavigate } from "react-router-dom";

import "./AbrirSobre.css";

const apiKey = process.env.REACT_APP_POKEMON_API_KEY;

const AbrirSobre = () => {
  const navigate = useNavigate();

  const [selectedSet, setSelectedSet] = useState("");
  const [selectedSetCards, setSelectedSetCards] = useState([]);
  const [allSetsCards, setAllSetsCards] = useState([]);
  const [sets, setSets] = useState([]);

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const response = await axios.get("https://api.pokemontcg.io/v2/sets", {
          headers: {
            "X-Api-Key": apiKey,
          },
        });
        // order sets by release date from newest to oldest
        const sortedSets = response.data.data.sort(
          (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
        );
        setSets(sortedSets);
      } catch (error) {
        console.error("Error fetching sets:", error);
      }
    };
    fetchSets();
  }, []);

  const handleSetChange = (event) => {
    setSelectedSet(event.target.value);
  };

  const drawFromSelectedSet = async () => {
    if (!selectedSet) {
      swal2.fire({
        icon: "warning",
        title: "No seleccionaste un set",
        text: "Por favor selecciona un set para ver sus cartas.",
      });
      return;
    }

    swal2.fire({
      title: "Cargando...",
      text: "Por favor espera mientras se cargan las cartas",
      timer: 6000,
      timerProgressBar: true,
      showConfirmButton: false,
    });

    try {
      const response = await axios.get(
        `https://api.pokemontcg.io/v2/cards?q=set.id:${selectedSet}`,
        {
          headers: {
            "X-Api-Key": apiKey,
          },
        }
      );

      if (response.data.data.length < 11) {
        swal2.fire({
          icon: "error",
          title: "No hay suficientes cartas en este set",
          text: `El Set seleccionado tiene ${response.data.data.length} cartas, por favor selecciona otro set.`,
        });
      } else {
        const randomIndices = new Set();
        while (randomIndices.size < 11) {
          randomIndices.add(
            Math.floor(Math.random() * response.data.data.length)
          );
        }
        setSelectedSetCards(
          Array.from(randomIndices).map((index) => response.data.data[index])
        );
      }
    } catch (error) {
      console.error("Error fetching selected set cards:", error);
    }
  };

  const drawFromAllSets = async () => {
    swal2.fire({
      title: "Cargando...",
      text: "Por favor espera mientras se cargan las cartas",
      timer: 6000,
      timerProgressBar: true,
      showConfirmButton: false,
    });

    try {
      const response = await axios.get("https://api.pokemontcg.io/v2/cards", {
        headers: {
          "X-Api-Key": apiKey,
        },
      });

      if (response.data.data.length < 11) {
        swal2.fire({
          icon: "error",
          title: "No hay suficientes cartas en todos los sets",
          text: "Hay menos de 11 cartas en todos los sets.",
        });
      } else {
        const randomIndices = new Set();
        while (randomIndices.size < 11) {
          randomIndices.add(
            Math.floor(Math.random() * response.data.data.length)
          );
        }
        setAllSetsCards(
          Array.from(randomIndices).map((index) => response.data.data[index])
        );
      }
    } catch (error) {
      console.error("Error fetching random cards from all sets:", error);
    }
  };

  const warningVolverAlInicio = () => {
    swal2
      .fire({
        title: "Volver al Inicio?",
        text: "Si volves al inicio se perdera la informacion del set seleccionado",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      })
      .then((result) => {
        if (result.isConfirmed) {
          navigate("/");
        }
      });
  };

  return (
    <div className="container-fluid">
      <p className="textSobre">
        Queres abrir un sobre de un set en particular? Selecciona el set que te
        guste (estan ordenados del mas nuevo al mas viejo) y dale al botón"Abrir
        sobre de este set"
        <br />
        Te saldran 11 cartas al azar de ese set. Suerte!
        <br />
        {/* Fijate que debajo de la carta te va a salir un precio promedio de venta en dolares, de esta forma vas a saber si te salió una carta valiosa o no.
<br /> */}
        tip: Te pido paciencia, ya que las cartas tardan en salir. Gracias!
      </p>
      <div className="selectSetContainer">
        <select id="set-select" onChange={handleSetChange} value={selectedSet}>
          <option value="">Selecciona un Set</option>
          {sets.map((set) => (
            <option key={set.id} value={set.id}>
              {set.name}
            </option>
          ))}
        </select>
        <button
          className="openSetButton"
          onClick={drawFromSelectedSet}
          // disabled={!selectedSet}
        >
          Abrir Sobre
        </button>
      </div>
      <div>
        <div className="cardContainer">
          {selectedSetCards.map((card) => (
            <div key={card.id}>
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
                <div>
                  Numero: {card.number} / {card.set.printedTotal}
                </div>
                <div>Rareza: {card.rarity}</div>
                <div>Tipo: {card.types}</div>
                {/* <div>
                      Precio: $
                      {card.tcgplayer.prices.holofoil
                        ? card.tcgplayer.prices.holofoil.market
                        : card.tcgplayer.prices.reverseHolofoil
                        ? card.tcgplayer.prices.reverseHolofoil.market
                        : card.tcgplayer.prices.normal
                        ? card.tcgplayer.prices.normal.market
                        : "No hay precio"}
                    </div> */}
                <div>Puntos HP: {card.hp}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <button className="backToHome" onClick={warningVolverAlInicio}>
            Ir a Pantalla de Inicio
          </button>
        </div>
      </div>
      <p className="textSobre">
        Te propongo un juego de suerte, te parece?
        <br />
        Hace click en el botón "Abrir sobre" y te saldrán 11 cartas al azar de
        cualquier set, imaginate que hay mas de 15.000 cartas, asi que Suerte!!!
        <br />
        {/* Fijate que debajo de la carta te va a salir un precio promedio de
          venta en dolares, de esta forma vas a saber si te salió una carta
          valiosa o no.
          <br /> */}
        Tip: Te pido paciencia, ya que las cartas tardan en salir. Gracias!
      </p>
      <div className="text-center">
        <button className="openSetButton" onClick={drawFromAllSets}>
          Abrir Sobre
        </button>
      </div>
      <div className="cardContainer">
        {allSetsCards.map((card) => (
          <div key={card.id}>
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
              <div>
                Numero: {card.number} / {card.set.printedTotal}
              </div>
              <div>Rareza: {card.rarity}</div>
              <div>Tipo: {card.types}</div>
              {/* <div>
                      Precio: $
                      {card.tcgplayer.prices.holofoil
                        ? card.tcgplayer.prices.holofoil.market
                        : card.tcgplayer.prices.reverseHolofoil
                        ? card.tcgplayer.prices.reverseHolofoil.market
                        : card.tcgplayer.prices.normal
                        ? card.tcgplayer.prices.normal.market
                        : "No hay precio"}
                    </div> */}
              <div>Puntos HP: {card.hp}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center">
        <button className="backToHome" onClick={warningVolverAlInicio}>
          Ir a Pantalla de Inicio
        </button>
      </div>
    </div>
  );
};

export default AbrirSobre;
