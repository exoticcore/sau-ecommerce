import { mount } from 'product/ProductApp';

import React, { useRef, useEffect } from 'react';

function ProductApp() {
  const ref = useRef(null);

  useEffect(() => {
    mount(ref.current);
  });

  return <div ref={ref}>ProductApp</div>;
}

export default ProductApp;
