import styled from 'styled-components';
import variables from '@/scss/variables.module.scss';
import { HiCurrencyDollar } from 'react-icons/hi';

export default function Qoutes() {
  return (
    <QoutesStyle>
      <div className="main-qoute">
        <div className="qoute-1">
          <h3>We provide best</h3>
          <h3>customer experiences</h3>
        </div>
        <div className="qoute-2">
          <span>We ensure our customers have the best shopping experience</span>
        </div>
      </div>
      <div className="grid-qoute">
        <div className="qoute-card">
          <div className="qoute-card__icon">
            <HiCurrencyDollar />
          </div>
          <h6>Original Products</h6>
          <span>
            We provide money back guarantee if the product not original
          </span>
        </div>
        <div className="qoute-card">
          <div className="qoute-card__icon">
            <HiCurrencyDollar />
          </div>
          <h6>Satisfaction Guarantee</h6>
          <span>
            Exchange the product you've purchased if it doesn't fit on you
          </span>
        </div>
        <div className="qoute-card">
          <div className="qoute-card__icon">
            <HiCurrencyDollar />
          </div>
          <h6>New Arrival Everyday</h6>
          <span>We updates our collections almost everyday</span>
        </div>
        <div className="qoute-card">
          <div className="qoute-card__icon">
            <HiCurrencyDollar />
          </div>
          <h6>Fast & Free Shipping</h6>
          <span>We offer fast and free shipping for our loyal customers</span>
        </div>
      </div>
    </QoutesStyle>
  );
}

const QoutesStyle = styled.div.attrs({ className: 'select-none' })`
  display: flex;
  flex-direction: column;
  cursor: default;
  gap: 3rem;
  margin-top: 3rem;
  width: 100%;

  .main-qoute {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    .qoute-1 {
      border-right: 2px solid;
      width: 100%;

      h3 {
        text-transform: none;
      }
    }

    .qoute-2 {
      padding-left: 2rem;
      height: 100%;
      span {
        color: ${variables.grey400};
        line-height: 1.4rem;
        font-weight: 300;
      }
    }
  }

  .grid-qoute {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 2rem;

    .qoute-card {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;

      &__icon {
        width: 2.5rem;
        height: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem;
        border-radius: ${variables.borderRadius};
        background: ${variables.grey200};
        font-size: 1.25rem;
      }

      span {
        color: ${variables.grey500};
        font-size: 0.9rem;
        line-height: 1.25rem;
        font-weight: 200;
      }
    }
  }
`;
