import styled from 'styled-components';

export default function BrandDropdown() {
  return (
    <BrandDropdownWrapper>
      <div className="brand-title">brand</div>
    </BrandDropdownWrapper>
  );
}

const BrandDropdownWrapper = styled.div`
  .brand-title {
    display: flex;
    padding: 1rem;
  }
`;
