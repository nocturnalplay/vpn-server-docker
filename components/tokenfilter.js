//token filter
const tokenfilter = (data) => {
  if (data) {
    const cookies = data.split(";");
    const token = cookies.map((a) => a.split("="));
    const c = [].concat.apply([], token);
    const tk = c.indexOf("token");
    return c[tk + 1];
  }
  return 0;
};

module.exports = tokenfilter;
