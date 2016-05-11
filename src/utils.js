let types = {};

"Boolean Number String Function Array Date RegExp Object".split(" ").forEach(name => {
    types[ "[object " + name + "]" ] = name.toLowerCase();
});

function isFunction(obj) {
    return getType(obj) === 'function' || false;
}

function isBoolean(obj) {
    return obj === true || obj === false || getType(obj) === 'boolean';
}

function isPromise(obj) {
    return isFunction(obj.then) && isFunction(obj['catch']);
}

function getType(obj) {
    return obj === null
        ? String(obj)
        : types[toString.call(obj)] || 'object';
}

function has(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
}

function noop() {}

// export default {isFunction, isBoolean, isPromise, getType, has, noop}

module.exports = {isFunction, isBoolean, isPromise, getType, has, noop}