let input = text => {
  const check = /^\d{11}(?:,\d{11})*$/;
  const checkSpace = /^\d{11}(?:, \d{11})*$/;
  if (check.test(text)) {
    return true;
  } else if (checkSpace.test(text)) {
    return true;
  } else return false;
};

module.exports = { input };
 