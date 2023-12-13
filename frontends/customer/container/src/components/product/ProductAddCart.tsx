import styled from 'styled-components';
import variables from '@/scss/variables.module.scss';

import { FaPlus, FaMinus, FaRegHeart } from 'react-icons/fa';
import { useState } from 'react';

export default function ProductAddCart({ stock }: { stock: number }) {
  const [cartQty, setCartQty] = useState<number>(1);

  return (
    <ProductAddCartWrapper>
      <span>{stock > 10 ? 'In stock' : `Only ${stock} items available`}</span>
      <div className="flex gap-4">
        <div className="flex gap-3">
          <div className="qty-button">
            <div onClick={() => setCartQty(cartQty - 1)}>
              <FaMinus />
            </div>
            <div>{cartQty}</div>
            <div onClick={() => setCartQty(cartQty + 1)}>
              <FaPlus />
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="add-cart-button">Add to cart</div>
        <div className="wish-button">
          <FaRegHeart />
        </div>
      </div>
    </ProductAddCartWrapper>
  );
}

const ProductAddCartWrapper = styled.div.attrs({ className: 'select-none' })`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;

  span {
    color: ${variables.grey400};
    font-weight: 300;
  }

  .qty-button {
    display: flex;
    background: ${variables.white};
    border-radius: ${variables.borderRadius};
    align-items: center;
    cursor: pointer;

    div {
      padding: 1rem;
    }
  }

  .add-cart-button {
    display: flex;
    padding: 1rem 5rem;
    justify-content: center;
    align-items: center;
    border-radius: ${variables.borderRadius};
    background: ${variables.primary600};
    color: ${variables.white};
    font-weight: 300;
    cursor: pointer;
    transition: ${variables.transition};

    &:hover {
      background: ${variables.primary500};
    }
  }

  .wish-button {
    padding: 0.9rem;
    display: flex;
    align-items: center;
    border-radius: ${variables.borderRadius};
    box-shadow: 0 0 0 1px ${variables.grey400};
    color: ${variables.grey400};
    font-size: 1.25rem;
    transition: ${variables.transition};
    cursor: pointer;

    &:hover {
      color: ${variables.primary600};
      /* box-shadow: 0 0 0 1px ${variables.primary600}; */
    }
  }
`;
