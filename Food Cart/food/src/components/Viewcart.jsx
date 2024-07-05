import React, { useEffect, useState, useContext } from 'react';
import './Cart.css';
import { cartContext } from '../App';

export const Viewcart = () => {
  const { cart, setCart } = useContext(cartContext);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(cart.reduce((acc, curr) => acc + Number(curr.amt), 0));
  }, [cart]);

  const handleRemove = (id) => {
    setCart(cart.filter(product => product.id !== id));
  };

  return (
    <>
      <h1 className='cart-heading'>Cart Products</h1>
      <div className='cart-container'>
        {cart.map((product) => (
          <div className="cart-product" key={product.id}>
            <div className="img">
              <img src={product.pic} alt="img" />
            </div>
            <div className="cart-product-details">
              <h3>{product.name}</h3>
              <p>Price Rs: {product.amt}</p>
              <button onClick={() => handleRemove(product.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      <h3 className='cart-amt'>Total Amount Rs: {total}</h3>
    </>
  );
}
