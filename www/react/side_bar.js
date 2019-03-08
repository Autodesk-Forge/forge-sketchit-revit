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
import EditorButton from './editor_button';
import Thumbnail from './thumbnail';
import Editor from './editor';
import ElementUtils from '../utils/element_utils';


class SideBar extends React.Component {

  getEditorData () {
    return [
      { type: 'wall',       needsLoop: false, generateElems: ElementUtils.generateWallsFromPoints  },
      { type: 'floor',      needsLoop: true,  generateElems: ElementUtils.generateFloorsFromPoints },
      { type: 'door',       needsLoop: false, generateElems: null },
      { type: 'window',     needsLoop: false, generateElems: null },
      { type: 'ceiling',    needsLoop: false, generateElems: null },
      { type: 'roof',       needsLoop: false, generateElems: null },
      { type: 'component',  needsLoop: false, generateElems: null },
      { type: 'column',     needsLoop: false, generateElems: null }
    ];
  };

  getActiveEditorComponent () {
    let editorData = this.getEditorData().filter(data => data.type === this.props.editorElem);

    if (editorData.length<1) return null;
    if (!editorData[0].generateElems) return null;

    let {type, ...propsToPass} = editorData[0];
    return (<Editor key={'editor_class'+editorData[0].type} {...propsToPass}/>);
  };

  render () {
    return (
      <div id='side-bar'>
        <div id='editors'>
          { this.getEditorData().map(data => (<EditorButton key={'editor_button'+data.type} className='other' type={data.type}/>)) }
        </div>
        { this.getActiveEditorComponent() }
        <Thumbnail />
      </div>
    );
  };
};

let mapStateToProps = (state, ownProps) => {
  return {
    editorElem: state.editorData.element,
  };
};

export default ReduxUtils.connect(mapStateToProps, true)(SideBar);
