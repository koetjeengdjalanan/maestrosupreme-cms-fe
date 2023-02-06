import { classNames } from 'primereact/utils';
import React from 'react';

function Loader({ className }) {
  return (
    <div className={classNames('loader-wrapper', className)}>
      <div className="loader" />
    </div>
  );
}

export default Loader;
