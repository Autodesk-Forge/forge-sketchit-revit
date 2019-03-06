import React from 'react';
import Element from './element';

class Wall extends Element {
  constructor (curve) {
    super();
    this.type = 'wall';
    this.curve = curve;
  };

  render (temp, snap) {
    return (
      <g>
        {this.curve.render(temp, snap)}
      </g>
    );
  };

  export () {
    return this.curve.export();
  };
};

export default Wall;
