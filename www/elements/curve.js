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

class Curve {
  constructor (start, end) {
    this.start = start;
    this.end = end;
  };

  render (temp, snap) {
    let {start, end} = this;
    let color = 'black';
    let width = temp ? 1 : 2;

    let snapPoints = (
      <g>
        <circle cx={start.x} cy={start.y} r={0} data-snap={JSON.stringify({...start})} stroke={color} strokeWidth={width} vectorEffect='non-scaling-stroke' />
        <circle cx={end.x}   cy={end.y}   r={0} data-snap={JSON.stringify({...end})}   stroke={color} strokeWidth={width} vectorEffect='non-scaling-stroke' />
      </g>
    );

    return (
      <g>
        <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke={color} strokeWidth={width} vectorEffect='non-scaling-stroke' />
        {snap ? snapPoints : null}
      </g>
    );
  };

  export () {
    let {start, end} = this;
    start.z = 0.0;
    end.z = 0.0;
    return {start, end};
  }
};

export default Curve;
