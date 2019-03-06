import React from 'react';
import debounce from 'debounce';
import {Vector, Matrix} from '../mathutils/gl_matrix_wrapper';
import TransformUtils from '../utils/transform_utils';
import store from '../store/store';

class CanvasEvents extends React.Component {
  constructor(props) {
    super(props);

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onMouseWheel = this.onMouseWheel.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.onContextMenu = this.onContextMenu.bind(this);
    this.onMouseWheelDoc = this.onMouseWheelDoc.bind(this);
    this.onResize = this.onResize.bind(this);
    this.resetEventDataDebounce = debounce(this.resetEventDataDebounce.bind(this), 200);
    this.onMouseDownDebounce = debounce(this.onMouseDownDebounce.bind(this), 200);
  };

  getSvgRect () {
    return this.props.getSvg().getBoundingClientRect();
  };

  getPositionAtEvent (event, snap) {
    let boundingRect   = this.getSvgRect();
    let pos = {
      x: event.clientX - boundingRect.left,
      y: event.clientY - boundingRect.top
    };

    if (!snap)
      return pos;

    let svg         = this.props.getSvg();
    let hitTestRect = svg.createSVGRect();

    let snapSize = 5;
    hitTestRect.x = pos.x - snapSize;
    hitTestRect.y = pos.y - snapSize;
    hitTestRect.width  = snapSize*2;
    hitTestRect.height = snapSize*2;

    let nodes = Array.from(svg.getIntersectionList(hitTestRect, null))
                     .filter(elem => elem.tagName === 'circle');

    if (nodes.length === 0)
      return pos;

    let posVec = Vector.create(pos.x, pos.y)
    let modelToScreen = TransformUtils.getModelToScreen();
    let points = nodes.map(elem => JSON.parse(elem.getAttribute('data-snap')))
                      .map(obj  => modelToScreen.transformPoint(Vector.create(obj.x, obj.y)))
                      .sort((pnt1, pnt2) => pnt1.distanceFrom(posVec) < pnt2.distanceFrom(posVec));

    return points[0].asObj();
  };

  register () {
    let svg = this.props.getSvg();
    svg.addEventListener('mousemove', this.onMouseMove, false);
    svg.addEventListener('mouseup', this.onMouseUp, false);
    svg.addEventListener('mousedown', this.onMouseDown, false);
    svg.addEventListener('mouseleave', this.onMouseLeave, false);
    svg.addEventListener('mousewheel', this.onMouseWheel, false);
    window.addEventListener('resize', this.onResize);
    document.addEventListener('keydown', this.onKeydown, false);
    document.addEventListener('mousewheel', this.onMouseWheelDoc, false);
    svg.oncontextmenu = this.onContextMenu;
  };

  unregister () {
    let svg = this.props.getSvg();
    svg.removeEventListener('mousemove', this.onMouseMove, false);
    svg.removeEventListener('mouseup', this.onMouseUp, false);
    svg.removeEventListener('mousedown', this.onMouseDown, false);
    svg.removeEventListener('mouseleave', this.onMouseLeave, false);
    svg.removeEventListener('mousewheel', this.onMouseWheel, false);
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('keydown', this.onKeydown, false);
    document.removeEventListener('mousewheel', this.onMouseWheelDoc, false);
    svg.oncontextmenu = null;
  };

  onContextMenu (event) {
    event.preventDefault();
    return false;
  };

  onMouseWheelDoc (event) {
    event.preventDefault();
    return false;
  };

  onMouseDownDebounce (event) {
    let dataType = 'none';
    let data     = {};

    if (!event.shiftKey) {
      dataType = 'pan';
      data.origin = store.getState().transformData.origin;
    } else {
      dataType = 'rotate';
      data.upVector = store.getState().transformData.upVector;
    }

    this.props.actions.setEventData(dataType, this.getPositionAtEvent(event, false), data);
  };

  onMouseDown (event) {
    this.onMouseDownDebounce(event);
  };

  onMouseMove (event) {
    let data = store.getState().eventData;
    if (data.type === 'pan') {
      this.handlePan(event);
    } else if (data.type === 'rotate') {
      this.handleRotate(event);
    } else {
      this.handleEditorEvent(event, 'move');
      return;
    }
  };

