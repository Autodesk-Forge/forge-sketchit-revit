import React from 'react';
import ReduxUtils from '../utils/redux_utils';
import ArrayUtils from '../utils/array_utils';

class Editor extends React.Component {
  componentDidMount () {
    this.editorReset();
  };

  componentDidUpdate () {
    if (this.handleEvent()) return;
    this.props.actions.setTemporaryElements(this.generateElements(true));
  };

  componentWillUnmount () {
    this.editorReset();
    this.props.actions.resetTemporaryElements();
  };

  editorReset () {
    this.props.actions.resetEditorPoints();
    this.props.actions.resetEditorEvent();
  };

  handleEvent () {
    let {event} = this.props;
    if (!event) return false;

    if ((event.type === 'chain') && (!this.props.needsLoop)) {
      this.props.actions.addPermanentElements(this.generateElements(false));
      let points = this.props.points.slice();
      this.editorReset();
      this.props.actions.addEditorPoints([points[points.length-1]]);
      return true;
    }

    if (event.type === 'done') {
      this.props.actions.addPermanentElements(this.generateElements(false));
      this.editorReset();
      return true;
    }

    if (event.type === 'click') {
      this.props.actions.addEditorPoints([event.point]);
      if (this.props.points.length === 1) {
        this.props.actions.setEditorEvent({type: 'chain'});
      } else {
        this.props.actions.resetEditorEvent();
      }

      return true;
    }

    return false;
  };

  getPoints (temp) {
    let points = this.props.points.slice();
    if (!temp) return points;

    let {event} = this.props;
    if (!event) return points;
    if (event.type !== 'move') return points;
    return points.concat([event.point]);
  };

  generateElements (temp) {
    let points = this.getPoints(temp);
    return this.props.generateElems(points, temp);
  };

  render () {
    return null;
  };
};


let mapStateToProps = (state, ownProps) => {
  return {
    points: state.editorData.points,
    length: state.editorData.points.length,
    event: state.editorData.event
  };
};

export default ReduxUtils.connect(mapStateToProps, true)(Editor);
