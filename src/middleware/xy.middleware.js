const xyHeader = (req, res, next) => {
  // res.headers = {
  //   x: y,
  // };
  res.set('x', 'y');
  next();
};

module.exports = {
  xyHeader,
};
