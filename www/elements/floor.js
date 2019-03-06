import React from 'react';
import Element from './element';
import ArrayUtils from '../utils/array_utils';

class Floor extends Element {
  constructor (curves) {
    super();
    this.type = 'floor';
    this.curves = curves;
  };

  render (temp, snap) {
    let {curves} = this;
    return (
      <g> {
        ArrayUtils.range(curves.length).map(idx => (
          <g key={'curve_'+idx}>
            {curves[idx].render(temp, snap || idx<curves.length-2)}
          </g>
        ))
      } </g>
    );
  };

  export () {
    return this.curves.map(({start}) => {
      start.z = 0.0;
      return start;
    });
  };
};

export default Floor;
