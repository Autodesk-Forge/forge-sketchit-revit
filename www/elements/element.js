class Element {
  render (temp) {
    throw new Error('The function render() not implemented.');
  };

  getType () {
    return this.type;
  };
};

export default Element;
