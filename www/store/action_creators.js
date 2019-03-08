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

import { createAction } from 'redux-actions';
import * as ActionTypes from './action_types';

export let addPermanentElements   = createAction(ActionTypes.ADD_PERMANENT_ELEMENTS);
export let resetPermanentElements = createAction(ActionTypes.RESET_PERMANENT_ELEMENTS);

export let setTemporaryElements   = createAction(ActionTypes.SET_TEMPORARY_ELEMENTS);
export let resetTemporaryElements = createAction(ActionTypes.RESET_TEMPORARY_ELEMENTS);

export let setEditorElem          = createAction(ActionTypes.SET_EDITOR_ELEM);
export let resetEditorElem        = createAction(ActionTypes.RESET_EDITOR_ELEM);

export let setEditorCurve         = createAction(ActionTypes.SET_EDITOR_CURVE);
export let resetEditorCurve       = createAction(ActionTypes.RESET_EDITOR_CURVE);

export let addEditorPoints        = createAction(ActionTypes.ADD_EDITOR_POINTS);
export let resetEditorPoints      = createAction(ActionTypes.RESET_EDITOR_POINTS);

export let setEditorEvent         = createAction(ActionTypes.SET_EDITOR_EVENT);
export let resetEditorEvent       = createAction(ActionTypes.RESET_EDITOR_EVENT);


let eventDataMap = (type, position, otherData = {}) => {
  let startData = Object.assign(otherData, {position});
  return { type, startData };
};
export let setEventData           = createAction(ActionTypes.SET_EVENT_DATA, eventDataMap);
export let resetEventData         = createAction(ActionTypes.RESET_EVENT_DATA);

export let setZoomFactor          = createAction(ActionTypes.SET_ZOOM_FACTOR);
export let resetZoomFactor        = createAction(ActionTypes.RESET_ZOOM_FACTOR);

export let setUpVector            = createAction(ActionTypes.SET_UP_VECTOR);
export let resetUpVector          = createAction(ActionTypes.RESET_UP_VECTOR);

export let setOrigin              = createAction(ActionTypes.SET_ORIGIN);
export let resetOrigin            = createAction(ActionTypes.RESET_ORIGIN);

let canvasDimensionsMap = (width, height) => {
  return {width, height};
};
export let setCanvasDimensions    = createAction(ActionTypes.SET_CANVAS_DIMENSIONS, canvasDimensionsMap);


export let setShowViewer          = createAction(ActionTypes.SET_SHOW_VIEWER);
export let resetShowViewer        = createAction(ActionTypes.RESET_SHOW_VIEWER);

export let setModelName           = createAction(ActionTypes.SET_MODEL_NAME);
export let resetModelName         = createAction(ActionTypes.RESET_MODEL_NAME);

export let setModelWorkitemDone   = createAction(ActionTypes.SET_MODEL_WORKITEM_DONE);
export let resetModelWorkitemDone = createAction(ActionTypes.RESET_MODEL_WORKITEM_DONE);

export let setModelThumbnail      = createAction(ActionTypes.SET_MODEL_THUMBNAIL);
export let resetModelThumbnail    = createAction(ActionTypes.RESET_MODEL_THUMBNAIL);

export let setModelDownloadUrl    = createAction(ActionTypes.SET_MODEL_DOWNLOADURL);
export let resetModelDownloadUrl  = createAction(ActionTypes.RESET_MODEL_DOWNLOADURL);
