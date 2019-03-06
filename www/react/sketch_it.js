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
