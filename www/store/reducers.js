import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';
import * as ActionTypes from './action_types';

let createReducer = (actionsMap, defaultState) => {
  let actionsMapLocal = {};
  Object.keys(actionsMap).map((key) => {
    let val = actionsMap[key];
    if (val === 'default')
      actionsMapLocal[key] = (state, action) => defaultState;
    else if (val === 'payload')
      actionsMapLocal[key] = (state, action) => action.payload;
    else
      actionsMapLocal[key] = val;
  });
  return handleActions(actionsMapLocal, defaultState);
};

let permanentElementsReducer = createReducer({
  [ActionTypes.ADD_PERMANENT_ELEMENTS]:   (state, action) => state.concat(action.payload),
  [ActionTypes.RESET_PERMANENT_ELEMENTS]: 'default'
}, []);

let temporaryElementsReducer = createReducer({
  [ActionTypes.SET_TEMPORARY_ELEMENTS]:   'payload',
  [ActionTypes.RESET_TEMPORARY_ELEMENTS]: 'default'
}, []);

let editorElemReducer = createReducer({
  [ActionTypes.SET_EDITOR_ELEM]:   'payload',
  [ActionTypes.RESET_EDITOR_ELEM]: 'default'
}, 'none');

let editorCurveReducer = createReducer({
  [ActionTypes.SET_EDITOR_CURVE]:   'payload',
  [ActionTypes.RESET_EDITOR_CURVE]: 'default'
}, 'none');

let editorPointsReducer = createReducer({
  [ActionTypes.ADD_EDITOR_POINTS]:   (state, action) => state.concat(action.payload),
  [ActionTypes.RESET_EDITOR_POINTS]: 'default'
}, []);

let editorEventReducer = createReducer({
  [ActionTypes.SET_EDITOR_EVENT]:   'payload',
  [ActionTypes.RESET_EDITOR_EVENT]: 'default'
}, null);

let eventDataReducer = createReducer({
  [ActionTypes.SET_EVENT_DATA]:   'payload',
  [ActionTypes.RESET_EVENT_DATA]: 'default'
}, {type: 'none', startData: null});

let zoomFactorReducer = createReducer({
  [ActionTypes.SET_ZOOM_FACTOR]:   'payload',
  [ActionTypes.RESET_ZOOM_FACTOR]: 'default'
}, 100);

let upVectorReducer = createReducer({
  [ActionTypes.SET_UP_VECTOR]:   'payload',
  [ActionTypes.RESET_UP_VECTOR]: 'default'
}, {x:0, y:1});

let originReducer = createReducer({
  [ActionTypes.SET_ORIGIN]:   'payload',
  [ActionTypes.RESET_ORIGIN]: 'default'
}, {x:0, y:0});

let canvasDimensionsReducer = createReducer({
  [ActionTypes.SET_CANVAS_DIMENSIONS]: 'payload'
}, {width:-1, height:-1});

let showViewerReducer = createReducer({
  [ActionTypes.SET_SHOW_VIEWER]:   'payload',
  [ActionTypes.RESET_SHOW_VIEWER]: 'default'
}, false);

let modelNameReducer = createReducer({
  [ActionTypes.SET_MODEL_NAME]:   'payload',
  [ActionTypes.RESET_MODEL_NAME]: 'default'
}, '');

let workitemDoneReducer = createReducer({
  [ActionTypes.SET_MODEL_WORKITEM_DONE]:   'payload',
  [ActionTypes.RESET_MODEL_WORKITEM_DONE]: 'default'
}, false);

let modelThumbnailReducer = createReducer({
  [ActionTypes.SET_MODEL_THUMBNAIL]:   'payload',
  [ActionTypes.RESET_MODEL_THUMBNAIL]: 'default'
}, '');

let modelDownloadUrlReducer = createReducer({
  [ActionTypes.SET_MODEL_DOWNLOADURL]:   'payload',
  [ActionTypes.RESET_MODEL_DOWNLOADURL]: 'default'
}, '');

let reducers = combineReducers({
  elementsData: combineReducers({
    permanent: permanentElementsReducer,
    temporary: temporaryElementsReducer
  }),

  eventData: eventDataReducer,

  editorData: combineReducers({
    element: editorElemReducer,
    curve: editorCurveReducer,
    points: editorPointsReducer,
    event: editorEventReducer
  }),

  transformData: combineReducers({
    zoomFactor: zoomFactorReducer,
    upVector: upVectorReducer,
    origin: originReducer,
  }),

  canvasDimensions: canvasDimensionsReducer,

  modelData: combineReducers({
    showViewer: showViewerReducer,
    name: modelNameReducer,
    workitemDone: workitemDoneReducer,
    thumbnail: modelThumbnailReducer,
    downloadUrl: modelDownloadUrlReducer
  })
});

export default reducers;
