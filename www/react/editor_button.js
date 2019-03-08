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
import classNames from 'classnames';

class EditorButton extends React.Component {
  constructor (props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  };

  onClick () {
    let {type, active} = this.props;
    if (active) {
      this.props.actions.setEditorEvent({type: 'cancel'});
      this.props.actions.resetEditorElem();
      this.props.actions.resetEditorCurve();
    }
    else {
      this.props.actions.setEditorElem(type);
    }
  };

  render () {
    let cls = classNames('editor-button', {'editor-button-active': this.props.active});
    return (
      <img className={cls} onClick={this.onClick} src={'res/'+this.props.type+'.png'} />
    );
  };
};

let mapStateToProps = (state, ownProps) => {
  return {
    active: state.editorData.element === ownProps.type,
  };
};

export default ReduxUtils.connect(mapStateToProps, true)(EditorButton);
