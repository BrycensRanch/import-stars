/* eslint-disable func-names */
/* eslint-disable eqeqeq */
/* eslint-disable no-restricted-syntax */
// @ts-nocheck
// This code is black magic I have no idea what it's doing but it's doing some crazy shit.
// I don't know RegExp btw.
// https://stackoverflow.com/a/67794690
// I converted the functions to arrow functions for maximum unreadability
const helpers = {};

helpers.camelize = (str) =>
  str
    .trim()
    .replace(/[A-Z]+/g, (letter, index) => {
      return index == 0 ? letter.toLowerCase() : `_${letter.toLowerCase()}`;
    })
    .replace(/(.(_|-|\s)+.)/g, function (subStr) {
      return subStr[0] + subStr[subStr.length - 1].toUpperCase();
    });

helpers.camelizeKeys = (data) => {
  const result = {};
  for (const [key, val] of Object.entries(data)) {
    result[helpers.camelize(key)] = val;
  }
  return result;
};

helpers.camelizeNestedKeys = (dataObj) =>
  JSON.parse(
    JSON.stringify(dataObj)
      .trim()
      .replace(/("\w+":)/g, (keys) =>
        keys
          .replace(/[A-Z]+/g, (letter, index) => {
            return index == 0
              ? letter.toLowerCase()
              : `_${letter.toLowerCase()}`;
          })
          .replace(
            /(.(_|-|\s)+.)/g,
            (subStr) => subStr[0] + subStr[subStr.length - 1].toUpperCase()
          )
      )
  );
helpers.isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};
helpers.compareTime = (time1, time2) => {
  return new Date(time1) < new Date(time2); // false if time1 is later
};
export default helpers;
