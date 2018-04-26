exports.andConditionStr = query => {
  let str = "1=1 "; //注意1=1 后面有空格
  for (let key in query) {
    str += `and ${key} ='${query[key]}'`;
  }
  return str;
};
