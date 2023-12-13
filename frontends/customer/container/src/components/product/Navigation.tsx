import styled from 'styled-components';
import variables from '@/scss/variables.module.scss';
import { FaAngleRight } from 'react-icons/fa6';

export default function Navigation({ navigate }: { navigate: string[] }) {
  const naviLen = navigate?.length;
  return (
    <NivagationWrapper>
      {navigate?.map((navi, index) => {
        return (
          <div className="flex items-center gap-4" key={index}>
            {index < naviLen - 1 ? (
              <>
                <span>{navi}</span>
                <span>
                  <FaAngleRight />
                </span>
              </>
            ) : (
              <p>{navi}</p>
            )}
          </div>
        );
      })}
    </NivagationWrapper>
  );
}

const NivagationWrapper = styled.div.attrs({ className: 'select-none' })`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 300;
  font-size: 0.95rem;
  width: 100%;
  margin-top: 2.5rem;

  span {
    color: ${variables.grey400};
    font-weight: 200;
    cursor: pointer;
    transition: ${variables.transition};

    &:hover {
      color: ${variables.primary500};
      text-decoration: underline;
    }
  }

  p {
    cursor: default;
  }
`;
