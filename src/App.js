import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [productData, setProductData] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [error, setError] = useState(null);
  const [isCartButtonActive, setIsCartButtonActive] = useState(false);
  const [cartItems, setCartItems] = useState({}); // Cart items and their quantities

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

      // Cart items and their quantities
      setCartItems((prevItems) => {
        const updatedItems = { ...prevItems };
        const quantity = updatedItems[selectedSize] || 0;
        updatedItems[selectedSize] = quantity + 1;
        return updatedItems;
      });
    }
  };

  const handleIncreaseQuantity = (sizeId) => {
    setCartItems((prevItems) => {
      const updatedItems = { ...prevItems };
      const quantity = updatedItems[sizeId] || 0;
      updatedItems[sizeId] = quantity + 1;
      return updatedItems;
    });
  };

  const handleDecreaseQuantity = (sizeId) => {
    setCartItems((prevItems) => {
      const updatedItems = { ...prevItems };
      const quantity = updatedItems[sizeId] || 0;
      if (quantity > 0) {
        updatedItems[sizeId] = quantity - 1;
      }
      return updatedItems;
    });
  };

  const getTotalItemsCount = () => {
    return Object.values(cartItems).reduce((total, count) => total + count, 0);
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
              My Cart (<span className="cart-count">{getTotalItemsCount()}</span>)
            </button>
          </div>
        </div>
        <div className={`menu-container ${isCartButtonActive ? 'item-trans' : ''}`}>
          <div className="menu-content">
            <div className="menu-inside">
              {getTotalItemsCount() === 0 ? (
                <div className="empty-cart-message">Your basket is empty</div>
              ) : (
                // Display only items with quantities greater than 0
                productData &&
                productData.sizeOptions.map((sizeOption) => {
                  const sizeLabel = sizeOption.label;
                  const quantity = cartItems[sizeLabel] || 0;
                  if (quantity > 0) {
                    return (
                      <div className="cart-item" key={sizeOption.id}>
                        <img src={productData.imageURL} alt="" />
                        <div className="product-info-preview">
                          <h2>{productData.title}</h2>
                          <div className="amount-items">
                            {quantity}x<span>${(productData.price * quantity).toFixed(2)}</span>
                          </div>
                          <div className="size-info-sm">
                            SIZE:
                            <div className="size-selected">{sizeOption.label}</div>
                          </div>
                        </div>
                        <div className="quantity-buttons">
                            <button onClick={() => handleDecreaseQuantity(sizeLabel)}>-</button>
                            <button onClick={() => handleIncreaseQuantity(sizeLabel)}>+</button>
                          </div>
                      </div>
                    );
                  } else {
                    return null; // Hide items with 0 quantity
                  }
                })
              )}
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
