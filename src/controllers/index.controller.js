const home = (req, res, next) => {
  const claims = res.locals;
  res.send(claims);
};

module.exports = {
  home,
};
