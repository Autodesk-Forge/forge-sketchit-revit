class ArrayUtils {
  static range (num) {
    return Array.from(Array(num).keys());
  };

  static orderedRange (num, last) {
    let arr = this.range(num);
    if (last <  0)   return arr;
    if (last >= num) return arr;
    return arr.concat(arr.splice(last, 1));
  }
};

export default ArrayUtils;