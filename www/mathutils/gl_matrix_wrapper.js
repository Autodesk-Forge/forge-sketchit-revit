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

import {vec2 as Vec2, vec3 as Vec3, mat2d as Mat2d} from 'gl-matrix';
import almostEqual from 'almost-equal';

class Vector {
  constructor (x, y) {
    x = x || 0;
    y = y || 0;
    this.v = Vec2.fromValues(x, y);
  };

  static create (x, y) {
    return new Vector(x, y);
  };

  clone () {
    let r = Vector.create();
    Vec2.copy(r.v, this.v);
    return r;
  };

  add (b) {
    let r = Vector.create();
    Vec2.add(r.v, this.v, b.v);
    return r;
  };

  subtract (b) {
    let r = Vector.create();
    Vec2.subtract(r.v, this.v, b.v);
    return r;
  };

  scale (val) {
    let r = Vector.create();
    Vec2.scale(r.v, this.v, val);
    return r;
  };

  negate () {
    let r = Vector.create();
    Vec2.negate(r.v, this.v);
    return r;
  };

  normalize () {
    let r = Vector.create();
    Vec2.normalize(r.v, this.v);
    return r;
  };

  min (b) {
    let r = Vector.create();
    Vec2.min(r.v, this.v, b.v);
    return r;
  };

  max (b) {
    let r = Vector.create();
    Vec2.max(r.v, this.v, b.v);
    return r;
  };

  distanceFrom (b) {
    return Vec2.distance(this.v, b.v);
  };

  angleTo (b) {
    let c = Vec3.fromValues(0, 0, 0);
    Vec2.cross(c, this.v, b.v);
    let sign = c[2] < 0 ? -1 : 1;
    let cos  = this.dot(b) / (this.length() * b.length());
    if (almostEqual(cos,  1)) cos =  1 - Number.EPSILON;
    if (almostEqual(cos, -1)) cos = -1 + Number.EPSILON;
    return sign * Math.acos(cos);
  };

  length () {
    return Vec2.length(this.v);
  };

  dot (b) {
    return Vec2.dot(this.v, b.v);
  };

  asObj () {
    return {
      x: this.v[0],
      y: this.v[1]
    };
  };

  asArr () {
    return [
      this.v[0],
      this.v[1]
    ];
  };
};

class Matrix {
  constructor () {
    this.m = Mat2d.create();
  };

  static create () {
    return new Matrix();
  };

  translate (point) {
    let r = Matrix.create();
    Mat2d.translate(r.m, this.m, point.v);
    return r;
  };

  rotate (rad) {
    let r = Matrix.create();
    Mat2d.rotate(r.m, this.m, rad);
    return r;
  };

  scale (val1, val2 = val1) {
    let r = Matrix.create();
    Mat2d.scale(r.m, this.m, Vec2.fromValues(val1, val2));
    return r;
  };

  invert () {
    let r = Matrix.create();
    Mat2d.invert(r.m, this.m);
    return r;
  };

  multiply (b) {
    let r = Matrix.create();
    Mat2d.multiply(r.m, this.m, b.m);
    return r;
  };

  transformPoint (point) {
    let r = Vector.create();
    Vec2.transformMat2d(r.v, point.v, this.m);
    return r;
  };

  asArr () {
    return this.m;
  };
};

class MatrixTransformations {
  constructor () {
    this.t = [];
  };

  static create () {
    return new MatrixTransformations();
  };

  append (trf) {
    this.t.push(trf);
  };

  appendFromOther (mt) {
    mt.t.forEach(trf => this.append(trf));
  };

  getMatrix () {
    return this.t.reduceRight((matrix, trf)=>trf(matrix), Matrix.create());
  };

  getInverseMatrix () {
    return this.getMatrix().invert();
  }
};

export {Vector, Matrix, MatrixTransformations};
