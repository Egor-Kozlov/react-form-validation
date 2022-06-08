const replaceEmptyStringsInObjectOnFalse = (obj) => {
  for (let key in obj) {
    if (obj[key] === "") {
      obj[key] = false;
    }
  }
  return obj;
};

export default replaceEmptyStringsInObjectOnFalse;
