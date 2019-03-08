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
import ReduxUtils from '../utils/redux_utils';
import Canvas from './canvas';
import Viewer from './viewer';
import SideBar from './side_bar';

let HeaderView = () => (
  <div id="header">
    Sketch It
  </div>
);

let FooterView = () => (
  <div id="footer">
    &copy; Copyright 2018 Autodesk, Inc.
  </div>
);

class SketchIt extends React.Component {
  render () {
    return (
      <div id="container">
        <HeaderView />
        {!this.props.showModel ? (<Canvas />) : (<Viewer />)}
        <SideBar />
        <FooterView />
      </div>
    );
  };
};

let mapStateToProps = (state, ownProps) => {
  return {
    showModel: state.modelData.showViewer,
  };
};

export default ReduxUtils.connect(mapStateToProps)(SketchIt);
