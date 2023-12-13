import styled from 'styled-components';
import variables from '@/scss/variables.module.scss';
import ProductRatting from './ProductRatting';
import ProductOption from './ProductOption';
import ProductAddCart from './ProductAddCart';

const productDetail = {
  title: 'Black Cloth',
  brand: 'zara',
  rating: 2.9,
  price: 2500,
  size: ['s', 'm', 'l'],
  color: [
    {
      name: 'black',
      hex: 'black',
    },
    {
      name: 'grey',
      hex: '#808080',
    },
  ],
};

export default function ProductDetail() {
  return (
    <ProductDetailWrapper>
      <div className="product-detail__title">
        <h4>{productDetail.title}</h4>
        <span>{productDetail.brand}</span>
      </div>
      <ProductRatting ratting={productDetail.rating} />
      <h4>${productDetail.price}</h4>
      <hr />
      <ProductOption
        options={{ size: productDetail.size, color: productDetail.color }}
      />
      <hr />
      <ProductAddCart stock={5} />
    </ProductDetailWrapper>
  );
}

const ProductDetailWrapper = styled.div.attrs({ className: 'select-none' })`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  gap: 1.2rem;

  .product-detail {
    &__title {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      span {
        color: ${variables.grey400};
        text-transform: capitalize;
        cursor: pointer;

        &:hover {
          color: ${variables.primary600};
        }
      }
    }

    &__rating {
      color: #ffdd00;
    }
  }

  hr {
    border-width: 0.1rem;
    margin: 0.65rem 0;
  }
`;
