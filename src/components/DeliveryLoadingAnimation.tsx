
"use client";

import './DeliveryLoadingAnimation.css';

export const DeliveryLoadingAnimation = () => {
  return (
    <div className="truck-loader">
      <div className="truck-wrapper">
        <div className="truck">
          <div className="truck-container"></div>
          <div className="glases"></div>
          <div className="bonet"></div>
          <div className="base"></div>
          <div className="base-aux"></div>
          <div className="wheel-back"></div>
          <div className="wheel-front"></div>
          <div className="smoke"></div>
        </div>
        <div className="box-wrapper">
            <div className="box"></div>
        </div>
      </div>
    </div>
  );
};
