import { useState } from "react";
import { useLocalStorageState } from "./useLocalStorageState";

let products = [
  {
    id: 1,
    name: "PRODUCT 1",
    image: "img/1.png",
    price: 2000,
  },
  {
    id: 2,
    name: "PRODUCT 2",
    image: "img/2.png",
    price: 2200,
  },
  {
    id: 3,
    name: "PRODUCT 3",
    image: "img/3.png",
    price: 2400,
  },
  {
    id: 4,
    name: "PRODUCT 4",
    image: "img/4.png",
    price: 2600,
  },
  {
    id: 5,
    name: "PRODUCT 5",
    image: "img/5.png",
    price: 1400,
  },
  {
    id: 6,
    name: "PRODUCT 6",
    image: "img/6.png",
    price: 1800,
  },
];

export default function App() {
  const [openModal, setOpenModal] = useState(false);
  const [productSelected, setProductSelected] = useLocalStorageState(
    [],
    "product"
  );

  return (
    <div className={openModal ? "container active" : "container"}>
      <Header setOpenModal={setOpenModal} productSelected={productSelected} />
      <ListsCard
        productSelected={productSelected}
        onSelected={setProductSelected}
      ></ListsCard>
      <Card
        setOpenModal={setOpenModal}
        productSelected={productSelected}
        onSelected={setProductSelected}
      />
    </div>
  );
}

function Header({ setOpenModal, productSelected }) {
  const quantityTotal = productSelected.reduce(
    (cur, card) => cur + card.quantity,
    0
  );

  return (
    <header>
      <h1>Shopping</h1>
      <div className="shopping" onClick={() => setOpenModal(true)}>
        <i className="fa-solid fa-bag-shopping"></i>
        <span className="quantity">{quantityTotal}</span>
      </div>
    </header>
  );
}

function ListsCard({ productSelected, onSelected }) {
  return (
    <div className="list">
      {products.map((product) => (
        <CardProduct
          key={product.id}
          product={product}
          onProduct={productSelected}
          onSelected={onSelected}
        />
      ))}
    </div>
  );
}

function CardProduct({ product, onProduct, onSelected }) {
  const productSelected = {
    id: product.id,
    name: product.name,
    image: product.image,
    price: product.price,
    quantity: 1,
  };

  function handleProductSelected(item) {
    if (onProduct.every((card) => card.id !== product.id)) {
      onSelected((cur) => [...cur, item]);
    }
  }

  return (
    <div className="item">
      <img src={product.image} alt={product.name} />
      <div className="title">{product.name}</div>
      <div className="price">{product.price}</div>
      <button onClick={() => handleProductSelected(productSelected)}>
        Add To Card
      </button>
    </div>
  );
}

function Card({ setOpenModal, productSelected, onSelected }) {
  function handleClearAll() {
    onSelected([]);
  }

  const totalPrice = productSelected.reduce(
    (cur, item) => cur + +item.quantity * +item.price,
    0
  );

  return (
    <div className="card">
      <h1>Card</h1>
      <AddCard productSelected={productSelected} onSelected={onSelected} />
      <div className="checkOut">
        <div className="total">{totalPrice}</div>
        <div className="closeShopping" onClick={handleClearAll}>
          Clear All
        </div>
      </div>
      <button className="btn-close" onClick={() => setOpenModal(false)}>
        X
      </button>
    </div>
  );
}

function AddCard({ productSelected, onSelected }) {
  return (
    <ul className="listCard">
      {productSelected.map((card) => (
        <CardSelected
          card={card}
          key={card.id}
          onSelected={onSelected}
          productSelected={productSelected}
        />
      ))}
    </ul>
  );
}

function CardSelected({ card, productSelected, onSelected }) {
  function handleIncrementQuantity() {
    onSelected(() =>
      productSelected.map((item) => {
        if (item.id === card.id) {
          return {
            id: item.id,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity++,
          };
        } else {
          return item;
        }
      })
    );
  }

  function handleDecrementQuantity() {
    onSelected(() =>
      productSelected.map((item) => {
        if (item.id === card.id && item.quantity > 0) {
          return {
            id: item.id,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity--,
          };
        } else {
          return item;
        }
      })
    );
  }

  function handleDeleteCard() {
    onSelected(() =>
      productSelected.filter((item) => {
        return item.quantity !== 0;
      })
    );
  }

  return (
    <li>
      <div>
        <img src={card.image} alt={card.name} />
      </div>
      <div className="cardTitle">{card.name}</div>
      <div className="cardPrice">{card.price * card.quantity}</div>

      <div>
        <button
          className="cardButton"
          onClick={() => {
            handleDecrementQuantity();
            handleDeleteCard();
          }}
        >
          -
        </button>
        <div className="count">{card.quantity}</div>
        <button className="cardButton" onClick={handleIncrementQuantity}>
          +
        </button>
      </div>
    </li>
  );
}
