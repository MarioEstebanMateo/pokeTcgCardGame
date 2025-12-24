import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import swal2 from "sweetalert2";
import "./VerSetCompleto.css";

const VerSetCompleto = () => {
  const navigate = useNavigate();
  const [sets, setSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState("");
  const [cards, setCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showButton, setShowButton] = useState(false);
  const [sortOption, setSortOption] = useState("number");
  const cardsPerPage = 50;

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = cards.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(cards.length / cardsPerPage);

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const response = await axios.get("https://api.pokemontcg.io/v2/sets", {
          headers: {
            "X-Api-Key": process.env.REACT_APP_POKEMON_API_KEY,
          },
          timeout: 30000, // 30 seconds timeout
        });
        const sortedSets = response.data.data.sort(
          (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
        );
        setSets(sortedSets);
      } catch (error) {
        console.error("Error fetching sets:", error);
        if (error.code === "ERR_NETWORK" || error.code === "ECONNABORTED") {
          swal2.fire({
            icon: "error",
            title: "Error de conexión",
            html:
              "No se pudo conectar con la API de Pokémon TCG.<br><br>" +
              "Posibles causas:<br>" +
              "• El servidor de la API está temporalmente no disponible<br>" +
              "• Problemas de conexión a internet<br>" +
              "• Firewall bloqueando la conexión<br><br>" +
              "Por favor, intenta de nuevo en unos minutos.",
          });
        }
      }
    };
    fetchSets();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    setShowButton(window.scrollY > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSetChange = (event) => {
    setSelectedSet(event.target.value);
    setSortOption("number"); //resets sort option when changing set
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    scrollToTop();
  };

  const getCardPrice = (card) => {
    return (
      card?.tcgplayer?.prices?.holofoil?.market ||
      card?.tcgplayer?.prices?.reverseHolofoil?.market ||
      card?.tcgplayer?.prices?.normal?.market ||
      0
    );
  };

  const sortCards = (cardsToSort, sortType) => {
    const cardsCopy = [...cardsToSort];

    switch (sortType) {
      case "number":
        return cardsCopy.sort((a, b) => a.number - b.number);
      case "price-asc":
        return cardsCopy.sort((a, b) => {
          const priceA = getCardPrice(a) || 0;
          const priceB = getCardPrice(b) || 0;
          return priceA - priceB;
        });
      case "price-desc":
        return cardsCopy.sort((a, b) => {
          const priceA = getCardPrice(a) || 0;
          const priceB = getCardPrice(b) || 0;
          return priceB - priceA;
        });
      default:
        return cardsCopy;
    }
  };

  const handleSortChange = (event) => {
    const newSortOption = event.target.value;
    setSortOption(newSortOption);
    setCards(sortCards(cards, newSortOption));
    setCurrentPage(1);
  };

  const doFetchCards = async () => {
    showLoading();
    try {
      let allCards = [];
      let page = 1;
      let hasMoreCards = true;

      while (hasMoreCards) {
        const response = await axios.get(
          `https://api.pokemontcg.io/v2/cards?q=set.id:${selectedSet}&page=${page}&pageSize=250`,
          {
            headers: {
              "X-Api-Key": process.env.REACT_APP_POKEMON_API_KEY,
            },
            timeout: 30000, // 30 seconds timeout
          }
        );

        const newCards = response.data.data;
        allCards = [...allCards, ...newCards];

        if (newCards.length < 250) {
          hasMoreCards = false;
        } else {
          page++;
        }
      }

      const sortedCards = sortCards(allCards, sortOption);
      setCards(sortedCards);
      setCurrentPage(1);
      swal2.close();
    } catch (error) {
      console.error("Error fetching cards:", error);
      let errorMessage = "Por favor intenta de nuevo mas tarde";
      if (error.code === "ECONNABORTED") {
        errorMessage =
          "La solicitud tardó demasiado tiempo. El servidor de la API puede estar lento o no disponible. Intenta de nuevo en unos minutos.";
      } else if (error.code === "ERR_NETWORK") {
        errorMessage =
          "No se pudo conectar con la API. Verifica tu conexión a internet o intenta más tarde.";
      }
      swal2.fire({
        icon: "error",
        title: "Error cargando cartas",
        text: errorMessage,
      });
      swal2.close();
    }
  };

  const fetchCards = async () => {
    if (!selectedSet) {
      swal2.fire({
        icon: "warning",
        title: "No seleccionaste un set",
        text: "Por favor selecciona un set para ver sus cartas.",
      });
      return;
    }

    if (cards.length > 0 && cards[0].set.id === selectedSet) {
      swal2.fire({
        icon: "warning",
        title: "Elegiste el mismo set",
        text: "Por favor selecciona un set diferente para ver sus cartas.",
      });
      return;
    }

    if (cards.length > 0) {
      swal2
        .fire({
          icon: "info",
          title: "Queres cambiar de set?",
          text: "Si cambias de set se perdera la informacion del set anterior",
          showCancelButton: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            setCards([]);
            doFetchCards();
          }
        });
    } else {
      doFetchCards();
    }
  };

  const showLoading = () => {
    swal2.fire({
      title: "Cargando cartas...",
      allowOutsideClick: false,
      didOpen: () => {
        swal2.showLoading();
      },
    });
  };

  const warningVolverAlInicioBySet = () => {
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

  const renderPaginationButtons = () => {
    if (totalPages <= 1) return null;

    const buttons = [];
    const maxVisibleButtons = 5;
    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisibleButtons / 2)
    );
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="paginationButton"
      >
        ←
      </button>
    );

    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`paginationButton ${currentPage === 1 ? "active" : ""}`}
        >
          1
        </button>
      );
      if (startPage > 2) buttons.push(<span key="dots1">...</span>);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`paginationButton ${currentPage === i ? "active" : ""}`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) buttons.push(<span key="dots2">...</span>);
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`paginationButton ${
            currentPage === totalPages ? "active" : ""
          }`}
        >
          {totalPages}
        </button>
      );
    }

    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="paginationButton"
      >
        →
      </button>
    );

    return buttons;
  };

  return (
    <div className="container-fluid">
      <p className="textSet">
        ¿Quieres ver todas las cartas de un set? Selecciona un set y haz clic en
        "Ver Set".
        <br />
        Si deseas ver una carta con una imagen más grande, haz clic en la carta
        y se abrirá en una nueva pestaña de tu navegador.
        <br />
        **Tip:** Agradecemos tu paciencia, ya que las cartas pueden tardar unos
        momentos en cargarse. ¡Gracias!
      </p>

      <div className="selectSetContainer">
        <select
          id="set-select"
          onChange={handleSetChange}
          value={selectedSet}
          className="setSelect"
        >
          <option value="">Selecciona un Set</option>
          {sets.map((set) => (
            <option key={set.id} value={set.id}>
              {set.name}
            </option>
          ))}
        </select>

        <button onClick={fetchCards} className="openSetButton">
          Ver Set
        </button>
      </div>

      {cards.length > 0 && (
        <div>
          <div className="textSet2">
            Set:{" "}
            <img
              className="setSymbol"
              src={cards[0].set.images.symbol}
              alt={cards[0].set.name}
            />{" "}
            {cards[0].set.name} (
            {new Date(cards[0].set.releaseDate).getFullYear()}) / Total de
            cartas: {cards.length}
          </div>

          <div className="text-center">
            <img
              className="setLogo"
              src={cards[0].set.images.logo}
              alt={cards[0].set.name}
            />
          </div>

          <div className="paginationContainer">{renderPaginationButtons()}</div>

          <div className="sortingContainer">
            <select
              id="sort-select"
              value={sortOption}
              onChange={handleSortChange}
              className="sortSelect"
            >
              <option value="number">Ordenar por Número</option>
              <option value="price-asc">
                Ordenar por Precio (Menor a Mayor)
              </option>
              <option value="price-desc">
                Ordenar por Precio (Mayor a Menor)
              </option>
            </select>
          </div>

          <div className="setContainer">
            {currentCards.map((card) => (
              <div className="" key={card.id}>
                <a
                  href={card.images.large}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="cardImage"
                    src={card.images.small}
                    alt={card.name}
                  />
                </a>
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
                  <div>Puntos HP: {card.hp}</div>
                  <div>Precio: ${getCardPrice(card) || "No hay precio"}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="paginationContainer">{renderPaginationButtons()}</div>
        </div>
      )}

      <div className="text-center">
        <button onClick={warningVolverAlInicioBySet} className="backToHome">
          Ir a Pantalla de Inicio
        </button>
      </div>

      <button
        className={`back-to-top-button ${showButton ? "show" : ""}`}
        onClick={scrollToTop}
      >
        ↑
      </button>
    </div>
  );
};

export default VerSetCompleto;
