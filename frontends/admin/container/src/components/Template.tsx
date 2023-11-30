import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import Sidebar from './Sidebar';
import * as Theme from '../constant/styles';

function Template({ children }: React.PropsWithChildren) {
  return (
    <TemplateStyle>
      <Sidebar />
      <div className="template__main">
        <Header />
        <div className="my-main">{children}</div>
      </div>
    </TemplateStyle>
  );
}

const TemplateStyle = styled.div`
  display: flex;
  gap: 0;
  background: white;
  width: 100%;
  height: 100svh;
  max-height: 100svh;

  .template {
    &__main {
      display: flex;
      flex-direction: column;
      padding: 0;
      width: 100%;
      max-height: 100svh;
      overflow: hidden;

      .my-main {
        width: 100%;
        height: 100%;
        flex-shrink: 1;
        padding: 0;
        position: relative;
        border-radius: 0.5rem 0 0 0;
        background: ${Theme.backgroundColor};
      }
    }
  }
`;

export default Template;
