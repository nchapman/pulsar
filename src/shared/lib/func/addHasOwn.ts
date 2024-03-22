export function addHasOwn() {
  // @ts-ignore
  // eslint-disable-next-line func-names
  Object.hasOwn = function (obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  };
}
