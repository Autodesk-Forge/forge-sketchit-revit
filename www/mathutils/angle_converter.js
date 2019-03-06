class AngleConverter {
  static toRad(deg) {
    return (Math.PI * deg) / 180;
  };

  static toDeg(rad) {
    return (180 * rad) / Math.PI;
  };
};

export default AngleConverter;