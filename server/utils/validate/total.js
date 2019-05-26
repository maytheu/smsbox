let total = contacts => {
  let i = 0;
  let match = contacts.split(",") || contacts.split(", ");
  console.log(match);
  for (i in match) {
    i++;
  }
  return i;
};

module.exports = { total };