  onMouseUp (event) {
    this.onMouseDownDebounce.clear();

    let data     = store.getState().eventData;
    if (data.type === 'pan') {
      this.handlePan(event);
    } else if (data.type === 'rotate') {
      this.handleRotate(event);
    } else {
      this.handleEditorEvent(event, 'click');
      return;
    }

    this.props.actions.resetEventData();
  };

  onMouseLeave () {
    this.onMouseDownDebounce.clear();
    this.props.actions.resetEventData();
  };

  onMouseWheel (event) {
    event.preventDefault();

    let dataType  = 'none';
    let data      = {};
    let wheelDistance = Math.round(event.wheelDeltaY/30);
    let zoomFactor    = store.getState().transformData.zoomFactor + wheelDistance;
    if (zoomFactor < 25) {
      zoomFactor = 25;
    } else if (zoomFactor > 400) {
      zoomFactor = 400;
    }

    if (wheelDistance > 0) {
      dataType = 'zoomin';
      data.zoomFactor = store.getState().transformData.zoomFactor;
    } else if (wheelDistance < 0) {
      dataType = 'zoomout';
      data.zoomFactor = store.getState().transformData.zoomFactor;
    }

    if (zoomFactor !== store.getState().transformData.zoomFactor) {
      this.props.actions.setEventData(dataType, this.getPositionAtEvent(event, false), data);
      this.props.actions.setZoomFactor(zoomFactor);
    }
    this.resetEventDataDebounce();
    return false;
  };

  resetEventDataDebounce () {
    this.props.actions.resetEventData();
  };

  setCanvasDimensions () {
    let {width, height}  = this.getSvgRect();
    this.props.actions.setCanvasDimensions(width, height);
  }

  onResize (e) {
    this.resetEventDataDebounce();
    this.setCanvasDimensions();
  };

  onKeydown (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      return false;
    }
    if (event.keyCode !== 27) {
      return;
    }

    let data     = store.getState().eventData;
    if (data.type === 'pan') {
      this.cancelPan();
    } else if (data.type === 'rotate') {
      this.cancelRotate();
    }
    this.props.actions.resetEventData();
    this.finishEditor();
  };

  createVectorFromObj (vecObj) {
    return Vector.create(vecObj.x, vecObj.y);
  };

  createVectorInModelCoordinates (vecObj) {
    let screenToModel = TransformUtils.getScreenToModel();
    return screenToModel.transformPoint(this.createVectorFromObj(vecObj));
  };

  handleRotate (event) {
    let data            = store.getState().eventData;
    let midPoint        = this.createVectorInModelCoordinates({x: this.getSvgRect().width*0.5, y: this.getSvgRect().height*0.5});
    let startVec        = this.createVectorInModelCoordinates(data.startData.position).subtract(midPoint);
    let currentVec      = this.createVectorInModelCoordinates(this.getPositionAtEvent(event, false)).subtract(midPoint);

    let matrix          = Matrix.create().rotate(-1 * startVec.angleTo(currentVec));
    let upVector        = matrix.transformPoint(this.createVectorFromObj(data.startData.upVector));
    this.props.actions.setUpVector(upVector.asObj());
  };

  cancelRotate () {
    let data = store.getState().eventData;
    this.props.actions.setUpVector(data.startData.upVector);
  };

  handlePan (event) {
    let data            = store.getState().eventData;
    let startPnt        = this.createVectorInModelCoordinates(data.startData.position);
    let currentPnt      = this.createVectorInModelCoordinates(this.getPositionAtEvent(event, false));
    let moveVec         = currentPnt.subtract(startPnt);

    let org = this.createVectorFromObj(data.startData.origin).subtract(moveVec);
    this.props.actions.setOrigin(org.asObj());
  };

  handleEditorEvent (event, type) {
    let {element} = store.getState().editorData;
    if (element==='none') return;
    let point          = this.createVectorInModelCoordinates(this.getPositionAtEvent(event, true)).asObj();
    let screenToModel  = TransformUtils.getScreenToModel();
    this.props.actions.setEditorEvent({type, point, screenToModel});
  };

  finishEditor () {
    let {element} = store.getState().editorData;
    if (element==='none') return;
    this.props.actions.setEditorEvent({type: 'done'});
    this.props.actions.resetEditorElem();
    this.props.actions.resetEditorCurve();
  };

  cancelPan () {
    let data = store.getState().eventData;
    this.props.actions.setOrigin(data.startData.origin);
  };

  render() {
    return null;
  };
};

export default CanvasEvents;
