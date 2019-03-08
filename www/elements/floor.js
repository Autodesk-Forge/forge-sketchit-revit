/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

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
