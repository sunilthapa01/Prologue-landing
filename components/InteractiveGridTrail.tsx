'use client';

import React from 'react';

export default function InteractiveGridTrail() {
  const tiles = Array.from({ length: 100 });

  return (
    <>
      {/* Decorative editorial corner brackets */}
      <span className="nb-corner tl"></span>
      <span className="nb-corner tr"></span>
      <span className="nb-corner bl"></span>
      <span className="nb-corner br"></span>

      {/* Grid hover trail effect container */}
      <div className="notebook-grid-effect" id="notebook-grid-effect">
        {tiles.map((_, index) => (
          <div key={index} className="grid-tile"></div>
        ))}
      </div>
    </>
  );
}
