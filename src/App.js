import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [productData, setProductData] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [error, setError] = useState(null);
  const [isCartButtonActive, setIsCartButtonActive] = useState(false);

  useEffect(() => {
    axios
      .get('https://3sb655pz3a.execute-api.ap-southeast-2.amazonaws.com/live/product')
      .then((response) => {
        setProductData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleSizeButtonClick = (sizeId) => {
    setSelectedSize(sizeId);
    setError(null);
  };

  const handleCartButtonClick = () => {
    setIsCartButtonActive((prevState) => !prevState);
  };

  const handleAddToCart = () => {
    if (selectedSize === null) {
      setError("Please select a size before adding to cart.");
    } else {
      console.log("Added to cart:", productData.title, "Size:", selectedSize);
    }
  };

  return (
    <div>
      <header>
        <div className="cart">
          <div className="header-content">
            <button
              className={`cart-button ${isCartButtonActive ? 'cart-button-active' : ''}`}
              onClick={handleCartButtonClick}
            >
              My Cart (<span className="cart-count">3</span>)
            </button>
          </div>
        </div>
        <div className={`menu-container ${isCartButtonActive ? 'item-trans' : ''}`}>
          <div className="menu-content">
            <div className="menu-inside">
              {productData &&
                productData.sizeOptions.map((sizeOption) => (
                  <div className="cart-item" key={sizeOption.id}>
                    <img src={productData.imageURL} alt="" />
                    <div className="product-info-preview">
                      <h2>{productData.title}</h2>
                      <div className="amount-items">
                        1x<span>${productData.price.toFixed(2)}</span>
                      </div>
                      <div className="size-info-sm">
                        SIZE:
                        <div className="size-selected">{sizeOption.label}</div>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="product-card">
        <img src={productData ? productData.imageURL : ""} alt="" />
        <div className="product-info">
          <h2>{productData ? productData.title : "Loading..."}</h2>
          <span className="price">
            {productData ? `$${productData.price.toFixed(2)}` : ""}
          </span>
          <p>{productData ? productData.description : "Loading..."}</p>
          <div className="size-info">
            SIZE<span>*</span>
            <div className="size-selected">
              {selectedSize ? selectedSize : "Please select a size"}
            </div>
          </div>
          <div className="size-options">
            {productData &&
              productData.sizeOptions.map((sizeOption) => (
                <button
                  className={`size-button ${
                    selectedSize === sizeOption.label ? 'selected-button' : ''
                  }`}
                  key={sizeOption.label}
                  onClick={() => handleSizeButtonClick(sizeOption.label)}
                >
                  {sizeOption.label}
                </button>
              ))}
          </div>
          <button className="buy-button" onClick={handleAddToCart}>
            ADD TO CART
          </button>
          {error && <div className="error-popup">{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default App;
