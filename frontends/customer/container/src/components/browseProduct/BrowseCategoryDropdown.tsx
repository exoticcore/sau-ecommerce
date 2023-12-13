import styled from 'styled-components';
import variables from '@/scss/variables.module.scss';

import { FaAngleRight } from 'react-icons/fa6';
import { IoIosCheckmark } from 'react-icons/io';

export default function CategoryDropdown() {
  return (
    <CategoryDropdownWrapper>
      <div className="category-list__main active">
        category <FaAngleRight className="category-list__main__icon" />
      </div>
      {categoryList.map((list, index) => {
        return (
          <div className="category-list" key={index}>
            <div className="category-list__title active">
              {list.title}
              <FaAngleRight />
            </div>
            <div className="category-list__subcat">
              {list.subCats.map((subCat, index) => {
                return (
                  <div className="category-list__subcat__title" key={index}>
                    <div className="flex gap-3">
                      <div className="checkmark">
                        <IoIosCheckmark className="checkmark__icon" />
                      </div>
                      <p>{subCat.subTitle}</p>
                    </div>
                    <span>{subCat.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </CategoryDropdownWrapper>
  );
}

const CategoryDropdownWrapper = styled.div`
  display: flex;
  flex-direction: column;

  .category-list {
    &__main {
      padding: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: ${variables.borderRadius};
      cursor: pointer;

      &__icon {
        transition: ${variables.transition};
      }

      &.active {
        background: ${variables.grey100};
        .category-list__main__icon {
          transform: rotate(90deg);
        }
      }
    }

    &__title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 0.65rem;
      padding: 1rem;
      cursor: pointer;

      &.active {
        .category-list__subcat {
          display: block;
        }
      }
    }

    &__subcat {
      display: none;
      &__title {
        font-weight: 200;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0 1.8rem;
        padding: 0.65rem;

        .checkmark {
          padding: 0.075rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid;
          border-radius: ${variables.borderRadius};

          &__icon {
            opacity: 1;

            &.marked {
              opacity: 1;
            }
          }
        }

        span {
          font-size: 0.8rem;
          font-weight: 400;
          color: ${variables.primary600};
          background: ${variables.grey200};
          padding: 0.3rem;
          border-radius: 40%;
        }
      }
    }
  }
`;

const categoryList = [
  {
    title: 'woman',
    subCats: [
      {
        subTitle: 'tops',
        count: 36,
      },
      {
        subTitle: 'jackets',
        count: 22,
      },
      {
        subTitle: 'sweaters',
        count: 31,
      },
    ],
  },
  {
    title: 'men',
    subCats: [
      {
        subTitle: 'tops',
        count: 36,
      },
      {
        subTitle: 'jackets',
        count: 12,
      },
      {
        subTitle: 'sweaters',
        count: 8,
      },
    ],
  },
  {
    title: 'kids',
    subCats: [
      {
        subTitle: 'tops',
        count: 36,
      },
      {
        subTitle: 'jackets',
        count: 12,
      },
      {
        subTitle: 'sweaters',
        count: 8,
      },
    ],
  },
  {
    title: 'sporty',
    subCats: [
      {
        subTitle: 'tops',
        count: 36,
      },
      {
        subTitle: 'jackets',
        count: 12,
      },
      {
        subTitle: 'sweaters',
        count: 8,
      },
    ],
  },
  {
    title: 'casual',
    subCats: [
      {
        subTitle: 'tops',
        count: 36,
      },
      {
        subTitle: 'jackets',
        count: 12,
      },
      {
        subTitle: 'sweaters',
        count: 8,
      },
    ],
  },
  //   {
  //     title: 'men',
  //     subCats: ['tops', 'pants', 'jackets'],
  //   },
  //   {
  //     title: 'kids',
  //     subCats: ['tops', 'pants']
  //   }
];
