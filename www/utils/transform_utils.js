import {Vector, MatrixTransformations} from '../mathutils/gl_matrix_wrapper';
import store from '../store/store';

class TransformUtils {
  static getModelToScreen () {
    let matrixTransforms = MatrixTransformations.create();
    let {transformData, canvasDimensions} = store.getState();
    let {origin, zoomFactor, upVector} = transformData;

    let negOrg = Vector.create(origin.x, origin.y).negate();
    matrixTransforms.append(m => m.translate(negOrg));
    matrixTransforms.append(m => m.scale(zoomFactor*0.01));
    matrixTransforms.append(m => m.scale(10)); // Pixel to units.

    let upVec  = Vector.create(upVector.x, upVector.y);
    matrixTransforms.append(m => m.rotate(upVec.angleTo(Vector.create(0, 1))));

    matrixTransforms.append(m => m.scale(1, -1));
    let midRect = Vector.create(canvasDimensions.width, canvasDimensions.height).scale(0.5);
    matrixTransforms.append(m => m.translate(midRect));

    return matrixTransforms.getMatrix();
  };

  static getScreenToModel () {
    return TransformUtils.getModelToScreen().invert();
  };
};

export default TransformUtils;