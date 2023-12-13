import styled from 'styled-components';

export default function ProductList() {
  return (
    <ProductListWrapper>
      <div>list1</div>
      <div>list2</div>
      <div>list3</div>
    </ProductListWrapper>
  );
}

const ProductListWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  height: 50rem;
  width: 100%;
`;
