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
