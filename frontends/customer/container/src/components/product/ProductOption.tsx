import styled from 'styled-components';
import variables from '@/scss/variables.module.scss';

type OptionType = {
  size: string[];
  color: {
    name: string;
    hex: string;
  }[];
};

export default function ProductOption({ options }: { options: OptionType }) {
  return (
    <ProductOptionWrapper>
      <div className="option__size">
        <h6>Size</h6>
        <div className="flex gap-3">
          {options.size.map((sizes, index) => {
            return (
              <div className="option__size__select" key={index}>
                {sizes}
              </div>
            );
          })}
        </div>
      </div>
      <div className="option__color">
        <h6>Color</h6>
        <div className="flex gap-3 items-center h-full">
          {options.color.map((colors, index) => {
            return (
              <div
                className="option__color__select"
                key={index}
                style={{ background: colors.hex }}
              ></div>
            );
          })}
        </div>
      </div>
    </ProductOptionWrapper>
  );
}

const ProductOptionWrapper = styled.div.attrs({ className: 'select-none' })`
  display: grid;
  grid-template-columns: 1fr 1fr;

  h6 {
    font-weight: 300;
  }

  .option {
    &__size {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 1.5rem;

      &__select {
        padding: 1rem 1.25rem;
        box-shadow: 0 0 0 1px ${variables.grey300};
        border-radius: ${variables.borderRadius};
        text-transform: uppercase;
        cursor: pointer;
        transition: ${variables.transition};

        &:hover {
          box-shadow: 0 0 0 1px ${variables.primary600};
          color: ${variables.primary600};
        }

        &.active {
          background: ${variables.primary600};
          color: ${variables.white};
        }
      }
    }

    &__color {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 1.5rem;

      &__select {
        border-radius: 50%;
        padding: 0.7rem;
        cursor: pointer;
      }
    }
  }
`;
