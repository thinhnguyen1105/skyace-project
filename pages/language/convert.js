let json = require('./convert.json');
let obj = {};
json.forEach((val, index) => {
  if (index === 0) return;
  else {
    if (val && val.A && val.C) {
      obj[val.A] = {
        key: val.A,
        translated: val.C,
        }
      }
    }
})
console.log(JSON.stringify(obj));