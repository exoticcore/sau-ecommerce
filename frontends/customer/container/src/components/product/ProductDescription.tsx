'use client';
import styled from 'styled-components';
import variables from '@/scss/variables.module.scss';
import DescriptionMenu from './DescriptionMenu';

import { FaPlus, FaMinus } from 'react-icons/fa';
import { useState } from 'react';

const descriptionDetail = [
  {
    topic: 'Description',
    description: `<p>Regular fit coat made of stretch fabric. Notch lapel collar and long
        sleeves. Welt pockets at the hip and an inside pocket detail. Black vent
        at the centre of the hem. Front button fastening.</p>`,
  },
  {
    topic: 'Composition',
    description: `<p>We work with monitoring programmes to ensure compliance with our social, environmental and health and safety standards for our products. To assess compliance, we have developed a programme of audits and continuous improvement plans.<br/>
    <br/>
    OUTER SHELL<br/>
    100% polyester<br/>
    <br/>
    LINING<br/>
    100% polyester</p>`,
  },
  {
    topic: 'Care',
    description: `<p>Caring for your clothes is caring for the environment.<br/><br/>
    To keep your jackets and coats clean, you only need to freshen them up and go over them with a cloth or a clothes brush. If you need to dry clean a garment, look for a dry cleaner that uses technologies that are respectful of the environment. </p>`,
  },
  {
    topic: 'Origin',
    description: `<p>We work with our suppliers, workers, unions and international organisations to develop a supply chain in which human rights are respected and promoted, contributing to the United Nations Sustainable Development Goals.<br/><br/>
    Thanks to the collaboration with our suppliers, we work to know the facilities and processes used to manufacture our products in order to understand their traceability.<br/><br/>Made in Bangladesh</p>`,
  },
];

export default function ProductDescription() {
  return (
    <ProductDescriptionWrapper>
      <DescriptionMenu />
      {descriptionDetail.map((description, index) => {
        return <Description key={index} details={description} />;
      })}
    </ProductDescriptionWrapper>
  );
}

const ProductDescriptionWrapper = styled.div``;

type DetailType = {
  topic: string;
  description: string;
};

function Description({ details }: { details: DetailType }) {
  const [hide, setHide] = useState<boolean>(true);
  return (
    <DetailsDescriptionWrapper>
      <div className="detail-topic select-none" onClick={() => setHide(!hide)}>
        <h6>{details.topic}</h6>
        {hide ? <FaPlus /> : <FaMinus />}
      </div>
      <div
        className={hide ? 'detail-description' : 'detail-description active'}
      >
        <div
          className="detail-description__content"
          dangerouslySetInnerHTML={{ __html: details.description }}
        ></div>
      </div>
    </DetailsDescriptionWrapper>
  );
}

const DetailsDescriptionWrapper = styled.div`
  .detail-topic {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 1.5rem 1rem;
    background: ${variables.grey100};
    margin-top: 0.5rem;
    cursor: pointer;
  }
  .detail-description {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.25s ease-out;
    /* transition: ${variables.transitionNormal}; */

    &__content {
      padding: 1rem;
    }

    &.active {
      max-height: 30rem;
      transition: max-height 0.25s ease-in;
      /* transition: ${variables.transitionNormal}; */
    }

    p {
      font-weight: 200;
      line-height: 1.5rem;
      cursor: text;
    }
  }
`;
