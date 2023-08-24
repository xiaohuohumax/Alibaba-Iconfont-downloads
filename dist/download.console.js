/**
 * 名称 阿里巴巴矢量图标一键下载
 * 描述 可配置颜色,大小,类型等
 * 版本 v2.0.0
 */

(function(){'use strict';function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}const {toString} = Object.prototype;
const {getPrototypeOf} = Object;
const kindOf = (cache => thing => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));
const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type
};
const typeOfTest = type => thing => typeof thing === type;
const {isArray} = Array;
const isUndefined = typeOfTest('undefined');
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}
const isArrayBuffer = kindOfTest('ArrayBuffer');
function isArrayBufferView(val) {
  let result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}
const isString = typeOfTest('string');
const isFunction = typeOfTest('function');
const isNumber = typeOfTest('number');
const isObject = (thing) => thing !== null && typeof thing === 'object';
const isBoolean = thing => thing === true || thing === false;
const isPlainObject = (val) => {
  if (kindOf(val) !== 'object') {
    return false;
  }
  const prototype = getPrototypeOf(val);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
};
const isDate = kindOfTest('Date');
const isFile = kindOfTest('File');
const isBlob = kindOfTest('Blob');
const isFileList = kindOfTest('FileList');
const isStream = (val) => isObject(val) && isFunction(val.pipe);
const isFormData = (thing) => {
  let kind;
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) || (
      isFunction(thing.append) && (
        (kind = kindOf(thing)) === 'formdata' ||
        (kind === 'object' && isFunction(thing.toString) && thing.toString() === '[object FormData]')
      )
    )
  )
};
const isURLSearchParams = kindOfTest('URLSearchParams');
const trim = (str) => str.trim ?
  str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
function forEach(obj, fn, {allOwnKeys = false} = {}) {
  if (obj === null || typeof obj === 'undefined') {
    return;
  }
  let i;
  let l;
  if (typeof obj !== 'object') {
    obj = [obj];
  }
  if (isArray(obj)) {
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}
function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}
const _global = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : global)
})();
const isContextDefined = (context) => !isUndefined(context) && context !== _global;
function merge() {
  const {caseless} = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  };
  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}
const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  }, {allOwnKeys});
  return a;
};
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
};
const inherits = (constructor, superConstructor, props, descriptors) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, 'super', {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
};
const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};
  destObj = destObj || {};
  if (sourceObj == null) return destObj;
  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);
  return destObj;
};
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};
const toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
};
const isTypedArray = (TypedArray => {
  return thing => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];
  const iterator = generator.call(obj);
  let result;
  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];
  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }
  return arr;
};
const isHTMLForm = kindOfTest('HTMLFormElement');
const toCamelCase = str => {
  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};
const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);
const isRegExp = kindOfTest('RegExp');
const reduceDescriptors = (obj, reducer) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};
  forEach(descriptors, (descriptor, name) => {
    if (reducer(descriptor, name, obj) !== false) {
      reducedDescriptors[name] = descriptor;
    }
  });
  Object.defineProperties(obj, reducedDescriptors);
};
const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
      return false;
    }
    const value = obj[name];
    if (!isFunction(value)) return;
    descriptor.enumerable = false;
    if ('writable' in descriptor) {
      descriptor.writable = false;
      return;
    }
    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error('Can not rewrite read-only method \'' + name + '\'');
      };
    }
  });
};
const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};
  const define = (arr) => {
    arr.forEach(value => {
      obj[value] = true;
    });
  };
  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
  return obj;
};
const noop = () => {};
const toFiniteNumber = (value, defaultValue) => {
  value = +value;
  return Number.isFinite(value) ? value : defaultValue;
};
const ALPHA = 'abcdefghijklmnopqrstuvwxyz';
const DIGIT = '0123456789';
const ALPHABET = {
  DIGIT,
  ALPHA,
  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
};
const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
  let str = '';
  const {length} = alphabet;
  while (size--) {
    str += alphabet[Math.random() * length|0];
  }
  return str;
};
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === 'FormData' && thing[Symbol.iterator]);
}
const toJSONObject = (obj) => {
  const stack = new Array(10);
  const visit = (source, i) => {
    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }
      if(!('toJSON' in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};
        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });
        stack[i] = undefined;
        return target;
      }
    }
    return source;
  };
  return visit(obj, 0);
};
const isAsyncFn = kindOfTest('AsyncFunction');
const isThenable = (thing) =>
  thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);
var utils = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty,
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  ALPHABET,
  generateString,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable
};function AxiosError(message, code, config, request, response) {
  Error.call(this);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = (new Error()).stack;
  }
  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  response && (this.response = response);
}
utils.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      message: this.message,
      name: this.name,
      description: this.description,
      number: this.number,
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      config: utils.toJSONObject(this.config),
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});
const prototype$1 = AxiosError.prototype;
const descriptors = {};
[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL'
].forEach(code => {
  descriptors[code] = {value: code};
});
Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype$1, 'isAxiosError', {value: true});
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype$1);
  utils.toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  }, prop => {
    return prop !== 'isAxiosError';
  });
  AxiosError.call(axiosError, error.message, code, config, request, response);
  axiosError.cause = error;
  axiosError.name = error.name;
  customProps && Object.assign(axiosError, customProps);
  return axiosError;
};var httpAdapter = null;function isVisitable(thing) {
  return utils.isPlainObject(thing) || utils.isArray(thing);
}
function removeBrackets(key) {
  return utils.endsWith(key, '[]') ? key.slice(0, -2) : key;
}
function renderKey(path, key, dots) {
  if (!path) return key;
  return path.concat(key).map(function each(token, i) {
    token = removeBrackets(token);
    return !dots && i ? '[' + token + ']' : token;
  }).join(dots ? '.' : '');
}
function isFlatArray(arr) {
  return utils.isArray(arr) && !arr.some(isVisitable);
}
const predicates = utils.toFlatObject(utils, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});
function toFormData(obj, formData, options) {
  if (!utils.isObject(obj)) {
    throw new TypeError('target must be an object');
  }
  formData = formData || new (FormData)();
  options = utils.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    return !utils.isUndefined(source[option]);
  });
  const metaTokens = options.metaTokens;
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
  const useBlob = _Blob && utils.isSpecCompliantForm(formData);
  if (!utils.isFunction(visitor)) {
    throw new TypeError('visitor must be a function');
  }
  function convertValue(value) {
    if (value === null) return '';
    if (utils.isDate(value)) {
      return value.toISOString();
    }
    if (!useBlob && utils.isBlob(value)) {
      throw new AxiosError('Blob is not supported. Use a Buffer instead.');
    }
    if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }
    return value;
  }
  function defaultVisitor(value, key, path) {
    let arr = value;
    if (value && !path && typeof value === 'object') {
      if (utils.endsWith(key, '{}')) {
        key = metaTokens ? key : key.slice(0, -2);
        value = JSON.stringify(value);
      } else if (
        (utils.isArray(value) && isFlatArray(value)) ||
        ((utils.isFileList(value) || utils.endsWith(key, '[]')) && (arr = utils.toArray(value))
        )) {
        key = removeBrackets(key);
        arr.forEach(function each(el, index) {
          !(utils.isUndefined(el) || el === null) && formData.append(
            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
            convertValue(el)
          );
        });
        return false;
      }
    }
    if (isVisitable(value)) {
      return true;
    }
    formData.append(renderKey(path, key, dots), convertValue(value));
    return false;
  }
  const stack = [];
  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });
  function build(value, path) {
    if (utils.isUndefined(value)) return;
    if (stack.indexOf(value) !== -1) {
      throw Error('Circular reference detected in ' + path.join('.'));
    }
    stack.push(value);
    utils.forEach(value, function each(el, key) {
      const result = !(utils.isUndefined(el) || el === null) && visitor.call(
        formData, el, utils.isString(key) ? key.trim() : key, path, exposedHelpers
      );
      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });
    stack.pop();
  }
  if (!utils.isObject(obj)) {
    throw new TypeError('data must be an object');
  }
  build(obj);
  return formData;
}function encode$1(str) {
  const charMap = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}
function AxiosURLSearchParams(params, options) {
  this._pairs = [];
  params && toFormData(params, this, options);
}
const prototype = AxiosURLSearchParams.prototype;
prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};
prototype.toString = function toString(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode$1);
  } : encode$1;
  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + '=' + _encode(pair[1]);
  }, '').join('&');
};function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}
function buildURL(url, params, options) {
  if (!params) {
    return url;
  }
  const _encode = options && options.encode || encode;
  const serializeFn = options && options.serialize;
  let serializedParams;
  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils.isURLSearchParams(params) ?
      params.toString() :
      new AxiosURLSearchParams(params, options).toString(_encode);
  }
  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }
  return url;
}class InterceptorManager {
  constructor() {
    this.handlers = [];
  }
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }
  forEach(fn) {
    utils.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}
var InterceptorManager$1 = InterceptorManager;var transitionalDefaults = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};var URLSearchParams$1 = typeof URLSearchParams !== 'undefined' ? URLSearchParams : AxiosURLSearchParams;var FormData$1 = typeof FormData !== 'undefined' ? FormData : null;var Blob$1 = typeof Blob !== 'undefined' ? Blob : null;const isStandardBrowserEnv = (() => {
  let product;
  if (typeof navigator !== 'undefined' && (
    (product = navigator.product) === 'ReactNative' ||
    product === 'NativeScript' ||
    product === 'NS')
  ) {
    return false;
  }
  return typeof window !== 'undefined' && typeof document !== 'undefined';
})();
 const isStandardBrowserWebWorkerEnv = (() => {
  return (
    typeof WorkerGlobalScope !== 'undefined' &&
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts === 'function'
  );
})();
var platform = {
  isBrowser: true,
  classes: {
    URLSearchParams: URLSearchParams$1,
    FormData: FormData$1,
    Blob: Blob$1
  },
  isStandardBrowserEnv,
  isStandardBrowserWebWorkerEnv,
  protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
};function toURLEncodedForm(data, options) {
  return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path, helpers) {
      if (platform.isNode && utils.isBuffer(value)) {
        this.append(key, value.toString('base64'));
        return false;
      }
      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}function parsePropPath(name) {
  return utils.matchAll(/\w+|\[(\w*)]/g, name).map(match => {
    return match[0] === '[]' ? '' : match[1] || match[0];
  });
}
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];
    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && utils.isArray(target) ? target.length : name;
    if (isLast) {
      if (utils.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }
      return !isNumericKey;
    }
    if (!target[name] || !utils.isObject(target[name])) {
      target[name] = [];
    }
    const result = buildPath(path, value, target[name], index);
    if (result && utils.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }
    return !isNumericKey;
  }
  if (utils.isFormData(formData) && utils.isFunction(formData.entries)) {
    const obj = {};
    utils.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });
    return obj;
  }
  return null;
}const DEFAULT_CONTENT_TYPE = {
  'Content-Type': undefined
};
function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }
  return (encoder || JSON.stringify)(rawValue);
}
const defaults = {
  transitional: transitionalDefaults,
  adapter: ['xhr', 'http'],
  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || '';
    const hasJSONContentType = contentType.indexOf('application/json') > -1;
    const isObjectPayload = utils.isObject(data);
    if (isObjectPayload && utils.isHTMLForm(data)) {
      data = new FormData(data);
    }
    const isFormData = utils.isFormData(data);
    if (isFormData) {
      if (!hasJSONContentType) {
        return data;
      }
      return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
    }
    if (utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
      return data.toString();
    }
    let isFileList;
    if (isObjectPayload) {
      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }
      if ((isFileList = utils.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
        const _FormData = this.env && this.env.FormData;
        return toFormData(
          isFileList ? {'files[]': data} : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }
    if (isObjectPayload || hasJSONContentType ) {
      headers.setContentType('application/json', false);
      return stringifySafely(data);
    }
    return data;
  }],
  transformResponse: [function transformResponse(data) {
    const transitional = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    const JSONRequested = this.responseType === 'json';
    if (data && utils.isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
      const silentJSONParsing = transitional && transitional.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }
    return data;
  }],
  timeout: 0,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: platform.classes.FormData,
    Blob: platform.classes.Blob
  },
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },
  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  }
};
utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});
utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});
var defaults$1 = defaults;const ignoreDuplicateOf = utils.toObjectSet([
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
]);
var parseHeaders = rawHeaders => {
  const parsed = {};
  let key;
  let val;
  let i;
  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
    i = line.indexOf(':');
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();
    if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
      return;
    }
    if (key === 'set-cookie') {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });
  return parsed;
};const $internals = Symbol('internals');
function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}
function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }
  return utils.isArray(value) ? value.map(normalizeValue) : String(value);
}
function parseTokens(str) {
  const tokens = Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;
  while ((match = tokensRE.exec(str))) {
    tokens[match[1]] = match[2];
  }
  return tokens;
}
const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
  if (utils.isFunction(filter)) {
    return filter.call(this, value, header);
  }
  if (isHeaderNameFilter) {
    value = header;
  }
  if (!utils.isString(value)) return;
  if (utils.isString(filter)) {
    return value.indexOf(filter) !== -1;
  }
  if (utils.isRegExp(filter)) {
    return filter.test(value);
  }
}
function formatHeader(header) {
  return header.trim()
    .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
}
function buildAccessors(obj, header) {
  const accessorName = utils.toCamelCase(' ' + header);
  ['get', 'set', 'has'].forEach(methodName => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}
class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }
  set(header, valueOrRewrite, rewrite) {
    const self = this;
    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);
      if (!lHeader) {
        throw new Error('header name must be a non-empty string');
      }
      const key = utils.findKey(self, lHeader);
      if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
        self[key || _header] = normalizeValue(_value);
      }
    }
    const setHeaders = (headers, _rewrite) =>
      utils.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
    if (utils.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite);
    } else if(utils.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders(header), valueOrRewrite);
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }
    return this;
  }
  get(header, parser) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils.findKey(this, header);
      if (key) {
        const value = this[key];
        if (!parser) {
          return value;
        }
        if (parser === true) {
          return parseTokens(value);
        }
        if (utils.isFunction(parser)) {
          return parser.call(this, value, key);
        }
        if (utils.isRegExp(parser)) {
          return parser.exec(value);
        }
        throw new TypeError('parser must be boolean|regexp|function');
      }
    }
  }
  has(header, matcher) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils.findKey(this, header);
      return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }
    return false;
  }
  delete(header, matcher) {
    const self = this;
    let deleted = false;
    function deleteHeader(_header) {
      _header = normalizeHeader(_header);
      if (_header) {
        const key = utils.findKey(self, _header);
        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
          delete self[key];
          deleted = true;
        }
      }
    }
    if (utils.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }
    return deleted;
  }
  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;
    while (i--) {
      const key = keys[i];
      if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }
    return deleted;
  }
  normalize(format) {
    const self = this;
    const headers = {};
    utils.forEach(this, (value, header) => {
      const key = utils.findKey(headers, header);
      if (key) {
        self[key] = normalizeValue(value);
        delete self[header];
        return;
      }
      const normalized = format ? formatHeader(header) : String(header).trim();
      if (normalized !== header) {
        delete self[header];
      }
      self[normalized] = normalizeValue(value);
      headers[normalized] = true;
    });
    return this;
  }
  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }
  toJSON(asStrings) {
    const obj = Object.create(null);
    utils.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils.isArray(value) ? value.join(', ') : value);
    });
    return obj;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
  }
  get [Symbol.toStringTag]() {
    return 'AxiosHeaders';
  }
  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }
  static concat(first, ...targets) {
    const computed = new this(first);
    targets.forEach((target) => computed.set(target));
    return computed;
  }
  static accessor(header) {
    const internals = this[$internals] = (this[$internals] = {
      accessors: {}
    });
    const accessors = internals.accessors;
    const prototype = this.prototype;
    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);
      if (!accessors[lHeader]) {
        buildAccessors(prototype, _header);
        accessors[lHeader] = true;
      }
    }
    utils.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
    return this;
  }
}
AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);
utils.freezeMethods(AxiosHeaders.prototype);
utils.freezeMethods(AxiosHeaders);
var AxiosHeaders$1 = AxiosHeaders;function transformData(fns, response) {
  const config = this || defaults$1;
  const context = response || config;
  const headers = AxiosHeaders$1.from(context.headers);
  let data = context.data;
  utils.forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
  });
  headers.normalize();
  return data;
}function isCancel(value) {
  return !!(value && value.__CANCEL__);
}function CanceledError(message, config, request) {
  AxiosError.call(this, message == null ? 'canceled' : message, AxiosError.ERR_CANCELED, config, request);
  this.name = 'CanceledError';
}
utils.inherits(CanceledError, AxiosError, {
  __CANCEL__: true
});function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError(
      'Request failed with status code ' + response.status,
      [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}var cookies = platform.isStandardBrowserEnv ?
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        const cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));
        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }
        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }
        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }
        if (secure === true) {
          cookie.push('secure');
        }
        document.cookie = cookie.join('; ');
      },
      read: function read(name) {
        const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },
      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })();function isAbsoluteURL(url) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}var isURLSameOrigin = platform.isStandardBrowserEnv ?
  (function standardBrowserEnv() {
    const msie = /(msie|trident)/i.test(navigator.userAgent);
    const urlParsingNode = document.createElement('a');
    let originURL;
    function resolveURL(url) {
      let href = url;
      if (msie) {
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }
      urlParsingNode.setAttribute('href', href);
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
          urlParsingNode.pathname :
          '/' + urlParsingNode.pathname
      };
    }
    originURL = resolveURL(window.location.href);
    return function isURLSameOrigin(requestURL) {
      const parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
          parsed.host === originURL.host);
    };
  })() :
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })();function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
}function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;
  min = min !== undefined ? min : 1000;
  return function push(chunkLength) {
    const now = Date.now();
    const startedAt = timestamps[tail];
    if (!firstSampleTS) {
      firstSampleTS = now;
    }
    bytes[head] = chunkLength;
    timestamps[head] = now;
    let i = tail;
    let bytesCount = 0;
    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }
    head = (head + 1) % samplesCount;
    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }
    if (now - firstSampleTS < min) {
      return;
    }
    const passed = startedAt && now - startedAt;
    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
  };
}function progressEventReducer(listener, isDownloadStream) {
  let bytesNotified = 0;
  const _speedometer = speedometer(50, 250);
  return e => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : undefined;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;
    bytesNotified = loaded;
    const data = {
      loaded,
      total,
      progress: total ? (loaded / total) : undefined,
      bytes: progressBytes,
      rate: rate ? rate : undefined,
      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
      event: e
    };
    data[isDownloadStream ? 'download' : 'upload'] = true;
    listener(data);
  };
}
const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';
var xhrAdapter = isXHRAdapterSupported && function (config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    let requestData = config.data;
    const requestHeaders = AxiosHeaders$1.from(config.headers).normalize();
    const responseType = config.responseType;
    let onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }
      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }
    if (utils.isFormData(requestData)) {
      if (platform.isStandardBrowserEnv || platform.isStandardBrowserWebWorkerEnv) {
        requestHeaders.setContentType(false);
      } else {
        requestHeaders.setContentType('multipart/form-data;', false);
      }
    }
    let request = new XMLHttpRequest();
    if (config.auth) {
      const username = config.auth.username || '';
      const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.set('Authorization', 'Basic ' + btoa(username + ':' + password));
    }
    const fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);
    request.timeout = config.timeout;
    function onloadend() {
      if (!request) {
        return;
      }
      const responseHeaders = AxiosHeaders$1.from(
        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
        request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };
      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);
      request = null;
    }
    if ('onloadend' in request) {
      request.onloadend = onloadend;
    } else {
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        setTimeout(onloadend);
      };
    }
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }
      reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, config, request));
      request = null;
    };
    request.onerror = function handleError() {
      reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request));
      request = null;
    };
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
      const transitional = config.transitional || transitionalDefaults;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(new AxiosError(
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
        config,
        request));
      request = null;
    };
    if (platform.isStandardBrowserEnv) {
      const xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath))
        && config.xsrfCookieName && cookies.read(config.xsrfCookieName);
      if (xsrfValue) {
        requestHeaders.set(config.xsrfHeaderName, xsrfValue);
      }
    }
    requestData === undefined && requestHeaders.setContentType(null);
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', progressEventReducer(config.onDownloadProgress, true));
    }
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', progressEventReducer(config.onUploadProgress));
    }
    if (config.cancelToken || config.signal) {
      onCanceled = cancel => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
        request.abort();
        request = null;
      };
      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }
    const protocol = parseProtocol(fullPath);
    if (protocol && platform.protocols.indexOf(protocol) === -1) {
      reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));
      return;
    }
    request.send(requestData || null);
  });
};const knownAdapters = {
  http: httpAdapter,
  xhr: xhrAdapter
};
utils.forEach(knownAdapters, (fn, value) => {
  if(fn) {
    try {
      Object.defineProperty(fn, 'name', {value});
    } catch (e) {
    }
    Object.defineProperty(fn, 'adapterName', {value});
  }
});
var adapters = {
  getAdapter: (adapters) => {
    adapters = utils.isArray(adapters) ? adapters : [adapters];
    const {length} = adapters;
    let nameOrAdapter;
    let adapter;
    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      if((adapter = utils.isString(nameOrAdapter) ? knownAdapters[nameOrAdapter.toLowerCase()] : nameOrAdapter)) {
        break;
      }
    }
    if (!adapter) {
      if (adapter === false) {
        throw new AxiosError(
          `Adapter ${nameOrAdapter} is not supported by the environment`,
          'ERR_NOT_SUPPORT'
        );
      }
      throw new Error(
        utils.hasOwnProp(knownAdapters, nameOrAdapter) ?
          `Adapter '${nameOrAdapter}' is not available in the build` :
          `Unknown adapter '${nameOrAdapter}'`
      );
    }
    if (!utils.isFunction(adapter)) {
      throw new TypeError('adapter is not a function');
    }
    return adapter;
  },
  adapters: knownAdapters
};function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
  if (config.signal && config.signal.aborted) {
    throw new CanceledError(null, config);
  }
}
function dispatchRequest(config) {
  throwIfCancellationRequested(config);
  config.headers = AxiosHeaders$1.from(config.headers);
  config.data = transformData.call(
    config,
    config.transformRequest
  );
  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
    config.headers.setContentType('application/x-www-form-urlencoded', false);
  }
  const adapter = adapters.getAdapter(config.adapter || defaults$1.adapter);
  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);
    response.data = transformData.call(
      config,
      config.transformResponse,
      response
    );
    response.headers = AxiosHeaders$1.from(response.headers);
    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
      }
    }
    return Promise.reject(reason);
  });
}const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? thing.toJSON() : thing;
function mergeConfig(config1, config2) {
  config2 = config2 || {};
  const config = {};
  function getMergedValue(target, source, caseless) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge.call({caseless}, target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }
  function mergeDeepProperties(a, b, caseless) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(a, b, caseless);
    } else if (!utils.isUndefined(a)) {
      return getMergedValue(undefined, a, caseless);
    }
  }
  function valueFromConfig2(a, b) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(undefined, b);
    }
  }
  function defaultToConfig2(a, b) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(undefined, b);
    } else if (!utils.isUndefined(a)) {
      return getMergedValue(undefined, a);
    }
  }
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(undefined, a);
    }
  }
  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
  };
  utils.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
    const merge = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge(config1[prop], config2[prop], prop);
    (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });
  return config;
}const VERSION = "1.4.0";const validators$1 = {};
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
  validators$1[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});
const deprecatedWarnings = {};
validators$1.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }
  return (value, opt, opts) => {
    if (validator === false) {
      throw new AxiosError(
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        AxiosError.ERR_DEPRECATED
      );
    }
    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }
    return validator ? validator(value, opt, opts) : true;
  };
};
function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError('Unknown option ' + opt, AxiosError.ERR_BAD_OPTION);
    }
  }
}
var validator = {
  assertOptions,
  validators: validators$1
};const validators = validator.validators;
let Axios$1=class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager$1(),
      response: new InterceptorManager$1()
    };
  }
  request(configOrUrl, config) {
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }
    config = mergeConfig(this.defaults, config);
    const {transitional, paramsSerializer, headers} = config;
    if (transitional !== undefined) {
      validator.assertOptions(transitional, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }
    if (paramsSerializer != null) {
      if (utils.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        };
      } else {
        validator.assertOptions(paramsSerializer, {
          encode: validators.function,
          serialize: validators.function
        }, true);
      }
    }
    config.method = (config.method || this.defaults.method || 'get').toLowerCase();
    let contextHeaders;
    contextHeaders = headers && utils.merge(
      headers.common,
      headers[config.method]
    );
    contextHeaders && utils.forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      (method) => {
        delete headers[method];
      }
    );
    config.headers = AxiosHeaders$1.concat(contextHeaders, headers);
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }
      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });
    let promise;
    let i = 0;
    let len;
    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), undefined];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;
      promise = Promise.resolve(config);
      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }
      return promise;
    }
    len = requestInterceptorChain.length;
    let newConfig = config;
    i = 0;
    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }
    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }
    i = 0;
    len = responseInterceptorChain.length;
    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }
    return promise;
  }
  getUri(config) {
    config = mergeConfig(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
};
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  Axios$1.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});
utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url,
        data
      }));
    };
  }
  Axios$1.prototype[method] = generateHTTPMethod();
  Axios$1.prototype[method + 'Form'] = generateHTTPMethod(true);
});
var Axios$2 = Axios$1;class CancelToken {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }
    let resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });
    const token = this;
    this.promise.then(cancel => {
      if (!token._listeners) return;
      let i = token._listeners.length;
      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });
    this.promise.then = onfulfilled => {
      let _resolve;
      const promise = new Promise(resolve => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);
      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };
      return promise;
    };
    executor(function cancel(message, config, request) {
      if (token.reason) {
        return;
      }
      token.reason = new CanceledError(message, config, request);
      resolvePromise(token.reason);
    });
  }
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }
  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }
    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }
  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
}
var CancelToken$1 = CancelToken;function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}function isAxiosError(payload) {
  return utils.isObject(payload) && (payload.isAxiosError === true);
}const HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};
Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});
var HttpStatusCode$1 = HttpStatusCode;function createInstance(defaultConfig) {
  const context = new Axios$2(defaultConfig);
  const instance = bind(Axios$2.prototype.request, context);
  utils.extend(instance, Axios$2.prototype, context, {allOwnKeys: true});
  utils.extend(instance, context, null, {allOwnKeys: true});
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };
  return instance;
}
const axios = createInstance(defaults$1);
axios.Axios = Axios$2;
axios.CanceledError = CanceledError;
axios.CancelToken = CancelToken$1;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = toFormData;
axios.AxiosError = AxiosError;
axios.Cancel = axios.CanceledError;
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = spread;
axios.isAxiosError = isAxiosError;
axios.mergeConfig = mergeConfig;
axios.AxiosHeaders = AxiosHeaders$1;
axios.formToJSON = thing => formDataToJSON(utils.isHTMLForm(thing) ? new FormData(thing) : thing);
axios.HttpStatusCode = HttpStatusCode$1;
axios.default = axios;
var Axios = axios;/*! js-cookie v3.0.5 | MIT */
function assign (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      target[key] = source[key];
    }
  }
  return target
}
var defaultConverter = {
  read: function (value) {
    if (value[0] === '"') {
      value = value.slice(1, -1);
    }
    return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
  },
  write: function (value) {
    return encodeURIComponent(value).replace(
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
      decodeURIComponent
    )
  }
};
function init (converter, defaultAttributes) {
  function set (name, value, attributes) {
    if (typeof document === 'undefined') {
      return
    }
    attributes = assign({}, defaultAttributes, attributes);
    if (typeof attributes.expires === 'number') {
      attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
    }
    if (attributes.expires) {
      attributes.expires = attributes.expires.toUTCString();
    }
    name = encodeURIComponent(name)
      .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape);
    var stringifiedAttributes = '';
    for (var attributeName in attributes) {
      if (!attributes[attributeName]) {
        continue
      }
      stringifiedAttributes += '; ' + attributeName;
      if (attributes[attributeName] === true) {
        continue
      }
      stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
    }
    return (document.cookie =
      name + '=' + converter.write(value, name) + stringifiedAttributes)
  }
  function get (name) {
    if (typeof document === 'undefined' || (arguments.length && !name)) {
      return
    }
    var cookies = document.cookie ? document.cookie.split('; ') : [];
    var jar = {};
    for (var i = 0; i < cookies.length; i++) {
      var parts = cookies[i].split('=');
      var value = parts.slice(1).join('=');
      try {
        var found = decodeURIComponent(parts[0]);
        jar[found] = converter.read(value, found);
        if (name === found) {
          break
        }
      } catch (e) {}
    }
    return name ? jar[name] : jar
  }
  return Object.create(
    {
      set,
      get,
      remove: function (name, attributes) {
        set(
          name,
          '',
          assign({}, attributes, {
            expires: -1
          })
        );
      },
      withAttributes: function (attributes) {
        return init(this.converter, assign({}, this.attributes, attributes))
      },
      withConverter: function (converter) {
        return init(assign({}, this.converter, converter), this.attributes)
      }
    },
    {
      attributes: { value: Object.freeze(defaultAttributes) },
      converter: { value: Object.freeze(converter) }
    }
  )
}
var api = init(defaultConverter, { path: '/' });var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}var lodash = {exports: {}};/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
lodash.exports;
(function (module, exports) {
(function() {
	  var undefined$1;
	  var VERSION = '4.17.21';
	  var LARGE_ARRAY_SIZE = 200;
	  var CORE_ERROR_TEXT = 'Unsupported core-js use. Try https://npms.io/search?q=ponyfill.',
	      FUNC_ERROR_TEXT = 'Expected a function',
	      INVALID_TEMPL_VAR_ERROR_TEXT = 'Invalid `variable` option passed into `_.template`';
	  var HASH_UNDEFINED = '__lodash_hash_undefined__';
	  var MAX_MEMOIZE_SIZE = 500;
	  var PLACEHOLDER = '__lodash_placeholder__';
	  var CLONE_DEEP_FLAG = 1,
	      CLONE_FLAT_FLAG = 2,
	      CLONE_SYMBOLS_FLAG = 4;
	  var COMPARE_PARTIAL_FLAG = 1,
	      COMPARE_UNORDERED_FLAG = 2;
	  var WRAP_BIND_FLAG = 1,
	      WRAP_BIND_KEY_FLAG = 2,
	      WRAP_CURRY_BOUND_FLAG = 4,
	      WRAP_CURRY_FLAG = 8,
	      WRAP_CURRY_RIGHT_FLAG = 16,
	      WRAP_PARTIAL_FLAG = 32,
	      WRAP_PARTIAL_RIGHT_FLAG = 64,
	      WRAP_ARY_FLAG = 128,
	      WRAP_REARG_FLAG = 256,
	      WRAP_FLIP_FLAG = 512;
	  var DEFAULT_TRUNC_LENGTH = 30,
	      DEFAULT_TRUNC_OMISSION = '...';
	  var HOT_COUNT = 800,
	      HOT_SPAN = 16;
	  var LAZY_FILTER_FLAG = 1,
	      LAZY_MAP_FLAG = 2,
	      LAZY_WHILE_FLAG = 3;
	  var INFINITY = 1 / 0,
	      MAX_SAFE_INTEGER = 9007199254740991,
	      MAX_INTEGER = 1.7976931348623157e+308,
	      NAN = 0 / 0;
	  var MAX_ARRAY_LENGTH = 4294967295,
	      MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
	      HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;
	  var wrapFlags = [
	    ['ary', WRAP_ARY_FLAG],
	    ['bind', WRAP_BIND_FLAG],
	    ['bindKey', WRAP_BIND_KEY_FLAG],
	    ['curry', WRAP_CURRY_FLAG],
	    ['curryRight', WRAP_CURRY_RIGHT_FLAG],
	    ['flip', WRAP_FLIP_FLAG],
	    ['partial', WRAP_PARTIAL_FLAG],
	    ['partialRight', WRAP_PARTIAL_RIGHT_FLAG],
	    ['rearg', WRAP_REARG_FLAG]
	  ];
	  var argsTag = '[object Arguments]',
	      arrayTag = '[object Array]',
	      asyncTag = '[object AsyncFunction]',
	      boolTag = '[object Boolean]',
	      dateTag = '[object Date]',
	      domExcTag = '[object DOMException]',
	      errorTag = '[object Error]',
	      funcTag = '[object Function]',
	      genTag = '[object GeneratorFunction]',
	      mapTag = '[object Map]',
	      numberTag = '[object Number]',
	      nullTag = '[object Null]',
	      objectTag = '[object Object]',
	      promiseTag = '[object Promise]',
	      proxyTag = '[object Proxy]',
	      regexpTag = '[object RegExp]',
	      setTag = '[object Set]',
	      stringTag = '[object String]',
	      symbolTag = '[object Symbol]',
	      undefinedTag = '[object Undefined]',
	      weakMapTag = '[object WeakMap]',
	      weakSetTag = '[object WeakSet]';
	  var arrayBufferTag = '[object ArrayBuffer]',
	      dataViewTag = '[object DataView]',
	      float32Tag = '[object Float32Array]',
	      float64Tag = '[object Float64Array]',
	      int8Tag = '[object Int8Array]',
	      int16Tag = '[object Int16Array]',
	      int32Tag = '[object Int32Array]',
	      uint8Tag = '[object Uint8Array]',
	      uint8ClampedTag = '[object Uint8ClampedArray]',
	      uint16Tag = '[object Uint16Array]',
	      uint32Tag = '[object Uint32Array]';
	  var reEmptyStringLeading = /\b__p \+= '';/g,
	      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
	      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
	  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g,
	      reUnescapedHtml = /[&<>"']/g,
	      reHasEscapedHtml = RegExp(reEscapedHtml.source),
	      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
	  var reEscape = /<%-([\s\S]+?)%>/g,
	      reEvaluate = /<%([\s\S]+?)%>/g,
	      reInterpolate = /<%=([\s\S]+?)%>/g;
	  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
	      reIsPlainProp = /^\w*$/,
	      rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
	  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
	      reHasRegExpChar = RegExp(reRegExpChar.source);
	  var reTrimStart = /^\s+/;
	  var reWhitespace = /\s/;
	  var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
	      reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
	      reSplitDetails = /,? & /;
	  var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
	  var reForbiddenIdentifierChars = /[()=,{}\[\]\/\s]/;
	  var reEscapeChar = /\\(\\)?/g;
	  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
	  var reFlags = /\w*$/;
	  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
	  var reIsBinary = /^0b[01]+$/i;
	  var reIsHostCtor = /^\[object .+?Constructor\]$/;
	  var reIsOctal = /^0o[0-7]+$/i;
	  var reIsUint = /^(?:0|[1-9]\d*)$/;
	  var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
	  var reNoMatch = /($^)/;
	  var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
	  var rsAstralRange = '\\ud800-\\udfff',
	      rsComboMarksRange = '\\u0300-\\u036f',
	      reComboHalfMarksRange = '\\ufe20-\\ufe2f',
	      rsComboSymbolsRange = '\\u20d0-\\u20ff',
	      rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
	      rsDingbatRange = '\\u2700-\\u27bf',
	      rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
	      rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
	      rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
	      rsPunctuationRange = '\\u2000-\\u206f',
	      rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
	      rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
	      rsVarRange = '\\ufe0e\\ufe0f',
	      rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
	  var rsApos = "['\u2019]",
	      rsAstral = '[' + rsAstralRange + ']',
	      rsBreak = '[' + rsBreakRange + ']',
	      rsCombo = '[' + rsComboRange + ']',
	      rsDigits = '\\d+',
	      rsDingbat = '[' + rsDingbatRange + ']',
	      rsLower = '[' + rsLowerRange + ']',
	      rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
	      rsFitz = '\\ud83c[\\udffb-\\udfff]',
	      rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
	      rsNonAstral = '[^' + rsAstralRange + ']',
	      rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
	      rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
	      rsUpper = '[' + rsUpperRange + ']',
	      rsZWJ = '\\u200d';
	  var rsMiscLower = '(?:' + rsLower + '|' + rsMisc + ')',
	      rsMiscUpper = '(?:' + rsUpper + '|' + rsMisc + ')',
	      rsOptContrLower = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
	      rsOptContrUpper = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
	      reOptMod = rsModifier + '?',
	      rsOptVar = '[' + rsVarRange + ']?',
	      rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
	      rsOrdLower = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])',
	      rsOrdUpper = '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])',
	      rsSeq = rsOptVar + reOptMod + rsOptJoin,
	      rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq,
	      rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';
	  var reApos = RegExp(rsApos, 'g');
	  var reComboMark = RegExp(rsCombo, 'g');
	  var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');
	  var reUnicodeWord = RegExp([
	    rsUpper + '?' + rsLower + '+' + rsOptContrLower + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
	    rsMiscUpper + '+' + rsOptContrUpper + '(?=' + [rsBreak, rsUpper + rsMiscLower, '$'].join('|') + ')',
	    rsUpper + '?' + rsMiscLower + '+' + rsOptContrLower,
	    rsUpper + '+' + rsOptContrUpper,
	    rsOrdUpper,
	    rsOrdLower,
	    rsDigits,
	    rsEmoji
	  ].join('|'), 'g');
	  var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');
	  var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
	  var contextProps = [
	    'Array', 'Buffer', 'DataView', 'Date', 'Error', 'Float32Array', 'Float64Array',
	    'Function', 'Int8Array', 'Int16Array', 'Int32Array', 'Map', 'Math', 'Object',
	    'Promise', 'RegExp', 'Set', 'String', 'Symbol', 'TypeError', 'Uint8Array',
	    'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap',
	    '_', 'clearTimeout', 'isFinite', 'parseInt', 'setTimeout'
	  ];
	  var templateCounter = -1;
	  var typedArrayTags = {};
	  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	  typedArrayTags[uint32Tag] = true;
	  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
	  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	  typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
	  typedArrayTags[errorTag] = typedArrayTags[funcTag] =
	  typedArrayTags[mapTag] = typedArrayTags[numberTag] =
	  typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
	  typedArrayTags[setTag] = typedArrayTags[stringTag] =
	  typedArrayTags[weakMapTag] = false;
	  var cloneableTags = {};
	  cloneableTags[argsTag] = cloneableTags[arrayTag] =
	  cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
	  cloneableTags[boolTag] = cloneableTags[dateTag] =
	  cloneableTags[float32Tag] = cloneableTags[float64Tag] =
	  cloneableTags[int8Tag] = cloneableTags[int16Tag] =
	  cloneableTags[int32Tag] = cloneableTags[mapTag] =
	  cloneableTags[numberTag] = cloneableTags[objectTag] =
	  cloneableTags[regexpTag] = cloneableTags[setTag] =
	  cloneableTags[stringTag] = cloneableTags[symbolTag] =
	  cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
	  cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
	  cloneableTags[errorTag] = cloneableTags[funcTag] =
	  cloneableTags[weakMapTag] = false;
	  var deburredLetters = {
	    '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
	    '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
	    '\xc7': 'C',  '\xe7': 'c',
	    '\xd0': 'D',  '\xf0': 'd',
	    '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
	    '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
	    '\xcc': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
	    '\xec': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
	    '\xd1': 'N',  '\xf1': 'n',
	    '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
	    '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
	    '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
	    '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
	    '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
	    '\xc6': 'Ae', '\xe6': 'ae',
	    '\xde': 'Th', '\xfe': 'th',
	    '\xdf': 'ss',
	    '\u0100': 'A',  '\u0102': 'A', '\u0104': 'A',
	    '\u0101': 'a',  '\u0103': 'a', '\u0105': 'a',
	    '\u0106': 'C',  '\u0108': 'C', '\u010a': 'C', '\u010c': 'C',
	    '\u0107': 'c',  '\u0109': 'c', '\u010b': 'c', '\u010d': 'c',
	    '\u010e': 'D',  '\u0110': 'D', '\u010f': 'd', '\u0111': 'd',
	    '\u0112': 'E',  '\u0114': 'E', '\u0116': 'E', '\u0118': 'E', '\u011a': 'E',
	    '\u0113': 'e',  '\u0115': 'e', '\u0117': 'e', '\u0119': 'e', '\u011b': 'e',
	    '\u011c': 'G',  '\u011e': 'G', '\u0120': 'G', '\u0122': 'G',
	    '\u011d': 'g',  '\u011f': 'g', '\u0121': 'g', '\u0123': 'g',
	    '\u0124': 'H',  '\u0126': 'H', '\u0125': 'h', '\u0127': 'h',
	    '\u0128': 'I',  '\u012a': 'I', '\u012c': 'I', '\u012e': 'I', '\u0130': 'I',
	    '\u0129': 'i',  '\u012b': 'i', '\u012d': 'i', '\u012f': 'i', '\u0131': 'i',
	    '\u0134': 'J',  '\u0135': 'j',
	    '\u0136': 'K',  '\u0137': 'k', '\u0138': 'k',
	    '\u0139': 'L',  '\u013b': 'L', '\u013d': 'L', '\u013f': 'L', '\u0141': 'L',
	    '\u013a': 'l',  '\u013c': 'l', '\u013e': 'l', '\u0140': 'l', '\u0142': 'l',
	    '\u0143': 'N',  '\u0145': 'N', '\u0147': 'N', '\u014a': 'N',
	    '\u0144': 'n',  '\u0146': 'n', '\u0148': 'n', '\u014b': 'n',
	    '\u014c': 'O',  '\u014e': 'O', '\u0150': 'O',
	    '\u014d': 'o',  '\u014f': 'o', '\u0151': 'o',
	    '\u0154': 'R',  '\u0156': 'R', '\u0158': 'R',
	    '\u0155': 'r',  '\u0157': 'r', '\u0159': 'r',
	    '\u015a': 'S',  '\u015c': 'S', '\u015e': 'S', '\u0160': 'S',
	    '\u015b': 's',  '\u015d': 's', '\u015f': 's', '\u0161': 's',
	    '\u0162': 'T',  '\u0164': 'T', '\u0166': 'T',
	    '\u0163': 't',  '\u0165': 't', '\u0167': 't',
	    '\u0168': 'U',  '\u016a': 'U', '\u016c': 'U', '\u016e': 'U', '\u0170': 'U', '\u0172': 'U',
	    '\u0169': 'u',  '\u016b': 'u', '\u016d': 'u', '\u016f': 'u', '\u0171': 'u', '\u0173': 'u',
	    '\u0174': 'W',  '\u0175': 'w',
	    '\u0176': 'Y',  '\u0177': 'y', '\u0178': 'Y',
	    '\u0179': 'Z',  '\u017b': 'Z', '\u017d': 'Z',
	    '\u017a': 'z',  '\u017c': 'z', '\u017e': 'z',
	    '\u0132': 'IJ', '\u0133': 'ij',
	    '\u0152': 'Oe', '\u0153': 'oe',
	    '\u0149': "'n", '\u017f': 's'
	  };
	  var htmlEscapes = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#39;'
	  };
	  var htmlUnescapes = {
	    '&amp;': '&',
	    '&lt;': '<',
	    '&gt;': '>',
	    '&quot;': '"',
	    '&#39;': "'"
	  };
	  var stringEscapes = {
	    '\\': '\\',
	    "'": "'",
	    '\n': 'n',
	    '\r': 'r',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	  };
	  var freeParseFloat = parseFloat,
	      freeParseInt = parseInt;
	  var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
	  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
	  var root = freeGlobal || freeSelf || Function('return this')();
	  var freeExports = exports && !exports.nodeType && exports;
	  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;
	  var moduleExports = freeModule && freeModule.exports === freeExports;
	  var freeProcess = moduleExports && freeGlobal.process;
	  var nodeUtil = (function() {
	    try {
	      var types = freeModule && freeModule.require && freeModule.require('util').types;
	      if (types) {
	        return types;
	      }
	      return freeProcess && freeProcess.binding && freeProcess.binding('util');
	    } catch (e) {}
	  }());
	  var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer,
	      nodeIsDate = nodeUtil && nodeUtil.isDate,
	      nodeIsMap = nodeUtil && nodeUtil.isMap,
	      nodeIsRegExp = nodeUtil && nodeUtil.isRegExp,
	      nodeIsSet = nodeUtil && nodeUtil.isSet,
	      nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
	  function apply(func, thisArg, args) {
	    switch (args.length) {
	      case 0: return func.call(thisArg);
	      case 1: return func.call(thisArg, args[0]);
	      case 2: return func.call(thisArg, args[0], args[1]);
	      case 3: return func.call(thisArg, args[0], args[1], args[2]);
	    }
	    return func.apply(thisArg, args);
	  }
	  function arrayAggregator(array, setter, iteratee, accumulator) {
	    var index = -1,
	        length = array == null ? 0 : array.length;
	    while (++index < length) {
	      var value = array[index];
	      setter(accumulator, value, iteratee(value), array);
	    }
	    return accumulator;
	  }
	  function arrayEach(array, iteratee) {
	    var index = -1,
	        length = array == null ? 0 : array.length;
	    while (++index < length) {
	      if (iteratee(array[index], index, array) === false) {
	        break;
	      }
	    }
	    return array;
	  }
	  function arrayEachRight(array, iteratee) {
	    var length = array == null ? 0 : array.length;
	    while (length--) {
	      if (iteratee(array[length], length, array) === false) {
	        break;
	      }
	    }
	    return array;
	  }
	  function arrayEvery(array, predicate) {
	    var index = -1,
	        length = array == null ? 0 : array.length;
	    while (++index < length) {
	      if (!predicate(array[index], index, array)) {
	        return false;
	      }
	    }
	    return true;
	  }
	  function arrayFilter(array, predicate) {
	    var index = -1,
	        length = array == null ? 0 : array.length,
	        resIndex = 0,
	        result = [];
	    while (++index < length) {
	      var value = array[index];
	      if (predicate(value, index, array)) {
	        result[resIndex++] = value;
	      }
	    }
	    return result;
	  }
	  function arrayIncludes(array, value) {
	    var length = array == null ? 0 : array.length;
	    return !!length && baseIndexOf(array, value, 0) > -1;
	  }
	  function arrayIncludesWith(array, value, comparator) {
	    var index = -1,
	        length = array == null ? 0 : array.length;
	    while (++index < length) {
	      if (comparator(value, array[index])) {
	        return true;
	      }
	    }
	    return false;
	  }
	  function arrayMap(array, iteratee) {
	    var index = -1,
	        length = array == null ? 0 : array.length,
	        result = Array(length);
	    while (++index < length) {
	      result[index] = iteratee(array[index], index, array);
	    }
	    return result;
	  }
	  function arrayPush(array, values) {
	    var index = -1,
	        length = values.length,
	        offset = array.length;
	    while (++index < length) {
	      array[offset + index] = values[index];
	    }
	    return array;
	  }
	  function arrayReduce(array, iteratee, accumulator, initAccum) {
	    var index = -1,
	        length = array == null ? 0 : array.length;
	    if (initAccum && length) {
	      accumulator = array[++index];
	    }
	    while (++index < length) {
	      accumulator = iteratee(accumulator, array[index], index, array);
	    }
	    return accumulator;
	  }
	  function arrayReduceRight(array, iteratee, accumulator, initAccum) {
	    var length = array == null ? 0 : array.length;
	    if (initAccum && length) {
	      accumulator = array[--length];
	    }
	    while (length--) {
	      accumulator = iteratee(accumulator, array[length], length, array);
	    }
	    return accumulator;
	  }
	  function arraySome(array, predicate) {
	    var index = -1,
	        length = array == null ? 0 : array.length;
	    while (++index < length) {
	      if (predicate(array[index], index, array)) {
	        return true;
	      }
	    }
	    return false;
	  }
	  var asciiSize = baseProperty('length');
	  function asciiToArray(string) {
	    return string.split('');
	  }
	  function asciiWords(string) {
	    return string.match(reAsciiWord) || [];
	  }
	  function baseFindKey(collection, predicate, eachFunc) {
	    var result;
	    eachFunc(collection, function(value, key, collection) {
	      if (predicate(value, key, collection)) {
	        result = key;
	        return false;
	      }
	    });
	    return result;
	  }
	  function baseFindIndex(array, predicate, fromIndex, fromRight) {
	    var length = array.length,
	        index = fromIndex + (fromRight ? 1 : -1);
	    while ((fromRight ? index-- : ++index < length)) {
	      if (predicate(array[index], index, array)) {
	        return index;
	      }
	    }
	    return -1;
	  }
	  function baseIndexOf(array, value, fromIndex) {
	    return value === value
	      ? strictIndexOf(array, value, fromIndex)
	      : baseFindIndex(array, baseIsNaN, fromIndex);
	  }
	  function baseIndexOfWith(array, value, fromIndex, comparator) {
	    var index = fromIndex - 1,
	        length = array.length;
	    while (++index < length) {
	      if (comparator(array[index], value)) {
	        return index;
	      }
	    }
	    return -1;
	  }
	  function baseIsNaN(value) {
	    return value !== value;
	  }
	  function baseMean(array, iteratee) {
	    var length = array == null ? 0 : array.length;
	    return length ? (baseSum(array, iteratee) / length) : NAN;
	  }
	  function baseProperty(key) {
	    return function(object) {
	      return object == null ? undefined$1 : object[key];
	    };
	  }
	  function basePropertyOf(object) {
	    return function(key) {
	      return object == null ? undefined$1 : object[key];
	    };
	  }
	  function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
	    eachFunc(collection, function(value, index, collection) {
	      accumulator = initAccum
	        ? (initAccum = false, value)
	        : iteratee(accumulator, value, index, collection);
	    });
	    return accumulator;
	  }
	  function baseSortBy(array, comparer) {
	    var length = array.length;
	    array.sort(comparer);
	    while (length--) {
	      array[length] = array[length].value;
	    }
	    return array;
	  }
	  function baseSum(array, iteratee) {
	    var result,
	        index = -1,
	        length = array.length;
	    while (++index < length) {
	      var current = iteratee(array[index]);
	      if (current !== undefined$1) {
	        result = result === undefined$1 ? current : (result + current);
	      }
	    }
	    return result;
	  }
	  function baseTimes(n, iteratee) {
	    var index = -1,
	        result = Array(n);
	    while (++index < n) {
	      result[index] = iteratee(index);
	    }
	    return result;
	  }
	  function baseToPairs(object, props) {
	    return arrayMap(props, function(key) {
	      return [key, object[key]];
	    });
	  }
	  function baseTrim(string) {
	    return string
	      ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
	      : string;
	  }
	  function baseUnary(func) {
	    return function(value) {
	      return func(value);
	    };
	  }
	  function baseValues(object, props) {
	    return arrayMap(props, function(key) {
	      return object[key];
	    });
	  }
	  function cacheHas(cache, key) {
	    return cache.has(key);
	  }
	  function charsStartIndex(strSymbols, chrSymbols) {
	    var index = -1,
	        length = strSymbols.length;
	    while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
	    return index;
	  }
	  function charsEndIndex(strSymbols, chrSymbols) {
	    var index = strSymbols.length;
	    while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
	    return index;
	  }
	  function countHolders(array, placeholder) {
	    var length = array.length,
	        result = 0;
	    while (length--) {
	      if (array[length] === placeholder) {
	        ++result;
	      }
	    }
	    return result;
	  }
	  var deburrLetter = basePropertyOf(deburredLetters);
	  var escapeHtmlChar = basePropertyOf(htmlEscapes);
	  function escapeStringChar(chr) {
	    return '\\' + stringEscapes[chr];
	  }
	  function getValue(object, key) {
	    return object == null ? undefined$1 : object[key];
	  }
	  function hasUnicode(string) {
	    return reHasUnicode.test(string);
	  }
	  function hasUnicodeWord(string) {
	    return reHasUnicodeWord.test(string);
	  }
	  function iteratorToArray(iterator) {
	    var data,
	        result = [];
	    while (!(data = iterator.next()).done) {
	      result.push(data.value);
	    }
	    return result;
	  }
	  function mapToArray(map) {
	    var index = -1,
	        result = Array(map.size);
	    map.forEach(function(value, key) {
	      result[++index] = [key, value];
	    });
	    return result;
	  }
	  function overArg(func, transform) {
	    return function(arg) {
	      return func(transform(arg));
	    };
	  }
	  function replaceHolders(array, placeholder) {
	    var index = -1,
	        length = array.length,
	        resIndex = 0,
	        result = [];
	    while (++index < length) {
	      var value = array[index];
	      if (value === placeholder || value === PLACEHOLDER) {
	        array[index] = PLACEHOLDER;
	        result[resIndex++] = index;
	      }
	    }
	    return result;
	  }
	  function setToArray(set) {
	    var index = -1,
	        result = Array(set.size);
	    set.forEach(function(value) {
	      result[++index] = value;
	    });
	    return result;
	  }
	  function setToPairs(set) {
	    var index = -1,
	        result = Array(set.size);
	    set.forEach(function(value) {
	      result[++index] = [value, value];
	    });
	    return result;
	  }
	  function strictIndexOf(array, value, fromIndex) {
	    var index = fromIndex - 1,
	        length = array.length;
	    while (++index < length) {
	      if (array[index] === value) {
	        return index;
	      }
	    }
	    return -1;
	  }
	  function strictLastIndexOf(array, value, fromIndex) {
	    var index = fromIndex + 1;
	    while (index--) {
	      if (array[index] === value) {
	        return index;
	      }
	    }
	    return index;
	  }
	  function stringSize(string) {
	    return hasUnicode(string)
	      ? unicodeSize(string)
	      : asciiSize(string);
	  }
	  function stringToArray(string) {
	    return hasUnicode(string)
	      ? unicodeToArray(string)
	      : asciiToArray(string);
	  }
	  function trimmedEndIndex(string) {
	    var index = string.length;
	    while (index-- && reWhitespace.test(string.charAt(index))) {}
	    return index;
	  }
	  var unescapeHtmlChar = basePropertyOf(htmlUnescapes);
	  function unicodeSize(string) {
	    var result = reUnicode.lastIndex = 0;
	    while (reUnicode.test(string)) {
	      ++result;
	    }
	    return result;
	  }
	  function unicodeToArray(string) {
	    return string.match(reUnicode) || [];
	  }
	  function unicodeWords(string) {
	    return string.match(reUnicodeWord) || [];
	  }
	  var runInContext = (function runInContext(context) {
	    context = context == null ? root : _.defaults(root.Object(), context, _.pick(root, contextProps));
	    var Array = context.Array,
	        Date = context.Date,
	        Error = context.Error,
	        Function = context.Function,
	        Math = context.Math,
	        Object = context.Object,
	        RegExp = context.RegExp,
	        String = context.String,
	        TypeError = context.TypeError;
	    var arrayProto = Array.prototype,
	        funcProto = Function.prototype,
	        objectProto = Object.prototype;
	    var coreJsData = context['__core-js_shared__'];
	    var funcToString = funcProto.toString;
	    var hasOwnProperty = objectProto.hasOwnProperty;
	    var idCounter = 0;
	    var maskSrcKey = (function() {
	      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
	      return uid ? ('Symbol(src)_1.' + uid) : '';
	    }());
	    var nativeObjectToString = objectProto.toString;
	    var objectCtorString = funcToString.call(Object);
	    var oldDash = root._;
	    var reIsNative = RegExp('^' +
	      funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
	      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	    );
	    var Buffer = moduleExports ? context.Buffer : undefined$1,
	        Symbol = context.Symbol,
	        Uint8Array = context.Uint8Array,
	        allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined$1,
	        getPrototype = overArg(Object.getPrototypeOf, Object),
	        objectCreate = Object.create,
	        propertyIsEnumerable = objectProto.propertyIsEnumerable,
	        splice = arrayProto.splice,
	        spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined$1,
	        symIterator = Symbol ? Symbol.iterator : undefined$1,
	        symToStringTag = Symbol ? Symbol.toStringTag : undefined$1;
	    var defineProperty = (function() {
	      try {
	        var func = getNative(Object, 'defineProperty');
	        func({}, '', {});
	        return func;
	      } catch (e) {}
	    }());
	    var ctxClearTimeout = context.clearTimeout !== root.clearTimeout && context.clearTimeout,
	        ctxNow = Date && Date.now !== root.Date.now && Date.now,
	        ctxSetTimeout = context.setTimeout !== root.setTimeout && context.setTimeout;
	    var nativeCeil = Math.ceil,
	        nativeFloor = Math.floor,
	        nativeGetSymbols = Object.getOwnPropertySymbols,
	        nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined$1,
	        nativeIsFinite = context.isFinite,
	        nativeJoin = arrayProto.join,
	        nativeKeys = overArg(Object.keys, Object),
	        nativeMax = Math.max,
	        nativeMin = Math.min,
	        nativeNow = Date.now,
	        nativeParseInt = context.parseInt,
	        nativeRandom = Math.random,
	        nativeReverse = arrayProto.reverse;
	    var DataView = getNative(context, 'DataView'),
	        Map = getNative(context, 'Map'),
	        Promise = getNative(context, 'Promise'),
	        Set = getNative(context, 'Set'),
	        WeakMap = getNative(context, 'WeakMap'),
	        nativeCreate = getNative(Object, 'create');
	    var metaMap = WeakMap && new WeakMap;
	    var realNames = {};
	    var dataViewCtorString = toSource(DataView),
	        mapCtorString = toSource(Map),
	        promiseCtorString = toSource(Promise),
	        setCtorString = toSource(Set),
	        weakMapCtorString = toSource(WeakMap);
	    var symbolProto = Symbol ? Symbol.prototype : undefined$1,
	        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined$1,
	        symbolToString = symbolProto ? symbolProto.toString : undefined$1;
	    function lodash(value) {
	      if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
	        if (value instanceof LodashWrapper) {
	          return value;
	        }
	        if (hasOwnProperty.call(value, '__wrapped__')) {
	          return wrapperClone(value);
	        }
	      }
	      return new LodashWrapper(value);
	    }
	    var baseCreate = (function() {
	      function object() {}
	      return function(proto) {
	        if (!isObject(proto)) {
	          return {};
	        }
	        if (objectCreate) {
	          return objectCreate(proto);
	        }
	        object.prototype = proto;
	        var result = new object;
	        object.prototype = undefined$1;
	        return result;
	      };
	    }());
	    function baseLodash() {
	    }
	    function LodashWrapper(value, chainAll) {
	      this.__wrapped__ = value;
	      this.__actions__ = [];
	      this.__chain__ = !!chainAll;
	      this.__index__ = 0;
	      this.__values__ = undefined$1;
	    }
	    lodash.templateSettings = {
	      'escape': reEscape,
	      'evaluate': reEvaluate,
	      'interpolate': reInterpolate,
	      'variable': '',
	      'imports': {
	        '_': lodash
	      }
	    };
	    lodash.prototype = baseLodash.prototype;
	    lodash.prototype.constructor = lodash;
	    LodashWrapper.prototype = baseCreate(baseLodash.prototype);
	    LodashWrapper.prototype.constructor = LodashWrapper;
	    function LazyWrapper(value) {
	      this.__wrapped__ = value;
	      this.__actions__ = [];
	      this.__dir__ = 1;
	      this.__filtered__ = false;
	      this.__iteratees__ = [];
	      this.__takeCount__ = MAX_ARRAY_LENGTH;
	      this.__views__ = [];
	    }
	    function lazyClone() {
	      var result = new LazyWrapper(this.__wrapped__);
	      result.__actions__ = copyArray(this.__actions__);
	      result.__dir__ = this.__dir__;
	      result.__filtered__ = this.__filtered__;
	      result.__iteratees__ = copyArray(this.__iteratees__);
	      result.__takeCount__ = this.__takeCount__;
	      result.__views__ = copyArray(this.__views__);
	      return result;
	    }
	    function lazyReverse() {
	      if (this.__filtered__) {
	        var result = new LazyWrapper(this);
	        result.__dir__ = -1;
	        result.__filtered__ = true;
	      } else {
	        result = this.clone();
	        result.__dir__ *= -1;
	      }
	      return result;
	    }
	    function lazyValue() {
	      var array = this.__wrapped__.value(),
	          dir = this.__dir__,
	          isArr = isArray(array),
	          isRight = dir < 0,
	          arrLength = isArr ? array.length : 0,
	          view = getView(0, arrLength, this.__views__),
	          start = view.start,
	          end = view.end,
	          length = end - start,
	          index = isRight ? end : (start - 1),
	          iteratees = this.__iteratees__,
	          iterLength = iteratees.length,
	          resIndex = 0,
	          takeCount = nativeMin(length, this.__takeCount__);
	      if (!isArr || (!isRight && arrLength == length && takeCount == length)) {
	        return baseWrapperValue(array, this.__actions__);
	      }
	      var result = [];
	      outer:
	      while (length-- && resIndex < takeCount) {
	        index += dir;
	        var iterIndex = -1,
	            value = array[index];
	        while (++iterIndex < iterLength) {
	          var data = iteratees[iterIndex],
	              iteratee = data.iteratee,
	              type = data.type,
	              computed = iteratee(value);
	          if (type == LAZY_MAP_FLAG) {
	            value = computed;
	          } else if (!computed) {
	            if (type == LAZY_FILTER_FLAG) {
	              continue outer;
	            } else {
	              break outer;
	            }
	          }
	        }
	        result[resIndex++] = value;
	      }
	      return result;
	    }
	    LazyWrapper.prototype = baseCreate(baseLodash.prototype);
	    LazyWrapper.prototype.constructor = LazyWrapper;
	    function Hash(entries) {
	      var index = -1,
	          length = entries == null ? 0 : entries.length;
	      this.clear();
	      while (++index < length) {
	        var entry = entries[index];
	        this.set(entry[0], entry[1]);
	      }
	    }
	    function hashClear() {
	      this.__data__ = nativeCreate ? nativeCreate(null) : {};
	      this.size = 0;
	    }
	    function hashDelete(key) {
	      var result = this.has(key) && delete this.__data__[key];
	      this.size -= result ? 1 : 0;
	      return result;
	    }
	    function hashGet(key) {
	      var data = this.__data__;
	      if (nativeCreate) {
	        var result = data[key];
	        return result === HASH_UNDEFINED ? undefined$1 : result;
	      }
	      return hasOwnProperty.call(data, key) ? data[key] : undefined$1;
	    }
	    function hashHas(key) {
	      var data = this.__data__;
	      return nativeCreate ? (data[key] !== undefined$1) : hasOwnProperty.call(data, key);
	    }
	    function hashSet(key, value) {
	      var data = this.__data__;
	      this.size += this.has(key) ? 0 : 1;
	      data[key] = (nativeCreate && value === undefined$1) ? HASH_UNDEFINED : value;
	      return this;
	    }
	    Hash.prototype.clear = hashClear;
	    Hash.prototype['delete'] = hashDelete;
	    Hash.prototype.get = hashGet;
	    Hash.prototype.has = hashHas;
	    Hash.prototype.set = hashSet;
	    function ListCache(entries) {
	      var index = -1,
	          length = entries == null ? 0 : entries.length;
	      this.clear();
	      while (++index < length) {
	        var entry = entries[index];
	        this.set(entry[0], entry[1]);
	      }
	    }
	    function listCacheClear() {
	      this.__data__ = [];
	      this.size = 0;
	    }
	    function listCacheDelete(key) {
	      var data = this.__data__,
	          index = assocIndexOf(data, key);
	      if (index < 0) {
	        return false;
	      }
	      var lastIndex = data.length - 1;
	      if (index == lastIndex) {
	        data.pop();
	      } else {
	        splice.call(data, index, 1);
	      }
	      --this.size;
	      return true;
	    }
	    function listCacheGet(key) {
	      var data = this.__data__,
	          index = assocIndexOf(data, key);
	      return index < 0 ? undefined$1 : data[index][1];
	    }
	    function listCacheHas(key) {
	      return assocIndexOf(this.__data__, key) > -1;
	    }
	    function listCacheSet(key, value) {
	      var data = this.__data__,
	          index = assocIndexOf(data, key);
	      if (index < 0) {
	        ++this.size;
	        data.push([key, value]);
	      } else {
	        data[index][1] = value;
	      }
	      return this;
	    }
	    ListCache.prototype.clear = listCacheClear;
	    ListCache.prototype['delete'] = listCacheDelete;
	    ListCache.prototype.get = listCacheGet;
	    ListCache.prototype.has = listCacheHas;
	    ListCache.prototype.set = listCacheSet;
	    function MapCache(entries) {
	      var index = -1,
	          length = entries == null ? 0 : entries.length;
	      this.clear();
	      while (++index < length) {
	        var entry = entries[index];
	        this.set(entry[0], entry[1]);
	      }
	    }
	    function mapCacheClear() {
	      this.size = 0;
	      this.__data__ = {
	        'hash': new Hash,
	        'map': new (Map || ListCache),
	        'string': new Hash
	      };
	    }
	    function mapCacheDelete(key) {
	      var result = getMapData(this, key)['delete'](key);
	      this.size -= result ? 1 : 0;
	      return result;
	    }
	    function mapCacheGet(key) {
	      return getMapData(this, key).get(key);
	    }
	    function mapCacheHas(key) {
	      return getMapData(this, key).has(key);
	    }
	    function mapCacheSet(key, value) {
	      var data = getMapData(this, key),
	          size = data.size;
	      data.set(key, value);
	      this.size += data.size == size ? 0 : 1;
	      return this;
	    }
	    MapCache.prototype.clear = mapCacheClear;
	    MapCache.prototype['delete'] = mapCacheDelete;
	    MapCache.prototype.get = mapCacheGet;
	    MapCache.prototype.has = mapCacheHas;
	    MapCache.prototype.set = mapCacheSet;
	    function SetCache(values) {
	      var index = -1,
	          length = values == null ? 0 : values.length;
	      this.__data__ = new MapCache;
	      while (++index < length) {
	        this.add(values[index]);
	      }
	    }
	    function setCacheAdd(value) {
	      this.__data__.set(value, HASH_UNDEFINED);
	      return this;
	    }
	    function setCacheHas(value) {
	      return this.__data__.has(value);
	    }
	    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
	    SetCache.prototype.has = setCacheHas;
	    function Stack(entries) {
	      var data = this.__data__ = new ListCache(entries);
	      this.size = data.size;
	    }
	    function stackClear() {
	      this.__data__ = new ListCache;
	      this.size = 0;
	    }
	    function stackDelete(key) {
	      var data = this.__data__,
	          result = data['delete'](key);
	      this.size = data.size;
	      return result;
	    }
	    function stackGet(key) {
	      return this.__data__.get(key);
	    }
	    function stackHas(key) {
	      return this.__data__.has(key);
	    }
	    function stackSet(key, value) {
	      var data = this.__data__;
	      if (data instanceof ListCache) {
	        var pairs = data.__data__;
	        if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
	          pairs.push([key, value]);
	          this.size = ++data.size;
	          return this;
	        }
	        data = this.__data__ = new MapCache(pairs);
	      }
	      data.set(key, value);
	      this.size = data.size;
	      return this;
	    }
	    Stack.prototype.clear = stackClear;
	    Stack.prototype['delete'] = stackDelete;
	    Stack.prototype.get = stackGet;
	    Stack.prototype.has = stackHas;
	    Stack.prototype.set = stackSet;
	    function arrayLikeKeys(value, inherited) {
	      var isArr = isArray(value),
	          isArg = !isArr && isArguments(value),
	          isBuff = !isArr && !isArg && isBuffer(value),
	          isType = !isArr && !isArg && !isBuff && isTypedArray(value),
	          skipIndexes = isArr || isArg || isBuff || isType,
	          result = skipIndexes ? baseTimes(value.length, String) : [],
	          length = result.length;
	      for (var key in value) {
	        if ((inherited || hasOwnProperty.call(value, key)) &&
	            !(skipIndexes && (
	               key == 'length' ||
	               (isBuff && (key == 'offset' || key == 'parent')) ||
	               (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
	               isIndex(key, length)
	            ))) {
	          result.push(key);
	        }
	      }
	      return result;
	    }
	    function arraySample(array) {
	      var length = array.length;
	      return length ? array[baseRandom(0, length - 1)] : undefined$1;
	    }
	    function arraySampleSize(array, n) {
	      return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
	    }
	    function arrayShuffle(array) {
	      return shuffleSelf(copyArray(array));
	    }
	    function assignMergeValue(object, key, value) {
	      if ((value !== undefined$1 && !eq(object[key], value)) ||
	          (value === undefined$1 && !(key in object))) {
	        baseAssignValue(object, key, value);
	      }
	    }
	    function assignValue(object, key, value) {
	      var objValue = object[key];
	      if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
	          (value === undefined$1 && !(key in object))) {
	        baseAssignValue(object, key, value);
	      }
	    }
	    function assocIndexOf(array, key) {
	      var length = array.length;
	      while (length--) {
	        if (eq(array[length][0], key)) {
	          return length;
	        }
	      }
	      return -1;
	    }
	    function baseAggregator(collection, setter, iteratee, accumulator) {
	      baseEach(collection, function(value, key, collection) {
	        setter(accumulator, value, iteratee(value), collection);
	      });
	      return accumulator;
	    }
	    function baseAssign(object, source) {
	      return object && copyObject(source, keys(source), object);
	    }
	    function baseAssignIn(object, source) {
	      return object && copyObject(source, keysIn(source), object);
	    }
	    function baseAssignValue(object, key, value) {
	      if (key == '__proto__' && defineProperty) {
	        defineProperty(object, key, {
	          'configurable': true,
	          'enumerable': true,
	          'value': value,
	          'writable': true
	        });
	      } else {
	        object[key] = value;
	      }
	    }
	    function baseAt(object, paths) {
	      var index = -1,
	          length = paths.length,
	          result = Array(length),
	          skip = object == null;
	      while (++index < length) {
	        result[index] = skip ? undefined$1 : get(object, paths[index]);
	      }
	      return result;
	    }
	    function baseClamp(number, lower, upper) {
	      if (number === number) {
	        if (upper !== undefined$1) {
	          number = number <= upper ? number : upper;
	        }
	        if (lower !== undefined$1) {
	          number = number >= lower ? number : lower;
	        }
	      }
	      return number;
	    }
	    function baseClone(value, bitmask, customizer, key, object, stack) {
	      var result,
	          isDeep = bitmask & CLONE_DEEP_FLAG,
	          isFlat = bitmask & CLONE_FLAT_FLAG,
	          isFull = bitmask & CLONE_SYMBOLS_FLAG;
	      if (customizer) {
	        result = object ? customizer(value, key, object, stack) : customizer(value);
	      }
	      if (result !== undefined$1) {
	        return result;
	      }
	      if (!isObject(value)) {
	        return value;
	      }
	      var isArr = isArray(value);
	      if (isArr) {
	        result = initCloneArray(value);
	        if (!isDeep) {
	          return copyArray(value, result);
	        }
	      } else {
	        var tag = getTag(value),
	            isFunc = tag == funcTag || tag == genTag;
	        if (isBuffer(value)) {
	          return cloneBuffer(value, isDeep);
	        }
	        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
	          result = (isFlat || isFunc) ? {} : initCloneObject(value);
	          if (!isDeep) {
	            return isFlat
	              ? copySymbolsIn(value, baseAssignIn(result, value))
	              : copySymbols(value, baseAssign(result, value));
	          }
	        } else {
	          if (!cloneableTags[tag]) {
	            return object ? value : {};
	          }
	          result = initCloneByTag(value, tag, isDeep);
	        }
	      }
	      stack || (stack = new Stack);
	      var stacked = stack.get(value);
	      if (stacked) {
	        return stacked;
	      }
	      stack.set(value, result);
	      if (isSet(value)) {
	        value.forEach(function(subValue) {
	          result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
	        });
	      } else if (isMap(value)) {
	        value.forEach(function(subValue, key) {
	          result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
	        });
	      }
	      var keysFunc = isFull
	        ? (isFlat ? getAllKeysIn : getAllKeys)
	        : (isFlat ? keysIn : keys);
	      var props = isArr ? undefined$1 : keysFunc(value);
	      arrayEach(props || value, function(subValue, key) {
	        if (props) {
	          key = subValue;
	          subValue = value[key];
	        }
	        assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
	      });
	      return result;
	    }
	    function baseConforms(source) {
	      var props = keys(source);
	      return function(object) {
	        return baseConformsTo(object, source, props);
	      };
	    }
	    function baseConformsTo(object, source, props) {
	      var length = props.length;
	      if (object == null) {
	        return !length;
	      }
	      object = Object(object);
	      while (length--) {
	        var key = props[length],
	            predicate = source[key],
	            value = object[key];
	        if ((value === undefined$1 && !(key in object)) || !predicate(value)) {
	          return false;
	        }
	      }
	      return true;
	    }
	    function baseDelay(func, wait, args) {
	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      return setTimeout(function() { func.apply(undefined$1, args); }, wait);
	    }
	    function baseDifference(array, values, iteratee, comparator) {
	      var index = -1,
	          includes = arrayIncludes,
	          isCommon = true,
	          length = array.length,
	          result = [],
	          valuesLength = values.length;
	      if (!length) {
	        return result;
	      }
	      if (iteratee) {
	        values = arrayMap(values, baseUnary(iteratee));
	      }
	      if (comparator) {
	        includes = arrayIncludesWith;
	        isCommon = false;
	      }
	      else if (values.length >= LARGE_ARRAY_SIZE) {
	        includes = cacheHas;
	        isCommon = false;
	        values = new SetCache(values);
	      }
	      outer:
	      while (++index < length) {
	        var value = array[index],
	            computed = iteratee == null ? value : iteratee(value);
	        value = (comparator || value !== 0) ? value : 0;
	        if (isCommon && computed === computed) {
	          var valuesIndex = valuesLength;
	          while (valuesIndex--) {
	            if (values[valuesIndex] === computed) {
	              continue outer;
	            }
	          }
	          result.push(value);
	        }
	        else if (!includes(values, computed, comparator)) {
	          result.push(value);
	        }
	      }
	      return result;
	    }
	    var baseEach = createBaseEach(baseForOwn);
	    var baseEachRight = createBaseEach(baseForOwnRight, true);
	    function baseEvery(collection, predicate) {
	      var result = true;
	      baseEach(collection, function(value, index, collection) {
	        result = !!predicate(value, index, collection);
	        return result;
	      });
	      return result;
	    }
	    function baseExtremum(array, iteratee, comparator) {
	      var index = -1,
	          length = array.length;
	      while (++index < length) {
	        var value = array[index],
	            current = iteratee(value);
	        if (current != null && (computed === undefined$1
	              ? (current === current && !isSymbol(current))
	              : comparator(current, computed)
	            )) {
	          var computed = current,
	              result = value;
	        }
	      }
	      return result;
	    }
	    function baseFill(array, value, start, end) {
	      var length = array.length;
	      start = toInteger(start);
	      if (start < 0) {
	        start = -start > length ? 0 : (length + start);
	      }
	      end = (end === undefined$1 || end > length) ? length : toInteger(end);
	      if (end < 0) {
	        end += length;
	      }
	      end = start > end ? 0 : toLength(end);
	      while (start < end) {
	        array[start++] = value;
	      }
	      return array;
	    }
	    function baseFilter(collection, predicate) {
	      var result = [];
	      baseEach(collection, function(value, index, collection) {
	        if (predicate(value, index, collection)) {
	          result.push(value);
	        }
	      });
	      return result;
	    }
	    function baseFlatten(array, depth, predicate, isStrict, result) {
	      var index = -1,
	          length = array.length;
	      predicate || (predicate = isFlattenable);
	      result || (result = []);
	      while (++index < length) {
	        var value = array[index];
	        if (depth > 0 && predicate(value)) {
	          if (depth > 1) {
	            baseFlatten(value, depth - 1, predicate, isStrict, result);
	          } else {
	            arrayPush(result, value);
	          }
	        } else if (!isStrict) {
	          result[result.length] = value;
	        }
	      }
	      return result;
	    }
	    var baseFor = createBaseFor();
	    var baseForRight = createBaseFor(true);
	    function baseForOwn(object, iteratee) {
	      return object && baseFor(object, iteratee, keys);
	    }
	    function baseForOwnRight(object, iteratee) {
	      return object && baseForRight(object, iteratee, keys);
	    }
	    function baseFunctions(object, props) {
	      return arrayFilter(props, function(key) {
	        return isFunction(object[key]);
	      });
	    }
	    function baseGet(object, path) {
	      path = castPath(path, object);
	      var index = 0,
	          length = path.length;
	      while (object != null && index < length) {
	        object = object[toKey(path[index++])];
	      }
	      return (index && index == length) ? object : undefined$1;
	    }
	    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
	      var result = keysFunc(object);
	      return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
	    }
	    function baseGetTag(value) {
	      if (value == null) {
	        return value === undefined$1 ? undefinedTag : nullTag;
	      }
	      return (symToStringTag && symToStringTag in Object(value))
	        ? getRawTag(value)
	        : objectToString(value);
	    }
	    function baseGt(value, other) {
	      return value > other;
	    }
	    function baseHas(object, key) {
	      return object != null && hasOwnProperty.call(object, key);
	    }
	    function baseHasIn(object, key) {
	      return object != null && key in Object(object);
	    }
	    function baseInRange(number, start, end) {
	      return number >= nativeMin(start, end) && number < nativeMax(start, end);
	    }
	    function baseIntersection(arrays, iteratee, comparator) {
	      var includes = comparator ? arrayIncludesWith : arrayIncludes,
	          length = arrays[0].length,
	          othLength = arrays.length,
	          othIndex = othLength,
	          caches = Array(othLength),
	          maxLength = Infinity,
	          result = [];
	      while (othIndex--) {
	        var array = arrays[othIndex];
	        if (othIndex && iteratee) {
	          array = arrayMap(array, baseUnary(iteratee));
	        }
	        maxLength = nativeMin(array.length, maxLength);
	        caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))
	          ? new SetCache(othIndex && array)
	          : undefined$1;
	      }
	      array = arrays[0];
	      var index = -1,
	          seen = caches[0];
	      outer:
	      while (++index < length && result.length < maxLength) {
	        var value = array[index],
	            computed = iteratee ? iteratee(value) : value;
	        value = (comparator || value !== 0) ? value : 0;
	        if (!(seen
	              ? cacheHas(seen, computed)
	              : includes(result, computed, comparator)
	            )) {
	          othIndex = othLength;
	          while (--othIndex) {
	            var cache = caches[othIndex];
	            if (!(cache
	                  ? cacheHas(cache, computed)
	                  : includes(arrays[othIndex], computed, comparator))
	                ) {
	              continue outer;
	            }
	          }
	          if (seen) {
	            seen.push(computed);
	          }
	          result.push(value);
	        }
	      }
	      return result;
	    }
	    function baseInverter(object, setter, iteratee, accumulator) {
	      baseForOwn(object, function(value, key, object) {
	        setter(accumulator, iteratee(value), key, object);
	      });
	      return accumulator;
	    }
	    function baseInvoke(object, path, args) {
	      path = castPath(path, object);
	      object = parent(object, path);
	      var func = object == null ? object : object[toKey(last(path))];
	      return func == null ? undefined$1 : apply(func, object, args);
	    }
	    function baseIsArguments(value) {
	      return isObjectLike(value) && baseGetTag(value) == argsTag;
	    }
	    function baseIsArrayBuffer(value) {
	      return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
	    }
	    function baseIsDate(value) {
	      return isObjectLike(value) && baseGetTag(value) == dateTag;
	    }
	    function baseIsEqual(value, other, bitmask, customizer, stack) {
	      if (value === other) {
	        return true;
	      }
	      if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
	        return value !== value && other !== other;
	      }
	      return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
	    }
	    function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
	      var objIsArr = isArray(object),
	          othIsArr = isArray(other),
	          objTag = objIsArr ? arrayTag : getTag(object),
	          othTag = othIsArr ? arrayTag : getTag(other);
	      objTag = objTag == argsTag ? objectTag : objTag;
	      othTag = othTag == argsTag ? objectTag : othTag;
	      var objIsObj = objTag == objectTag,
	          othIsObj = othTag == objectTag,
	          isSameTag = objTag == othTag;
	      if (isSameTag && isBuffer(object)) {
	        if (!isBuffer(other)) {
	          return false;
	        }
	        objIsArr = true;
	        objIsObj = false;
	      }
	      if (isSameTag && !objIsObj) {
	        stack || (stack = new Stack);
	        return (objIsArr || isTypedArray(object))
	          ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
	          : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
	      }
	      if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
	        var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
	            othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');
	        if (objIsWrapped || othIsWrapped) {
	          var objUnwrapped = objIsWrapped ? object.value() : object,
	              othUnwrapped = othIsWrapped ? other.value() : other;
	          stack || (stack = new Stack);
	          return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
	        }
	      }
	      if (!isSameTag) {
	        return false;
	      }
	      stack || (stack = new Stack);
	      return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
	    }
	    function baseIsMap(value) {
	      return isObjectLike(value) && getTag(value) == mapTag;
	    }
	    function baseIsMatch(object, source, matchData, customizer) {
	      var index = matchData.length,
	          length = index,
	          noCustomizer = !customizer;
	      if (object == null) {
	        return !length;
	      }
	      object = Object(object);
	      while (index--) {
	        var data = matchData[index];
	        if ((noCustomizer && data[2])
	              ? data[1] !== object[data[0]]
	              : !(data[0] in object)
	            ) {
	          return false;
	        }
	      }
	      while (++index < length) {
	        data = matchData[index];
	        var key = data[0],
	            objValue = object[key],
	            srcValue = data[1];
	        if (noCustomizer && data[2]) {
	          if (objValue === undefined$1 && !(key in object)) {
	            return false;
	          }
	        } else {
	          var stack = new Stack;
	          if (customizer) {
	            var result = customizer(objValue, srcValue, key, object, source, stack);
	          }
	          if (!(result === undefined$1
	                ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
	                : result
	              )) {
	            return false;
	          }
	        }
	      }
	      return true;
	    }
	    function baseIsNative(value) {
	      if (!isObject(value) || isMasked(value)) {
	        return false;
	      }
	      var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
	      return pattern.test(toSource(value));
	    }
	    function baseIsRegExp(value) {
	      return isObjectLike(value) && baseGetTag(value) == regexpTag;
	    }
	    function baseIsSet(value) {
	      return isObjectLike(value) && getTag(value) == setTag;
	    }
	    function baseIsTypedArray(value) {
	      return isObjectLike(value) &&
	        isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
	    }
	    function baseIteratee(value) {
	      if (typeof value == 'function') {
	        return value;
	      }
	      if (value == null) {
	        return identity;
	      }
	      if (typeof value == 'object') {
	        return isArray(value)
	          ? baseMatchesProperty(value[0], value[1])
	          : baseMatches(value);
	      }
	      return property(value);
	    }
	    function baseKeys(object) {
	      if (!isPrototype(object)) {
	        return nativeKeys(object);
	      }
	      var result = [];
	      for (var key in Object(object)) {
	        if (hasOwnProperty.call(object, key) && key != 'constructor') {
	          result.push(key);
	        }
	      }
	      return result;
	    }
	    function baseKeysIn(object) {
	      if (!isObject(object)) {
	        return nativeKeysIn(object);
	      }
	      var isProto = isPrototype(object),
	          result = [];
	      for (var key in object) {
	        if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
	          result.push(key);
	        }
	      }
	      return result;
	    }
	    function baseLt(value, other) {
	      return value < other;
	    }
	    function baseMap(collection, iteratee) {
	      var index = -1,
	          result = isArrayLike(collection) ? Array(collection.length) : [];
	      baseEach(collection, function(value, key, collection) {
	        result[++index] = iteratee(value, key, collection);
	      });
	      return result;
	    }
	    function baseMatches(source) {
	      var matchData = getMatchData(source);
	      if (matchData.length == 1 && matchData[0][2]) {
	        return matchesStrictComparable(matchData[0][0], matchData[0][1]);
	      }
	      return function(object) {
	        return object === source || baseIsMatch(object, source, matchData);
	      };
	    }
	    function baseMatchesProperty(path, srcValue) {
	      if (isKey(path) && isStrictComparable(srcValue)) {
	        return matchesStrictComparable(toKey(path), srcValue);
	      }
	      return function(object) {
	        var objValue = get(object, path);
	        return (objValue === undefined$1 && objValue === srcValue)
	          ? hasIn(object, path)
	          : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
	      };
	    }
	    function baseMerge(object, source, srcIndex, customizer, stack) {
	      if (object === source) {
	        return;
	      }
	      baseFor(source, function(srcValue, key) {
	        stack || (stack = new Stack);
	        if (isObject(srcValue)) {
	          baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
	        }
	        else {
	          var newValue = customizer
	            ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
	            : undefined$1;
	          if (newValue === undefined$1) {
	            newValue = srcValue;
	          }
	          assignMergeValue(object, key, newValue);
	        }
	      }, keysIn);
	    }
	    function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
	      var objValue = safeGet(object, key),
	          srcValue = safeGet(source, key),
	          stacked = stack.get(srcValue);
	      if (stacked) {
	        assignMergeValue(object, key, stacked);
	        return;
	      }
	      var newValue = customizer
	        ? customizer(objValue, srcValue, (key + ''), object, source, stack)
	        : undefined$1;
	      var isCommon = newValue === undefined$1;
	      if (isCommon) {
	        var isArr = isArray(srcValue),
	            isBuff = !isArr && isBuffer(srcValue),
	            isTyped = !isArr && !isBuff && isTypedArray(srcValue);
	        newValue = srcValue;
	        if (isArr || isBuff || isTyped) {
	          if (isArray(objValue)) {
	            newValue = objValue;
	          }
	          else if (isArrayLikeObject(objValue)) {
	            newValue = copyArray(objValue);
	          }
	          else if (isBuff) {
	            isCommon = false;
	            newValue = cloneBuffer(srcValue, true);
	          }
	          else if (isTyped) {
	            isCommon = false;
	            newValue = cloneTypedArray(srcValue, true);
	          }
	          else {
	            newValue = [];
	          }
	        }
	        else if (isPlainObject(srcValue) || isArguments(srcValue)) {
	          newValue = objValue;
	          if (isArguments(objValue)) {
	            newValue = toPlainObject(objValue);
	          }
	          else if (!isObject(objValue) || isFunction(objValue)) {
	            newValue = initCloneObject(srcValue);
	          }
	        }
	        else {
	          isCommon = false;
	        }
	      }
	      if (isCommon) {
	        stack.set(srcValue, newValue);
	        mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
	        stack['delete'](srcValue);
	      }
	      assignMergeValue(object, key, newValue);
	    }
	    function baseNth(array, n) {
	      var length = array.length;
	      if (!length) {
	        return;
	      }
	      n += n < 0 ? length : 0;
	      return isIndex(n, length) ? array[n] : undefined$1;
	    }
	    function baseOrderBy(collection, iteratees, orders) {
	      if (iteratees.length) {
	        iteratees = arrayMap(iteratees, function(iteratee) {
	          if (isArray(iteratee)) {
	            return function(value) {
	              return baseGet(value, iteratee.length === 1 ? iteratee[0] : iteratee);
	            }
	          }
	          return iteratee;
	        });
	      } else {
	        iteratees = [identity];
	      }
	      var index = -1;
	      iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
	      var result = baseMap(collection, function(value, key, collection) {
	        var criteria = arrayMap(iteratees, function(iteratee) {
	          return iteratee(value);
	        });
	        return { 'criteria': criteria, 'index': ++index, 'value': value };
	      });
	      return baseSortBy(result, function(object, other) {
	        return compareMultiple(object, other, orders);
	      });
	    }
	    function basePick(object, paths) {
	      return basePickBy(object, paths, function(value, path) {
	        return hasIn(object, path);
	      });
	    }
	    function basePickBy(object, paths, predicate) {
	      var index = -1,
	          length = paths.length,
	          result = {};
	      while (++index < length) {
	        var path = paths[index],
	            value = baseGet(object, path);
	        if (predicate(value, path)) {
	          baseSet(result, castPath(path, object), value);
	        }
	      }
	      return result;
	    }
	    function basePropertyDeep(path) {
	      return function(object) {
	        return baseGet(object, path);
	      };
	    }
	    function basePullAll(array, values, iteratee, comparator) {
	      var indexOf = comparator ? baseIndexOfWith : baseIndexOf,
	          index = -1,
	          length = values.length,
	          seen = array;
	      if (array === values) {
	        values = copyArray(values);
	      }
	      if (iteratee) {
	        seen = arrayMap(array, baseUnary(iteratee));
	      }
	      while (++index < length) {
	        var fromIndex = 0,
	            value = values[index],
	            computed = iteratee ? iteratee(value) : value;
	        while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
	          if (seen !== array) {
	            splice.call(seen, fromIndex, 1);
	          }
	          splice.call(array, fromIndex, 1);
	        }
	      }
	      return array;
	    }
	    function basePullAt(array, indexes) {
	      var length = array ? indexes.length : 0,
	          lastIndex = length - 1;
	      while (length--) {
	        var index = indexes[length];
	        if (length == lastIndex || index !== previous) {
	          var previous = index;
	          if (isIndex(index)) {
	            splice.call(array, index, 1);
	          } else {
	            baseUnset(array, index);
	          }
	        }
	      }
	      return array;
	    }
	    function baseRandom(lower, upper) {
	      return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
	    }
	    function baseRange(start, end, step, fromRight) {
	      var index = -1,
	          length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
	          result = Array(length);
	      while (length--) {
	        result[fromRight ? length : ++index] = start;
	        start += step;
	      }
	      return result;
	    }
	    function baseRepeat(string, n) {
	      var result = '';
	      if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
	        return result;
	      }
	      do {
	        if (n % 2) {
	          result += string;
	        }
	        n = nativeFloor(n / 2);
	        if (n) {
	          string += string;
	        }
	      } while (n);
	      return result;
	    }
	    function baseRest(func, start) {
	      return setToString(overRest(func, start, identity), func + '');
	    }
	    function baseSample(collection) {
	      return arraySample(values(collection));
	    }
	    function baseSampleSize(collection, n) {
	      var array = values(collection);
	      return shuffleSelf(array, baseClamp(n, 0, array.length));
	    }
	    function baseSet(object, path, value, customizer) {
	      if (!isObject(object)) {
	        return object;
	      }
	      path = castPath(path, object);
	      var index = -1,
	          length = path.length,
	          lastIndex = length - 1,
	          nested = object;
	      while (nested != null && ++index < length) {
	        var key = toKey(path[index]),
	            newValue = value;
	        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
	          return object;
	        }
	        if (index != lastIndex) {
	          var objValue = nested[key];
	          newValue = customizer ? customizer(objValue, key, nested) : undefined$1;
	          if (newValue === undefined$1) {
	            newValue = isObject(objValue)
	              ? objValue
	              : (isIndex(path[index + 1]) ? [] : {});
	          }
	        }
	        assignValue(nested, key, newValue);
	        nested = nested[key];
	      }
	      return object;
	    }
	    var baseSetData = !metaMap ? identity : function(func, data) {
	      metaMap.set(func, data);
	      return func;
	    };
	    var baseSetToString = !defineProperty ? identity : function(func, string) {
	      return defineProperty(func, 'toString', {
	        'configurable': true,
	        'enumerable': false,
	        'value': constant(string),
	        'writable': true
	      });
	    };
	    function baseShuffle(collection) {
	      return shuffleSelf(values(collection));
	    }
	    function baseSlice(array, start, end) {
	      var index = -1,
	          length = array.length;
	      if (start < 0) {
	        start = -start > length ? 0 : (length + start);
	      }
	      end = end > length ? length : end;
	      if (end < 0) {
	        end += length;
	      }
	      length = start > end ? 0 : ((end - start) >>> 0);
	      start >>>= 0;
	      var result = Array(length);
	      while (++index < length) {
	        result[index] = array[index + start];
	      }
	      return result;
	    }
	    function baseSome(collection, predicate) {
	      var result;
	      baseEach(collection, function(value, index, collection) {
	        result = predicate(value, index, collection);
	        return !result;
	      });
	      return !!result;
	    }
	    function baseSortedIndex(array, value, retHighest) {
	      var low = 0,
	          high = array == null ? low : array.length;
	      if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
	        while (low < high) {
	          var mid = (low + high) >>> 1,
	              computed = array[mid];
	          if (computed !== null && !isSymbol(computed) &&
	              (retHighest ? (computed <= value) : (computed < value))) {
	            low = mid + 1;
	          } else {
	            high = mid;
	          }
	        }
	        return high;
	      }
	      return baseSortedIndexBy(array, value, identity, retHighest);
	    }
	    function baseSortedIndexBy(array, value, iteratee, retHighest) {
	      var low = 0,
	          high = array == null ? 0 : array.length;
	      if (high === 0) {
	        return 0;
	      }
	      value = iteratee(value);
	      var valIsNaN = value !== value,
	          valIsNull = value === null,
	          valIsSymbol = isSymbol(value),
	          valIsUndefined = value === undefined$1;
	      while (low < high) {
	        var mid = nativeFloor((low + high) / 2),
	            computed = iteratee(array[mid]),
	            othIsDefined = computed !== undefined$1,
	            othIsNull = computed === null,
	            othIsReflexive = computed === computed,
	            othIsSymbol = isSymbol(computed);
	        if (valIsNaN) {
	          var setLow = retHighest || othIsReflexive;
	        } else if (valIsUndefined) {
	          setLow = othIsReflexive && (retHighest || othIsDefined);
	        } else if (valIsNull) {
	          setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
	        } else if (valIsSymbol) {
	          setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
	        } else if (othIsNull || othIsSymbol) {
	          setLow = false;
	        } else {
	          setLow = retHighest ? (computed <= value) : (computed < value);
	        }
	        if (setLow) {
	          low = mid + 1;
	        } else {
	          high = mid;
	        }
	      }
	      return nativeMin(high, MAX_ARRAY_INDEX);
	    }
	    function baseSortedUniq(array, iteratee) {
	      var index = -1,
	          length = array.length,
	          resIndex = 0,
	          result = [];
	      while (++index < length) {
	        var value = array[index],
	            computed = iteratee ? iteratee(value) : value;
	        if (!index || !eq(computed, seen)) {
	          var seen = computed;
	          result[resIndex++] = value === 0 ? 0 : value;
	        }
	      }
	      return result;
	    }
	    function baseToNumber(value) {
	      if (typeof value == 'number') {
	        return value;
	      }
	      if (isSymbol(value)) {
	        return NAN;
	      }
	      return +value;
	    }
	    function baseToString(value) {
	      if (typeof value == 'string') {
	        return value;
	      }
	      if (isArray(value)) {
	        return arrayMap(value, baseToString) + '';
	      }
	      if (isSymbol(value)) {
	        return symbolToString ? symbolToString.call(value) : '';
	      }
	      var result = (value + '');
	      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	    }
	    function baseUniq(array, iteratee, comparator) {
	      var index = -1,
	          includes = arrayIncludes,
	          length = array.length,
	          isCommon = true,
	          result = [],
	          seen = result;
	      if (comparator) {
	        isCommon = false;
	        includes = arrayIncludesWith;
	      }
	      else if (length >= LARGE_ARRAY_SIZE) {
	        var set = iteratee ? null : createSet(array);
	        if (set) {
	          return setToArray(set);
	        }
	        isCommon = false;
	        includes = cacheHas;
	        seen = new SetCache;
	      }
	      else {
	        seen = iteratee ? [] : result;
	      }
	      outer:
	      while (++index < length) {
	        var value = array[index],
	            computed = iteratee ? iteratee(value) : value;
	        value = (comparator || value !== 0) ? value : 0;
	        if (isCommon && computed === computed) {
	          var seenIndex = seen.length;
	          while (seenIndex--) {
	            if (seen[seenIndex] === computed) {
	              continue outer;
	            }
	          }
	          if (iteratee) {
	            seen.push(computed);
	          }
	          result.push(value);
	        }
	        else if (!includes(seen, computed, comparator)) {
	          if (seen !== result) {
	            seen.push(computed);
	          }
	          result.push(value);
	        }
	      }
	      return result;
	    }
	    function baseUnset(object, path) {
	      path = castPath(path, object);
	      object = parent(object, path);
	      return object == null || delete object[toKey(last(path))];
	    }
	    function baseUpdate(object, path, updater, customizer) {
	      return baseSet(object, path, updater(baseGet(object, path)), customizer);
	    }
	    function baseWhile(array, predicate, isDrop, fromRight) {
	      var length = array.length,
	          index = fromRight ? length : -1;
	      while ((fromRight ? index-- : ++index < length) &&
	        predicate(array[index], index, array)) {}
	      return isDrop
	        ? baseSlice(array, (fromRight ? 0 : index), (fromRight ? index + 1 : length))
	        : baseSlice(array, (fromRight ? index + 1 : 0), (fromRight ? length : index));
	    }
	    function baseWrapperValue(value, actions) {
	      var result = value;
	      if (result instanceof LazyWrapper) {
	        result = result.value();
	      }
	      return arrayReduce(actions, function(result, action) {
	        return action.func.apply(action.thisArg, arrayPush([result], action.args));
	      }, result);
	    }
	    function baseXor(arrays, iteratee, comparator) {
	      var length = arrays.length;
	      if (length < 2) {
	        return length ? baseUniq(arrays[0]) : [];
	      }
	      var index = -1,
	          result = Array(length);
	      while (++index < length) {
	        var array = arrays[index],
	            othIndex = -1;
	        while (++othIndex < length) {
	          if (othIndex != index) {
	            result[index] = baseDifference(result[index] || array, arrays[othIndex], iteratee, comparator);
	          }
	        }
	      }
	      return baseUniq(baseFlatten(result, 1), iteratee, comparator);
	    }
	    function baseZipObject(props, values, assignFunc) {
	      var index = -1,
	          length = props.length,
	          valsLength = values.length,
	          result = {};
	      while (++index < length) {
	        var value = index < valsLength ? values[index] : undefined$1;
	        assignFunc(result, props[index], value);
	      }
	      return result;
	    }
	    function castArrayLikeObject(value) {
	      return isArrayLikeObject(value) ? value : [];
	    }
	    function castFunction(value) {
	      return typeof value == 'function' ? value : identity;
	    }
	    function castPath(value, object) {
	      if (isArray(value)) {
	        return value;
	      }
	      return isKey(value, object) ? [value] : stringToPath(toString(value));
	    }
	    var castRest = baseRest;
	    function castSlice(array, start, end) {
	      var length = array.length;
	      end = end === undefined$1 ? length : end;
	      return (!start && end >= length) ? array : baseSlice(array, start, end);
	    }
	    var clearTimeout = ctxClearTimeout || function(id) {
	      return root.clearTimeout(id);
	    };
	    function cloneBuffer(buffer, isDeep) {
	      if (isDeep) {
	        return buffer.slice();
	      }
	      var length = buffer.length,
	          result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
	      buffer.copy(result);
	      return result;
	    }
	    function cloneArrayBuffer(arrayBuffer) {
	      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
	      new Uint8Array(result).set(new Uint8Array(arrayBuffer));
	      return result;
	    }
	    function cloneDataView(dataView, isDeep) {
	      var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
	      return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
	    }
	    function cloneRegExp(regexp) {
	      var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
	      result.lastIndex = regexp.lastIndex;
	      return result;
	    }
	    function cloneSymbol(symbol) {
	      return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
	    }
	    function cloneTypedArray(typedArray, isDeep) {
	      var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
	      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
	    }
	    function compareAscending(value, other) {
	      if (value !== other) {
	        var valIsDefined = value !== undefined$1,
	            valIsNull = value === null,
	            valIsReflexive = value === value,
	            valIsSymbol = isSymbol(value);
	        var othIsDefined = other !== undefined$1,
	            othIsNull = other === null,
	            othIsReflexive = other === other,
	            othIsSymbol = isSymbol(other);
	        if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
	            (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
	            (valIsNull && othIsDefined && othIsReflexive) ||
	            (!valIsDefined && othIsReflexive) ||
	            !valIsReflexive) {
	          return 1;
	        }
	        if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
	            (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
	            (othIsNull && valIsDefined && valIsReflexive) ||
	            (!othIsDefined && valIsReflexive) ||
	            !othIsReflexive) {
	          return -1;
	        }
	      }
	      return 0;
	    }
	    function compareMultiple(object, other, orders) {
	      var index = -1,
	          objCriteria = object.criteria,
	          othCriteria = other.criteria,
	          length = objCriteria.length,
	          ordersLength = orders.length;
	      while (++index < length) {
	        var result = compareAscending(objCriteria[index], othCriteria[index]);
	        if (result) {
	          if (index >= ordersLength) {
	            return result;
	          }
	          var order = orders[index];
	          return result * (order == 'desc' ? -1 : 1);
	        }
	      }
	      return object.index - other.index;
	    }
	    function composeArgs(args, partials, holders, isCurried) {
	      var argsIndex = -1,
	          argsLength = args.length,
	          holdersLength = holders.length,
	          leftIndex = -1,
	          leftLength = partials.length,
	          rangeLength = nativeMax(argsLength - holdersLength, 0),
	          result = Array(leftLength + rangeLength),
	          isUncurried = !isCurried;
	      while (++leftIndex < leftLength) {
	        result[leftIndex] = partials[leftIndex];
	      }
	      while (++argsIndex < holdersLength) {
	        if (isUncurried || argsIndex < argsLength) {
	          result[holders[argsIndex]] = args[argsIndex];
	        }
	      }
	      while (rangeLength--) {
	        result[leftIndex++] = args[argsIndex++];
	      }
	      return result;
	    }
	    function composeArgsRight(args, partials, holders, isCurried) {
	      var argsIndex = -1,
	          argsLength = args.length,
	          holdersIndex = -1,
	          holdersLength = holders.length,
	          rightIndex = -1,
	          rightLength = partials.length,
	          rangeLength = nativeMax(argsLength - holdersLength, 0),
	          result = Array(rangeLength + rightLength),
	          isUncurried = !isCurried;
	      while (++argsIndex < rangeLength) {
	        result[argsIndex] = args[argsIndex];
	      }
	      var offset = argsIndex;
	      while (++rightIndex < rightLength) {
	        result[offset + rightIndex] = partials[rightIndex];
	      }
	      while (++holdersIndex < holdersLength) {
	        if (isUncurried || argsIndex < argsLength) {
	          result[offset + holders[holdersIndex]] = args[argsIndex++];
	        }
	      }
	      return result;
	    }
	    function copyArray(source, array) {
	      var index = -1,
	          length = source.length;
	      array || (array = Array(length));
	      while (++index < length) {
	        array[index] = source[index];
	      }
	      return array;
	    }
	    function copyObject(source, props, object, customizer) {
	      var isNew = !object;
	      object || (object = {});
	      var index = -1,
	          length = props.length;
	      while (++index < length) {
	        var key = props[index];
	        var newValue = customizer
	          ? customizer(object[key], source[key], key, object, source)
	          : undefined$1;
	        if (newValue === undefined$1) {
	          newValue = source[key];
	        }
	        if (isNew) {
	          baseAssignValue(object, key, newValue);
	        } else {
	          assignValue(object, key, newValue);
	        }
	      }
	      return object;
	    }
	    function copySymbols(source, object) {
	      return copyObject(source, getSymbols(source), object);
	    }
	    function copySymbolsIn(source, object) {
	      return copyObject(source, getSymbolsIn(source), object);
	    }
	    function createAggregator(setter, initializer) {
	      return function(collection, iteratee) {
	        var func = isArray(collection) ? arrayAggregator : baseAggregator,
	            accumulator = initializer ? initializer() : {};
	        return func(collection, setter, getIteratee(iteratee, 2), accumulator);
	      };
	    }
	    function createAssigner(assigner) {
	      return baseRest(function(object, sources) {
	        var index = -1,
	            length = sources.length,
	            customizer = length > 1 ? sources[length - 1] : undefined$1,
	            guard = length > 2 ? sources[2] : undefined$1;
	        customizer = (assigner.length > 3 && typeof customizer == 'function')
	          ? (length--, customizer)
	          : undefined$1;
	        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
	          customizer = length < 3 ? undefined$1 : customizer;
	          length = 1;
	        }
	        object = Object(object);
	        while (++index < length) {
	          var source = sources[index];
	          if (source) {
	            assigner(object, source, index, customizer);
	          }
	        }
	        return object;
	      });
	    }
	    function createBaseEach(eachFunc, fromRight) {
	      return function(collection, iteratee) {
	        if (collection == null) {
	          return collection;
	        }
	        if (!isArrayLike(collection)) {
	          return eachFunc(collection, iteratee);
	        }
	        var length = collection.length,
	            index = fromRight ? length : -1,
	            iterable = Object(collection);
	        while ((fromRight ? index-- : ++index < length)) {
	          if (iteratee(iterable[index], index, iterable) === false) {
	            break;
	          }
	        }
	        return collection;
	      };
	    }
	    function createBaseFor(fromRight) {
	      return function(object, iteratee, keysFunc) {
	        var index = -1,
	            iterable = Object(object),
	            props = keysFunc(object),
	            length = props.length;
	        while (length--) {
	          var key = props[fromRight ? length : ++index];
	          if (iteratee(iterable[key], key, iterable) === false) {
	            break;
	          }
	        }
	        return object;
	      };
	    }
	    function createBind(func, bitmask, thisArg) {
	      var isBind = bitmask & WRAP_BIND_FLAG,
	          Ctor = createCtor(func);
	      function wrapper() {
	        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
	        return fn.apply(isBind ? thisArg : this, arguments);
	      }
	      return wrapper;
	    }
	    function createCaseFirst(methodName) {
	      return function(string) {
	        string = toString(string);
	        var strSymbols = hasUnicode(string)
	          ? stringToArray(string)
	          : undefined$1;
	        var chr = strSymbols
	          ? strSymbols[0]
	          : string.charAt(0);
	        var trailing = strSymbols
	          ? castSlice(strSymbols, 1).join('')
	          : string.slice(1);
	        return chr[methodName]() + trailing;
	      };
	    }
	    function createCompounder(callback) {
	      return function(string) {
	        return arrayReduce(words(deburr(string).replace(reApos, '')), callback, '');
	      };
	    }
	    function createCtor(Ctor) {
	      return function() {
	        var args = arguments;
	        switch (args.length) {
	          case 0: return new Ctor;
	          case 1: return new Ctor(args[0]);
	          case 2: return new Ctor(args[0], args[1]);
	          case 3: return new Ctor(args[0], args[1], args[2]);
	          case 4: return new Ctor(args[0], args[1], args[2], args[3]);
	          case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
	          case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
	          case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
	        }
	        var thisBinding = baseCreate(Ctor.prototype),
	            result = Ctor.apply(thisBinding, args);
	        return isObject(result) ? result : thisBinding;
	      };
	    }
	    function createCurry(func, bitmask, arity) {
	      var Ctor = createCtor(func);
	      function wrapper() {
	        var length = arguments.length,
	            args = Array(length),
	            index = length,
	            placeholder = getHolder(wrapper);
	        while (index--) {
	          args[index] = arguments[index];
	        }
	        var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
	          ? []
	          : replaceHolders(args, placeholder);
	        length -= holders.length;
	        if (length < arity) {
	          return createRecurry(
	            func, bitmask, createHybrid, wrapper.placeholder, undefined$1,
	            args, holders, undefined$1, undefined$1, arity - length);
	        }
	        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
	        return apply(fn, this, args);
	      }
	      return wrapper;
	    }
	    function createFind(findIndexFunc) {
	      return function(collection, predicate, fromIndex) {
	        var iterable = Object(collection);
	        if (!isArrayLike(collection)) {
	          var iteratee = getIteratee(predicate, 3);
	          collection = keys(collection);
	          predicate = function(key) { return iteratee(iterable[key], key, iterable); };
	        }
	        var index = findIndexFunc(collection, predicate, fromIndex);
	        return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined$1;
	      };
	    }
	    function createFlow(fromRight) {
	      return flatRest(function(funcs) {
	        var length = funcs.length,
	            index = length,
	            prereq = LodashWrapper.prototype.thru;
	        if (fromRight) {
	          funcs.reverse();
	        }
	        while (index--) {
	          var func = funcs[index];
	          if (typeof func != 'function') {
	            throw new TypeError(FUNC_ERROR_TEXT);
	          }
	          if (prereq && !wrapper && getFuncName(func) == 'wrapper') {
	            var wrapper = new LodashWrapper([], true);
	          }
	        }
	        index = wrapper ? index : length;
	        while (++index < length) {
	          func = funcs[index];
	          var funcName = getFuncName(func),
	              data = funcName == 'wrapper' ? getData(func) : undefined$1;
	          if (data && isLaziable(data[0]) &&
	                data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) &&
	                !data[4].length && data[9] == 1
	              ) {
	            wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
	          } else {
	            wrapper = (func.length == 1 && isLaziable(func))
	              ? wrapper[funcName]()
	              : wrapper.thru(func);
	          }
	        }
	        return function() {
	          var args = arguments,
	              value = args[0];
	          if (wrapper && args.length == 1 && isArray(value)) {
	            return wrapper.plant(value).value();
	          }
	          var index = 0,
	              result = length ? funcs[index].apply(this, args) : value;
	          while (++index < length) {
	            result = funcs[index].call(this, result);
	          }
	          return result;
	        };
	      });
	    }
	    function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
	      var isAry = bitmask & WRAP_ARY_FLAG,
	          isBind = bitmask & WRAP_BIND_FLAG,
	          isBindKey = bitmask & WRAP_BIND_KEY_FLAG,
	          isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG),
	          isFlip = bitmask & WRAP_FLIP_FLAG,
	          Ctor = isBindKey ? undefined$1 : createCtor(func);
	      function wrapper() {
	        var length = arguments.length,
	            args = Array(length),
	            index = length;
	        while (index--) {
	          args[index] = arguments[index];
	        }
	        if (isCurried) {
	          var placeholder = getHolder(wrapper),
	              holdersCount = countHolders(args, placeholder);
	        }
	        if (partials) {
	          args = composeArgs(args, partials, holders, isCurried);
	        }
	        if (partialsRight) {
	          args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
	        }
	        length -= holdersCount;
	        if (isCurried && length < arity) {
	          var newHolders = replaceHolders(args, placeholder);
	          return createRecurry(
	            func, bitmask, createHybrid, wrapper.placeholder, thisArg,
	            args, newHolders, argPos, ary, arity - length
	          );
	        }
	        var thisBinding = isBind ? thisArg : this,
	            fn = isBindKey ? thisBinding[func] : func;
	        length = args.length;
	        if (argPos) {
	          args = reorder(args, argPos);
	        } else if (isFlip && length > 1) {
	          args.reverse();
	        }
	        if (isAry && ary < length) {
	          args.length = ary;
	        }
	        if (this && this !== root && this instanceof wrapper) {
	          fn = Ctor || createCtor(fn);
	        }
	        return fn.apply(thisBinding, args);
	      }
	      return wrapper;
	    }
	    function createInverter(setter, toIteratee) {
	      return function(object, iteratee) {
	        return baseInverter(object, setter, toIteratee(iteratee), {});
	      };
	    }
	    function createMathOperation(operator, defaultValue) {
	      return function(value, other) {
	        var result;
	        if (value === undefined$1 && other === undefined$1) {
	          return defaultValue;
	        }
	        if (value !== undefined$1) {
	          result = value;
	        }
	        if (other !== undefined$1) {
	          if (result === undefined$1) {
	            return other;
	          }
	          if (typeof value == 'string' || typeof other == 'string') {
	            value = baseToString(value);
	            other = baseToString(other);
	          } else {
	            value = baseToNumber(value);
	            other = baseToNumber(other);
	          }
	          result = operator(value, other);
	        }
	        return result;
	      };
	    }
	    function createOver(arrayFunc) {
	      return flatRest(function(iteratees) {
	        iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
	        return baseRest(function(args) {
	          var thisArg = this;
	          return arrayFunc(iteratees, function(iteratee) {
	            return apply(iteratee, thisArg, args);
	          });
	        });
	      });
	    }
	    function createPadding(length, chars) {
	      chars = chars === undefined$1 ? ' ' : baseToString(chars);
	      var charsLength = chars.length;
	      if (charsLength < 2) {
	        return charsLength ? baseRepeat(chars, length) : chars;
	      }
	      var result = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
	      return hasUnicode(chars)
	        ? castSlice(stringToArray(result), 0, length).join('')
	        : result.slice(0, length);
	    }
	    function createPartial(func, bitmask, thisArg, partials) {
	      var isBind = bitmask & WRAP_BIND_FLAG,
	          Ctor = createCtor(func);
	      function wrapper() {
	        var argsIndex = -1,
	            argsLength = arguments.length,
	            leftIndex = -1,
	            leftLength = partials.length,
	            args = Array(leftLength + argsLength),
	            fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
	        while (++leftIndex < leftLength) {
	          args[leftIndex] = partials[leftIndex];
	        }
	        while (argsLength--) {
	          args[leftIndex++] = arguments[++argsIndex];
	        }
	        return apply(fn, isBind ? thisArg : this, args);
	      }
	      return wrapper;
	    }
	    function createRange(fromRight) {
	      return function(start, end, step) {
	        if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
	          end = step = undefined$1;
	        }
	        start = toFinite(start);
	        if (end === undefined$1) {
	          end = start;
	          start = 0;
	        } else {
	          end = toFinite(end);
	        }
	        step = step === undefined$1 ? (start < end ? 1 : -1) : toFinite(step);
	        return baseRange(start, end, step, fromRight);
	      };
	    }
	    function createRelationalOperation(operator) {
	      return function(value, other) {
	        if (!(typeof value == 'string' && typeof other == 'string')) {
	          value = toNumber(value);
	          other = toNumber(other);
	        }
	        return operator(value, other);
	      };
	    }
	    function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
	      var isCurry = bitmask & WRAP_CURRY_FLAG,
	          newHolders = isCurry ? holders : undefined$1,
	          newHoldersRight = isCurry ? undefined$1 : holders,
	          newPartials = isCurry ? partials : undefined$1,
	          newPartialsRight = isCurry ? undefined$1 : partials;
	      bitmask |= (isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG);
	      bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);
	      if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
	        bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
	      }
	      var newData = [
	        func, bitmask, thisArg, newPartials, newHolders, newPartialsRight,
	        newHoldersRight, argPos, ary, arity
	      ];
	      var result = wrapFunc.apply(undefined$1, newData);
	      if (isLaziable(func)) {
	        setData(result, newData);
	      }
	      result.placeholder = placeholder;
	      return setWrapToString(result, func, bitmask);
	    }
	    function createRound(methodName) {
	      var func = Math[methodName];
	      return function(number, precision) {
	        number = toNumber(number);
	        precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);
	        if (precision && nativeIsFinite(number)) {
	          var pair = (toString(number) + 'e').split('e'),
	              value = func(pair[0] + 'e' + (+pair[1] + precision));
	          pair = (toString(value) + 'e').split('e');
	          return +(pair[0] + 'e' + (+pair[1] - precision));
	        }
	        return func(number);
	      };
	    }
	    var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
	      return new Set(values);
	    };
	    function createToPairs(keysFunc) {
	      return function(object) {
	        var tag = getTag(object);
	        if (tag == mapTag) {
	          return mapToArray(object);
	        }
	        if (tag == setTag) {
	          return setToPairs(object);
	        }
	        return baseToPairs(object, keysFunc(object));
	      };
	    }
	    function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
	      var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
	      if (!isBindKey && typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      var length = partials ? partials.length : 0;
	      if (!length) {
	        bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
	        partials = holders = undefined$1;
	      }
	      ary = ary === undefined$1 ? ary : nativeMax(toInteger(ary), 0);
	      arity = arity === undefined$1 ? arity : toInteger(arity);
	      length -= holders ? holders.length : 0;
	      if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
	        var partialsRight = partials,
	            holdersRight = holders;
	        partials = holders = undefined$1;
	      }
	      var data = isBindKey ? undefined$1 : getData(func);
	      var newData = [
	        func, bitmask, thisArg, partials, holders, partialsRight, holdersRight,
	        argPos, ary, arity
	      ];
	      if (data) {
	        mergeData(newData, data);
	      }
	      func = newData[0];
	      bitmask = newData[1];
	      thisArg = newData[2];
	      partials = newData[3];
	      holders = newData[4];
	      arity = newData[9] = newData[9] === undefined$1
	        ? (isBindKey ? 0 : func.length)
	        : nativeMax(newData[9] - length, 0);
	      if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
	        bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
	      }
	      if (!bitmask || bitmask == WRAP_BIND_FLAG) {
	        var result = createBind(func, bitmask, thisArg);
	      } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
	        result = createCurry(func, bitmask, arity);
	      } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
	        result = createPartial(func, bitmask, thisArg, partials);
	      } else {
	        result = createHybrid.apply(undefined$1, newData);
	      }
	      var setter = data ? baseSetData : setData;
	      return setWrapToString(setter(result, newData), func, bitmask);
	    }
	    function customDefaultsAssignIn(objValue, srcValue, key, object) {
	      if (objValue === undefined$1 ||
	          (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
	        return srcValue;
	      }
	      return objValue;
	    }
	    function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
	      if (isObject(objValue) && isObject(srcValue)) {
	        stack.set(srcValue, objValue);
	        baseMerge(objValue, srcValue, undefined$1, customDefaultsMerge, stack);
	        stack['delete'](srcValue);
	      }
	      return objValue;
	    }
	    function customOmitClone(value) {
	      return isPlainObject(value) ? undefined$1 : value;
	    }
	    function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
	      var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
	          arrLength = array.length,
	          othLength = other.length;
	      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
	        return false;
	      }
	      var arrStacked = stack.get(array);
	      var othStacked = stack.get(other);
	      if (arrStacked && othStacked) {
	        return arrStacked == other && othStacked == array;
	      }
	      var index = -1,
	          result = true,
	          seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined$1;
	      stack.set(array, other);
	      stack.set(other, array);
	      while (++index < arrLength) {
	        var arrValue = array[index],
	            othValue = other[index];
	        if (customizer) {
	          var compared = isPartial
	            ? customizer(othValue, arrValue, index, other, array, stack)
	            : customizer(arrValue, othValue, index, array, other, stack);
	        }
	        if (compared !== undefined$1) {
	          if (compared) {
	            continue;
	          }
	          result = false;
	          break;
	        }
	        if (seen) {
	          if (!arraySome(other, function(othValue, othIndex) {
	                if (!cacheHas(seen, othIndex) &&
	                    (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
	                  return seen.push(othIndex);
	                }
	              })) {
	            result = false;
	            break;
	          }
	        } else if (!(
	              arrValue === othValue ||
	                equalFunc(arrValue, othValue, bitmask, customizer, stack)
	            )) {
	          result = false;
	          break;
	        }
	      }
	      stack['delete'](array);
	      stack['delete'](other);
	      return result;
	    }
	    function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
	      switch (tag) {
	        case dataViewTag:
	          if ((object.byteLength != other.byteLength) ||
	              (object.byteOffset != other.byteOffset)) {
	            return false;
	          }
	          object = object.buffer;
	          other = other.buffer;
	        case arrayBufferTag:
	          if ((object.byteLength != other.byteLength) ||
	              !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
	            return false;
	          }
	          return true;
	        case boolTag:
	        case dateTag:
	        case numberTag:
	          return eq(+object, +other);
	        case errorTag:
	          return object.name == other.name && object.message == other.message;
	        case regexpTag:
	        case stringTag:
	          return object == (other + '');
	        case mapTag:
	          var convert = mapToArray;
	        case setTag:
	          var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
	          convert || (convert = setToArray);
	          if (object.size != other.size && !isPartial) {
	            return false;
	          }
	          var stacked = stack.get(object);
	          if (stacked) {
	            return stacked == other;
	          }
	          bitmask |= COMPARE_UNORDERED_FLAG;
	          stack.set(object, other);
	          var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
	          stack['delete'](object);
	          return result;
	        case symbolTag:
	          if (symbolValueOf) {
	            return symbolValueOf.call(object) == symbolValueOf.call(other);
	          }
	      }
	      return false;
	    }
	    function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
	      var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
	          objProps = getAllKeys(object),
	          objLength = objProps.length,
	          othProps = getAllKeys(other),
	          othLength = othProps.length;
	      if (objLength != othLength && !isPartial) {
	        return false;
	      }
	      var index = objLength;
	      while (index--) {
	        var key = objProps[index];
	        if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
	          return false;
	        }
	      }
	      var objStacked = stack.get(object);
	      var othStacked = stack.get(other);
	      if (objStacked && othStacked) {
	        return objStacked == other && othStacked == object;
	      }
	      var result = true;
	      stack.set(object, other);
	      stack.set(other, object);
	      var skipCtor = isPartial;
	      while (++index < objLength) {
	        key = objProps[index];
	        var objValue = object[key],
	            othValue = other[key];
	        if (customizer) {
	          var compared = isPartial
	            ? customizer(othValue, objValue, key, other, object, stack)
	            : customizer(objValue, othValue, key, object, other, stack);
	        }
	        if (!(compared === undefined$1
	              ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
	              : compared
	            )) {
	          result = false;
	          break;
	        }
	        skipCtor || (skipCtor = key == 'constructor');
	      }
	      if (result && !skipCtor) {
	        var objCtor = object.constructor,
	            othCtor = other.constructor;
	        if (objCtor != othCtor &&
	            ('constructor' in object && 'constructor' in other) &&
	            !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
	              typeof othCtor == 'function' && othCtor instanceof othCtor)) {
	          result = false;
	        }
	      }
	      stack['delete'](object);
	      stack['delete'](other);
	      return result;
	    }
	    function flatRest(func) {
	      return setToString(overRest(func, undefined$1, flatten), func + '');
	    }
	    function getAllKeys(object) {
	      return baseGetAllKeys(object, keys, getSymbols);
	    }
	    function getAllKeysIn(object) {
	      return baseGetAllKeys(object, keysIn, getSymbolsIn);
	    }
	    var getData = !metaMap ? noop : function(func) {
	      return metaMap.get(func);
	    };
	    function getFuncName(func) {
	      var result = (func.name + ''),
	          array = realNames[result],
	          length = hasOwnProperty.call(realNames, result) ? array.length : 0;
	      while (length--) {
	        var data = array[length],
	            otherFunc = data.func;
	        if (otherFunc == null || otherFunc == func) {
	          return data.name;
	        }
	      }
	      return result;
	    }
	    function getHolder(func) {
	      var object = hasOwnProperty.call(lodash, 'placeholder') ? lodash : func;
	      return object.placeholder;
	    }
	    function getIteratee() {
	      var result = lodash.iteratee || iteratee;
	      result = result === iteratee ? baseIteratee : result;
	      return arguments.length ? result(arguments[0], arguments[1]) : result;
	    }
	    function getMapData(map, key) {
	      var data = map.__data__;
	      return isKeyable(key)
	        ? data[typeof key == 'string' ? 'string' : 'hash']
	        : data.map;
	    }
	    function getMatchData(object) {
	      var result = keys(object),
	          length = result.length;
	      while (length--) {
	        var key = result[length],
	            value = object[key];
	        result[length] = [key, value, isStrictComparable(value)];
	      }
	      return result;
	    }
	    function getNative(object, key) {
	      var value = getValue(object, key);
	      return baseIsNative(value) ? value : undefined$1;
	    }
	    function getRawTag(value) {
	      var isOwn = hasOwnProperty.call(value, symToStringTag),
	          tag = value[symToStringTag];
	      try {
	        value[symToStringTag] = undefined$1;
	        var unmasked = true;
	      } catch (e) {}
	      var result = nativeObjectToString.call(value);
	      if (unmasked) {
	        if (isOwn) {
	          value[symToStringTag] = tag;
	        } else {
	          delete value[symToStringTag];
	        }
	      }
	      return result;
	    }
	    var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
	      if (object == null) {
	        return [];
	      }
	      object = Object(object);
	      return arrayFilter(nativeGetSymbols(object), function(symbol) {
	        return propertyIsEnumerable.call(object, symbol);
	      });
	    };
	    var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
	      var result = [];
	      while (object) {
	        arrayPush(result, getSymbols(object));
	        object = getPrototype(object);
	      }
	      return result;
	    };
	    var getTag = baseGetTag;
	    if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
	        (Map && getTag(new Map) != mapTag) ||
	        (Promise && getTag(Promise.resolve()) != promiseTag) ||
	        (Set && getTag(new Set) != setTag) ||
	        (WeakMap && getTag(new WeakMap) != weakMapTag)) {
	      getTag = function(value) {
	        var result = baseGetTag(value),
	            Ctor = result == objectTag ? value.constructor : undefined$1,
	            ctorString = Ctor ? toSource(Ctor) : '';
	        if (ctorString) {
	          switch (ctorString) {
	            case dataViewCtorString: return dataViewTag;
	            case mapCtorString: return mapTag;
	            case promiseCtorString: return promiseTag;
	            case setCtorString: return setTag;
	            case weakMapCtorString: return weakMapTag;
	          }
	        }
	        return result;
	      };
	    }
	    function getView(start, end, transforms) {
	      var index = -1,
	          length = transforms.length;
	      while (++index < length) {
	        var data = transforms[index],
	            size = data.size;
	        switch (data.type) {
	          case 'drop':      start += size; break;
	          case 'dropRight': end -= size; break;
	          case 'take':      end = nativeMin(end, start + size); break;
	          case 'takeRight': start = nativeMax(start, end - size); break;
	        }
	      }
	      return { 'start': start, 'end': end };
	    }
	    function getWrapDetails(source) {
	      var match = source.match(reWrapDetails);
	      return match ? match[1].split(reSplitDetails) : [];
	    }
	    function hasPath(object, path, hasFunc) {
	      path = castPath(path, object);
	      var index = -1,
	          length = path.length,
	          result = false;
	      while (++index < length) {
	        var key = toKey(path[index]);
	        if (!(result = object != null && hasFunc(object, key))) {
	          break;
	        }
	        object = object[key];
	      }
	      if (result || ++index != length) {
	        return result;
	      }
	      length = object == null ? 0 : object.length;
	      return !!length && isLength(length) && isIndex(key, length) &&
	        (isArray(object) || isArguments(object));
	    }
	    function initCloneArray(array) {
	      var length = array.length,
	          result = new array.constructor(length);
	      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
	        result.index = array.index;
	        result.input = array.input;
	      }
	      return result;
	    }
	    function initCloneObject(object) {
	      return (typeof object.constructor == 'function' && !isPrototype(object))
	        ? baseCreate(getPrototype(object))
	        : {};
	    }
	    function initCloneByTag(object, tag, isDeep) {
	      var Ctor = object.constructor;
	      switch (tag) {
	        case arrayBufferTag:
	          return cloneArrayBuffer(object);
	        case boolTag:
	        case dateTag:
	          return new Ctor(+object);
	        case dataViewTag:
	          return cloneDataView(object, isDeep);
	        case float32Tag: case float64Tag:
	        case int8Tag: case int16Tag: case int32Tag:
	        case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
	          return cloneTypedArray(object, isDeep);
	        case mapTag:
	          return new Ctor;
	        case numberTag:
	        case stringTag:
	          return new Ctor(object);
	        case regexpTag:
	          return cloneRegExp(object);
	        case setTag:
	          return new Ctor;
	        case symbolTag:
	          return cloneSymbol(object);
	      }
	    }
	    function insertWrapDetails(source, details) {
	      var length = details.length;
	      if (!length) {
	        return source;
	      }
	      var lastIndex = length - 1;
	      details[lastIndex] = (length > 1 ? '& ' : '') + details[lastIndex];
	      details = details.join(length > 2 ? ', ' : ' ');
	      return source.replace(reWrapComment, '{\n/* [wrapped with ' + details + '] */\n');
	    }
	    function isFlattenable(value) {
	      return isArray(value) || isArguments(value) ||
	        !!(spreadableSymbol && value && value[spreadableSymbol]);
	    }
	    function isIndex(value, length) {
	      var type = typeof value;
	      length = length == null ? MAX_SAFE_INTEGER : length;
	      return !!length &&
	        (type == 'number' ||
	          (type != 'symbol' && reIsUint.test(value))) &&
	            (value > -1 && value % 1 == 0 && value < length);
	    }
	    function isIterateeCall(value, index, object) {
	      if (!isObject(object)) {
	        return false;
	      }
	      var type = typeof index;
	      if (type == 'number'
	            ? (isArrayLike(object) && isIndex(index, object.length))
	            : (type == 'string' && index in object)
	          ) {
	        return eq(object[index], value);
	      }
	      return false;
	    }
	    function isKey(value, object) {
	      if (isArray(value)) {
	        return false;
	      }
	      var type = typeof value;
	      if (type == 'number' || type == 'symbol' || type == 'boolean' ||
	          value == null || isSymbol(value)) {
	        return true;
	      }
	      return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
	        (object != null && value in Object(object));
	    }
	    function isKeyable(value) {
	      var type = typeof value;
	      return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
	        ? (value !== '__proto__')
	        : (value === null);
	    }
	    function isLaziable(func) {
	      var funcName = getFuncName(func),
	          other = lodash[funcName];
	      if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
	        return false;
	      }
	      if (func === other) {
	        return true;
	      }
	      var data = getData(other);
	      return !!data && func === data[0];
	    }
	    function isMasked(func) {
	      return !!maskSrcKey && (maskSrcKey in func);
	    }
	    var isMaskable = coreJsData ? isFunction : stubFalse;
	    function isPrototype(value) {
	      var Ctor = value && value.constructor,
	          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;
	      return value === proto;
	    }
	    function isStrictComparable(value) {
	      return value === value && !isObject(value);
	    }
	    function matchesStrictComparable(key, srcValue) {
	      return function(object) {
	        if (object == null) {
	          return false;
	        }
	        return object[key] === srcValue &&
	          (srcValue !== undefined$1 || (key in Object(object)));
	      };
	    }
	    function memoizeCapped(func) {
	      var result = memoize(func, function(key) {
	        if (cache.size === MAX_MEMOIZE_SIZE) {
	          cache.clear();
	        }
	        return key;
	      });
	      var cache = result.cache;
	      return result;
	    }
	    function mergeData(data, source) {
	      var bitmask = data[1],
	          srcBitmask = source[1],
	          newBitmask = bitmask | srcBitmask,
	          isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);
	      var isCombo =
	        ((srcBitmask == WRAP_ARY_FLAG) && (bitmask == WRAP_CURRY_FLAG)) ||
	        ((srcBitmask == WRAP_ARY_FLAG) && (bitmask == WRAP_REARG_FLAG) && (data[7].length <= source[8])) ||
	        ((srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG)) && (source[7].length <= source[8]) && (bitmask == WRAP_CURRY_FLAG));
	      if (!(isCommon || isCombo)) {
	        return data;
	      }
	      if (srcBitmask & WRAP_BIND_FLAG) {
	        data[2] = source[2];
	        newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
	      }
	      var value = source[3];
	      if (value) {
	        var partials = data[3];
	        data[3] = partials ? composeArgs(partials, value, source[4]) : value;
	        data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
	      }
	      value = source[5];
	      if (value) {
	        partials = data[5];
	        data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
	        data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
	      }
	      value = source[7];
	      if (value) {
	        data[7] = value;
	      }
	      if (srcBitmask & WRAP_ARY_FLAG) {
	        data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
	      }
	      if (data[9] == null) {
	        data[9] = source[9];
	      }
	      data[0] = source[0];
	      data[1] = newBitmask;
	      return data;
	    }
	    function nativeKeysIn(object) {
	      var result = [];
	      if (object != null) {
	        for (var key in Object(object)) {
	          result.push(key);
	        }
	      }
	      return result;
	    }
	    function objectToString(value) {
	      return nativeObjectToString.call(value);
	    }
	    function overRest(func, start, transform) {
	      start = nativeMax(start === undefined$1 ? (func.length - 1) : start, 0);
	      return function() {
	        var args = arguments,
	            index = -1,
	            length = nativeMax(args.length - start, 0),
	            array = Array(length);
	        while (++index < length) {
	          array[index] = args[start + index];
	        }
	        index = -1;
	        var otherArgs = Array(start + 1);
	        while (++index < start) {
	          otherArgs[index] = args[index];
	        }
	        otherArgs[start] = transform(array);
	        return apply(func, this, otherArgs);
	      };
	    }
	    function parent(object, path) {
	      return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
	    }
	    function reorder(array, indexes) {
	      var arrLength = array.length,
	          length = nativeMin(indexes.length, arrLength),
	          oldArray = copyArray(array);
	      while (length--) {
	        var index = indexes[length];
	        array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined$1;
	      }
	      return array;
	    }
	    function safeGet(object, key) {
	      if (key === 'constructor' && typeof object[key] === 'function') {
	        return;
	      }
	      if (key == '__proto__') {
	        return;
	      }
	      return object[key];
	    }
	    var setData = shortOut(baseSetData);
	    var setTimeout = ctxSetTimeout || function(func, wait) {
	      return root.setTimeout(func, wait);
	    };
	    var setToString = shortOut(baseSetToString);
	    function setWrapToString(wrapper, reference, bitmask) {
	      var source = (reference + '');
	      return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
	    }
	    function shortOut(func) {
	      var count = 0,
	          lastCalled = 0;
	      return function() {
	        var stamp = nativeNow(),
	            remaining = HOT_SPAN - (stamp - lastCalled);
	        lastCalled = stamp;
	        if (remaining > 0) {
	          if (++count >= HOT_COUNT) {
	            return arguments[0];
	          }
	        } else {
	          count = 0;
	        }
	        return func.apply(undefined$1, arguments);
	      };
	    }
	    function shuffleSelf(array, size) {
	      var index = -1,
	          length = array.length,
	          lastIndex = length - 1;
	      size = size === undefined$1 ? length : size;
	      while (++index < size) {
	        var rand = baseRandom(index, lastIndex),
	            value = array[rand];
	        array[rand] = array[index];
	        array[index] = value;
	      }
	      array.length = size;
	      return array;
	    }
	    var stringToPath = memoizeCapped(function(string) {
	      var result = [];
	      if (string.charCodeAt(0) === 46 ) {
	        result.push('');
	      }
	      string.replace(rePropName, function(match, number, quote, subString) {
	        result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
	      });
	      return result;
	    });
	    function toKey(value) {
	      if (typeof value == 'string' || isSymbol(value)) {
	        return value;
	      }
	      var result = (value + '');
	      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	    }
	    function toSource(func) {
	      if (func != null) {
	        try {
	          return funcToString.call(func);
	        } catch (e) {}
	        try {
	          return (func + '');
	        } catch (e) {}
	      }
	      return '';
	    }
	    function updateWrapDetails(details, bitmask) {
	      arrayEach(wrapFlags, function(pair) {
	        var value = '_.' + pair[0];
	        if ((bitmask & pair[1]) && !arrayIncludes(details, value)) {
	          details.push(value);
	        }
	      });
	      return details.sort();
	    }
	    function wrapperClone(wrapper) {
	      if (wrapper instanceof LazyWrapper) {
	        return wrapper.clone();
	      }
	      var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
	      result.__actions__ = copyArray(wrapper.__actions__);
	      result.__index__  = wrapper.__index__;
	      result.__values__ = wrapper.__values__;
	      return result;
	    }
	    function chunk(array, size, guard) {
	      if ((guard ? isIterateeCall(array, size, guard) : size === undefined$1)) {
	        size = 1;
	      } else {
	        size = nativeMax(toInteger(size), 0);
	      }
	      var length = array == null ? 0 : array.length;
	      if (!length || size < 1) {
	        return [];
	      }
	      var index = 0,
	          resIndex = 0,
	          result = Array(nativeCeil(length / size));
	      while (index < length) {
	        result[resIndex++] = baseSlice(array, index, (index += size));
	      }
	      return result;
	    }
	    function compact(array) {
	      var index = -1,
	          length = array == null ? 0 : array.length,
	          resIndex = 0,
	          result = [];
	      while (++index < length) {
	        var value = array[index];
	        if (value) {
	          result[resIndex++] = value;
	        }
	      }
	      return result;
	    }
	    function concat() {
	      var length = arguments.length;
	      if (!length) {
	        return [];
	      }
	      var args = Array(length - 1),
	          array = arguments[0],
	          index = length;
	      while (index--) {
	        args[index - 1] = arguments[index];
	      }
	      return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
	    }
	    var difference = baseRest(function(array, values) {
	      return isArrayLikeObject(array)
	        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
	        : [];
	    });
	    var differenceBy = baseRest(function(array, values) {
	      var iteratee = last(values);
	      if (isArrayLikeObject(iteratee)) {
	        iteratee = undefined$1;
	      }
	      return isArrayLikeObject(array)
	        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), getIteratee(iteratee, 2))
	        : [];
	    });
	    var differenceWith = baseRest(function(array, values) {
	      var comparator = last(values);
	      if (isArrayLikeObject(comparator)) {
	        comparator = undefined$1;
	      }
	      return isArrayLikeObject(array)
	        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), undefined$1, comparator)
	        : [];
	    });
	    function drop(array, n, guard) {
	      var length = array == null ? 0 : array.length;
	      if (!length) {
	        return [];
	      }
	      n = (guard || n === undefined$1) ? 1 : toInteger(n);
	      return baseSlice(array, n < 0 ? 0 : n, length);
	    }
	    function dropRight(array, n, guard) {
	      var length = array == null ? 0 : array.length;
	      if (!length) {
	        return [];
	      }
	      n = (guard || n === undefined$1) ? 1 : toInteger(n);
	      n = length - n;
	      return baseSlice(array, 0, n < 0 ? 0 : n);
	    }
	    function dropRightWhile(array, predicate) {
	      return (array && array.length)
	        ? baseWhile(array, getIteratee(predicate, 3), true, true)
	        : [];
	    }
	    function dropWhile(array, predicate) {
	      return (array && array.length)
	        ? baseWhile(array, getIteratee(predicate, 3), true)
	        : [];
	    }
	    function fill(array, value, start, end) {
	      var length = array == null ? 0 : array.length;
	      if (!length) {
	        return [];
	      }
	      if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
	        start = 0;
	        end = length;
	      }
	      return baseFill(array, value, start, end);
	    }
	    function findIndex(array, predicate, fromIndex) {
	      var length = array == null ? 0 : array.length;
	      if (!length) {
	        return -1;
	      }
	      var index = fromIndex == null ? 0 : toInteger(fromIndex);
	      if (index < 0) {
	        index = nativeMax(length + index, 0);
	      }
	      return baseFindIndex(array, getIteratee(predicate, 3), index);
	    }
	    function findLastIndex(array, predicate, fromIndex) {
	      var length = array == null ? 0 : array.length;
	      if (!length) {
	        return -1;
	      }
	      var index = length - 1;
	      if (fromIndex !== undefined$1) {
	        index = toInteger(fromIndex);
	        index = fromIndex < 0
	          ? nativeMax(length + index, 0)
	          : nativeMin(index, length - 1);
	      }
	      return baseFindIndex(array, getIteratee(predicate, 3), index, true);
	    }
	    function flatten(array) {
	      var length = array == null ? 0 : array.length;
	      return length ? baseFlatten(array, 1) : [];
	    }
	    function flattenDeep(array) {
	      var length = array == null ? 0 : array.length;
	      return length ? baseFlatten(array, INFINITY) : [];
	    }
	    function flattenDepth(array, depth) {
	      var length = array == null ? 0 : array.length;
	      if (!length) {
	        return [];
	      }
	      depth = depth === undefined$1 ? 1 : toInteger(depth);
	      return baseFlatten(array, depth);
	    }
	    function fromPairs(pairs) {
	      var index = -1,
	          length = pairs == null ? 0 : pairs.length,
	          result = {};
	      while (++index < length) {
	        var pair = pairs[index];
	        result[pair[0]] = pair[1];
	      }
	      return result;
	    }
	    function head(array) {
	      return (array && array.length) ? array[0] : undefined$1;
	    }
	    function indexOf(array, value, fromIndex) {
	      var length = array == null ? 0 : array.length;
	      if (!length) {
	        return -1;
	      }
	      var index = fromIndex == null ? 0 : toInteger(fromIndex);
	      if (index < 0) {
	        index = nativeMax(length + index, 0);
	      }
	      return baseIndexOf(array, value, index);
	    }
	    function initial(array) {
	      var length = array == null ? 0 : array.length;
	      return length ? baseSlice(array, 0, -1) : [];
	    }
	    var intersection = baseRest(function(arrays) {
	      var mapped = arrayMap(arrays, castArrayLikeObject);
	      return (mapped.length && mapped[0] === arrays[0])
	        ? baseIntersection(mapped)
	        : [];
	    });
	    var intersectionBy = baseRest(function(arrays) {
	      var iteratee = last(arrays),
	          mapped = arrayMap(arrays, castArrayLikeObject);
	      if (iteratee === last(mapped)) {
	        iteratee = undefined$1;
	      } else {
	        mapped.pop();
	      }
	      return (mapped.length && mapped[0] === arrays[0])
	        ? baseIntersection(mapped, getIteratee(iteratee, 2))
	        : [];
	    });
	    var intersectionWith = baseRest(function(arrays) {
	      var comparator = last(arrays),
	          mapped = arrayMap(arrays, castArrayLikeObject);
	      comparator = typeof comparator == 'function' ? comparator : undefined$1;
	      if (comparator) {
	        mapped.pop();
	      }
	      return (mapped.length && mapped[0] === arrays[0])
	        ? baseIntersection(mapped, undefined$1, comparator)
	        : [];
	    });
	    function join(array, separator) {
	      return array == null ? '' : nativeJoin.call(array, separator);
	    }
	    function last(array) {
	      var length = array == null ? 0 : array.length;
	      return length ? array[length - 1] : undefined$1;
	    }
	    function lastIndexOf(array, value, fromIndex) {
	      var length = array == null ? 0 : array.length;
	      if (!length) {
	        return -1;
	      }
	      var index = length;
	      if (fromIndex !== undefined$1) {
	        index = toInteger(fromIndex);
	        index = index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
	      }
	      return value === value
	        ? strictLastIndexOf(array, value, index)
	        : baseFindIndex(array, baseIsNaN, index, true);
	    }
	    function nth(array, n) {
	      return (array && array.length) ? baseNth(array, toInteger(n)) : undefined$1;
	    }
	    var pull = baseRest(pullAll);
	    function pullAll(array, values) {
	      return (array && array.length && values && values.length)
	        ? basePullAll(array, values)
	        : array;
	    }
	    function pullAllBy(array, values, iteratee) {
	      return (array && array.length && values && values.length)
	        ? basePullAll(array, values, getIteratee(iteratee, 2))
	        : array;
	    }
	    function pullAllWith(array, values, comparator) {
	      return (array && array.length && values && values.length)
	        ? basePullAll(array, values, undefined$1, comparator)
	        : array;
	    }
	    var pullAt = flatRest(function(array, indexes) {
	      var length = array == null ? 0 : array.length,
	          result = baseAt(array, indexes);
	      basePullAt(array, arrayMap(indexes, function(index) {
	        return isIndex(index, length) ? +index : index;
	      }).sort(compareAscending));
	      return result;
	    });
	    function remove(array, predicate) {
	      var result = [];
	      if (!(array && array.length)) {
	        return result;
	      }
	      var index = -1,
	          indexes = [],
	          length = array.length;
	      predicate = getIteratee(predicate, 3);
	      while (++index < length) {
	        var value = array[index];
	        if (predicate(value, index, array)) {
	          result.push(value);
	          indexes.push(index);
	        }
	      }
	      basePullAt(array, indexes);
	      return result;
	    }
	    function reverse(array) {
	      return array == null ? array : nativeReverse.call(array);
	    }
	    function slice(array, start, end) {
	      var length = array == null ? 0 : array.length;
	      if (!length) {
	        return [];
	      }
	      if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
	        start = 0;
	        end = length;
	      }
	      else {
	        start = start == null ? 0 : toInteger(start);
	        end = end === undefined$1 ? length : toInteger(end);
	      }
	      return baseSlice(array, start, end);
	    }
	    function sortedIndex(array, value) {
	      return baseSortedIndex(array, value);
	    }
	    function sortedIndexBy(array, value, iteratee) {
	      return baseSortedIndexBy(array, value, getIteratee(iteratee, 2));
	    }
	    function sortedIndexOf(array, value) {
	      var length = array == null ? 0 : array.length;
	      if (length) {
	        var index = baseSortedIndex(array, value);
	        if (index < length && eq(array[index], value)) {
	          return index;
	        }
	      }
	      return -1;
	    }
	    function sortedLastIndex(array, value) {
	      return baseSortedIndex(array, value, true);
	    }
	    function sortedLastIndexBy(array, value, iteratee) {
	      return baseSortedIndexBy(array, value, getIteratee(iteratee, 2), true);
	    }
	    function sortedLastIndexOf(array, value) {
	      var length = array == null ? 0 : array.length;
	      if (length) {
	        var index = baseSortedIndex(array, value, true) - 1;
	        if (eq(array[index], value)) {
	          return index;
	        }
	      }
	      return -1;
	    }
	    function sortedUniq(array) {
	      return (array && array.length)
	        ? baseSortedUniq(array)
	        : [];
	    }
	    function sortedUniqBy(array, iteratee) {
	      return (array && array.length)
	        ? baseSortedUniq(array, getIteratee(iteratee, 2))
	        : [];
	    }
	    function tail(array) {
	      var length = array == null ? 0 : array.length;
	      return length ? baseSlice(array, 1, length) : [];
	    }
	    function take(array, n, guard) {
	      if (!(array && array.length)) {
	        return [];
	      }
	      n = (guard || n === undefined$1) ? 1 : toInteger(n);
	      return baseSlice(array, 0, n < 0 ? 0 : n);
	    }
	    function takeRight(array, n, guard) {
	      var length = array == null ? 0 : array.length;
	      if (!length) {
	        return [];
	      }
	      n = (guard || n === undefined$1) ? 1 : toInteger(n);
	      n = length - n;
	      return baseSlice(array, n < 0 ? 0 : n, length);
	    }
	    function takeRightWhile(array, predicate) {
	      return (array && array.length)
	        ? baseWhile(array, getIteratee(predicate, 3), false, true)
	        : [];
	    }
	    function takeWhile(array, predicate) {
	      return (array && array.length)
	        ? baseWhile(array, getIteratee(predicate, 3))
	        : [];
	    }
	    var union = baseRest(function(arrays) {
	      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
	    });
	    var unionBy = baseRest(function(arrays) {
	      var iteratee = last(arrays);
	      if (isArrayLikeObject(iteratee)) {
	        iteratee = undefined$1;
	      }
	      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), getIteratee(iteratee, 2));
	    });
	    var unionWith = baseRest(function(arrays) {
	      var comparator = last(arrays);
	      comparator = typeof comparator == 'function' ? comparator : undefined$1;
	      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined$1, comparator);
	    });
	    function uniq(array) {
	      return (array && array.length) ? baseUniq(array) : [];
	    }
	    function uniqBy(array, iteratee) {
	      return (array && array.length) ? baseUniq(array, getIteratee(iteratee, 2)) : [];
	    }
	    function uniqWith(array, comparator) {
	      comparator = typeof comparator == 'function' ? comparator : undefined$1;
	      return (array && array.length) ? baseUniq(array, undefined$1, comparator) : [];
	    }
	    function unzip(array) {
	      if (!(array && array.length)) {
	        return [];
	      }
	      var length = 0;
	      array = arrayFilter(array, function(group) {
	        if (isArrayLikeObject(group)) {
	          length = nativeMax(group.length, length);
	          return true;
	        }
	      });
	      return baseTimes(length, function(index) {
	        return arrayMap(array, baseProperty(index));
	      });
	    }
	    function unzipWith(array, iteratee) {
	      if (!(array && array.length)) {
	        return [];
	      }
	      var result = unzip(array);
	      if (iteratee == null) {
	        return result;
	      }
	      return arrayMap(result, function(group) {
	        return apply(iteratee, undefined$1, group);
	      });
	    }
	    var without = baseRest(function(array, values) {
	      return isArrayLikeObject(array)
	        ? baseDifference(array, values)
	        : [];
	    });
	    var xor = baseRest(function(arrays) {
	      return baseXor(arrayFilter(arrays, isArrayLikeObject));
	    });
	    var xorBy = baseRest(function(arrays) {
	      var iteratee = last(arrays);
	      if (isArrayLikeObject(iteratee)) {
	        iteratee = undefined$1;
	      }
	      return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee, 2));
	    });
	    var xorWith = baseRest(function(arrays) {
	      var comparator = last(arrays);
	      comparator = typeof comparator == 'function' ? comparator : undefined$1;
	      return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined$1, comparator);
	    });
	    var zip = baseRest(unzip);
	    function zipObject(props, values) {
	      return baseZipObject(props || [], values || [], assignValue);
	    }
	    function zipObjectDeep(props, values) {
	      return baseZipObject(props || [], values || [], baseSet);
	    }
	    var zipWith = baseRest(function(arrays) {
	      var length = arrays.length,
	          iteratee = length > 1 ? arrays[length - 1] : undefined$1;
	      iteratee = typeof iteratee == 'function' ? (arrays.pop(), iteratee) : undefined$1;
	      return unzipWith(arrays, iteratee);
	    });
	    function chain(value) {
	      var result = lodash(value);
	      result.__chain__ = true;
	      return result;
	    }
	    function tap(value, interceptor) {
	      interceptor(value);
	      return value;
	    }
	    function thru(value, interceptor) {
	      return interceptor(value);
	    }
	    var wrapperAt = flatRest(function(paths) {
	      var length = paths.length,
	          start = length ? paths[0] : 0,
	          value = this.__wrapped__,
	          interceptor = function(object) { return baseAt(object, paths); };
	      if (length > 1 || this.__actions__.length ||
	          !(value instanceof LazyWrapper) || !isIndex(start)) {
	        return this.thru(interceptor);
	      }
	      value = value.slice(start, +start + (length ? 1 : 0));
	      value.__actions__.push({
	        'func': thru,
	        'args': [interceptor],
	        'thisArg': undefined$1
	      });
	      return new LodashWrapper(value, this.__chain__).thru(function(array) {
	        if (length && !array.length) {
	          array.push(undefined$1);
	        }
	        return array;
	      });
	    });
	    function wrapperChain() {
	      return chain(this);
	    }
	    function wrapperCommit() {
	      return new LodashWrapper(this.value(), this.__chain__);
	    }
	    function wrapperNext() {
	      if (this.__values__ === undefined$1) {
	        this.__values__ = toArray(this.value());
	      }
	      var done = this.__index__ >= this.__values__.length,
	          value = done ? undefined$1 : this.__values__[this.__index__++];
	      return { 'done': done, 'value': value };
	    }
	    function wrapperToIterator() {
	      return this;
	    }
	    function wrapperPlant(value) {
	      var result,
	          parent = this;
	      while (parent instanceof baseLodash) {
	        var clone = wrapperClone(parent);
	        clone.__index__ = 0;
	        clone.__values__ = undefined$1;
	        if (result) {
	          previous.__wrapped__ = clone;
	        } else {
	          result = clone;
	        }
	        var previous = clone;
	        parent = parent.__wrapped__;
	      }
	      previous.__wrapped__ = value;
	      return result;
	    }
	    function wrapperReverse() {
	      var value = this.__wrapped__;
	      if (value instanceof LazyWrapper) {
	        var wrapped = value;
	        if (this.__actions__.length) {
	          wrapped = new LazyWrapper(this);
	        }
	        wrapped = wrapped.reverse();
	        wrapped.__actions__.push({
	          'func': thru,
	          'args': [reverse],
	          'thisArg': undefined$1
	        });
	        return new LodashWrapper(wrapped, this.__chain__);
	      }
	      return this.thru(reverse);
	    }
	    function wrapperValue() {
	      return baseWrapperValue(this.__wrapped__, this.__actions__);
	    }
	    var countBy = createAggregator(function(result, value, key) {
	      if (hasOwnProperty.call(result, key)) {
	        ++result[key];
	      } else {
	        baseAssignValue(result, key, 1);
	      }
	    });
	    function every(collection, predicate, guard) {
	      var func = isArray(collection) ? arrayEvery : baseEvery;
	      if (guard && isIterateeCall(collection, predicate, guard)) {
	        predicate = undefined$1;
	      }
	      return func(collection, getIteratee(predicate, 3));
	    }
	    function filter(collection, predicate) {
	      var func = isArray(collection) ? arrayFilter : baseFilter;
	      return func(collection, getIteratee(predicate, 3));
	    }
	    var find = createFind(findIndex);
	    var findLast = createFind(findLastIndex);
	    function flatMap(collection, iteratee) {
	      return baseFlatten(map(collection, iteratee), 1);
	    }
	    function flatMapDeep(collection, iteratee) {
	      return baseFlatten(map(collection, iteratee), INFINITY);
	    }
	    function flatMapDepth(collection, iteratee, depth) {
	      depth = depth === undefined$1 ? 1 : toInteger(depth);
	      return baseFlatten(map(collection, iteratee), depth);
	    }
	    function forEach(collection, iteratee) {
	      var func = isArray(collection) ? arrayEach : baseEach;
	      return func(collection, getIteratee(iteratee, 3));
	    }
	    function forEachRight(collection, iteratee) {
	      var func = isArray(collection) ? arrayEachRight : baseEachRight;
	      return func(collection, getIteratee(iteratee, 3));
	    }
	    var groupBy = createAggregator(function(result, value, key) {
	      if (hasOwnProperty.call(result, key)) {
	        result[key].push(value);
	      } else {
	        baseAssignValue(result, key, [value]);
	      }
	    });
	    function includes(collection, value, fromIndex, guard) {
	      collection = isArrayLike(collection) ? collection : values(collection);
	      fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;
	      var length = collection.length;
	      if (fromIndex < 0) {
	        fromIndex = nativeMax(length + fromIndex, 0);
	      }
	      return isString(collection)
	        ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
	        : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
	    }
	    var invokeMap = baseRest(function(collection, path, args) {
	      var index = -1,
	          isFunc = typeof path == 'function',
	          result = isArrayLike(collection) ? Array(collection.length) : [];
	      baseEach(collection, function(value) {
	        result[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
	      });
	      return result;
	    });
	    var keyBy = createAggregator(function(result, value, key) {
	      baseAssignValue(result, key, value);
	    });
	    function map(collection, iteratee) {
	      var func = isArray(collection) ? arrayMap : baseMap;
	      return func(collection, getIteratee(iteratee, 3));
	    }
	    function orderBy(collection, iteratees, orders, guard) {
	      if (collection == null) {
	        return [];
	      }
	      if (!isArray(iteratees)) {
	        iteratees = iteratees == null ? [] : [iteratees];
	      }
	      orders = guard ? undefined$1 : orders;
	      if (!isArray(orders)) {
	        orders = orders == null ? [] : [orders];
	      }
	      return baseOrderBy(collection, iteratees, orders);
	    }
	    var partition = createAggregator(function(result, value, key) {
	      result[key ? 0 : 1].push(value);
	    }, function() { return [[], []]; });
	    function reduce(collection, iteratee, accumulator) {
	      var func = isArray(collection) ? arrayReduce : baseReduce,
	          initAccum = arguments.length < 3;
	      return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEach);
	    }
	    function reduceRight(collection, iteratee, accumulator) {
	      var func = isArray(collection) ? arrayReduceRight : baseReduce,
	          initAccum = arguments.length < 3;
	      return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEachRight);
	    }
	    function reject(collection, predicate) {
	      var func = isArray(collection) ? arrayFilter : baseFilter;
	      return func(collection, negate(getIteratee(predicate, 3)));
	    }
	    function sample(collection) {
	      var func = isArray(collection) ? arraySample : baseSample;
	      return func(collection);
	    }
	    function sampleSize(collection, n, guard) {
	      if ((guard ? isIterateeCall(collection, n, guard) : n === undefined$1)) {
	        n = 1;
	      } else {
	        n = toInteger(n);
	      }
	      var func = isArray(collection) ? arraySampleSize : baseSampleSize;
	      return func(collection, n);
	    }
	    function shuffle(collection) {
	      var func = isArray(collection) ? arrayShuffle : baseShuffle;
	      return func(collection);
	    }
	    function size(collection) {
	      if (collection == null) {
	        return 0;
	      }
	      if (isArrayLike(collection)) {
	        return isString(collection) ? stringSize(collection) : collection.length;
	      }
	      var tag = getTag(collection);
	      if (tag == mapTag || tag == setTag) {
	        return collection.size;
	      }
	      return baseKeys(collection).length;
	    }
	    function some(collection, predicate, guard) {
	      var func = isArray(collection) ? arraySome : baseSome;
	      if (guard && isIterateeCall(collection, predicate, guard)) {
	        predicate = undefined$1;
	      }
	      return func(collection, getIteratee(predicate, 3));
	    }
	    var sortBy = baseRest(function(collection, iteratees) {
	      if (collection == null) {
	        return [];
	      }
	      var length = iteratees.length;
	      if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
	        iteratees = [];
	      } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
	        iteratees = [iteratees[0]];
	      }
	      return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
	    });
	    var now = ctxNow || function() {
	      return root.Date.now();
	    };
	    function after(n, func) {
	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      n = toInteger(n);
	      return function() {
	        if (--n < 1) {
	          return func.apply(this, arguments);
	        }
	      };
	    }
	    function ary(func, n, guard) {
	      n = guard ? undefined$1 : n;
	      n = (func && n == null) ? func.length : n;
	      return createWrap(func, WRAP_ARY_FLAG, undefined$1, undefined$1, undefined$1, undefined$1, n);
	    }
	    function before(n, func) {
	      var result;
	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      n = toInteger(n);
	      return function() {
	        if (--n > 0) {
	          result = func.apply(this, arguments);
	        }
	        if (n <= 1) {
	          func = undefined$1;
	        }
	        return result;
	      };
	    }
	    var bind = baseRest(function(func, thisArg, partials) {
	      var bitmask = WRAP_BIND_FLAG;
	      if (partials.length) {
	        var holders = replaceHolders(partials, getHolder(bind));
	        bitmask |= WRAP_PARTIAL_FLAG;
	      }
	      return createWrap(func, bitmask, thisArg, partials, holders);
	    });
	    var bindKey = baseRest(function(object, key, partials) {
	      var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;
	      if (partials.length) {
	        var holders = replaceHolders(partials, getHolder(bindKey));
	        bitmask |= WRAP_PARTIAL_FLAG;
	      }
	      return createWrap(key, bitmask, object, partials, holders);
	    });
	    function curry(func, arity, guard) {
	      arity = guard ? undefined$1 : arity;
	      var result = createWrap(func, WRAP_CURRY_FLAG, undefined$1, undefined$1, undefined$1, undefined$1, undefined$1, arity);
	      result.placeholder = curry.placeholder;
	      return result;
	    }
	    function curryRight(func, arity, guard) {
	      arity = guard ? undefined$1 : arity;
	      var result = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined$1, undefined$1, undefined$1, undefined$1, undefined$1, arity);
	      result.placeholder = curryRight.placeholder;
	      return result;
	    }
	    function debounce(func, wait, options) {
	      var lastArgs,
	          lastThis,
	          maxWait,
	          result,
	          timerId,
	          lastCallTime,
	          lastInvokeTime = 0,
	          leading = false,
	          maxing = false,
	          trailing = true;
	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      wait = toNumber(wait) || 0;
	      if (isObject(options)) {
	        leading = !!options.leading;
	        maxing = 'maxWait' in options;
	        maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
	        trailing = 'trailing' in options ? !!options.trailing : trailing;
	      }
	      function invokeFunc(time) {
	        var args = lastArgs,
	            thisArg = lastThis;
	        lastArgs = lastThis = undefined$1;
	        lastInvokeTime = time;
	        result = func.apply(thisArg, args);
	        return result;
	      }
	      function leadingEdge(time) {
	        lastInvokeTime = time;
	        timerId = setTimeout(timerExpired, wait);
	        return leading ? invokeFunc(time) : result;
	      }
	      function remainingWait(time) {
	        var timeSinceLastCall = time - lastCallTime,
	            timeSinceLastInvoke = time - lastInvokeTime,
	            timeWaiting = wait - timeSinceLastCall;
	        return maxing
	          ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
	          : timeWaiting;
	      }
	      function shouldInvoke(time) {
	        var timeSinceLastCall = time - lastCallTime,
	            timeSinceLastInvoke = time - lastInvokeTime;
	        return (lastCallTime === undefined$1 || (timeSinceLastCall >= wait) ||
	          (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
	      }
	      function timerExpired() {
	        var time = now();
	        if (shouldInvoke(time)) {
	          return trailingEdge(time);
	        }
	        timerId = setTimeout(timerExpired, remainingWait(time));
	      }
	      function trailingEdge(time) {
	        timerId = undefined$1;
	        if (trailing && lastArgs) {
	          return invokeFunc(time);
	        }
	        lastArgs = lastThis = undefined$1;
	        return result;
	      }
	      function cancel() {
	        if (timerId !== undefined$1) {
	          clearTimeout(timerId);
	        }
	        lastInvokeTime = 0;
	        lastArgs = lastCallTime = lastThis = timerId = undefined$1;
	      }
	      function flush() {
	        return timerId === undefined$1 ? result : trailingEdge(now());
	      }
	      function debounced() {
	        var time = now(),
	            isInvoking = shouldInvoke(time);
	        lastArgs = arguments;
	        lastThis = this;
	        lastCallTime = time;
	        if (isInvoking) {
	          if (timerId === undefined$1) {
	            return leadingEdge(lastCallTime);
	          }
	          if (maxing) {
	            clearTimeout(timerId);
	            timerId = setTimeout(timerExpired, wait);
	            return invokeFunc(lastCallTime);
	          }
	        }
	        if (timerId === undefined$1) {
	          timerId = setTimeout(timerExpired, wait);
	        }
	        return result;
	      }
	      debounced.cancel = cancel;
	      debounced.flush = flush;
	      return debounced;
	    }
	    var defer = baseRest(function(func, args) {
	      return baseDelay(func, 1, args);
	    });
	    var delay = baseRest(function(func, wait, args) {
	      return baseDelay(func, toNumber(wait) || 0, args);
	    });
	    function flip(func) {
	      return createWrap(func, WRAP_FLIP_FLAG);
	    }
	    function memoize(func, resolver) {
	      if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      var memoized = function() {
	        var args = arguments,
	            key = resolver ? resolver.apply(this, args) : args[0],
	            cache = memoized.cache;
	        if (cache.has(key)) {
	          return cache.get(key);
	        }
	        var result = func.apply(this, args);
	        memoized.cache = cache.set(key, result) || cache;
	        return result;
	      };
	      memoized.cache = new (memoize.Cache || MapCache);
	      return memoized;
	    }
	    memoize.Cache = MapCache;
	    function negate(predicate) {
	      if (typeof predicate != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      return function() {
	        var args = arguments;
	        switch (args.length) {
	          case 0: return !predicate.call(this);
	          case 1: return !predicate.call(this, args[0]);
	          case 2: return !predicate.call(this, args[0], args[1]);
	          case 3: return !predicate.call(this, args[0], args[1], args[2]);
	        }
	        return !predicate.apply(this, args);
	      };
	    }
	    function once(func) {
	      return before(2, func);
	    }
	    var overArgs = castRest(function(func, transforms) {
	      transforms = (transforms.length == 1 && isArray(transforms[0]))
	        ? arrayMap(transforms[0], baseUnary(getIteratee()))
	        : arrayMap(baseFlatten(transforms, 1), baseUnary(getIteratee()));
	      var funcsLength = transforms.length;
	      return baseRest(function(args) {
	        var index = -1,
	            length = nativeMin(args.length, funcsLength);
	        while (++index < length) {
	          args[index] = transforms[index].call(this, args[index]);
	        }
	        return apply(func, this, args);
	      });
	    });
	    var partial = baseRest(function(func, partials) {
	      var holders = replaceHolders(partials, getHolder(partial));
	      return createWrap(func, WRAP_PARTIAL_FLAG, undefined$1, partials, holders);
	    });
	    var partialRight = baseRest(function(func, partials) {
	      var holders = replaceHolders(partials, getHolder(partialRight));
	      return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, undefined$1, partials, holders);
	    });
	    var rearg = flatRest(function(func, indexes) {
	      return createWrap(func, WRAP_REARG_FLAG, undefined$1, undefined$1, undefined$1, indexes);
	    });
	    function rest(func, start) {
	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      start = start === undefined$1 ? start : toInteger(start);
	      return baseRest(func, start);
	    }
	    function spread(func, start) {
	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      start = start == null ? 0 : nativeMax(toInteger(start), 0);
	      return baseRest(function(args) {
	        var array = args[start],
	            otherArgs = castSlice(args, 0, start);
	        if (array) {
	          arrayPush(otherArgs, array);
	        }
	        return apply(func, this, otherArgs);
	      });
	    }
	    function throttle(func, wait, options) {
	      var leading = true,
	          trailing = true;
	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      if (isObject(options)) {
	        leading = 'leading' in options ? !!options.leading : leading;
	        trailing = 'trailing' in options ? !!options.trailing : trailing;
	      }
	      return debounce(func, wait, {
	        'leading': leading,
	        'maxWait': wait,
	        'trailing': trailing
	      });
	    }
	    function unary(func) {
	      return ary(func, 1);
	    }
	    function wrap(value, wrapper) {
	      return partial(castFunction(wrapper), value);
	    }
	    function castArray() {
	      if (!arguments.length) {
	        return [];
	      }
	      var value = arguments[0];
	      return isArray(value) ? value : [value];
	    }
	    function clone(value) {
	      return baseClone(value, CLONE_SYMBOLS_FLAG);
	    }
	    function cloneWith(value, customizer) {
	      customizer = typeof customizer == 'function' ? customizer : undefined$1;
	      return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
	    }
	    function cloneDeep(value) {
	      return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
	    }
	    function cloneDeepWith(value, customizer) {
	      customizer = typeof customizer == 'function' ? customizer : undefined$1;
	      return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG, customizer);
	    }
	    function conformsTo(object, source) {
	      return source == null || baseConformsTo(object, source, keys(source));
	    }
	    function eq(value, other) {
	      return value === other || (value !== value && other !== other);
	    }
	    var gt = createRelationalOperation(baseGt);
	    var gte = createRelationalOperation(function(value, other) {
	      return value >= other;
	    });
	    var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
	      return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
	        !propertyIsEnumerable.call(value, 'callee');
	    };
	    var isArray = Array.isArray;
	    var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;
	    function isArrayLike(value) {
	      return value != null && isLength(value.length) && !isFunction(value);
	    }
	    function isArrayLikeObject(value) {
	      return isObjectLike(value) && isArrayLike(value);
	    }
	    function isBoolean(value) {
	      return value === true || value === false ||
	        (isObjectLike(value) && baseGetTag(value) == boolTag);
	    }
	    var isBuffer = nativeIsBuffer || stubFalse;
	    var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;
	    function isElement(value) {
	      return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
	    }
	    function isEmpty(value) {
	      if (value == null) {
	        return true;
	      }
	      if (isArrayLike(value) &&
	          (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
	            isBuffer(value) || isTypedArray(value) || isArguments(value))) {
	        return !value.length;
	      }
	      var tag = getTag(value);
	      if (tag == mapTag || tag == setTag) {
	        return !value.size;
	      }
	      if (isPrototype(value)) {
	        return !baseKeys(value).length;
	      }
	      for (var key in value) {
	        if (hasOwnProperty.call(value, key)) {
	          return false;
	        }
	      }
	      return true;
	    }
	    function isEqual(value, other) {
	      return baseIsEqual(value, other);
	    }
	    function isEqualWith(value, other, customizer) {
	      customizer = typeof customizer == 'function' ? customizer : undefined$1;
	      var result = customizer ? customizer(value, other) : undefined$1;
	      return result === undefined$1 ? baseIsEqual(value, other, undefined$1, customizer) : !!result;
	    }
	    function isError(value) {
	      if (!isObjectLike(value)) {
	        return false;
	      }
	      var tag = baseGetTag(value);
	      return tag == errorTag || tag == domExcTag ||
	        (typeof value.message == 'string' && typeof value.name == 'string' && !isPlainObject(value));
	    }
	    function isFinite(value) {
	      return typeof value == 'number' && nativeIsFinite(value);
	    }
	    function isFunction(value) {
	      if (!isObject(value)) {
	        return false;
	      }
	      var tag = baseGetTag(value);
	      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
	    }
	    function isInteger(value) {
	      return typeof value == 'number' && value == toInteger(value);
	    }
	    function isLength(value) {
	      return typeof value == 'number' &&
	        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	    }
	    function isObject(value) {
	      var type = typeof value;
	      return value != null && (type == 'object' || type == 'function');
	    }
	    function isObjectLike(value) {
	      return value != null && typeof value == 'object';
	    }
	    var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
	    function isMatch(object, source) {
	      return object === source || baseIsMatch(object, source, getMatchData(source));
	    }
	    function isMatchWith(object, source, customizer) {
	      customizer = typeof customizer == 'function' ? customizer : undefined$1;
	      return baseIsMatch(object, source, getMatchData(source), customizer);
	    }
	    function isNaN(value) {
	      return isNumber(value) && value != +value;
	    }
	    function isNative(value) {
	      if (isMaskable(value)) {
	        throw new Error(CORE_ERROR_TEXT);
	      }
	      return baseIsNative(value);
	    }
	    function isNull(value) {
	      return value === null;
	    }
	    function isNil(value) {
	      return value == null;
	    }
	    function isNumber(value) {
	      return typeof value == 'number' ||
	        (isObjectLike(value) && baseGetTag(value) == numberTag);
	    }
	    function isPlainObject(value) {
	      if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
	        return false;
	      }
	      var proto = getPrototype(value);
	      if (proto === null) {
	        return true;
	      }
	      var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
	      return typeof Ctor == 'function' && Ctor instanceof Ctor &&
	        funcToString.call(Ctor) == objectCtorString;
	    }
	    var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;
	    function isSafeInteger(value) {
	      return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
	    }
	    var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
	    function isString(value) {
	      return typeof value == 'string' ||
	        (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
	    }
	    function isSymbol(value) {
	      return typeof value == 'symbol' ||
	        (isObjectLike(value) && baseGetTag(value) == symbolTag);
	    }
	    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
	    function isUndefined(value) {
	      return value === undefined$1;
	    }
	    function isWeakMap(value) {
	      return isObjectLike(value) && getTag(value) == weakMapTag;
	    }
	    function isWeakSet(value) {
	      return isObjectLike(value) && baseGetTag(value) == weakSetTag;
	    }
	    var lt = createRelationalOperation(baseLt);
	    var lte = createRelationalOperation(function(value, other) {
	      return value <= other;
	    });
	    function toArray(value) {
	      if (!value) {
	        return [];
	      }
	      if (isArrayLike(value)) {
	        return isString(value) ? stringToArray(value) : copyArray(value);
	      }
	      if (symIterator && value[symIterator]) {
	        return iteratorToArray(value[symIterator]());
	      }
	      var tag = getTag(value),
	          func = tag == mapTag ? mapToArray : (tag == setTag ? setToArray : values);
	      return func(value);
	    }
	    function toFinite(value) {
	      if (!value) {
	        return value === 0 ? value : 0;
	      }
	      value = toNumber(value);
	      if (value === INFINITY || value === -INFINITY) {
	        var sign = (value < 0 ? -1 : 1);
	        return sign * MAX_INTEGER;
	      }
	      return value === value ? value : 0;
	    }
	    function toInteger(value) {
	      var result = toFinite(value),
	          remainder = result % 1;
	      return result === result ? (remainder ? result - remainder : result) : 0;
	    }
	    function toLength(value) {
	      return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
	    }
	    function toNumber(value) {
	      if (typeof value == 'number') {
	        return value;
	      }
	      if (isSymbol(value)) {
	        return NAN;
	      }
	      if (isObject(value)) {
	        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
	        value = isObject(other) ? (other + '') : other;
	      }
	      if (typeof value != 'string') {
	        return value === 0 ? value : +value;
	      }
	      value = baseTrim(value);
	      var isBinary = reIsBinary.test(value);
	      return (isBinary || reIsOctal.test(value))
	        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
	        : (reIsBadHex.test(value) ? NAN : +value);
	    }
	    function toPlainObject(value) {
	      return copyObject(value, keysIn(value));
	    }
	    function toSafeInteger(value) {
	      return value
	        ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER)
	        : (value === 0 ? value : 0);
	    }
	    function toString(value) {
	      return value == null ? '' : baseToString(value);
	    }
	    var assign = createAssigner(function(object, source) {
	      if (isPrototype(source) || isArrayLike(source)) {
	        copyObject(source, keys(source), object);
	        return;
	      }
	      for (var key in source) {
	        if (hasOwnProperty.call(source, key)) {
	          assignValue(object, key, source[key]);
	        }
	      }
	    });
	    var assignIn = createAssigner(function(object, source) {
	      copyObject(source, keysIn(source), object);
	    });
	    var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
	      copyObject(source, keysIn(source), object, customizer);
	    });
	    var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
	      copyObject(source, keys(source), object, customizer);
	    });
	    var at = flatRest(baseAt);
	    function create(prototype, properties) {
	      var result = baseCreate(prototype);
	      return properties == null ? result : baseAssign(result, properties);
	    }
	    var defaults = baseRest(function(object, sources) {
	      object = Object(object);
	      var index = -1;
	      var length = sources.length;
	      var guard = length > 2 ? sources[2] : undefined$1;
	      if (guard && isIterateeCall(sources[0], sources[1], guard)) {
	        length = 1;
	      }
	      while (++index < length) {
	        var source = sources[index];
	        var props = keysIn(source);
	        var propsIndex = -1;
	        var propsLength = props.length;
	        while (++propsIndex < propsLength) {
	          var key = props[propsIndex];
	          var value = object[key];
	          if (value === undefined$1 ||
	              (eq(value, objectProto[key]) && !hasOwnProperty.call(object, key))) {
	            object[key] = source[key];
	          }
	        }
	      }
	      return object;
	    });
	    var defaultsDeep = baseRest(function(args) {
	      args.push(undefined$1, customDefaultsMerge);
	      return apply(mergeWith, undefined$1, args);
	    });
	    function findKey(object, predicate) {
	      return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
	    }
	    function findLastKey(object, predicate) {
	      return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight);
	    }
	    function forIn(object, iteratee) {
	      return object == null
	        ? object
	        : baseFor(object, getIteratee(iteratee, 3), keysIn);
	    }
	    function forInRight(object, iteratee) {
	      return object == null
	        ? object
	        : baseForRight(object, getIteratee(iteratee, 3), keysIn);
	    }
	    function forOwn(object, iteratee) {
	      return object && baseForOwn(object, getIteratee(iteratee, 3));
	    }
	    function forOwnRight(object, iteratee) {
	      return object && baseForOwnRight(object, getIteratee(iteratee, 3));
	    }
	    function functions(object) {
	      return object == null ? [] : baseFunctions(object, keys(object));
	    }
	    function functionsIn(object) {
	      return object == null ? [] : baseFunctions(object, keysIn(object));
	    }
	    function get(object, path, defaultValue) {
	      var result = object == null ? undefined$1 : baseGet(object, path);
	      return result === undefined$1 ? defaultValue : result;
	    }
	    function has(object, path) {
	      return object != null && hasPath(object, path, baseHas);
	    }
	    function hasIn(object, path) {
	      return object != null && hasPath(object, path, baseHasIn);
	    }
	    var invert = createInverter(function(result, value, key) {
	      if (value != null &&
	          typeof value.toString != 'function') {
	        value = nativeObjectToString.call(value);
	      }
	      result[value] = key;
	    }, constant(identity));
	    var invertBy = createInverter(function(result, value, key) {
	      if (value != null &&
	          typeof value.toString != 'function') {
	        value = nativeObjectToString.call(value);
	      }
	      if (hasOwnProperty.call(result, value)) {
	        result[value].push(key);
	      } else {
	        result[value] = [key];
	      }
	    }, getIteratee);
	    var invoke = baseRest(baseInvoke);
	    function keys(object) {
	      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
	    }
	    function keysIn(object) {
	      return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
	    }
	    function mapKeys(object, iteratee) {
	      var result = {};
	      iteratee = getIteratee(iteratee, 3);
	      baseForOwn(object, function(value, key, object) {
	        baseAssignValue(result, iteratee(value, key, object), value);
	      });
	      return result;
	    }
	    function mapValues(object, iteratee) {
	      var result = {};
	      iteratee = getIteratee(iteratee, 3);
	      baseForOwn(object, function(value, key, object) {
	        baseAssignValue(result, key, iteratee(value, key, object));
	      });
	      return result;
	    }
	    var merge = createAssigner(function(object, source, srcIndex) {
	      baseMerge(object, source, srcIndex);
	    });
	    var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
	      baseMerge(object, source, srcIndex, customizer);
	    });
	    var omit = flatRest(function(object, paths) {
	      var result = {};
	      if (object == null) {
	        return result;
	      }
	      var isDeep = false;
	      paths = arrayMap(paths, function(path) {
	        path = castPath(path, object);
	        isDeep || (isDeep = path.length > 1);
	        return path;
	      });
	      copyObject(object, getAllKeysIn(object), result);
	      if (isDeep) {
	        result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
	      }
	      var length = paths.length;
	      while (length--) {
	        baseUnset(result, paths[length]);
	      }
	      return result;
	    });
	    function omitBy(object, predicate) {
	      return pickBy(object, negate(getIteratee(predicate)));
	    }
	    var pick = flatRest(function(object, paths) {
	      return object == null ? {} : basePick(object, paths);
	    });
	    function pickBy(object, predicate) {
	      if (object == null) {
	        return {};
	      }
	      var props = arrayMap(getAllKeysIn(object), function(prop) {
	        return [prop];
	      });
	      predicate = getIteratee(predicate);
	      return basePickBy(object, props, function(value, path) {
	        return predicate(value, path[0]);
	      });
	    }
	    function result(object, path, defaultValue) {
	      path = castPath(path, object);
	      var index = -1,
	          length = path.length;
	      if (!length) {
	        length = 1;
	        object = undefined$1;
	      }
	      while (++index < length) {
	        var value = object == null ? undefined$1 : object[toKey(path[index])];
	        if (value === undefined$1) {
	          index = length;
	          value = defaultValue;
	        }
	        object = isFunction(value) ? value.call(object) : value;
	      }
	      return object;
	    }
	    function set(object, path, value) {
	      return object == null ? object : baseSet(object, path, value);
	    }
	    function setWith(object, path, value, customizer) {
	      customizer = typeof customizer == 'function' ? customizer : undefined$1;
	      return object == null ? object : baseSet(object, path, value, customizer);
	    }
	    var toPairs = createToPairs(keys);
	    var toPairsIn = createToPairs(keysIn);
	    function transform(object, iteratee, accumulator) {
	      var isArr = isArray(object),
	          isArrLike = isArr || isBuffer(object) || isTypedArray(object);
	      iteratee = getIteratee(iteratee, 4);
	      if (accumulator == null) {
	        var Ctor = object && object.constructor;
	        if (isArrLike) {
	          accumulator = isArr ? new Ctor : [];
	        }
	        else if (isObject(object)) {
	          accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
	        }
	        else {
	          accumulator = {};
	        }
	      }
	      (isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object) {
	        return iteratee(accumulator, value, index, object);
	      });
	      return accumulator;
	    }
	    function unset(object, path) {
	      return object == null ? true : baseUnset(object, path);
	    }
	    function update(object, path, updater) {
	      return object == null ? object : baseUpdate(object, path, castFunction(updater));
	    }
	    function updateWith(object, path, updater, customizer) {
	      customizer = typeof customizer == 'function' ? customizer : undefined$1;
	      return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
	    }
	    function values(object) {
	      return object == null ? [] : baseValues(object, keys(object));
	    }
	    function valuesIn(object) {
	      return object == null ? [] : baseValues(object, keysIn(object));
	    }
	    function clamp(number, lower, upper) {
	      if (upper === undefined$1) {
	        upper = lower;
	        lower = undefined$1;
	      }
	      if (upper !== undefined$1) {
	        upper = toNumber(upper);
	        upper = upper === upper ? upper : 0;
	      }
	      if (lower !== undefined$1) {
	        lower = toNumber(lower);
	        lower = lower === lower ? lower : 0;
	      }
	      return baseClamp(toNumber(number), lower, upper);
	    }
	    function inRange(number, start, end) {
	      start = toFinite(start);
	      if (end === undefined$1) {
	        end = start;
	        start = 0;
	      } else {
	        end = toFinite(end);
	      }
	      number = toNumber(number);
	      return baseInRange(number, start, end);
	    }
	    function random(lower, upper, floating) {
	      if (floating && typeof floating != 'boolean' && isIterateeCall(lower, upper, floating)) {
	        upper = floating = undefined$1;
	      }
	      if (floating === undefined$1) {
	        if (typeof upper == 'boolean') {
	          floating = upper;
	          upper = undefined$1;
	        }
	        else if (typeof lower == 'boolean') {
	          floating = lower;
	          lower = undefined$1;
	        }
	      }
	      if (lower === undefined$1 && upper === undefined$1) {
	        lower = 0;
	        upper = 1;
	      }
	      else {
	        lower = toFinite(lower);
	        if (upper === undefined$1) {
	          upper = lower;
	          lower = 0;
	        } else {
	          upper = toFinite(upper);
	        }
	      }
	      if (lower > upper) {
	        var temp = lower;
	        lower = upper;
	        upper = temp;
	      }
	      if (floating || lower % 1 || upper % 1) {
	        var rand = nativeRandom();
	        return nativeMin(lower + (rand * (upper - lower + freeParseFloat('1e-' + ((rand + '').length - 1)))), upper);
	      }
	      return baseRandom(lower, upper);
	    }
	    var camelCase = createCompounder(function(result, word, index) {
	      word = word.toLowerCase();
	      return result + (index ? capitalize(word) : word);
	    });
	    function capitalize(string) {
	      return upperFirst(toString(string).toLowerCase());
	    }
	    function deburr(string) {
	      string = toString(string);
	      return string && string.replace(reLatin, deburrLetter).replace(reComboMark, '');
	    }
	    function endsWith(string, target, position) {
	      string = toString(string);
	      target = baseToString(target);
	      var length = string.length;
	      position = position === undefined$1
	        ? length
	        : baseClamp(toInteger(position), 0, length);
	      var end = position;
	      position -= target.length;
	      return position >= 0 && string.slice(position, end) == target;
	    }
	    function escape(string) {
	      string = toString(string);
	      return (string && reHasUnescapedHtml.test(string))
	        ? string.replace(reUnescapedHtml, escapeHtmlChar)
	        : string;
	    }
	    function escapeRegExp(string) {
	      string = toString(string);
	      return (string && reHasRegExpChar.test(string))
	        ? string.replace(reRegExpChar, '\\$&')
	        : string;
	    }
	    var kebabCase = createCompounder(function(result, word, index) {
	      return result + (index ? '-' : '') + word.toLowerCase();
	    });
	    var lowerCase = createCompounder(function(result, word, index) {
	      return result + (index ? ' ' : '') + word.toLowerCase();
	    });
	    var lowerFirst = createCaseFirst('toLowerCase');
	    function pad(string, length, chars) {
	      string = toString(string);
	      length = toInteger(length);
	      var strLength = length ? stringSize(string) : 0;
	      if (!length || strLength >= length) {
	        return string;
	      }
	      var mid = (length - strLength) / 2;
	      return (
	        createPadding(nativeFloor(mid), chars) +
	        string +
	        createPadding(nativeCeil(mid), chars)
	      );
	    }
	    function padEnd(string, length, chars) {
	      string = toString(string);
	      length = toInteger(length);
	      var strLength = length ? stringSize(string) : 0;
	      return (length && strLength < length)
	        ? (string + createPadding(length - strLength, chars))
	        : string;
	    }
	    function padStart(string, length, chars) {
	      string = toString(string);
	      length = toInteger(length);
	      var strLength = length ? stringSize(string) : 0;
	      return (length && strLength < length)
	        ? (createPadding(length - strLength, chars) + string)
	        : string;
	    }
	    function parseInt(string, radix, guard) {
	      if (guard || radix == null) {
	        radix = 0;
	      } else if (radix) {
	        radix = +radix;
	      }
	      return nativeParseInt(toString(string).replace(reTrimStart, ''), radix || 0);
	    }
	    function repeat(string, n, guard) {
	      if ((guard ? isIterateeCall(string, n, guard) : n === undefined$1)) {
	        n = 1;
	      } else {
	        n = toInteger(n);
	      }
	      return baseRepeat(toString(string), n);
	    }
	    function replace() {
	      var args = arguments,
	          string = toString(args[0]);
	      return args.length < 3 ? string : string.replace(args[1], args[2]);
	    }
	    var snakeCase = createCompounder(function(result, word, index) {
	      return result + (index ? '_' : '') + word.toLowerCase();
	    });
	    function split(string, separator, limit) {
	      if (limit && typeof limit != 'number' && isIterateeCall(string, separator, limit)) {
	        separator = limit = undefined$1;
	      }
	      limit = limit === undefined$1 ? MAX_ARRAY_LENGTH : limit >>> 0;
	      if (!limit) {
	        return [];
	      }
	      string = toString(string);
	      if (string && (
	            typeof separator == 'string' ||
	            (separator != null && !isRegExp(separator))
	          )) {
	        separator = baseToString(separator);
	        if (!separator && hasUnicode(string)) {
	          return castSlice(stringToArray(string), 0, limit);
	        }
	      }
	      return string.split(separator, limit);
	    }
	    var startCase = createCompounder(function(result, word, index) {
	      return result + (index ? ' ' : '') + upperFirst(word);
	    });
	    function startsWith(string, target, position) {
	      string = toString(string);
	      position = position == null
	        ? 0
	        : baseClamp(toInteger(position), 0, string.length);
	      target = baseToString(target);
	      return string.slice(position, position + target.length) == target;
	    }
	    function template(string, options, guard) {
	      var settings = lodash.templateSettings;
	      if (guard && isIterateeCall(string, options, guard)) {
	        options = undefined$1;
	      }
	      string = toString(string);
	      options = assignInWith({}, options, settings, customDefaultsAssignIn);
	      var imports = assignInWith({}, options.imports, settings.imports, customDefaultsAssignIn),
	          importsKeys = keys(imports),
	          importsValues = baseValues(imports, importsKeys);
	      var isEscaping,
	          isEvaluating,
	          index = 0,
	          interpolate = options.interpolate || reNoMatch,
	          source = "__p += '";
	      var reDelimiters = RegExp(
	        (options.escape || reNoMatch).source + '|' +
	        interpolate.source + '|' +
	        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
	        (options.evaluate || reNoMatch).source + '|$'
	      , 'g');
	      var sourceURL = '//# sourceURL=' +
	        (hasOwnProperty.call(options, 'sourceURL')
	          ? (options.sourceURL + '').replace(/\s/g, ' ')
	          : ('lodash.templateSources[' + (++templateCounter) + ']')
	        ) + '\n';
	      string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
	        interpolateValue || (interpolateValue = esTemplateValue);
	        source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);
	        if (escapeValue) {
	          isEscaping = true;
	          source += "' +\n__e(" + escapeValue + ") +\n'";
	        }
	        if (evaluateValue) {
	          isEvaluating = true;
	          source += "';\n" + evaluateValue + ";\n__p += '";
	        }
	        if (interpolateValue) {
	          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
	        }
	        index = offset + match.length;
	        return match;
	      });
	      source += "';\n";
	      var variable = hasOwnProperty.call(options, 'variable') && options.variable;
	      if (!variable) {
	        source = 'with (obj) {\n' + source + '\n}\n';
	      }
	      else if (reForbiddenIdentifierChars.test(variable)) {
	        throw new Error(INVALID_TEMPL_VAR_ERROR_TEXT);
	      }
	      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
	        .replace(reEmptyStringMiddle, '$1')
	        .replace(reEmptyStringTrailing, '$1;');
	      source = 'function(' + (variable || 'obj') + ') {\n' +
	        (variable
	          ? ''
	          : 'obj || (obj = {});\n'
	        ) +
	        "var __t, __p = ''" +
	        (isEscaping
	           ? ', __e = _.escape'
	           : ''
	        ) +
	        (isEvaluating
	          ? ', __j = Array.prototype.join;\n' +
	            "function print() { __p += __j.call(arguments, '') }\n"
	          : ';\n'
	        ) +
	        source +
	        'return __p\n}';
	      var result = attempt(function() {
	        return Function(importsKeys, sourceURL + 'return ' + source)
	          .apply(undefined$1, importsValues);
	      });
	      result.source = source;
	      if (isError(result)) {
	        throw result;
	      }
	      return result;
	    }
	    function toLower(value) {
	      return toString(value).toLowerCase();
	    }
	    function toUpper(value) {
	      return toString(value).toUpperCase();
	    }
	    function trim(string, chars, guard) {
	      string = toString(string);
	      if (string && (guard || chars === undefined$1)) {
	        return baseTrim(string);
	      }
	      if (!string || !(chars = baseToString(chars))) {
	        return string;
	      }
	      var strSymbols = stringToArray(string),
	          chrSymbols = stringToArray(chars),
	          start = charsStartIndex(strSymbols, chrSymbols),
	          end = charsEndIndex(strSymbols, chrSymbols) + 1;
	      return castSlice(strSymbols, start, end).join('');
	    }
	    function trimEnd(string, chars, guard) {
	      string = toString(string);
	      if (string && (guard || chars === undefined$1)) {
	        return string.slice(0, trimmedEndIndex(string) + 1);
	      }
	      if (!string || !(chars = baseToString(chars))) {
	        return string;
	      }
	      var strSymbols = stringToArray(string),
	          end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;
	      return castSlice(strSymbols, 0, end).join('');
	    }
	    function trimStart(string, chars, guard) {
	      string = toString(string);
	      if (string && (guard || chars === undefined$1)) {
	        return string.replace(reTrimStart, '');
	      }
	      if (!string || !(chars = baseToString(chars))) {
	        return string;
	      }
	      var strSymbols = stringToArray(string),
	          start = charsStartIndex(strSymbols, stringToArray(chars));
	      return castSlice(strSymbols, start).join('');
	    }
	    function truncate(string, options) {
	      var length = DEFAULT_TRUNC_LENGTH,
	          omission = DEFAULT_TRUNC_OMISSION;
	      if (isObject(options)) {
	        var separator = 'separator' in options ? options.separator : separator;
	        length = 'length' in options ? toInteger(options.length) : length;
	        omission = 'omission' in options ? baseToString(options.omission) : omission;
	      }
	      string = toString(string);
	      var strLength = string.length;
	      if (hasUnicode(string)) {
	        var strSymbols = stringToArray(string);
	        strLength = strSymbols.length;
	      }
	      if (length >= strLength) {
	        return string;
	      }
	      var end = length - stringSize(omission);
	      if (end < 1) {
	        return omission;
	      }
	      var result = strSymbols
	        ? castSlice(strSymbols, 0, end).join('')
	        : string.slice(0, end);
	      if (separator === undefined$1) {
	        return result + omission;
	      }
	      if (strSymbols) {
	        end += (result.length - end);
	      }
	      if (isRegExp(separator)) {
	        if (string.slice(end).search(separator)) {
	          var match,
	              substring = result;
	          if (!separator.global) {
	            separator = RegExp(separator.source, toString(reFlags.exec(separator)) + 'g');
	          }
	          separator.lastIndex = 0;
	          while ((match = separator.exec(substring))) {
	            var newEnd = match.index;
	          }
	          result = result.slice(0, newEnd === undefined$1 ? end : newEnd);
	        }
	      } else if (string.indexOf(baseToString(separator), end) != end) {
	        var index = result.lastIndexOf(separator);
	        if (index > -1) {
	          result = result.slice(0, index);
	        }
	      }
	      return result + omission;
	    }
	    function unescape(string) {
	      string = toString(string);
	      return (string && reHasEscapedHtml.test(string))
	        ? string.replace(reEscapedHtml, unescapeHtmlChar)
	        : string;
	    }
	    var upperCase = createCompounder(function(result, word, index) {
	      return result + (index ? ' ' : '') + word.toUpperCase();
	    });
	    var upperFirst = createCaseFirst('toUpperCase');
	    function words(string, pattern, guard) {
	      string = toString(string);
	      pattern = guard ? undefined$1 : pattern;
	      if (pattern === undefined$1) {
	        return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
	      }
	      return string.match(pattern) || [];
	    }
	    var attempt = baseRest(function(func, args) {
	      try {
	        return apply(func, undefined$1, args);
	      } catch (e) {
	        return isError(e) ? e : new Error(e);
	      }
	    });
	    var bindAll = flatRest(function(object, methodNames) {
	      arrayEach(methodNames, function(key) {
	        key = toKey(key);
	        baseAssignValue(object, key, bind(object[key], object));
	      });
	      return object;
	    });
	    function cond(pairs) {
	      var length = pairs == null ? 0 : pairs.length,
	          toIteratee = getIteratee();
	      pairs = !length ? [] : arrayMap(pairs, function(pair) {
	        if (typeof pair[1] != 'function') {
	          throw new TypeError(FUNC_ERROR_TEXT);
	        }
	        return [toIteratee(pair[0]), pair[1]];
	      });
	      return baseRest(function(args) {
	        var index = -1;
	        while (++index < length) {
	          var pair = pairs[index];
	          if (apply(pair[0], this, args)) {
	            return apply(pair[1], this, args);
	          }
	        }
	      });
	    }
	    function conforms(source) {
	      return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
	    }
	    function constant(value) {
	      return function() {
	        return value;
	      };
	    }
	    function defaultTo(value, defaultValue) {
	      return (value == null || value !== value) ? defaultValue : value;
	    }
	    var flow = createFlow();
	    var flowRight = createFlow(true);
	    function identity(value) {
	      return value;
	    }
	    function iteratee(func) {
	      return baseIteratee(typeof func == 'function' ? func : baseClone(func, CLONE_DEEP_FLAG));
	    }
	    function matches(source) {
	      return baseMatches(baseClone(source, CLONE_DEEP_FLAG));
	    }
	    function matchesProperty(path, srcValue) {
	      return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG));
	    }
	    var method = baseRest(function(path, args) {
	      return function(object) {
	        return baseInvoke(object, path, args);
	      };
	    });
	    var methodOf = baseRest(function(object, args) {
	      return function(path) {
	        return baseInvoke(object, path, args);
	      };
	    });
	    function mixin(object, source, options) {
	      var props = keys(source),
	          methodNames = baseFunctions(source, props);
	      if (options == null &&
	          !(isObject(source) && (methodNames.length || !props.length))) {
	        options = source;
	        source = object;
	        object = this;
	        methodNames = baseFunctions(source, keys(source));
	      }
	      var chain = !(isObject(options) && 'chain' in options) || !!options.chain,
	          isFunc = isFunction(object);
	      arrayEach(methodNames, function(methodName) {
	        var func = source[methodName];
	        object[methodName] = func;
	        if (isFunc) {
	          object.prototype[methodName] = function() {
	            var chainAll = this.__chain__;
	            if (chain || chainAll) {
	              var result = object(this.__wrapped__),
	                  actions = result.__actions__ = copyArray(this.__actions__);
	              actions.push({ 'func': func, 'args': arguments, 'thisArg': object });
	              result.__chain__ = chainAll;
	              return result;
	            }
	            return func.apply(object, arrayPush([this.value()], arguments));
	          };
	        }
	      });
	      return object;
	    }
	    function noConflict() {
	      if (root._ === this) {
	        root._ = oldDash;
	      }
	      return this;
	    }
	    function noop() {
	    }
	    function nthArg(n) {
	      n = toInteger(n);
	      return baseRest(function(args) {
	        return baseNth(args, n);
	      });
	    }
	    var over = createOver(arrayMap);
	    var overEvery = createOver(arrayEvery);
	    var overSome = createOver(arraySome);
	    function property(path) {
	      return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
	    }
	    function propertyOf(object) {
	      return function(path) {
	        return object == null ? undefined$1 : baseGet(object, path);
	      };
	    }
	    var range = createRange();
	    var rangeRight = createRange(true);
	    function stubArray() {
	      return [];
	    }
	    function stubFalse() {
	      return false;
	    }
	    function stubObject() {
	      return {};
	    }
	    function stubString() {
	      return '';
	    }
	    function stubTrue() {
	      return true;
	    }
	    function times(n, iteratee) {
	      n = toInteger(n);
	      if (n < 1 || n > MAX_SAFE_INTEGER) {
	        return [];
	      }
	      var index = MAX_ARRAY_LENGTH,
	          length = nativeMin(n, MAX_ARRAY_LENGTH);
	      iteratee = getIteratee(iteratee);
	      n -= MAX_ARRAY_LENGTH;
	      var result = baseTimes(length, iteratee);
	      while (++index < n) {
	        iteratee(index);
	      }
	      return result;
	    }
	    function toPath(value) {
	      if (isArray(value)) {
	        return arrayMap(value, toKey);
	      }
	      return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
	    }
	    function uniqueId(prefix) {
	      var id = ++idCounter;
	      return toString(prefix) + id;
	    }
	    var add = createMathOperation(function(augend, addend) {
	      return augend + addend;
	    }, 0);
	    var ceil = createRound('ceil');
	    var divide = createMathOperation(function(dividend, divisor) {
	      return dividend / divisor;
	    }, 1);
	    var floor = createRound('floor');
	    function max(array) {
	      return (array && array.length)
	        ? baseExtremum(array, identity, baseGt)
	        : undefined$1;
	    }
	    function maxBy(array, iteratee) {
	      return (array && array.length)
	        ? baseExtremum(array, getIteratee(iteratee, 2), baseGt)
	        : undefined$1;
	    }
	    function mean(array) {
	      return baseMean(array, identity);
	    }
	    function meanBy(array, iteratee) {
	      return baseMean(array, getIteratee(iteratee, 2));
	    }
	    function min(array) {
	      return (array && array.length)
	        ? baseExtremum(array, identity, baseLt)
	        : undefined$1;
	    }
	    function minBy(array, iteratee) {
	      return (array && array.length)
	        ? baseExtremum(array, getIteratee(iteratee, 2), baseLt)
	        : undefined$1;
	    }
	    var multiply = createMathOperation(function(multiplier, multiplicand) {
	      return multiplier * multiplicand;
	    }, 1);
	    var round = createRound('round');
	    var subtract = createMathOperation(function(minuend, subtrahend) {
	      return minuend - subtrahend;
	    }, 0);
	    function sum(array) {
	      return (array && array.length)
	        ? baseSum(array, identity)
	        : 0;
	    }
	    function sumBy(array, iteratee) {
	      return (array && array.length)
	        ? baseSum(array, getIteratee(iteratee, 2))
	        : 0;
	    }
	    lodash.after = after;
	    lodash.ary = ary;
	    lodash.assign = assign;
	    lodash.assignIn = assignIn;
	    lodash.assignInWith = assignInWith;
	    lodash.assignWith = assignWith;
	    lodash.at = at;
	    lodash.before = before;
	    lodash.bind = bind;
	    lodash.bindAll = bindAll;
	    lodash.bindKey = bindKey;
	    lodash.castArray = castArray;
	    lodash.chain = chain;
	    lodash.chunk = chunk;
	    lodash.compact = compact;
	    lodash.concat = concat;
	    lodash.cond = cond;
	    lodash.conforms = conforms;
	    lodash.constant = constant;
	    lodash.countBy = countBy;
	    lodash.create = create;
	    lodash.curry = curry;
	    lodash.curryRight = curryRight;
	    lodash.debounce = debounce;
	    lodash.defaults = defaults;
	    lodash.defaultsDeep = defaultsDeep;
	    lodash.defer = defer;
	    lodash.delay = delay;
	    lodash.difference = difference;
	    lodash.differenceBy = differenceBy;
	    lodash.differenceWith = differenceWith;
	    lodash.drop = drop;
	    lodash.dropRight = dropRight;
	    lodash.dropRightWhile = dropRightWhile;
	    lodash.dropWhile = dropWhile;
	    lodash.fill = fill;
	    lodash.filter = filter;
	    lodash.flatMap = flatMap;
	    lodash.flatMapDeep = flatMapDeep;
	    lodash.flatMapDepth = flatMapDepth;
	    lodash.flatten = flatten;
	    lodash.flattenDeep = flattenDeep;
	    lodash.flattenDepth = flattenDepth;
	    lodash.flip = flip;
	    lodash.flow = flow;
	    lodash.flowRight = flowRight;
	    lodash.fromPairs = fromPairs;
	    lodash.functions = functions;
	    lodash.functionsIn = functionsIn;
	    lodash.groupBy = groupBy;
	    lodash.initial = initial;
	    lodash.intersection = intersection;
	    lodash.intersectionBy = intersectionBy;
	    lodash.intersectionWith = intersectionWith;
	    lodash.invert = invert;
	    lodash.invertBy = invertBy;
	    lodash.invokeMap = invokeMap;
	    lodash.iteratee = iteratee;
	    lodash.keyBy = keyBy;
	    lodash.keys = keys;
	    lodash.keysIn = keysIn;
	    lodash.map = map;
	    lodash.mapKeys = mapKeys;
	    lodash.mapValues = mapValues;
	    lodash.matches = matches;
	    lodash.matchesProperty = matchesProperty;
	    lodash.memoize = memoize;
	    lodash.merge = merge;
	    lodash.mergeWith = mergeWith;
	    lodash.method = method;
	    lodash.methodOf = methodOf;
	    lodash.mixin = mixin;
	    lodash.negate = negate;
	    lodash.nthArg = nthArg;
	    lodash.omit = omit;
	    lodash.omitBy = omitBy;
	    lodash.once = once;
	    lodash.orderBy = orderBy;
	    lodash.over = over;
	    lodash.overArgs = overArgs;
	    lodash.overEvery = overEvery;
	    lodash.overSome = overSome;
	    lodash.partial = partial;
	    lodash.partialRight = partialRight;
	    lodash.partition = partition;
	    lodash.pick = pick;
	    lodash.pickBy = pickBy;
	    lodash.property = property;
	    lodash.propertyOf = propertyOf;
	    lodash.pull = pull;
	    lodash.pullAll = pullAll;
	    lodash.pullAllBy = pullAllBy;
	    lodash.pullAllWith = pullAllWith;
	    lodash.pullAt = pullAt;
	    lodash.range = range;
	    lodash.rangeRight = rangeRight;
	    lodash.rearg = rearg;
	    lodash.reject = reject;
	    lodash.remove = remove;
	    lodash.rest = rest;
	    lodash.reverse = reverse;
	    lodash.sampleSize = sampleSize;
	    lodash.set = set;
	    lodash.setWith = setWith;
	    lodash.shuffle = shuffle;
	    lodash.slice = slice;
	    lodash.sortBy = sortBy;
	    lodash.sortedUniq = sortedUniq;
	    lodash.sortedUniqBy = sortedUniqBy;
	    lodash.split = split;
	    lodash.spread = spread;
	    lodash.tail = tail;
	    lodash.take = take;
	    lodash.takeRight = takeRight;
	    lodash.takeRightWhile = takeRightWhile;
	    lodash.takeWhile = takeWhile;
	    lodash.tap = tap;
	    lodash.throttle = throttle;
	    lodash.thru = thru;
	    lodash.toArray = toArray;
	    lodash.toPairs = toPairs;
	    lodash.toPairsIn = toPairsIn;
	    lodash.toPath = toPath;
	    lodash.toPlainObject = toPlainObject;
	    lodash.transform = transform;
	    lodash.unary = unary;
	    lodash.union = union;
	    lodash.unionBy = unionBy;
	    lodash.unionWith = unionWith;
	    lodash.uniq = uniq;
	    lodash.uniqBy = uniqBy;
	    lodash.uniqWith = uniqWith;
	    lodash.unset = unset;
	    lodash.unzip = unzip;
	    lodash.unzipWith = unzipWith;
	    lodash.update = update;
	    lodash.updateWith = updateWith;
	    lodash.values = values;
	    lodash.valuesIn = valuesIn;
	    lodash.without = without;
	    lodash.words = words;
	    lodash.wrap = wrap;
	    lodash.xor = xor;
	    lodash.xorBy = xorBy;
	    lodash.xorWith = xorWith;
	    lodash.zip = zip;
	    lodash.zipObject = zipObject;
	    lodash.zipObjectDeep = zipObjectDeep;
	    lodash.zipWith = zipWith;
	    lodash.entries = toPairs;
	    lodash.entriesIn = toPairsIn;
	    lodash.extend = assignIn;
	    lodash.extendWith = assignInWith;
	    mixin(lodash, lodash);
	    lodash.add = add;
	    lodash.attempt = attempt;
	    lodash.camelCase = camelCase;
	    lodash.capitalize = capitalize;
	    lodash.ceil = ceil;
	    lodash.clamp = clamp;
	    lodash.clone = clone;
	    lodash.cloneDeep = cloneDeep;
	    lodash.cloneDeepWith = cloneDeepWith;
	    lodash.cloneWith = cloneWith;
	    lodash.conformsTo = conformsTo;
	    lodash.deburr = deburr;
	    lodash.defaultTo = defaultTo;
	    lodash.divide = divide;
	    lodash.endsWith = endsWith;
	    lodash.eq = eq;
	    lodash.escape = escape;
	    lodash.escapeRegExp = escapeRegExp;
	    lodash.every = every;
	    lodash.find = find;
	    lodash.findIndex = findIndex;
	    lodash.findKey = findKey;
	    lodash.findLast = findLast;
	    lodash.findLastIndex = findLastIndex;
	    lodash.findLastKey = findLastKey;
	    lodash.floor = floor;
	    lodash.forEach = forEach;
	    lodash.forEachRight = forEachRight;
	    lodash.forIn = forIn;
	    lodash.forInRight = forInRight;
	    lodash.forOwn = forOwn;
	    lodash.forOwnRight = forOwnRight;
	    lodash.get = get;
	    lodash.gt = gt;
	    lodash.gte = gte;
	    lodash.has = has;
	    lodash.hasIn = hasIn;
	    lodash.head = head;
	    lodash.identity = identity;
	    lodash.includes = includes;
	    lodash.indexOf = indexOf;
	    lodash.inRange = inRange;
	    lodash.invoke = invoke;
	    lodash.isArguments = isArguments;
	    lodash.isArray = isArray;
	    lodash.isArrayBuffer = isArrayBuffer;
	    lodash.isArrayLike = isArrayLike;
	    lodash.isArrayLikeObject = isArrayLikeObject;
	    lodash.isBoolean = isBoolean;
	    lodash.isBuffer = isBuffer;
	    lodash.isDate = isDate;
	    lodash.isElement = isElement;
	    lodash.isEmpty = isEmpty;
	    lodash.isEqual = isEqual;
	    lodash.isEqualWith = isEqualWith;
	    lodash.isError = isError;
	    lodash.isFinite = isFinite;
	    lodash.isFunction = isFunction;
	    lodash.isInteger = isInteger;
	    lodash.isLength = isLength;
	    lodash.isMap = isMap;
	    lodash.isMatch = isMatch;
	    lodash.isMatchWith = isMatchWith;
	    lodash.isNaN = isNaN;
	    lodash.isNative = isNative;
	    lodash.isNil = isNil;
	    lodash.isNull = isNull;
	    lodash.isNumber = isNumber;
	    lodash.isObject = isObject;
	    lodash.isObjectLike = isObjectLike;
	    lodash.isPlainObject = isPlainObject;
	    lodash.isRegExp = isRegExp;
	    lodash.isSafeInteger = isSafeInteger;
	    lodash.isSet = isSet;
	    lodash.isString = isString;
	    lodash.isSymbol = isSymbol;
	    lodash.isTypedArray = isTypedArray;
	    lodash.isUndefined = isUndefined;
	    lodash.isWeakMap = isWeakMap;
	    lodash.isWeakSet = isWeakSet;
	    lodash.join = join;
	    lodash.kebabCase = kebabCase;
	    lodash.last = last;
	    lodash.lastIndexOf = lastIndexOf;
	    lodash.lowerCase = lowerCase;
	    lodash.lowerFirst = lowerFirst;
	    lodash.lt = lt;
	    lodash.lte = lte;
	    lodash.max = max;
	    lodash.maxBy = maxBy;
	    lodash.mean = mean;
	    lodash.meanBy = meanBy;
	    lodash.min = min;
	    lodash.minBy = minBy;
	    lodash.stubArray = stubArray;
	    lodash.stubFalse = stubFalse;
	    lodash.stubObject = stubObject;
	    lodash.stubString = stubString;
	    lodash.stubTrue = stubTrue;
	    lodash.multiply = multiply;
	    lodash.nth = nth;
	    lodash.noConflict = noConflict;
	    lodash.noop = noop;
	    lodash.now = now;
	    lodash.pad = pad;
	    lodash.padEnd = padEnd;
	    lodash.padStart = padStart;
	    lodash.parseInt = parseInt;
	    lodash.random = random;
	    lodash.reduce = reduce;
	    lodash.reduceRight = reduceRight;
	    lodash.repeat = repeat;
	    lodash.replace = replace;
	    lodash.result = result;
	    lodash.round = round;
	    lodash.runInContext = runInContext;
	    lodash.sample = sample;
	    lodash.size = size;
	    lodash.snakeCase = snakeCase;
	    lodash.some = some;
	    lodash.sortedIndex = sortedIndex;
	    lodash.sortedIndexBy = sortedIndexBy;
	    lodash.sortedIndexOf = sortedIndexOf;
	    lodash.sortedLastIndex = sortedLastIndex;
	    lodash.sortedLastIndexBy = sortedLastIndexBy;
	    lodash.sortedLastIndexOf = sortedLastIndexOf;
	    lodash.startCase = startCase;
	    lodash.startsWith = startsWith;
	    lodash.subtract = subtract;
	    lodash.sum = sum;
	    lodash.sumBy = sumBy;
	    lodash.template = template;
	    lodash.times = times;
	    lodash.toFinite = toFinite;
	    lodash.toInteger = toInteger;
	    lodash.toLength = toLength;
	    lodash.toLower = toLower;
	    lodash.toNumber = toNumber;
	    lodash.toSafeInteger = toSafeInteger;
	    lodash.toString = toString;
	    lodash.toUpper = toUpper;
	    lodash.trim = trim;
	    lodash.trimEnd = trimEnd;
	    lodash.trimStart = trimStart;
	    lodash.truncate = truncate;
	    lodash.unescape = unescape;
	    lodash.uniqueId = uniqueId;
	    lodash.upperCase = upperCase;
	    lodash.upperFirst = upperFirst;
	    lodash.each = forEach;
	    lodash.eachRight = forEachRight;
	    lodash.first = head;
	    mixin(lodash, (function() {
	      var source = {};
	      baseForOwn(lodash, function(func, methodName) {
	        if (!hasOwnProperty.call(lodash.prototype, methodName)) {
	          source[methodName] = func;
	        }
	      });
	      return source;
	    }()), { 'chain': false });
	    lodash.VERSION = VERSION;
	    arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function(methodName) {
	      lodash[methodName].placeholder = lodash;
	    });
	    arrayEach(['drop', 'take'], function(methodName, index) {
	      LazyWrapper.prototype[methodName] = function(n) {
	        n = n === undefined$1 ? 1 : nativeMax(toInteger(n), 0);
	        var result = (this.__filtered__ && !index)
	          ? new LazyWrapper(this)
	          : this.clone();
	        if (result.__filtered__) {
	          result.__takeCount__ = nativeMin(n, result.__takeCount__);
	        } else {
	          result.__views__.push({
	            'size': nativeMin(n, MAX_ARRAY_LENGTH),
	            'type': methodName + (result.__dir__ < 0 ? 'Right' : '')
	          });
	        }
	        return result;
	      };
	      LazyWrapper.prototype[methodName + 'Right'] = function(n) {
	        return this.reverse()[methodName](n).reverse();
	      };
	    });
	    arrayEach(['filter', 'map', 'takeWhile'], function(methodName, index) {
	      var type = index + 1,
	          isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;
	      LazyWrapper.prototype[methodName] = function(iteratee) {
	        var result = this.clone();
	        result.__iteratees__.push({
	          'iteratee': getIteratee(iteratee, 3),
	          'type': type
	        });
	        result.__filtered__ = result.__filtered__ || isFilter;
	        return result;
	      };
	    });
	    arrayEach(['head', 'last'], function(methodName, index) {
	      var takeName = 'take' + (index ? 'Right' : '');
	      LazyWrapper.prototype[methodName] = function() {
	        return this[takeName](1).value()[0];
	      };
	    });
	    arrayEach(['initial', 'tail'], function(methodName, index) {
	      var dropName = 'drop' + (index ? '' : 'Right');
	      LazyWrapper.prototype[methodName] = function() {
	        return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
	      };
	    });
	    LazyWrapper.prototype.compact = function() {
	      return this.filter(identity);
	    };
	    LazyWrapper.prototype.find = function(predicate) {
	      return this.filter(predicate).head();
	    };
	    LazyWrapper.prototype.findLast = function(predicate) {
	      return this.reverse().find(predicate);
	    };
	    LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {
	      if (typeof path == 'function') {
	        return new LazyWrapper(this);
	      }
	      return this.map(function(value) {
	        return baseInvoke(value, path, args);
	      });
	    });
	    LazyWrapper.prototype.reject = function(predicate) {
	      return this.filter(negate(getIteratee(predicate)));
	    };
	    LazyWrapper.prototype.slice = function(start, end) {
	      start = toInteger(start);
	      var result = this;
	      if (result.__filtered__ && (start > 0 || end < 0)) {
	        return new LazyWrapper(result);
	      }
	      if (start < 0) {
	        result = result.takeRight(-start);
	      } else if (start) {
	        result = result.drop(start);
	      }
	      if (end !== undefined$1) {
	        end = toInteger(end);
	        result = end < 0 ? result.dropRight(-end) : result.take(end - start);
	      }
	      return result;
	    };
	    LazyWrapper.prototype.takeRightWhile = function(predicate) {
	      return this.reverse().takeWhile(predicate).reverse();
	    };
	    LazyWrapper.prototype.toArray = function() {
	      return this.take(MAX_ARRAY_LENGTH);
	    };
	    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
	      var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName),
	          isTaker = /^(?:head|last)$/.test(methodName),
	          lodashFunc = lodash[isTaker ? ('take' + (methodName == 'last' ? 'Right' : '')) : methodName],
	          retUnwrapped = isTaker || /^find/.test(methodName);
	      if (!lodashFunc) {
	        return;
	      }
	      lodash.prototype[methodName] = function() {
	        var value = this.__wrapped__,
	            args = isTaker ? [1] : arguments,
	            isLazy = value instanceof LazyWrapper,
	            iteratee = args[0],
	            useLazy = isLazy || isArray(value);
	        var interceptor = function(value) {
	          var result = lodashFunc.apply(lodash, arrayPush([value], args));
	          return (isTaker && chainAll) ? result[0] : result;
	        };
	        if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {
	          isLazy = useLazy = false;
	        }
	        var chainAll = this.__chain__,
	            isHybrid = !!this.__actions__.length,
	            isUnwrapped = retUnwrapped && !chainAll,
	            onlyLazy = isLazy && !isHybrid;
	        if (!retUnwrapped && useLazy) {
	          value = onlyLazy ? value : new LazyWrapper(this);
	          var result = func.apply(value, args);
	          result.__actions__.push({ 'func': thru, 'args': [interceptor], 'thisArg': undefined$1 });
	          return new LodashWrapper(result, chainAll);
	        }
	        if (isUnwrapped && onlyLazy) {
	          return func.apply(this, args);
	        }
	        result = this.thru(interceptor);
	        return isUnwrapped ? (isTaker ? result.value()[0] : result.value()) : result;
	      };
	    });
	    arrayEach(['pop', 'push', 'shift', 'sort', 'splice', 'unshift'], function(methodName) {
	      var func = arrayProto[methodName],
	          chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
	          retUnwrapped = /^(?:pop|shift)$/.test(methodName);
	      lodash.prototype[methodName] = function() {
	        var args = arguments;
	        if (retUnwrapped && !this.__chain__) {
	          var value = this.value();
	          return func.apply(isArray(value) ? value : [], args);
	        }
	        return this[chainName](function(value) {
	          return func.apply(isArray(value) ? value : [], args);
	        });
	      };
	    });
	    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
	      var lodashFunc = lodash[methodName];
	      if (lodashFunc) {
	        var key = lodashFunc.name + '';
	        if (!hasOwnProperty.call(realNames, key)) {
	          realNames[key] = [];
	        }
	        realNames[key].push({ 'name': methodName, 'func': lodashFunc });
	      }
	    });
	    realNames[createHybrid(undefined$1, WRAP_BIND_KEY_FLAG).name] = [{
	      'name': 'wrapper',
	      'func': undefined$1
	    }];
	    LazyWrapper.prototype.clone = lazyClone;
	    LazyWrapper.prototype.reverse = lazyReverse;
	    LazyWrapper.prototype.value = lazyValue;
	    lodash.prototype.at = wrapperAt;
	    lodash.prototype.chain = wrapperChain;
	    lodash.prototype.commit = wrapperCommit;
	    lodash.prototype.next = wrapperNext;
	    lodash.prototype.plant = wrapperPlant;
	    lodash.prototype.reverse = wrapperReverse;
	    lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;
	    lodash.prototype.first = lodash.prototype.head;
	    if (symIterator) {
	      lodash.prototype[symIterator] = wrapperToIterator;
	    }
	    return lodash;
	  });
	  var _ = runInContext();
	  if (freeModule) {
	    (freeModule.exports = _)._ = _;
	    freeExports._ = _;
	  }
	  else {
	    root._ = _;
	  }
	}.call(commonjsGlobal));
} (lodash, lodash.exports));
var lodashExports = lodash.exports;
var _ = getDefaultExportFromCjs(lodashExports);var FileSaver_min = {exports: {}};(function (module, exports) {
	(function(a,b){b();})(commonjsGlobal,function(){function b(a,b){return "undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(a,b,c){var d=new XMLHttpRequest;d.open("GET",a),d.responseType="blob",d.onload=function(){g(d.response,b,c);},d.onerror=function(){console.error("could not download file");},d.send();}function d(a){var b=new XMLHttpRequest;b.open("HEAD",a,!1);try{b.send();}catch(a){}return 200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"));}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b);}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof commonjsGlobal&&commonjsGlobal.global===commonjsGlobal?commonjsGlobal:void 0,a=f.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),g=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype&&!a?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href);},4E4),setTimeout(function(){e(j);},0));}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else {var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i);});}}:function(b,d,e,g){if(g=g||open("","_blank"),g&&(g.document.title=g.document.body.innerText="downloading..."),"string"==typeof b)return c(b,d,e);var h="application/octet-stream"===b.type,i=/constructor/i.test(f.HTMLElement)||f.safari,j=/CriOS\/[\d]+/.test(navigator.userAgent);if((j||h&&i||a)&&"undefined"!=typeof FileReader){var k=new FileReader;k.onloadend=function(){var a=k.result;a=j?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),g?g.location.href=a:location=a,g=null;},k.readAsDataURL(b);}else {var l=f.URL||f.webkitURL,m=l.createObjectURL(b);g?g.location=m:location.href=m,g=null,setTimeout(function(){l.revokeObjectURL(m);},4E4);}});f.saveAs=g.saveAs=g,(module.exports=g);});
} (FileSaver_min));
var FileSaver_minExports = FileSaver_min.exports;
var FileSaver = getDefaultExportFromCjs(FileSaver_minExports);class Node {
	value;
	next;
	constructor(value) {
		this.value = value;
	}
}
class Queue {
	#head;
	#tail;
	#size;
	constructor() {
		this.clear();
	}
	enqueue(value) {
		const node = new Node(value);
		if (this.#head) {
			this.#tail.next = node;
			this.#tail = node;
		} else {
			this.#head = node;
			this.#tail = node;
		}
		this.#size++;
	}
	dequeue() {
		const current = this.#head;
		if (!current) {
			return;
		}
		this.#head = this.#head.next;
		this.#size--;
		return current.value;
	}
	clear() {
		this.#head = undefined;
		this.#tail = undefined;
		this.#size = 0;
	}
	get size() {
		return this.#size;
	}
	* [Symbol.iterator]() {
		let current = this.#head;
		while (current) {
			yield current.value;
			current = current.next;
		}
	}
}function pLimit(concurrency) {
	if (!((Number.isInteger(concurrency) || concurrency === Number.POSITIVE_INFINITY) && concurrency > 0)) {
		throw new TypeError('Expected `concurrency` to be a number from 1 and up');
	}
	const queue = new Queue();
	let activeCount = 0;
	const next = () => {
		activeCount--;
		if (queue.size > 0) {
			queue.dequeue()();
		}
	};
	const run = async (fn, resolve, args) => {
		activeCount++;
		const result = (async () => fn(...args))();
		resolve(result);
		try {
			await result;
		} catch {}
		next();
	};
	const enqueue = (fn, resolve, args) => {
		queue.enqueue(run.bind(undefined, fn, resolve, args));
		(async () => {
			await Promise.resolve();
			if (activeCount < concurrency && queue.size > 0) {
				queue.dequeue()();
			}
		})();
	};
	const generator = (fn, ...args) => new Promise(resolve => {
		enqueue(fn, resolve, args);
	});
	Object.defineProperties(generator, {
		activeCount: {
			get: () => activeCount,
		},
		pendingCount: {
			get: () => queue.size,
		},
		clearQueue: {
			value: () => {
				queue.clear();
			},
		},
	});
	return generator;
}function commonjsRequire(path) {
	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}var jszip_min = {exports: {}};/*!
JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>
(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.
JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/
(function (module, exports) {
	!function(e){module.exports=e();}(function(){return function s(a,o,h){function u(r,e){if(!o[r]){if(!a[r]){var t="function"==typeof commonjsRequire&&commonjsRequire;if(!e&&t)return t(r,!0);if(l)return l(r,!0);var n=new Error("Cannot find module '"+r+"'");throw n.code="MODULE_NOT_FOUND",n}var i=o[r]={exports:{}};a[r][0].call(i.exports,function(e){var t=a[r][1][e];return u(t||e)},i,i.exports,s,a,o,h);}return o[r].exports}for(var l="function"==typeof commonjsRequire&&commonjsRequire,e=0;e<h.length;e++)u(h[e]);return u}({1:[function(e,t,r){var d=e("./utils"),c=e("./support"),p="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";r.encode=function(e){for(var t,r,n,i,s,a,o,h=[],u=0,l=e.length,f=l,c="string"!==d.getTypeOf(e);u<e.length;)f=l-u,n=c?(t=e[u++],r=u<l?e[u++]:0,u<l?e[u++]:0):(t=e.charCodeAt(u++),r=u<l?e.charCodeAt(u++):0,u<l?e.charCodeAt(u++):0),i=t>>2,s=(3&t)<<4|r>>4,a=1<f?(15&r)<<2|n>>6:64,o=2<f?63&n:64,h.push(p.charAt(i)+p.charAt(s)+p.charAt(a)+p.charAt(o));return h.join("")},r.decode=function(e){var t,r,n,i,s,a,o=0,h=0,u="data:";if(e.substr(0,u.length)===u)throw new Error("Invalid base64 input, it looks like a data url.");var l,f=3*(e=e.replace(/[^A-Za-z0-9+/=]/g,"")).length/4;if(e.charAt(e.length-1)===p.charAt(64)&&f--,e.charAt(e.length-2)===p.charAt(64)&&f--,f%1!=0)throw new Error("Invalid base64 input, bad content length.");for(l=c.uint8array?new Uint8Array(0|f):new Array(0|f);o<e.length;)t=p.indexOf(e.charAt(o++))<<2|(i=p.indexOf(e.charAt(o++)))>>4,r=(15&i)<<4|(s=p.indexOf(e.charAt(o++)))>>2,n=(3&s)<<6|(a=p.indexOf(e.charAt(o++))),l[h++]=t,64!==s&&(l[h++]=r),64!==a&&(l[h++]=n);return l};},{"./support":30,"./utils":32}],2:[function(e,t,r){var n=e("./external"),i=e("./stream/DataWorker"),s=e("./stream/Crc32Probe"),a=e("./stream/DataLengthProbe");function o(e,t,r,n,i){this.compressedSize=e,this.uncompressedSize=t,this.crc32=r,this.compression=n,this.compressedContent=i;}o.prototype={getContentWorker:function(){var e=new i(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new a("data_length")),t=this;return e.on("end",function(){if(this.streamInfo.data_length!==t.uncompressedSize)throw new Error("Bug : uncompressed data size mismatch")}),e},getCompressedWorker:function(){return new i(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize",this.compressedSize).withStreamInfo("uncompressedSize",this.uncompressedSize).withStreamInfo("crc32",this.crc32).withStreamInfo("compression",this.compression)}},o.createWorkerFrom=function(e,t,r){return e.pipe(new s).pipe(new a("uncompressedSize")).pipe(t.compressWorker(r)).pipe(new a("compressedSize")).withStreamInfo("compression",t)},t.exports=o;},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(e,t,r){var n=e("./stream/GenericWorker");r.STORE={magic:"\0\0",compressWorker:function(){return new n("STORE compression")},uncompressWorker:function(){return new n("STORE decompression")}},r.DEFLATE=e("./flate");},{"./flate":7,"./stream/GenericWorker":28}],4:[function(e,t,r){var n=e("./utils");var o=function(){for(var e,t=[],r=0;r<256;r++){e=r;for(var n=0;n<8;n++)e=1&e?3988292384^e>>>1:e>>>1;t[r]=e;}return t}();t.exports=function(e,t){return void 0!==e&&e.length?"string"!==n.getTypeOf(e)?function(e,t,r,n){var i=o,s=n+r;e^=-1;for(var a=n;a<s;a++)e=e>>>8^i[255&(e^t[a])];return -1^e}(0|t,e,e.length,0):function(e,t,r,n){var i=o,s=n+r;e^=-1;for(var a=n;a<s;a++)e=e>>>8^i[255&(e^t.charCodeAt(a))];return -1^e}(0|t,e,e.length,0):0};},{"./utils":32}],5:[function(e,t,r){r.base64=!1,r.binary=!1,r.dir=!1,r.createFolders=!0,r.date=null,r.compression=null,r.compressionOptions=null,r.comment=null,r.unixPermissions=null,r.dosPermissions=null;},{}],6:[function(e,t,r){var n=null;n="undefined"!=typeof Promise?Promise:e("lie"),t.exports={Promise:n};},{lie:37}],7:[function(e,t,r){var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array,i=e("pako"),s=e("./utils"),a=e("./stream/GenericWorker"),o=n?"uint8array":"array";function h(e,t){a.call(this,"FlateWorker/"+e),this._pako=null,this._pakoAction=e,this._pakoOptions=t,this.meta={};}r.magic="\b\0",s.inherits(h,a),h.prototype.processChunk=function(e){this.meta=e.meta,null===this._pako&&this._createPako(),this._pako.push(s.transformTo(o,e.data),!1);},h.prototype.flush=function(){a.prototype.flush.call(this),null===this._pako&&this._createPako(),this._pako.push([],!0);},h.prototype.cleanUp=function(){a.prototype.cleanUp.call(this),this._pako=null;},h.prototype._createPako=function(){this._pako=new i[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var t=this;this._pako.onData=function(e){t.push({data:e,meta:t.meta});};},r.compressWorker=function(e){return new h("Deflate",e)},r.uncompressWorker=function(){return new h("Inflate",{})};},{"./stream/GenericWorker":28,"./utils":32,pako:38}],8:[function(e,t,r){function A(e,t){var r,n="";for(r=0;r<t;r++)n+=String.fromCharCode(255&e),e>>>=8;return n}function n(e,t,r,n,i,s){var a,o,h=e.file,u=e.compression,l=s!==O.utf8encode,f=I.transformTo("string",s(h.name)),c=I.transformTo("string",O.utf8encode(h.name)),d=h.comment,p=I.transformTo("string",s(d)),m=I.transformTo("string",O.utf8encode(d)),_=c.length!==h.name.length,g=m.length!==d.length,b="",v="",y="",w=h.dir,k=h.date,x={crc32:0,compressedSize:0,uncompressedSize:0};t&&!r||(x.crc32=e.crc32,x.compressedSize=e.compressedSize,x.uncompressedSize=e.uncompressedSize);var S=0;t&&(S|=8),l||!_&&!g||(S|=2048);var z=0,C=0;w&&(z|=16),"UNIX"===i?(C=798,z|=function(e,t){var r=e;return e||(r=t?16893:33204),(65535&r)<<16}(h.unixPermissions,w)):(C=20,z|=function(e){return 63&(e||0)}(h.dosPermissions)),a=k.getUTCHours(),a<<=6,a|=k.getUTCMinutes(),a<<=5,a|=k.getUTCSeconds()/2,o=k.getUTCFullYear()-1980,o<<=4,o|=k.getUTCMonth()+1,o<<=5,o|=k.getUTCDate(),_&&(v=A(1,1)+A(B(f),4)+c,b+="up"+A(v.length,2)+v),g&&(y=A(1,1)+A(B(p),4)+m,b+="uc"+A(y.length,2)+y);var E="";return E+="\n\0",E+=A(S,2),E+=u.magic,E+=A(a,2),E+=A(o,2),E+=A(x.crc32,4),E+=A(x.compressedSize,4),E+=A(x.uncompressedSize,4),E+=A(f.length,2),E+=A(b.length,2),{fileRecord:R.LOCAL_FILE_HEADER+E+f+b,dirRecord:R.CENTRAL_FILE_HEADER+A(C,2)+E+A(p.length,2)+"\0\0\0\0"+A(z,4)+A(n,4)+f+b+p}}var I=e("../utils"),i=e("../stream/GenericWorker"),O=e("../utf8"),B=e("../crc32"),R=e("../signature");function s(e,t,r,n){i.call(this,"ZipFileWorker"),this.bytesWritten=0,this.zipComment=t,this.zipPlatform=r,this.encodeFileName=n,this.streamFiles=e,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[];}I.inherits(s,i),s.prototype.push=function(e){var t=e.meta.percent||0,r=this.entriesCount,n=this._sources.length;this.accumulate?this.contentBuffer.push(e):(this.bytesWritten+=e.data.length,i.prototype.push.call(this,{data:e.data,meta:{currentFile:this.currentFile,percent:r?(t+100*(r-n-1))/r:100}}));},s.prototype.openedSource=function(e){this.currentSourceOffset=this.bytesWritten,this.currentFile=e.file.name;var t=this.streamFiles&&!e.file.dir;if(t){var r=n(e,t,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:r.fileRecord,meta:{percent:0}});}else this.accumulate=!0;},s.prototype.closedSource=function(e){this.accumulate=!1;var t=this.streamFiles&&!e.file.dir,r=n(e,t,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(r.dirRecord),t)this.push({data:function(e){return R.DATA_DESCRIPTOR+A(e.crc32,4)+A(e.compressedSize,4)+A(e.uncompressedSize,4)}(e),meta:{percent:100}});else for(this.push({data:r.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null;},s.prototype.flush=function(){for(var e=this.bytesWritten,t=0;t<this.dirRecords.length;t++)this.push({data:this.dirRecords[t],meta:{percent:100}});var r=this.bytesWritten-e,n=function(e,t,r,n,i){var s=I.transformTo("string",i(n));return R.CENTRAL_DIRECTORY_END+"\0\0\0\0"+A(e,2)+A(e,2)+A(t,4)+A(r,4)+A(s.length,2)+s}(this.dirRecords.length,r,e,this.zipComment,this.encodeFileName);this.push({data:n,meta:{percent:100}});},s.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume();},s.prototype.registerPrevious=function(e){this._sources.push(e);var t=this;return e.on("data",function(e){t.processChunk(e);}),e.on("end",function(){t.closedSource(t.previous.streamInfo),t._sources.length?t.prepareNextSource():t.end();}),e.on("error",function(e){t.error(e);}),this},s.prototype.resume=function(){return !!i.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},s.prototype.error=function(e){var t=this._sources;if(!i.prototype.error.call(this,e))return !1;for(var r=0;r<t.length;r++)try{t[r].error(e);}catch(e){}return !0},s.prototype.lock=function(){i.prototype.lock.call(this);for(var e=this._sources,t=0;t<e.length;t++)e[t].lock();},t.exports=s;},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(e,t,r){var u=e("../compressions"),n=e("./ZipFileWorker");r.generateWorker=function(e,a,t){var o=new n(a.streamFiles,t,a.platform,a.encodeFileName),h=0;try{e.forEach(function(e,t){h++;var r=function(e,t){var r=e||t,n=u[r];if(!n)throw new Error(r+" is not a valid compression method !");return n}(t.options.compression,a.compression),n=t.options.compressionOptions||a.compressionOptions||{},i=t.dir,s=t.date;t._compressWorker(r,n).withStreamInfo("file",{name:e,dir:i,date:s,comment:t.comment||"",unixPermissions:t.unixPermissions,dosPermissions:t.dosPermissions}).pipe(o);}),o.entriesCount=h;}catch(e){o.error(e);}return o};},{"../compressions":3,"./ZipFileWorker":8}],10:[function(e,t,r){function n(){if(!(this instanceof n))return new n;if(arguments.length)throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");this.files=Object.create(null),this.comment=null,this.root="",this.clone=function(){var e=new n;for(var t in this)"function"!=typeof this[t]&&(e[t]=this[t]);return e};}(n.prototype=e("./object")).loadAsync=e("./load"),n.support=e("./support"),n.defaults=e("./defaults"),n.version="3.10.1",n.loadAsync=function(e,t){return (new n).loadAsync(e,t)},n.external=e("./external"),t.exports=n;},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(e,t,r){var u=e("./utils"),i=e("./external"),n=e("./utf8"),s=e("./zipEntries"),a=e("./stream/Crc32Probe"),l=e("./nodejsUtils");function f(n){return new i.Promise(function(e,t){var r=n.decompressed.getContentWorker().pipe(new a);r.on("error",function(e){t(e);}).on("end",function(){r.streamInfo.crc32!==n.decompressed.crc32?t(new Error("Corrupted zip : CRC32 mismatch")):e();}).resume();})}t.exports=function(e,o){var h=this;return o=u.extend(o||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:n.utf8decode}),l.isNode&&l.isStream(e)?i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")):u.prepareContent("the loaded zip file",e,!0,o.optimizedBinaryString,o.base64).then(function(e){var t=new s(o);return t.load(e),t}).then(function(e){var t=[i.Promise.resolve(e)],r=e.files;if(o.checkCRC32)for(var n=0;n<r.length;n++)t.push(f(r[n]));return i.Promise.all(t)}).then(function(e){for(var t=e.shift(),r=t.files,n=0;n<r.length;n++){var i=r[n],s=i.fileNameStr,a=u.resolve(i.fileNameStr);h.file(a,i.decompressed,{binary:!0,optimizedBinaryString:!0,date:i.date,dir:i.dir,comment:i.fileCommentStr.length?i.fileCommentStr:null,unixPermissions:i.unixPermissions,dosPermissions:i.dosPermissions,createFolders:o.createFolders}),i.dir||(h.file(a).unsafeOriginalName=s);}return t.zipComment.length&&(h.comment=t.zipComment),h})};},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(e,t,r){var n=e("../utils"),i=e("../stream/GenericWorker");function s(e,t){i.call(this,"Nodejs stream input adapter for "+e),this._upstreamEnded=!1,this._bindStream(t);}n.inherits(s,i),s.prototype._bindStream=function(e){var t=this;(this._stream=e).pause(),e.on("data",function(e){t.push({data:e,meta:{percent:0}});}).on("error",function(e){t.isPaused?this.generatedError=e:t.error(e);}).on("end",function(){t.isPaused?t._upstreamEnded=!0:t.end();});},s.prototype.pause=function(){return !!i.prototype.pause.call(this)&&(this._stream.pause(),!0)},s.prototype.resume=function(){return !!i.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},t.exports=s;},{"../stream/GenericWorker":28,"../utils":32}],13:[function(e,t,r){var i=e("readable-stream").Readable;function n(e,t,r){i.call(this,t),this._helper=e;var n=this;e.on("data",function(e,t){n.push(e)||n._helper.pause(),r&&r(t);}).on("error",function(e){n.emit("error",e);}).on("end",function(){n.push(null);});}e("../utils").inherits(n,i),n.prototype._read=function(){this._helper.resume();},t.exports=n;},{"../utils":32,"readable-stream":16}],14:[function(e,t,r){t.exports={isNode:"undefined"!=typeof Buffer,newBufferFrom:function(e,t){if(Buffer.from&&Buffer.from!==Uint8Array.from)return Buffer.from(e,t);if("number"==typeof e)throw new Error('The "data" argument must not be a number');return new Buffer(e,t)},allocBuffer:function(e){if(Buffer.alloc)return Buffer.alloc(e);var t=new Buffer(e);return t.fill(0),t},isBuffer:function(e){return Buffer.isBuffer(e)},isStream:function(e){return e&&"function"==typeof e.on&&"function"==typeof e.pause&&"function"==typeof e.resume}};},{}],15:[function(e,t,r){function s(e,t,r){var n,i=u.getTypeOf(t),s=u.extend(r||{},f);s.date=s.date||new Date,null!==s.compression&&(s.compression=s.compression.toUpperCase()),"string"==typeof s.unixPermissions&&(s.unixPermissions=parseInt(s.unixPermissions,8)),s.unixPermissions&&16384&s.unixPermissions&&(s.dir=!0),s.dosPermissions&&16&s.dosPermissions&&(s.dir=!0),s.dir&&(e=g(e)),s.createFolders&&(n=_(e))&&b.call(this,n,!0);var a="string"===i&&!1===s.binary&&!1===s.base64;r&&void 0!==r.binary||(s.binary=!a),(t instanceof c&&0===t.uncompressedSize||s.dir||!t||0===t.length)&&(s.base64=!1,s.binary=!0,t="",s.compression="STORE",i="string");var o=null;o=t instanceof c||t instanceof l?t:p.isNode&&p.isStream(t)?new m(e,t):u.prepareContent(e,t,s.binary,s.optimizedBinaryString,s.base64);var h=new d(e,o,s);this.files[e]=h;}var i=e("./utf8"),u=e("./utils"),l=e("./stream/GenericWorker"),a=e("./stream/StreamHelper"),f=e("./defaults"),c=e("./compressedObject"),d=e("./zipObject"),o=e("./generate"),p=e("./nodejsUtils"),m=e("./nodejs/NodejsStreamInputAdapter"),_=function(e){"/"===e.slice(-1)&&(e=e.substring(0,e.length-1));var t=e.lastIndexOf("/");return 0<t?e.substring(0,t):""},g=function(e){return "/"!==e.slice(-1)&&(e+="/"),e},b=function(e,t){return t=void 0!==t?t:f.createFolders,e=g(e),this.files[e]||s.call(this,e,null,{dir:!0,createFolders:t}),this.files[e]};function h(e){return "[object RegExp]"===Object.prototype.toString.call(e)}var n={load:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},forEach:function(e){var t,r,n;for(t in this.files)n=this.files[t],(r=t.slice(this.root.length,t.length))&&t.slice(0,this.root.length)===this.root&&e(r,n);},filter:function(r){var n=[];return this.forEach(function(e,t){r(e,t)&&n.push(t);}),n},file:function(e,t,r){if(1!==arguments.length)return e=this.root+e,s.call(this,e,t,r),this;if(h(e)){var n=e;return this.filter(function(e,t){return !t.dir&&n.test(e)})}var i=this.files[this.root+e];return i&&!i.dir?i:null},folder:function(r){if(!r)return this;if(h(r))return this.filter(function(e,t){return t.dir&&r.test(e)});var e=this.root+r,t=b.call(this,e),n=this.clone();return n.root=t.name,n},remove:function(r){r=this.root+r;var e=this.files[r];if(e||("/"!==r.slice(-1)&&(r+="/"),e=this.files[r]),e&&!e.dir)delete this.files[r];else for(var t=this.filter(function(e,t){return t.name.slice(0,r.length)===r}),n=0;n<t.length;n++)delete this.files[t[n].name];return this},generate:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},generateInternalStream:function(e){var t,r={};try{if((r=u.extend(e||{},{streamFiles:!1,compression:"STORE",compressionOptions:null,type:"",platform:"DOS",comment:null,mimeType:"application/zip",encodeFileName:i.utf8encode})).type=r.type.toLowerCase(),r.compression=r.compression.toUpperCase(),"binarystring"===r.type&&(r.type="string"),!r.type)throw new Error("No output type specified.");u.checkSupport(r.type),"darwin"!==r.platform&&"freebsd"!==r.platform&&"linux"!==r.platform&&"sunos"!==r.platform||(r.platform="UNIX"),"win32"===r.platform&&(r.platform="DOS");var n=r.comment||this.comment||"";t=o.generateWorker(this,r,n);}catch(e){(t=new l("error")).error(e);}return new a(t,r.type||"string",r.mimeType)},generateAsync:function(e,t){return this.generateInternalStream(e).accumulate(t)},generateNodeStream:function(e,t){return (e=e||{}).type||(e.type="nodebuffer"),this.generateInternalStream(e).toNodejsStream(t)}};t.exports=n;},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(e,t,r){t.exports=e("stream");},{stream:void 0}],17:[function(e,t,r){var n=e("./DataReader");function i(e){n.call(this,e);for(var t=0;t<this.data.length;t++)e[t]=255&e[t];}e("../utils").inherits(i,n),i.prototype.byteAt=function(e){return this.data[this.zero+e]},i.prototype.lastIndexOfSignature=function(e){for(var t=e.charCodeAt(0),r=e.charCodeAt(1),n=e.charCodeAt(2),i=e.charCodeAt(3),s=this.length-4;0<=s;--s)if(this.data[s]===t&&this.data[s+1]===r&&this.data[s+2]===n&&this.data[s+3]===i)return s-this.zero;return -1},i.prototype.readAndCheckSignature=function(e){var t=e.charCodeAt(0),r=e.charCodeAt(1),n=e.charCodeAt(2),i=e.charCodeAt(3),s=this.readData(4);return t===s[0]&&r===s[1]&&n===s[2]&&i===s[3]},i.prototype.readData=function(e){if(this.checkOffset(e),0===e)return [];var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i;},{"../utils":32,"./DataReader":18}],18:[function(e,t,r){var n=e("../utils");function i(e){this.data=e,this.length=e.length,this.index=0,this.zero=0;}i.prototype={checkOffset:function(e){this.checkIndex(this.index+e);},checkIndex:function(e){if(this.length<this.zero+e||e<0)throw new Error("End of data reached (data length = "+this.length+", asked index = "+e+"). Corrupted zip ?")},setIndex:function(e){this.checkIndex(e),this.index=e;},skip:function(e){this.setIndex(this.index+e);},byteAt:function(){},readInt:function(e){var t,r=0;for(this.checkOffset(e),t=this.index+e-1;t>=this.index;t--)r=(r<<8)+this.byteAt(t);return this.index+=e,r},readString:function(e){return n.transformTo("string",this.readData(e))},readData:function(){},lastIndexOfSignature:function(){},readAndCheckSignature:function(){},readDate:function(){var e=this.readInt(4);return new Date(Date.UTC(1980+(e>>25&127),(e>>21&15)-1,e>>16&31,e>>11&31,e>>5&63,(31&e)<<1))}},t.exports=i;},{"../utils":32}],19:[function(e,t,r){var n=e("./Uint8ArrayReader");function i(e){n.call(this,e);}e("../utils").inherits(i,n),i.prototype.readData=function(e){this.checkOffset(e);var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i;},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(e,t,r){var n=e("./DataReader");function i(e){n.call(this,e);}e("../utils").inherits(i,n),i.prototype.byteAt=function(e){return this.data.charCodeAt(this.zero+e)},i.prototype.lastIndexOfSignature=function(e){return this.data.lastIndexOf(e)-this.zero},i.prototype.readAndCheckSignature=function(e){return e===this.readData(4)},i.prototype.readData=function(e){this.checkOffset(e);var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i;},{"../utils":32,"./DataReader":18}],21:[function(e,t,r){var n=e("./ArrayReader");function i(e){n.call(this,e);}e("../utils").inherits(i,n),i.prototype.readData=function(e){if(this.checkOffset(e),0===e)return new Uint8Array(0);var t=this.data.subarray(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i;},{"../utils":32,"./ArrayReader":17}],22:[function(e,t,r){var n=e("../utils"),i=e("../support"),s=e("./ArrayReader"),a=e("./StringReader"),o=e("./NodeBufferReader"),h=e("./Uint8ArrayReader");t.exports=function(e){var t=n.getTypeOf(e);return n.checkSupport(t),"string"!==t||i.uint8array?"nodebuffer"===t?new o(e):i.uint8array?new h(n.transformTo("uint8array",e)):new s(n.transformTo("array",e)):new a(e)};},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(e,t,r){r.LOCAL_FILE_HEADER="PK",r.CENTRAL_FILE_HEADER="PK",r.CENTRAL_DIRECTORY_END="PK",r.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK",r.ZIP64_CENTRAL_DIRECTORY_END="PK",r.DATA_DESCRIPTOR="PK\b";},{}],24:[function(e,t,r){var n=e("./GenericWorker"),i=e("../utils");function s(e){n.call(this,"ConvertWorker to "+e),this.destType=e;}i.inherits(s,n),s.prototype.processChunk=function(e){this.push({data:i.transformTo(this.destType,e.data),meta:e.meta});},t.exports=s;},{"../utils":32,"./GenericWorker":28}],25:[function(e,t,r){var n=e("./GenericWorker"),i=e("../crc32");function s(){n.call(this,"Crc32Probe"),this.withStreamInfo("crc32",0);}e("../utils").inherits(s,n),s.prototype.processChunk=function(e){this.streamInfo.crc32=i(e.data,this.streamInfo.crc32||0),this.push(e);},t.exports=s;},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(e,t,r){var n=e("../utils"),i=e("./GenericWorker");function s(e){i.call(this,"DataLengthProbe for "+e),this.propName=e,this.withStreamInfo(e,0);}n.inherits(s,i),s.prototype.processChunk=function(e){if(e){var t=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=t+e.data.length;}i.prototype.processChunk.call(this,e);},t.exports=s;},{"../utils":32,"./GenericWorker":28}],27:[function(e,t,r){var n=e("../utils"),i=e("./GenericWorker");function s(e){i.call(this,"DataWorker");var t=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type="",this._tickScheduled=!1,e.then(function(e){t.dataIsReady=!0,t.data=e,t.max=e&&e.length||0,t.type=n.getTypeOf(e),t.isPaused||t._tickAndRepeat();},function(e){t.error(e);});}n.inherits(s,i),s.prototype.cleanUp=function(){i.prototype.cleanUp.call(this),this.data=null;},s.prototype.resume=function(){return !!i.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,n.delay(this._tickAndRepeat,[],this)),!0)},s.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(n.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0));},s.prototype._tick=function(){if(this.isPaused||this.isFinished)return !1;var e=null,t=Math.min(this.max,this.index+16384);if(this.index>=this.max)return this.end();switch(this.type){case"string":e=this.data.substring(this.index,t);break;case"uint8array":e=this.data.subarray(this.index,t);break;case"array":case"nodebuffer":e=this.data.slice(this.index,t);}return this.index=t,this.push({data:e,meta:{percent:this.max?this.index/this.max*100:0}})},t.exports=s;},{"../utils":32,"./GenericWorker":28}],28:[function(e,t,r){function n(e){this.name=e||"default",this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null;}n.prototype={push:function(e){this.emit("data",e);},end:function(){if(this.isFinished)return !1;this.flush();try{this.emit("end"),this.cleanUp(),this.isFinished=!0;}catch(e){this.emit("error",e);}return !0},error:function(e){return !this.isFinished&&(this.isPaused?this.generatedError=e:(this.isFinished=!0,this.emit("error",e),this.previous&&this.previous.error(e),this.cleanUp()),!0)},on:function(e,t){return this._listeners[e].push(t),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[];},emit:function(e,t){if(this._listeners[e])for(var r=0;r<this._listeners[e].length;r++)this._listeners[e][r].call(this,t);},pipe:function(e){return e.registerPrevious(this)},registerPrevious:function(e){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.streamInfo=e.streamInfo,this.mergeStreamInfo(),this.previous=e;var t=this;return e.on("data",function(e){t.processChunk(e);}),e.on("end",function(){t.end();}),e.on("error",function(e){t.error(e);}),this},pause:function(){return !this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return !1;var e=this.isPaused=!1;return this.generatedError&&(this.error(this.generatedError),e=!0),this.previous&&this.previous.resume(),!e},flush:function(){},processChunk:function(e){this.push(e);},withStreamInfo:function(e,t){return this.extraStreamInfo[e]=t,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var e in this.extraStreamInfo)Object.prototype.hasOwnProperty.call(this.extraStreamInfo,e)&&(this.streamInfo[e]=this.extraStreamInfo[e]);},lock:function(){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.isLocked=!0,this.previous&&this.previous.lock();},toString:function(){var e="Worker "+this.name;return this.previous?this.previous+" -> "+e:e}},t.exports=n;},{}],29:[function(e,t,r){var h=e("../utils"),i=e("./ConvertWorker"),s=e("./GenericWorker"),u=e("../base64"),n=e("../support"),a=e("../external"),o=null;if(n.nodestream)try{o=e("../nodejs/NodejsStreamOutputAdapter");}catch(e){}function l(e,o){return new a.Promise(function(t,r){var n=[],i=e._internalType,s=e._outputType,a=e._mimeType;e.on("data",function(e,t){n.push(e),o&&o(t);}).on("error",function(e){n=[],r(e);}).on("end",function(){try{var e=function(e,t,r){switch(e){case"blob":return h.newBlob(h.transformTo("arraybuffer",t),r);case"base64":return u.encode(t);default:return h.transformTo(e,t)}}(s,function(e,t){var r,n=0,i=null,s=0;for(r=0;r<t.length;r++)s+=t[r].length;switch(e){case"string":return t.join("");case"array":return Array.prototype.concat.apply([],t);case"uint8array":for(i=new Uint8Array(s),r=0;r<t.length;r++)i.set(t[r],n),n+=t[r].length;return i;case"nodebuffer":return Buffer.concat(t);default:throw new Error("concat : unsupported type '"+e+"'")}}(i,n),a);t(e);}catch(e){r(e);}n=[];}).resume();})}function f(e,t,r){var n=t;switch(t){case"blob":case"arraybuffer":n="uint8array";break;case"base64":n="string";}try{this._internalType=n,this._outputType=t,this._mimeType=r,h.checkSupport(n),this._worker=e.pipe(new i(n)),e.lock();}catch(e){this._worker=new s("error"),this._worker.error(e);}}f.prototype={accumulate:function(e){return l(this,e)},on:function(e,t){var r=this;return "data"===e?this._worker.on(e,function(e){t.call(r,e.data,e.meta);}):this._worker.on(e,function(){h.delay(t,arguments,r);}),this},resume:function(){return h.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(e){if(h.checkSupport("nodestream"),"nodebuffer"!==this._outputType)throw new Error(this._outputType+" is not supported by this method");return new o(this,{objectMode:"nodebuffer"!==this._outputType},e)}},t.exports=f;},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(e,t,r){if(r.base64=!0,r.array=!0,r.string=!0,r.arraybuffer="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array,r.nodebuffer="undefined"!=typeof Buffer,r.uint8array="undefined"!=typeof Uint8Array,"undefined"==typeof ArrayBuffer)r.blob=!1;else {var n=new ArrayBuffer(0);try{r.blob=0===new Blob([n],{type:"application/zip"}).size;}catch(e){try{var i=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);i.append(n),r.blob=0===i.getBlob("application/zip").size;}catch(e){r.blob=!1;}}}try{r.nodestream=!!e("readable-stream").Readable;}catch(e){r.nodestream=!1;}},{"readable-stream":16}],31:[function(e,t,s){for(var o=e("./utils"),h=e("./support"),r=e("./nodejsUtils"),n=e("./stream/GenericWorker"),u=new Array(256),i=0;i<256;i++)u[i]=252<=i?6:248<=i?5:240<=i?4:224<=i?3:192<=i?2:1;u[254]=u[254]=1;function a(){n.call(this,"utf-8 decode"),this.leftOver=null;}function l(){n.call(this,"utf-8 encode");}s.utf8encode=function(e){return h.nodebuffer?r.newBufferFrom(e,"utf-8"):function(e){var t,r,n,i,s,a=e.length,o=0;for(i=0;i<a;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),o+=r<128?1:r<2048?2:r<65536?3:4;for(t=h.uint8array?new Uint8Array(o):new Array(o),i=s=0;s<o;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),r<128?t[s++]=r:(r<2048?t[s++]=192|r>>>6:(r<65536?t[s++]=224|r>>>12:(t[s++]=240|r>>>18,t[s++]=128|r>>>12&63),t[s++]=128|r>>>6&63),t[s++]=128|63&r);return t}(e)},s.utf8decode=function(e){return h.nodebuffer?o.transformTo("nodebuffer",e).toString("utf-8"):function(e){var t,r,n,i,s=e.length,a=new Array(2*s);for(t=r=0;t<s;)if((n=e[t++])<128)a[r++]=n;else if(4<(i=u[n]))a[r++]=65533,t+=i-1;else {for(n&=2===i?31:3===i?15:7;1<i&&t<s;)n=n<<6|63&e[t++],i--;1<i?a[r++]=65533:n<65536?a[r++]=n:(n-=65536,a[r++]=55296|n>>10&1023,a[r++]=56320|1023&n);}return a.length!==r&&(a.subarray?a=a.subarray(0,r):a.length=r),o.applyFromCharCode(a)}(e=o.transformTo(h.uint8array?"uint8array":"array",e))},o.inherits(a,n),a.prototype.processChunk=function(e){var t=o.transformTo(h.uint8array?"uint8array":"array",e.data);if(this.leftOver&&this.leftOver.length){if(h.uint8array){var r=t;(t=new Uint8Array(r.length+this.leftOver.length)).set(this.leftOver,0),t.set(r,this.leftOver.length);}else t=this.leftOver.concat(t);this.leftOver=null;}var n=function(e,t){var r;for((t=t||e.length)>e.length&&(t=e.length),r=t-1;0<=r&&128==(192&e[r]);)r--;return r<0?t:0===r?t:r+u[e[r]]>t?r:t}(t),i=t;n!==t.length&&(h.uint8array?(i=t.subarray(0,n),this.leftOver=t.subarray(n,t.length)):(i=t.slice(0,n),this.leftOver=t.slice(n,t.length))),this.push({data:s.utf8decode(i),meta:e.meta});},a.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:s.utf8decode(this.leftOver),meta:{}}),this.leftOver=null);},s.Utf8DecodeWorker=a,o.inherits(l,n),l.prototype.processChunk=function(e){this.push({data:s.utf8encode(e.data),meta:e.meta});},s.Utf8EncodeWorker=l;},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(e,t,a){var o=e("./support"),h=e("./base64"),r=e("./nodejsUtils"),u=e("./external");function n(e){return e}function l(e,t){for(var r=0;r<e.length;++r)t[r]=255&e.charCodeAt(r);return t}e("setimmediate"),a.newBlob=function(t,r){a.checkSupport("blob");try{return new Blob([t],{type:r})}catch(e){try{var n=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);return n.append(t),n.getBlob(r)}catch(e){throw new Error("Bug : can't construct the Blob.")}}};var i={stringifyByChunk:function(e,t,r){var n=[],i=0,s=e.length;if(s<=r)return String.fromCharCode.apply(null,e);for(;i<s;)"array"===t||"nodebuffer"===t?n.push(String.fromCharCode.apply(null,e.slice(i,Math.min(i+r,s)))):n.push(String.fromCharCode.apply(null,e.subarray(i,Math.min(i+r,s)))),i+=r;return n.join("")},stringifyByChar:function(e){for(var t="",r=0;r<e.length;r++)t+=String.fromCharCode(e[r]);return t},applyCanBeUsed:{uint8array:function(){try{return o.uint8array&&1===String.fromCharCode.apply(null,new Uint8Array(1)).length}catch(e){return !1}}(),nodebuffer:function(){try{return o.nodebuffer&&1===String.fromCharCode.apply(null,r.allocBuffer(1)).length}catch(e){return !1}}()}};function s(e){var t=65536,r=a.getTypeOf(e),n=!0;if("uint8array"===r?n=i.applyCanBeUsed.uint8array:"nodebuffer"===r&&(n=i.applyCanBeUsed.nodebuffer),n)for(;1<t;)try{return i.stringifyByChunk(e,r,t)}catch(e){t=Math.floor(t/2);}return i.stringifyByChar(e)}function f(e,t){for(var r=0;r<e.length;r++)t[r]=e[r];return t}a.applyFromCharCode=s;var c={};c.string={string:n,array:function(e){return l(e,new Array(e.length))},arraybuffer:function(e){return c.string.uint8array(e).buffer},uint8array:function(e){return l(e,new Uint8Array(e.length))},nodebuffer:function(e){return l(e,r.allocBuffer(e.length))}},c.array={string:s,array:n,arraybuffer:function(e){return new Uint8Array(e).buffer},uint8array:function(e){return new Uint8Array(e)},nodebuffer:function(e){return r.newBufferFrom(e)}},c.arraybuffer={string:function(e){return s(new Uint8Array(e))},array:function(e){return f(new Uint8Array(e),new Array(e.byteLength))},arraybuffer:n,uint8array:function(e){return new Uint8Array(e)},nodebuffer:function(e){return r.newBufferFrom(new Uint8Array(e))}},c.uint8array={string:s,array:function(e){return f(e,new Array(e.length))},arraybuffer:function(e){return e.buffer},uint8array:n,nodebuffer:function(e){return r.newBufferFrom(e)}},c.nodebuffer={string:s,array:function(e){return f(e,new Array(e.length))},arraybuffer:function(e){return c.nodebuffer.uint8array(e).buffer},uint8array:function(e){return f(e,new Uint8Array(e.length))},nodebuffer:n},a.transformTo=function(e,t){if(t=t||"",!e)return t;a.checkSupport(e);var r=a.getTypeOf(t);return c[r][e](t)},a.resolve=function(e){for(var t=e.split("/"),r=[],n=0;n<t.length;n++){var i=t[n];"."===i||""===i&&0!==n&&n!==t.length-1||(".."===i?r.pop():r.push(i));}return r.join("/")},a.getTypeOf=function(e){return "string"==typeof e?"string":"[object Array]"===Object.prototype.toString.call(e)?"array":o.nodebuffer&&r.isBuffer(e)?"nodebuffer":o.uint8array&&e instanceof Uint8Array?"uint8array":o.arraybuffer&&e instanceof ArrayBuffer?"arraybuffer":void 0},a.checkSupport=function(e){if(!o[e.toLowerCase()])throw new Error(e+" is not supported by this platform")},a.MAX_VALUE_16BITS=65535,a.MAX_VALUE_32BITS=-1,a.pretty=function(e){var t,r,n="";for(r=0;r<(e||"").length;r++)n+="\\x"+((t=e.charCodeAt(r))<16?"0":"")+t.toString(16).toUpperCase();return n},a.delay=function(e,t,r){setImmediate(function(){e.apply(r||null,t||[]);});},a.inherits=function(e,t){function r(){}r.prototype=t.prototype,e.prototype=new r;},a.extend=function(){var e,t,r={};for(e=0;e<arguments.length;e++)for(t in arguments[e])Object.prototype.hasOwnProperty.call(arguments[e],t)&&void 0===r[t]&&(r[t]=arguments[e][t]);return r},a.prepareContent=function(r,e,n,i,s){return u.Promise.resolve(e).then(function(n){return o.blob&&(n instanceof Blob||-1!==["[object File]","[object Blob]"].indexOf(Object.prototype.toString.call(n)))&&"undefined"!=typeof FileReader?new u.Promise(function(t,r){var e=new FileReader;e.onload=function(e){t(e.target.result);},e.onerror=function(e){r(e.target.error);},e.readAsArrayBuffer(n);}):n}).then(function(e){var t=a.getTypeOf(e);return t?("arraybuffer"===t?e=a.transformTo("uint8array",e):"string"===t&&(s?e=h.decode(e):n&&!0!==i&&(e=function(e){return l(e,o.uint8array?new Uint8Array(e.length):new Array(e.length))}(e))),e):u.Promise.reject(new Error("Can't read the data of '"+r+"'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"))})};},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,setimmediate:54}],33:[function(e,t,r){var n=e("./reader/readerFor"),i=e("./utils"),s=e("./signature"),a=e("./zipEntry"),o=e("./support");function h(e){this.files=[],this.loadOptions=e;}h.prototype={checkSignature:function(e){if(!this.reader.readAndCheckSignature(e)){this.reader.index-=4;var t=this.reader.readString(4);throw new Error("Corrupted zip or bug: unexpected signature ("+i.pretty(t)+", expected "+i.pretty(e)+")")}},isSignature:function(e,t){var r=this.reader.index;this.reader.setIndex(e);var n=this.reader.readString(4)===t;return this.reader.setIndex(r),n},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var e=this.reader.readData(this.zipCommentLength),t=o.uint8array?"uint8array":"array",r=i.transformTo(t,e);this.zipComment=this.loadOptions.decodeFileName(r);},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var e,t,r,n=this.zip64EndOfCentralSize-44;0<n;)e=this.reader.readInt(2),t=this.reader.readInt(4),r=this.reader.readData(t),this.zip64ExtensibleData[e]={id:e,length:t,value:r};},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),1<this.disksCount)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var e,t;for(e=0;e<this.files.length;e++)t=this.files[e],this.reader.setIndex(t.localHeaderOffset),this.checkSignature(s.LOCAL_FILE_HEADER),t.readLocalPart(this.reader),t.handleUTF8(),t.processAttributes();},readCentralDir:function(){var e;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER);)(e=new a({zip64:this.zip64},this.loadOptions)).readCentralPart(this.reader),this.files.push(e);if(this.centralDirRecords!==this.files.length&&0!==this.centralDirRecords&&0===this.files.length)throw new Error("Corrupted zip or bug: expected "+this.centralDirRecords+" records in central dir, got "+this.files.length)},readEndOfCentral:function(){var e=this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);if(e<0)throw !this.isSignature(0,s.LOCAL_FILE_HEADER)?new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html"):new Error("Corrupted zip: can't find end of central directory");this.reader.setIndex(e);var t=e;if(this.checkSignature(s.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===i.MAX_VALUE_16BITS||this.diskWithCentralDirStart===i.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===i.MAX_VALUE_16BITS||this.centralDirRecords===i.MAX_VALUE_16BITS||this.centralDirSize===i.MAX_VALUE_32BITS||this.centralDirOffset===i.MAX_VALUE_32BITS){if(this.zip64=!0,(e=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR))<0)throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");if(this.reader.setIndex(e),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,s.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral();}var r=this.centralDirOffset+this.centralDirSize;this.zip64&&(r+=20,r+=12+this.zip64EndOfCentralSize);var n=t-r;if(0<n)this.isSignature(t,s.CENTRAL_FILE_HEADER)||(this.reader.zero=n);else if(n<0)throw new Error("Corrupted zip: missing "+Math.abs(n)+" bytes.")},prepareReader:function(e){this.reader=n(e);},load:function(e){this.prepareReader(e),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles();}},t.exports=h;},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utils":32,"./zipEntry":34}],34:[function(e,t,r){var n=e("./reader/readerFor"),s=e("./utils"),i=e("./compressedObject"),a=e("./crc32"),o=e("./utf8"),h=e("./compressions"),u=e("./support");function l(e,t){this.options=e,this.loadOptions=t;}l.prototype={isEncrypted:function(){return 1==(1&this.bitFlag)},useUTF8:function(){return 2048==(2048&this.bitFlag)},readLocalPart:function(e){var t,r;if(e.skip(22),this.fileNameLength=e.readInt(2),r=e.readInt(2),this.fileName=e.readData(this.fileNameLength),e.skip(r),-1===this.compressedSize||-1===this.uncompressedSize)throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");if(null===(t=function(e){for(var t in h)if(Object.prototype.hasOwnProperty.call(h,t)&&h[t].magic===e)return h[t];return null}(this.compressionMethod)))throw new Error("Corrupted zip : compression "+s.pretty(this.compressionMethod)+" unknown (inner file : "+s.transformTo("string",this.fileName)+")");this.decompressed=new i(this.compressedSize,this.uncompressedSize,this.crc32,t,e.readData(this.compressedSize));},readCentralPart:function(e){this.versionMadeBy=e.readInt(2),e.skip(2),this.bitFlag=e.readInt(2),this.compressionMethod=e.readString(2),this.date=e.readDate(),this.crc32=e.readInt(4),this.compressedSize=e.readInt(4),this.uncompressedSize=e.readInt(4);var t=e.readInt(2);if(this.extraFieldsLength=e.readInt(2),this.fileCommentLength=e.readInt(2),this.diskNumberStart=e.readInt(2),this.internalFileAttributes=e.readInt(2),this.externalFileAttributes=e.readInt(4),this.localHeaderOffset=e.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");e.skip(t),this.readExtraFields(e),this.parseZIP64ExtraField(e),this.fileComment=e.readData(this.fileCommentLength);},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var e=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),0==e&&(this.dosPermissions=63&this.externalFileAttributes),3==e&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||"/"!==this.fileNameStr.slice(-1)||(this.dir=!0);},parseZIP64ExtraField:function(){if(this.extraFields[1]){var e=n(this.extraFields[1].value);this.uncompressedSize===s.MAX_VALUE_32BITS&&(this.uncompressedSize=e.readInt(8)),this.compressedSize===s.MAX_VALUE_32BITS&&(this.compressedSize=e.readInt(8)),this.localHeaderOffset===s.MAX_VALUE_32BITS&&(this.localHeaderOffset=e.readInt(8)),this.diskNumberStart===s.MAX_VALUE_32BITS&&(this.diskNumberStart=e.readInt(4));}},readExtraFields:function(e){var t,r,n,i=e.index+this.extraFieldsLength;for(this.extraFields||(this.extraFields={});e.index+4<i;)t=e.readInt(2),r=e.readInt(2),n=e.readData(r),this.extraFields[t]={id:t,length:r,value:n};e.setIndex(i);},handleUTF8:function(){var e=u.uint8array?"uint8array":"array";if(this.useUTF8())this.fileNameStr=o.utf8decode(this.fileName),this.fileCommentStr=o.utf8decode(this.fileComment);else {var t=this.findExtraFieldUnicodePath();if(null!==t)this.fileNameStr=t;else {var r=s.transformTo(e,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(r);}var n=this.findExtraFieldUnicodeComment();if(null!==n)this.fileCommentStr=n;else {var i=s.transformTo(e,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(i);}}},findExtraFieldUnicodePath:function(){var e=this.extraFields[28789];if(e){var t=n(e.value);return 1!==t.readInt(1)?null:a(this.fileName)!==t.readInt(4)?null:o.utf8decode(t.readData(e.length-5))}return null},findExtraFieldUnicodeComment:function(){var e=this.extraFields[25461];if(e){var t=n(e.value);return 1!==t.readInt(1)?null:a(this.fileComment)!==t.readInt(4)?null:o.utf8decode(t.readData(e.length-5))}return null}},t.exports=l;},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(e,t,r){function n(e,t,r){this.name=e,this.dir=r.dir,this.date=r.date,this.comment=r.comment,this.unixPermissions=r.unixPermissions,this.dosPermissions=r.dosPermissions,this._data=t,this._dataBinary=r.binary,this.options={compression:r.compression,compressionOptions:r.compressionOptions};}var s=e("./stream/StreamHelper"),i=e("./stream/DataWorker"),a=e("./utf8"),o=e("./compressedObject"),h=e("./stream/GenericWorker");n.prototype={internalStream:function(e){var t=null,r="string";try{if(!e)throw new Error("No output type specified.");var n="string"===(r=e.toLowerCase())||"text"===r;"binarystring"!==r&&"text"!==r||(r="string"),t=this._decompressWorker();var i=!this._dataBinary;i&&!n&&(t=t.pipe(new a.Utf8EncodeWorker)),!i&&n&&(t=t.pipe(new a.Utf8DecodeWorker));}catch(e){(t=new h("error")).error(e);}return new s(t,r,"")},async:function(e,t){return this.internalStream(e).accumulate(t)},nodeStream:function(e,t){return this.internalStream(e||"nodebuffer").toNodejsStream(t)},_compressWorker:function(e,t){if(this._data instanceof o&&this._data.compression.magic===e.magic)return this._data.getCompressedWorker();var r=this._decompressWorker();return this._dataBinary||(r=r.pipe(new a.Utf8EncodeWorker)),o.createWorkerFrom(r,e,t)},_decompressWorker:function(){return this._data instanceof o?this._data.getContentWorker():this._data instanceof h?this._data:new i(this._data)}};for(var u=["asText","asBinary","asNodeBuffer","asUint8Array","asArrayBuffer"],l=function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},f=0;f<u.length;f++)n.prototype[u[f]]=l;t.exports=n;},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(e,l,t){(function(t){var r,n,e=t.MutationObserver||t.WebKitMutationObserver;if(e){var i=0,s=new e(u),a=t.document.createTextNode("");s.observe(a,{characterData:!0}),r=function(){a.data=i=++i%2;};}else if(t.setImmediate||void 0===t.MessageChannel)r="document"in t&&"onreadystatechange"in t.document.createElement("script")?function(){var e=t.document.createElement("script");e.onreadystatechange=function(){u(),e.onreadystatechange=null,e.parentNode.removeChild(e),e=null;},t.document.documentElement.appendChild(e);}:function(){setTimeout(u,0);};else {var o=new t.MessageChannel;o.port1.onmessage=u,r=function(){o.port2.postMessage(0);};}var h=[];function u(){var e,t;n=!0;for(var r=h.length;r;){for(t=h,h=[],e=-1;++e<r;)t[e]();r=h.length;}n=!1;}l.exports=function(e){1!==h.push(e)||n||r();};}).call(this,"undefined"!=typeof commonjsGlobal?commonjsGlobal:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});},{}],37:[function(e,t,r){var i=e("immediate");function u(){}var l={},s=["REJECTED"],a=["FULFILLED"],n=["PENDING"];function o(e){if("function"!=typeof e)throw new TypeError("resolver must be a function");this.state=n,this.queue=[],this.outcome=void 0,e!==u&&d(this,e);}function h(e,t,r){this.promise=e,"function"==typeof t&&(this.onFulfilled=t,this.callFulfilled=this.otherCallFulfilled),"function"==typeof r&&(this.onRejected=r,this.callRejected=this.otherCallRejected);}function f(t,r,n){i(function(){var e;try{e=r(n);}catch(e){return l.reject(t,e)}e===t?l.reject(t,new TypeError("Cannot resolve promise with itself")):l.resolve(t,e);});}function c(e){var t=e&&e.then;if(e&&("object"==typeof e||"function"==typeof e)&&"function"==typeof t)return function(){t.apply(e,arguments);}}function d(t,e){var r=!1;function n(e){r||(r=!0,l.reject(t,e));}function i(e){r||(r=!0,l.resolve(t,e));}var s=p(function(){e(i,n);});"error"===s.status&&n(s.value);}function p(e,t){var r={};try{r.value=e(t),r.status="success";}catch(e){r.status="error",r.value=e;}return r}(t.exports=o).prototype.finally=function(t){if("function"!=typeof t)return this;var r=this.constructor;return this.then(function(e){return r.resolve(t()).then(function(){return e})},function(e){return r.resolve(t()).then(function(){throw e})})},o.prototype.catch=function(e){return this.then(null,e)},o.prototype.then=function(e,t){if("function"!=typeof e&&this.state===a||"function"!=typeof t&&this.state===s)return this;var r=new this.constructor(u);this.state!==n?f(r,this.state===a?e:t,this.outcome):this.queue.push(new h(r,e,t));return r},h.prototype.callFulfilled=function(e){l.resolve(this.promise,e);},h.prototype.otherCallFulfilled=function(e){f(this.promise,this.onFulfilled,e);},h.prototype.callRejected=function(e){l.reject(this.promise,e);},h.prototype.otherCallRejected=function(e){f(this.promise,this.onRejected,e);},l.resolve=function(e,t){var r=p(c,t);if("error"===r.status)return l.reject(e,r.value);var n=r.value;if(n)d(e,n);else {e.state=a,e.outcome=t;for(var i=-1,s=e.queue.length;++i<s;)e.queue[i].callFulfilled(t);}return e},l.reject=function(e,t){e.state=s,e.outcome=t;for(var r=-1,n=e.queue.length;++r<n;)e.queue[r].callRejected(t);return e},o.resolve=function(e){if(e instanceof this)return e;return l.resolve(new this(u),e)},o.reject=function(e){var t=new this(u);return l.reject(t,e)},o.all=function(e){var r=this;if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var n=e.length,i=!1;if(!n)return this.resolve([]);var s=new Array(n),a=0,t=-1,o=new this(u);for(;++t<n;)h(e[t],t);return o;function h(e,t){r.resolve(e).then(function(e){s[t]=e,++a!==n||i||(i=!0,l.resolve(o,s));},function(e){i||(i=!0,l.reject(o,e));});}},o.race=function(e){var t=this;if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var r=e.length,n=!1;if(!r)return this.resolve([]);var i=-1,s=new this(u);for(;++i<r;)a=e[i],t.resolve(a).then(function(e){n||(n=!0,l.resolve(s,e));},function(e){n||(n=!0,l.reject(s,e));});var a;return s};},{immediate:36}],38:[function(e,t,r){var n={};(0, e("./lib/utils/common").assign)(n,e("./lib/deflate"),e("./lib/inflate"),e("./lib/zlib/constants")),t.exports=n;},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(e,t,r){var a=e("./zlib/deflate"),o=e("./utils/common"),h=e("./utils/strings"),i=e("./zlib/messages"),s=e("./zlib/zstream"),u=Object.prototype.toString,l=0,f=-1,c=0,d=8;function p(e){if(!(this instanceof p))return new p(e);this.options=o.assign({level:f,method:d,chunkSize:16384,windowBits:15,memLevel:8,strategy:c,to:""},e||{});var t=this.options;t.raw&&0<t.windowBits?t.windowBits=-t.windowBits:t.gzip&&0<t.windowBits&&t.windowBits<16&&(t.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new s,this.strm.avail_out=0;var r=a.deflateInit2(this.strm,t.level,t.method,t.windowBits,t.memLevel,t.strategy);if(r!==l)throw new Error(i[r]);if(t.header&&a.deflateSetHeader(this.strm,t.header),t.dictionary){var n;if(n="string"==typeof t.dictionary?h.string2buf(t.dictionary):"[object ArrayBuffer]"===u.call(t.dictionary)?new Uint8Array(t.dictionary):t.dictionary,(r=a.deflateSetDictionary(this.strm,n))!==l)throw new Error(i[r]);this._dict_set=!0;}}function n(e,t){var r=new p(t);if(r.push(e,!0),r.err)throw r.msg||i[r.err];return r.result}p.prototype.push=function(e,t){var r,n,i=this.strm,s=this.options.chunkSize;if(this.ended)return !1;n=t===~~t?t:!0===t?4:0,"string"==typeof e?i.input=h.string2buf(e):"[object ArrayBuffer]"===u.call(e)?i.input=new Uint8Array(e):i.input=e,i.next_in=0,i.avail_in=i.input.length;do{if(0===i.avail_out&&(i.output=new o.Buf8(s),i.next_out=0,i.avail_out=s),1!==(r=a.deflate(i,n))&&r!==l)return this.onEnd(r),!(this.ended=!0);0!==i.avail_out&&(0!==i.avail_in||4!==n&&2!==n)||("string"===this.options.to?this.onData(h.buf2binstring(o.shrinkBuf(i.output,i.next_out))):this.onData(o.shrinkBuf(i.output,i.next_out)));}while((0<i.avail_in||0===i.avail_out)&&1!==r);return 4===n?(r=a.deflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===l):2!==n||(this.onEnd(l),!(i.avail_out=0))},p.prototype.onData=function(e){this.chunks.push(e);},p.prototype.onEnd=function(e){e===l&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=o.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg;},r.Deflate=p,r.deflate=n,r.deflateRaw=function(e,t){return (t=t||{}).raw=!0,n(e,t)},r.gzip=function(e,t){return (t=t||{}).gzip=!0,n(e,t)};},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(e,t,r){var c=e("./zlib/inflate"),d=e("./utils/common"),p=e("./utils/strings"),m=e("./zlib/constants"),n=e("./zlib/messages"),i=e("./zlib/zstream"),s=e("./zlib/gzheader"),_=Object.prototype.toString;function a(e){if(!(this instanceof a))return new a(e);this.options=d.assign({chunkSize:16384,windowBits:0,to:""},e||{});var t=this.options;t.raw&&0<=t.windowBits&&t.windowBits<16&&(t.windowBits=-t.windowBits,0===t.windowBits&&(t.windowBits=-15)),!(0<=t.windowBits&&t.windowBits<16)||e&&e.windowBits||(t.windowBits+=32),15<t.windowBits&&t.windowBits<48&&0==(15&t.windowBits)&&(t.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new i,this.strm.avail_out=0;var r=c.inflateInit2(this.strm,t.windowBits);if(r!==m.Z_OK)throw new Error(n[r]);this.header=new s,c.inflateGetHeader(this.strm,this.header);}function o(e,t){var r=new a(t);if(r.push(e,!0),r.err)throw r.msg||n[r.err];return r.result}a.prototype.push=function(e,t){var r,n,i,s,a,o,h=this.strm,u=this.options.chunkSize,l=this.options.dictionary,f=!1;if(this.ended)return !1;n=t===~~t?t:!0===t?m.Z_FINISH:m.Z_NO_FLUSH,"string"==typeof e?h.input=p.binstring2buf(e):"[object ArrayBuffer]"===_.call(e)?h.input=new Uint8Array(e):h.input=e,h.next_in=0,h.avail_in=h.input.length;do{if(0===h.avail_out&&(h.output=new d.Buf8(u),h.next_out=0,h.avail_out=u),(r=c.inflate(h,m.Z_NO_FLUSH))===m.Z_NEED_DICT&&l&&(o="string"==typeof l?p.string2buf(l):"[object ArrayBuffer]"===_.call(l)?new Uint8Array(l):l,r=c.inflateSetDictionary(this.strm,o)),r===m.Z_BUF_ERROR&&!0===f&&(r=m.Z_OK,f=!1),r!==m.Z_STREAM_END&&r!==m.Z_OK)return this.onEnd(r),!(this.ended=!0);h.next_out&&(0!==h.avail_out&&r!==m.Z_STREAM_END&&(0!==h.avail_in||n!==m.Z_FINISH&&n!==m.Z_SYNC_FLUSH)||("string"===this.options.to?(i=p.utf8border(h.output,h.next_out),s=h.next_out-i,a=p.buf2string(h.output,i),h.next_out=s,h.avail_out=u-s,s&&d.arraySet(h.output,h.output,i,s,0),this.onData(a)):this.onData(d.shrinkBuf(h.output,h.next_out)))),0===h.avail_in&&0===h.avail_out&&(f=!0);}while((0<h.avail_in||0===h.avail_out)&&r!==m.Z_STREAM_END);return r===m.Z_STREAM_END&&(n=m.Z_FINISH),n===m.Z_FINISH?(r=c.inflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===m.Z_OK):n!==m.Z_SYNC_FLUSH||(this.onEnd(m.Z_OK),!(h.avail_out=0))},a.prototype.onData=function(e){this.chunks.push(e);},a.prototype.onEnd=function(e){e===m.Z_OK&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=d.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg;},r.Inflate=a,r.inflate=o,r.inflateRaw=function(e,t){return (t=t||{}).raw=!0,o(e,t)},r.ungzip=o;},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(e,t,r){var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;r.assign=function(e){for(var t=Array.prototype.slice.call(arguments,1);t.length;){var r=t.shift();if(r){if("object"!=typeof r)throw new TypeError(r+"must be non-object");for(var n in r)r.hasOwnProperty(n)&&(e[n]=r[n]);}}return e},r.shrinkBuf=function(e,t){return e.length===t?e:e.subarray?e.subarray(0,t):(e.length=t,e)};var i={arraySet:function(e,t,r,n,i){if(t.subarray&&e.subarray)e.set(t.subarray(r,r+n),i);else for(var s=0;s<n;s++)e[i+s]=t[r+s];},flattenChunks:function(e){var t,r,n,i,s,a;for(t=n=0,r=e.length;t<r;t++)n+=e[t].length;for(a=new Uint8Array(n),t=i=0,r=e.length;t<r;t++)s=e[t],a.set(s,i),i+=s.length;return a}},s={arraySet:function(e,t,r,n,i){for(var s=0;s<n;s++)e[i+s]=t[r+s];},flattenChunks:function(e){return [].concat.apply([],e)}};r.setTyped=function(e){e?(r.Buf8=Uint8Array,r.Buf16=Uint16Array,r.Buf32=Int32Array,r.assign(r,i)):(r.Buf8=Array,r.Buf16=Array,r.Buf32=Array,r.assign(r,s));},r.setTyped(n);},{}],42:[function(e,t,r){var h=e("./common"),i=!0,s=!0;try{String.fromCharCode.apply(null,[0]);}catch(e){i=!1;}try{String.fromCharCode.apply(null,new Uint8Array(1));}catch(e){s=!1;}for(var u=new h.Buf8(256),n=0;n<256;n++)u[n]=252<=n?6:248<=n?5:240<=n?4:224<=n?3:192<=n?2:1;function l(e,t){if(t<65537&&(e.subarray&&s||!e.subarray&&i))return String.fromCharCode.apply(null,h.shrinkBuf(e,t));for(var r="",n=0;n<t;n++)r+=String.fromCharCode(e[n]);return r}u[254]=u[254]=1,r.string2buf=function(e){var t,r,n,i,s,a=e.length,o=0;for(i=0;i<a;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),o+=r<128?1:r<2048?2:r<65536?3:4;for(t=new h.Buf8(o),i=s=0;s<o;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),r<128?t[s++]=r:(r<2048?t[s++]=192|r>>>6:(r<65536?t[s++]=224|r>>>12:(t[s++]=240|r>>>18,t[s++]=128|r>>>12&63),t[s++]=128|r>>>6&63),t[s++]=128|63&r);return t},r.buf2binstring=function(e){return l(e,e.length)},r.binstring2buf=function(e){for(var t=new h.Buf8(e.length),r=0,n=t.length;r<n;r++)t[r]=e.charCodeAt(r);return t},r.buf2string=function(e,t){var r,n,i,s,a=t||e.length,o=new Array(2*a);for(r=n=0;r<a;)if((i=e[r++])<128)o[n++]=i;else if(4<(s=u[i]))o[n++]=65533,r+=s-1;else {for(i&=2===s?31:3===s?15:7;1<s&&r<a;)i=i<<6|63&e[r++],s--;1<s?o[n++]=65533:i<65536?o[n++]=i:(i-=65536,o[n++]=55296|i>>10&1023,o[n++]=56320|1023&i);}return l(o,n)},r.utf8border=function(e,t){var r;for((t=t||e.length)>e.length&&(t=e.length),r=t-1;0<=r&&128==(192&e[r]);)r--;return r<0?t:0===r?t:r+u[e[r]]>t?r:t};},{"./common":41}],43:[function(e,t,r){t.exports=function(e,t,r,n){for(var i=65535&e|0,s=e>>>16&65535|0,a=0;0!==r;){for(r-=a=2e3<r?2e3:r;s=s+(i=i+t[n++]|0)|0,--a;);i%=65521,s%=65521;}return i|s<<16|0};},{}],44:[function(e,t,r){t.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8};},{}],45:[function(e,t,r){var o=function(){for(var e,t=[],r=0;r<256;r++){e=r;for(var n=0;n<8;n++)e=1&e?3988292384^e>>>1:e>>>1;t[r]=e;}return t}();t.exports=function(e,t,r,n){var i=o,s=n+r;e^=-1;for(var a=n;a<s;a++)e=e>>>8^i[255&(e^t[a])];return -1^e};},{}],46:[function(e,t,r){var h,c=e("../utils/common"),u=e("./trees"),d=e("./adler32"),p=e("./crc32"),n=e("./messages"),l=0,f=4,m=0,_=-2,g=-1,b=4,i=2,v=8,y=9,s=286,a=30,o=19,w=2*s+1,k=15,x=3,S=258,z=S+x+1,C=42,E=113,A=1,I=2,O=3,B=4;function R(e,t){return e.msg=n[t],t}function T(e){return (e<<1)-(4<e?9:0)}function D(e){for(var t=e.length;0<=--t;)e[t]=0;}function F(e){var t=e.state,r=t.pending;r>e.avail_out&&(r=e.avail_out),0!==r&&(c.arraySet(e.output,t.pending_buf,t.pending_out,r,e.next_out),e.next_out+=r,t.pending_out+=r,e.total_out+=r,e.avail_out-=r,t.pending-=r,0===t.pending&&(t.pending_out=0));}function N(e,t){u._tr_flush_block(e,0<=e.block_start?e.block_start:-1,e.strstart-e.block_start,t),e.block_start=e.strstart,F(e.strm);}function U(e,t){e.pending_buf[e.pending++]=t;}function P(e,t){e.pending_buf[e.pending++]=t>>>8&255,e.pending_buf[e.pending++]=255&t;}function L(e,t){var r,n,i=e.max_chain_length,s=e.strstart,a=e.prev_length,o=e.nice_match,h=e.strstart>e.w_size-z?e.strstart-(e.w_size-z):0,u=e.window,l=e.w_mask,f=e.prev,c=e.strstart+S,d=u[s+a-1],p=u[s+a];e.prev_length>=e.good_match&&(i>>=2),o>e.lookahead&&(o=e.lookahead);do{if(u[(r=t)+a]===p&&u[r+a-1]===d&&u[r]===u[s]&&u[++r]===u[s+1]){s+=2,r++;do{}while(u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&s<c);if(n=S-(c-s),s=c-S,a<n){if(e.match_start=t,o<=(a=n))break;d=u[s+a-1],p=u[s+a];}}}while((t=f[t&l])>h&&0!=--i);return a<=e.lookahead?a:e.lookahead}function j(e){var t,r,n,i,s,a,o,h,u,l,f=e.w_size;do{if(i=e.window_size-e.lookahead-e.strstart,e.strstart>=f+(f-z)){for(c.arraySet(e.window,e.window,f,f,0),e.match_start-=f,e.strstart-=f,e.block_start-=f,t=r=e.hash_size;n=e.head[--t],e.head[t]=f<=n?n-f:0,--r;);for(t=r=f;n=e.prev[--t],e.prev[t]=f<=n?n-f:0,--r;);i+=f;}if(0===e.strm.avail_in)break;if(a=e.strm,o=e.window,h=e.strstart+e.lookahead,u=i,l=void 0,l=a.avail_in,u<l&&(l=u),r=0===l?0:(a.avail_in-=l,c.arraySet(o,a.input,a.next_in,l,h),1===a.state.wrap?a.adler=d(a.adler,o,l,h):2===a.state.wrap&&(a.adler=p(a.adler,o,l,h)),a.next_in+=l,a.total_in+=l,l),e.lookahead+=r,e.lookahead+e.insert>=x)for(s=e.strstart-e.insert,e.ins_h=e.window[s],e.ins_h=(e.ins_h<<e.hash_shift^e.window[s+1])&e.hash_mask;e.insert&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[s+x-1])&e.hash_mask,e.prev[s&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=s,s++,e.insert--,!(e.lookahead+e.insert<x)););}while(e.lookahead<z&&0!==e.strm.avail_in)}function Z(e,t){for(var r,n;;){if(e.lookahead<z){if(j(e),e.lookahead<z&&t===l)return A;if(0===e.lookahead)break}if(r=0,e.lookahead>=x&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+x-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),0!==r&&e.strstart-r<=e.w_size-z&&(e.match_length=L(e,r)),e.match_length>=x)if(n=u._tr_tally(e,e.strstart-e.match_start,e.match_length-x),e.lookahead-=e.match_length,e.match_length<=e.max_lazy_match&&e.lookahead>=x){for(e.match_length--;e.strstart++,e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+x-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart,0!=--e.match_length;);e.strstart++;}else e.strstart+=e.match_length,e.match_length=0,e.ins_h=e.window[e.strstart],e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+1])&e.hash_mask;else n=u._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++;if(n&&(N(e,!1),0===e.strm.avail_out))return A}return e.insert=e.strstart<x-1?e.strstart:x-1,t===f?(N(e,!0),0===e.strm.avail_out?O:B):e.last_lit&&(N(e,!1),0===e.strm.avail_out)?A:I}function W(e,t){for(var r,n,i;;){if(e.lookahead<z){if(j(e),e.lookahead<z&&t===l)return A;if(0===e.lookahead)break}if(r=0,e.lookahead>=x&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+x-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),e.prev_length=e.match_length,e.prev_match=e.match_start,e.match_length=x-1,0!==r&&e.prev_length<e.max_lazy_match&&e.strstart-r<=e.w_size-z&&(e.match_length=L(e,r),e.match_length<=5&&(1===e.strategy||e.match_length===x&&4096<e.strstart-e.match_start)&&(e.match_length=x-1)),e.prev_length>=x&&e.match_length<=e.prev_length){for(i=e.strstart+e.lookahead-x,n=u._tr_tally(e,e.strstart-1-e.prev_match,e.prev_length-x),e.lookahead-=e.prev_length-1,e.prev_length-=2;++e.strstart<=i&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+x-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),0!=--e.prev_length;);if(e.match_available=0,e.match_length=x-1,e.strstart++,n&&(N(e,!1),0===e.strm.avail_out))return A}else if(e.match_available){if((n=u._tr_tally(e,0,e.window[e.strstart-1]))&&N(e,!1),e.strstart++,e.lookahead--,0===e.strm.avail_out)return A}else e.match_available=1,e.strstart++,e.lookahead--;}return e.match_available&&(n=u._tr_tally(e,0,e.window[e.strstart-1]),e.match_available=0),e.insert=e.strstart<x-1?e.strstart:x-1,t===f?(N(e,!0),0===e.strm.avail_out?O:B):e.last_lit&&(N(e,!1),0===e.strm.avail_out)?A:I}function M(e,t,r,n,i){this.good_length=e,this.max_lazy=t,this.nice_length=r,this.max_chain=n,this.func=i;}function H(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=v,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new c.Buf16(2*w),this.dyn_dtree=new c.Buf16(2*(2*a+1)),this.bl_tree=new c.Buf16(2*(2*o+1)),D(this.dyn_ltree),D(this.dyn_dtree),D(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new c.Buf16(k+1),this.heap=new c.Buf16(2*s+1),D(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new c.Buf16(2*s+1),D(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0;}function G(e){var t;return e&&e.state?(e.total_in=e.total_out=0,e.data_type=i,(t=e.state).pending=0,t.pending_out=0,t.wrap<0&&(t.wrap=-t.wrap),t.status=t.wrap?C:E,e.adler=2===t.wrap?0:1,t.last_flush=l,u._tr_init(t),m):R(e,_)}function K(e){var t=G(e);return t===m&&function(e){e.window_size=2*e.w_size,D(e.head),e.max_lazy_match=h[e.level].max_lazy,e.good_match=h[e.level].good_length,e.nice_match=h[e.level].nice_length,e.max_chain_length=h[e.level].max_chain,e.strstart=0,e.block_start=0,e.lookahead=0,e.insert=0,e.match_length=e.prev_length=x-1,e.match_available=0,e.ins_h=0;}(e.state),t}function Y(e,t,r,n,i,s){if(!e)return _;var a=1;if(t===g&&(t=6),n<0?(a=0,n=-n):15<n&&(a=2,n-=16),i<1||y<i||r!==v||n<8||15<n||t<0||9<t||s<0||b<s)return R(e,_);8===n&&(n=9);var o=new H;return (e.state=o).strm=e,o.wrap=a,o.gzhead=null,o.w_bits=n,o.w_size=1<<o.w_bits,o.w_mask=o.w_size-1,o.hash_bits=i+7,o.hash_size=1<<o.hash_bits,o.hash_mask=o.hash_size-1,o.hash_shift=~~((o.hash_bits+x-1)/x),o.window=new c.Buf8(2*o.w_size),o.head=new c.Buf16(o.hash_size),o.prev=new c.Buf16(o.w_size),o.lit_bufsize=1<<i+6,o.pending_buf_size=4*o.lit_bufsize,o.pending_buf=new c.Buf8(o.pending_buf_size),o.d_buf=1*o.lit_bufsize,o.l_buf=3*o.lit_bufsize,o.level=t,o.strategy=s,o.method=r,K(e)}h=[new M(0,0,0,0,function(e,t){var r=65535;for(r>e.pending_buf_size-5&&(r=e.pending_buf_size-5);;){if(e.lookahead<=1){if(j(e),0===e.lookahead&&t===l)return A;if(0===e.lookahead)break}e.strstart+=e.lookahead,e.lookahead=0;var n=e.block_start+r;if((0===e.strstart||e.strstart>=n)&&(e.lookahead=e.strstart-n,e.strstart=n,N(e,!1),0===e.strm.avail_out))return A;if(e.strstart-e.block_start>=e.w_size-z&&(N(e,!1),0===e.strm.avail_out))return A}return e.insert=0,t===f?(N(e,!0),0===e.strm.avail_out?O:B):(e.strstart>e.block_start&&(N(e,!1),e.strm.avail_out),A)}),new M(4,4,8,4,Z),new M(4,5,16,8,Z),new M(4,6,32,32,Z),new M(4,4,16,16,W),new M(8,16,32,32,W),new M(8,16,128,128,W),new M(8,32,128,256,W),new M(32,128,258,1024,W),new M(32,258,258,4096,W)],r.deflateInit=function(e,t){return Y(e,t,v,15,8,0)},r.deflateInit2=Y,r.deflateReset=K,r.deflateResetKeep=G,r.deflateSetHeader=function(e,t){return e&&e.state?2!==e.state.wrap?_:(e.state.gzhead=t,m):_},r.deflate=function(e,t){var r,n,i,s;if(!e||!e.state||5<t||t<0)return e?R(e,_):_;if(n=e.state,!e.output||!e.input&&0!==e.avail_in||666===n.status&&t!==f)return R(e,0===e.avail_out?-5:_);if(n.strm=e,r=n.last_flush,n.last_flush=t,n.status===C)if(2===n.wrap)e.adler=0,U(n,31),U(n,139),U(n,8),n.gzhead?(U(n,(n.gzhead.text?1:0)+(n.gzhead.hcrc?2:0)+(n.gzhead.extra?4:0)+(n.gzhead.name?8:0)+(n.gzhead.comment?16:0)),U(n,255&n.gzhead.time),U(n,n.gzhead.time>>8&255),U(n,n.gzhead.time>>16&255),U(n,n.gzhead.time>>24&255),U(n,9===n.level?2:2<=n.strategy||n.level<2?4:0),U(n,255&n.gzhead.os),n.gzhead.extra&&n.gzhead.extra.length&&(U(n,255&n.gzhead.extra.length),U(n,n.gzhead.extra.length>>8&255)),n.gzhead.hcrc&&(e.adler=p(e.adler,n.pending_buf,n.pending,0)),n.gzindex=0,n.status=69):(U(n,0),U(n,0),U(n,0),U(n,0),U(n,0),U(n,9===n.level?2:2<=n.strategy||n.level<2?4:0),U(n,3),n.status=E);else {var a=v+(n.w_bits-8<<4)<<8;a|=(2<=n.strategy||n.level<2?0:n.level<6?1:6===n.level?2:3)<<6,0!==n.strstart&&(a|=32),a+=31-a%31,n.status=E,P(n,a),0!==n.strstart&&(P(n,e.adler>>>16),P(n,65535&e.adler)),e.adler=1;}if(69===n.status)if(n.gzhead.extra){for(i=n.pending;n.gzindex<(65535&n.gzhead.extra.length)&&(n.pending!==n.pending_buf_size||(n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),F(e),i=n.pending,n.pending!==n.pending_buf_size));)U(n,255&n.gzhead.extra[n.gzindex]),n.gzindex++;n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),n.gzindex===n.gzhead.extra.length&&(n.gzindex=0,n.status=73);}else n.status=73;if(73===n.status)if(n.gzhead.name){i=n.pending;do{if(n.pending===n.pending_buf_size&&(n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),F(e),i=n.pending,n.pending===n.pending_buf_size)){s=1;break}s=n.gzindex<n.gzhead.name.length?255&n.gzhead.name.charCodeAt(n.gzindex++):0,U(n,s);}while(0!==s);n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),0===s&&(n.gzindex=0,n.status=91);}else n.status=91;if(91===n.status)if(n.gzhead.comment){i=n.pending;do{if(n.pending===n.pending_buf_size&&(n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),F(e),i=n.pending,n.pending===n.pending_buf_size)){s=1;break}s=n.gzindex<n.gzhead.comment.length?255&n.gzhead.comment.charCodeAt(n.gzindex++):0,U(n,s);}while(0!==s);n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),0===s&&(n.status=103);}else n.status=103;if(103===n.status&&(n.gzhead.hcrc?(n.pending+2>n.pending_buf_size&&F(e),n.pending+2<=n.pending_buf_size&&(U(n,255&e.adler),U(n,e.adler>>8&255),e.adler=0,n.status=E)):n.status=E),0!==n.pending){if(F(e),0===e.avail_out)return n.last_flush=-1,m}else if(0===e.avail_in&&T(t)<=T(r)&&t!==f)return R(e,-5);if(666===n.status&&0!==e.avail_in)return R(e,-5);if(0!==e.avail_in||0!==n.lookahead||t!==l&&666!==n.status){var o=2===n.strategy?function(e,t){for(var r;;){if(0===e.lookahead&&(j(e),0===e.lookahead)){if(t===l)return A;break}if(e.match_length=0,r=u._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++,r&&(N(e,!1),0===e.strm.avail_out))return A}return e.insert=0,t===f?(N(e,!0),0===e.strm.avail_out?O:B):e.last_lit&&(N(e,!1),0===e.strm.avail_out)?A:I}(n,t):3===n.strategy?function(e,t){for(var r,n,i,s,a=e.window;;){if(e.lookahead<=S){if(j(e),e.lookahead<=S&&t===l)return A;if(0===e.lookahead)break}if(e.match_length=0,e.lookahead>=x&&0<e.strstart&&(n=a[i=e.strstart-1])===a[++i]&&n===a[++i]&&n===a[++i]){s=e.strstart+S;do{}while(n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&i<s);e.match_length=S-(s-i),e.match_length>e.lookahead&&(e.match_length=e.lookahead);}if(e.match_length>=x?(r=u._tr_tally(e,1,e.match_length-x),e.lookahead-=e.match_length,e.strstart+=e.match_length,e.match_length=0):(r=u._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++),r&&(N(e,!1),0===e.strm.avail_out))return A}return e.insert=0,t===f?(N(e,!0),0===e.strm.avail_out?O:B):e.last_lit&&(N(e,!1),0===e.strm.avail_out)?A:I}(n,t):h[n.level].func(n,t);if(o!==O&&o!==B||(n.status=666),o===A||o===O)return 0===e.avail_out&&(n.last_flush=-1),m;if(o===I&&(1===t?u._tr_align(n):5!==t&&(u._tr_stored_block(n,0,0,!1),3===t&&(D(n.head),0===n.lookahead&&(n.strstart=0,n.block_start=0,n.insert=0))),F(e),0===e.avail_out))return n.last_flush=-1,m}return t!==f?m:n.wrap<=0?1:(2===n.wrap?(U(n,255&e.adler),U(n,e.adler>>8&255),U(n,e.adler>>16&255),U(n,e.adler>>24&255),U(n,255&e.total_in),U(n,e.total_in>>8&255),U(n,e.total_in>>16&255),U(n,e.total_in>>24&255)):(P(n,e.adler>>>16),P(n,65535&e.adler)),F(e),0<n.wrap&&(n.wrap=-n.wrap),0!==n.pending?m:1)},r.deflateEnd=function(e){var t;return e&&e.state?(t=e.state.status)!==C&&69!==t&&73!==t&&91!==t&&103!==t&&t!==E&&666!==t?R(e,_):(e.state=null,t===E?R(e,-3):m):_},r.deflateSetDictionary=function(e,t){var r,n,i,s,a,o,h,u,l=t.length;if(!e||!e.state)return _;if(2===(s=(r=e.state).wrap)||1===s&&r.status!==C||r.lookahead)return _;for(1===s&&(e.adler=d(e.adler,t,l,0)),r.wrap=0,l>=r.w_size&&(0===s&&(D(r.head),r.strstart=0,r.block_start=0,r.insert=0),u=new c.Buf8(r.w_size),c.arraySet(u,t,l-r.w_size,r.w_size,0),t=u,l=r.w_size),a=e.avail_in,o=e.next_in,h=e.input,e.avail_in=l,e.next_in=0,e.input=t,j(r);r.lookahead>=x;){for(n=r.strstart,i=r.lookahead-(x-1);r.ins_h=(r.ins_h<<r.hash_shift^r.window[n+x-1])&r.hash_mask,r.prev[n&r.w_mask]=r.head[r.ins_h],r.head[r.ins_h]=n,n++,--i;);r.strstart=n,r.lookahead=x-1,j(r);}return r.strstart+=r.lookahead,r.block_start=r.strstart,r.insert=r.lookahead,r.lookahead=0,r.match_length=r.prev_length=x-1,r.match_available=0,e.next_in=o,e.input=h,e.avail_in=a,r.wrap=s,m},r.deflateInfo="pako deflate (from Nodeca project)";},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(e,t,r){t.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1;};},{}],48:[function(e,t,r){t.exports=function(e,t){var r,n,i,s,a,o,h,u,l,f,c,d,p,m,_,g,b,v,y,w,k,x,S,z,C;r=e.state,n=e.next_in,z=e.input,i=n+(e.avail_in-5),s=e.next_out,C=e.output,a=s-(t-e.avail_out),o=s+(e.avail_out-257),h=r.dmax,u=r.wsize,l=r.whave,f=r.wnext,c=r.window,d=r.hold,p=r.bits,m=r.lencode,_=r.distcode,g=(1<<r.lenbits)-1,b=(1<<r.distbits)-1;e:do{p<15&&(d+=z[n++]<<p,p+=8,d+=z[n++]<<p,p+=8),v=m[d&g];t:for(;;){if(d>>>=y=v>>>24,p-=y,0===(y=v>>>16&255))C[s++]=65535&v;else {if(!(16&y)){if(0==(64&y)){v=m[(65535&v)+(d&(1<<y)-1)];continue t}if(32&y){r.mode=12;break e}e.msg="invalid literal/length code",r.mode=30;break e}w=65535&v,(y&=15)&&(p<y&&(d+=z[n++]<<p,p+=8),w+=d&(1<<y)-1,d>>>=y,p-=y),p<15&&(d+=z[n++]<<p,p+=8,d+=z[n++]<<p,p+=8),v=_[d&b];r:for(;;){if(d>>>=y=v>>>24,p-=y,!(16&(y=v>>>16&255))){if(0==(64&y)){v=_[(65535&v)+(d&(1<<y)-1)];continue r}e.msg="invalid distance code",r.mode=30;break e}if(k=65535&v,p<(y&=15)&&(d+=z[n++]<<p,(p+=8)<y&&(d+=z[n++]<<p,p+=8)),h<(k+=d&(1<<y)-1)){e.msg="invalid distance too far back",r.mode=30;break e}if(d>>>=y,p-=y,(y=s-a)<k){if(l<(y=k-y)&&r.sane){e.msg="invalid distance too far back",r.mode=30;break e}if(S=c,(x=0)===f){if(x+=u-y,y<w){for(w-=y;C[s++]=c[x++],--y;);x=s-k,S=C;}}else if(f<y){if(x+=u+f-y,(y-=f)<w){for(w-=y;C[s++]=c[x++],--y;);if(x=0,f<w){for(w-=y=f;C[s++]=c[x++],--y;);x=s-k,S=C;}}}else if(x+=f-y,y<w){for(w-=y;C[s++]=c[x++],--y;);x=s-k,S=C;}for(;2<w;)C[s++]=S[x++],C[s++]=S[x++],C[s++]=S[x++],w-=3;w&&(C[s++]=S[x++],1<w&&(C[s++]=S[x++]));}else {for(x=s-k;C[s++]=C[x++],C[s++]=C[x++],C[s++]=C[x++],2<(w-=3););w&&(C[s++]=C[x++],1<w&&(C[s++]=C[x++]));}break}}break}}while(n<i&&s<o);n-=w=p>>3,d&=(1<<(p-=w<<3))-1,e.next_in=n,e.next_out=s,e.avail_in=n<i?i-n+5:5-(n-i),e.avail_out=s<o?o-s+257:257-(s-o),r.hold=d,r.bits=p;};},{}],49:[function(e,t,r){var I=e("../utils/common"),O=e("./adler32"),B=e("./crc32"),R=e("./inffast"),T=e("./inftrees"),D=1,F=2,N=0,U=-2,P=1,n=852,i=592;function L(e){return (e>>>24&255)+(e>>>8&65280)+((65280&e)<<8)+((255&e)<<24)}function s(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new I.Buf16(320),this.work=new I.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0;}function a(e){var t;return e&&e.state?(t=e.state,e.total_in=e.total_out=t.total=0,e.msg="",t.wrap&&(e.adler=1&t.wrap),t.mode=P,t.last=0,t.havedict=0,t.dmax=32768,t.head=null,t.hold=0,t.bits=0,t.lencode=t.lendyn=new I.Buf32(n),t.distcode=t.distdyn=new I.Buf32(i),t.sane=1,t.back=-1,N):U}function o(e){var t;return e&&e.state?((t=e.state).wsize=0,t.whave=0,t.wnext=0,a(e)):U}function h(e,t){var r,n;return e&&e.state?(n=e.state,t<0?(r=0,t=-t):(r=1+(t>>4),t<48&&(t&=15)),t&&(t<8||15<t)?U:(null!==n.window&&n.wbits!==t&&(n.window=null),n.wrap=r,n.wbits=t,o(e))):U}function u(e,t){var r,n;return e?(n=new s,(e.state=n).window=null,(r=h(e,t))!==N&&(e.state=null),r):U}var l,f,c=!0;function j(e){if(c){var t;for(l=new I.Buf32(512),f=new I.Buf32(32),t=0;t<144;)e.lens[t++]=8;for(;t<256;)e.lens[t++]=9;for(;t<280;)e.lens[t++]=7;for(;t<288;)e.lens[t++]=8;for(T(D,e.lens,0,288,l,0,e.work,{bits:9}),t=0;t<32;)e.lens[t++]=5;T(F,e.lens,0,32,f,0,e.work,{bits:5}),c=!1;}e.lencode=l,e.lenbits=9,e.distcode=f,e.distbits=5;}function Z(e,t,r,n){var i,s=e.state;return null===s.window&&(s.wsize=1<<s.wbits,s.wnext=0,s.whave=0,s.window=new I.Buf8(s.wsize)),n>=s.wsize?(I.arraySet(s.window,t,r-s.wsize,s.wsize,0),s.wnext=0,s.whave=s.wsize):(n<(i=s.wsize-s.wnext)&&(i=n),I.arraySet(s.window,t,r-n,i,s.wnext),(n-=i)?(I.arraySet(s.window,t,r-n,n,0),s.wnext=n,s.whave=s.wsize):(s.wnext+=i,s.wnext===s.wsize&&(s.wnext=0),s.whave<s.wsize&&(s.whave+=i))),0}r.inflateReset=o,r.inflateReset2=h,r.inflateResetKeep=a,r.inflateInit=function(e){return u(e,15)},r.inflateInit2=u,r.inflate=function(e,t){var r,n,i,s,a,o,h,u,l,f,c,d,p,m,_,g,b,v,y,w,k,x,S,z,C=0,E=new I.Buf8(4),A=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!e||!e.state||!e.output||!e.input&&0!==e.avail_in)return U;12===(r=e.state).mode&&(r.mode=13),a=e.next_out,i=e.output,h=e.avail_out,s=e.next_in,n=e.input,o=e.avail_in,u=r.hold,l=r.bits,f=o,c=h,x=N;e:for(;;)switch(r.mode){case P:if(0===r.wrap){r.mode=13;break}for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}if(2&r.wrap&&35615===u){E[r.check=0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0),l=u=0,r.mode=2;break}if(r.flags=0,r.head&&(r.head.done=!1),!(1&r.wrap)||(((255&u)<<8)+(u>>8))%31){e.msg="incorrect header check",r.mode=30;break}if(8!=(15&u)){e.msg="unknown compression method",r.mode=30;break}if(l-=4,k=8+(15&(u>>>=4)),0===r.wbits)r.wbits=k;else if(k>r.wbits){e.msg="invalid window size",r.mode=30;break}r.dmax=1<<k,e.adler=r.check=1,r.mode=512&u?10:12,l=u=0;break;case 2:for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}if(r.flags=u,8!=(255&r.flags)){e.msg="unknown compression method",r.mode=30;break}if(57344&r.flags){e.msg="unknown header flags set",r.mode=30;break}r.head&&(r.head.text=u>>8&1),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0,r.mode=3;case 3:for(;l<32;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}r.head&&(r.head.time=u),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,E[2]=u>>>16&255,E[3]=u>>>24&255,r.check=B(r.check,E,4,0)),l=u=0,r.mode=4;case 4:for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}r.head&&(r.head.xflags=255&u,r.head.os=u>>8),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0,r.mode=5;case 5:if(1024&r.flags){for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}r.length=u,r.head&&(r.head.extra_len=u),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0;}else r.head&&(r.head.extra=null);r.mode=6;case 6:if(1024&r.flags&&(o<(d=r.length)&&(d=o),d&&(r.head&&(k=r.head.extra_len-r.length,r.head.extra||(r.head.extra=new Array(r.head.extra_len)),I.arraySet(r.head.extra,n,s,d,k)),512&r.flags&&(r.check=B(r.check,n,d,s)),o-=d,s+=d,r.length-=d),r.length))break e;r.length=0,r.mode=7;case 7:if(2048&r.flags){if(0===o)break e;for(d=0;k=n[s+d++],r.head&&k&&r.length<65536&&(r.head.name+=String.fromCharCode(k)),k&&d<o;);if(512&r.flags&&(r.check=B(r.check,n,d,s)),o-=d,s+=d,k)break e}else r.head&&(r.head.name=null);r.length=0,r.mode=8;case 8:if(4096&r.flags){if(0===o)break e;for(d=0;k=n[s+d++],r.head&&k&&r.length<65536&&(r.head.comment+=String.fromCharCode(k)),k&&d<o;);if(512&r.flags&&(r.check=B(r.check,n,d,s)),o-=d,s+=d,k)break e}else r.head&&(r.head.comment=null);r.mode=9;case 9:if(512&r.flags){for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}if(u!==(65535&r.check)){e.msg="header crc mismatch",r.mode=30;break}l=u=0;}r.head&&(r.head.hcrc=r.flags>>9&1,r.head.done=!0),e.adler=r.check=0,r.mode=12;break;case 10:for(;l<32;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}e.adler=r.check=L(u),l=u=0,r.mode=11;case 11:if(0===r.havedict)return e.next_out=a,e.avail_out=h,e.next_in=s,e.avail_in=o,r.hold=u,r.bits=l,2;e.adler=r.check=1,r.mode=12;case 12:if(5===t||6===t)break e;case 13:if(r.last){u>>>=7&l,l-=7&l,r.mode=27;break}for(;l<3;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}switch(r.last=1&u,l-=1,3&(u>>>=1)){case 0:r.mode=14;break;case 1:if(j(r),r.mode=20,6!==t)break;u>>>=2,l-=2;break e;case 2:r.mode=17;break;case 3:e.msg="invalid block type",r.mode=30;}u>>>=2,l-=2;break;case 14:for(u>>>=7&l,l-=7&l;l<32;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}if((65535&u)!=(u>>>16^65535)){e.msg="invalid stored block lengths",r.mode=30;break}if(r.length=65535&u,l=u=0,r.mode=15,6===t)break e;case 15:r.mode=16;case 16:if(d=r.length){if(o<d&&(d=o),h<d&&(d=h),0===d)break e;I.arraySet(i,n,s,d,a),o-=d,s+=d,h-=d,a+=d,r.length-=d;break}r.mode=12;break;case 17:for(;l<14;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}if(r.nlen=257+(31&u),u>>>=5,l-=5,r.ndist=1+(31&u),u>>>=5,l-=5,r.ncode=4+(15&u),u>>>=4,l-=4,286<r.nlen||30<r.ndist){e.msg="too many length or distance symbols",r.mode=30;break}r.have=0,r.mode=18;case 18:for(;r.have<r.ncode;){for(;l<3;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}r.lens[A[r.have++]]=7&u,u>>>=3,l-=3;}for(;r.have<19;)r.lens[A[r.have++]]=0;if(r.lencode=r.lendyn,r.lenbits=7,S={bits:r.lenbits},x=T(0,r.lens,0,19,r.lencode,0,r.work,S),r.lenbits=S.bits,x){e.msg="invalid code lengths set",r.mode=30;break}r.have=0,r.mode=19;case 19:for(;r.have<r.nlen+r.ndist;){for(;g=(C=r.lencode[u&(1<<r.lenbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}if(b<16)u>>>=_,l-=_,r.lens[r.have++]=b;else {if(16===b){for(z=_+2;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}if(u>>>=_,l-=_,0===r.have){e.msg="invalid bit length repeat",r.mode=30;break}k=r.lens[r.have-1],d=3+(3&u),u>>>=2,l-=2;}else if(17===b){for(z=_+3;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}l-=_,k=0,d=3+(7&(u>>>=_)),u>>>=3,l-=3;}else {for(z=_+7;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}l-=_,k=0,d=11+(127&(u>>>=_)),u>>>=7,l-=7;}if(r.have+d>r.nlen+r.ndist){e.msg="invalid bit length repeat",r.mode=30;break}for(;d--;)r.lens[r.have++]=k;}}if(30===r.mode)break;if(0===r.lens[256]){e.msg="invalid code -- missing end-of-block",r.mode=30;break}if(r.lenbits=9,S={bits:r.lenbits},x=T(D,r.lens,0,r.nlen,r.lencode,0,r.work,S),r.lenbits=S.bits,x){e.msg="invalid literal/lengths set",r.mode=30;break}if(r.distbits=6,r.distcode=r.distdyn,S={bits:r.distbits},x=T(F,r.lens,r.nlen,r.ndist,r.distcode,0,r.work,S),r.distbits=S.bits,x){e.msg="invalid distances set",r.mode=30;break}if(r.mode=20,6===t)break e;case 20:r.mode=21;case 21:if(6<=o&&258<=h){e.next_out=a,e.avail_out=h,e.next_in=s,e.avail_in=o,r.hold=u,r.bits=l,R(e,c),a=e.next_out,i=e.output,h=e.avail_out,s=e.next_in,n=e.input,o=e.avail_in,u=r.hold,l=r.bits,12===r.mode&&(r.back=-1);break}for(r.back=0;g=(C=r.lencode[u&(1<<r.lenbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}if(g&&0==(240&g)){for(v=_,y=g,w=b;g=(C=r.lencode[w+((u&(1<<v+y)-1)>>v)])>>>16&255,b=65535&C,!(v+(_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}u>>>=v,l-=v,r.back+=v;}if(u>>>=_,l-=_,r.back+=_,r.length=b,0===g){r.mode=26;break}if(32&g){r.back=-1,r.mode=12;break}if(64&g){e.msg="invalid literal/length code",r.mode=30;break}r.extra=15&g,r.mode=22;case 22:if(r.extra){for(z=r.extra;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}r.length+=u&(1<<r.extra)-1,u>>>=r.extra,l-=r.extra,r.back+=r.extra;}r.was=r.length,r.mode=23;case 23:for(;g=(C=r.distcode[u&(1<<r.distbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}if(0==(240&g)){for(v=_,y=g,w=b;g=(C=r.distcode[w+((u&(1<<v+y)-1)>>v)])>>>16&255,b=65535&C,!(v+(_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}u>>>=v,l-=v,r.back+=v;}if(u>>>=_,l-=_,r.back+=_,64&g){e.msg="invalid distance code",r.mode=30;break}r.offset=b,r.extra=15&g,r.mode=24;case 24:if(r.extra){for(z=r.extra;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}r.offset+=u&(1<<r.extra)-1,u>>>=r.extra,l-=r.extra,r.back+=r.extra;}if(r.offset>r.dmax){e.msg="invalid distance too far back",r.mode=30;break}r.mode=25;case 25:if(0===h)break e;if(d=c-h,r.offset>d){if((d=r.offset-d)>r.whave&&r.sane){e.msg="invalid distance too far back",r.mode=30;break}p=d>r.wnext?(d-=r.wnext,r.wsize-d):r.wnext-d,d>r.length&&(d=r.length),m=r.window;}else m=i,p=a-r.offset,d=r.length;for(h<d&&(d=h),h-=d,r.length-=d;i[a++]=m[p++],--d;);0===r.length&&(r.mode=21);break;case 26:if(0===h)break e;i[a++]=r.length,h--,r.mode=21;break;case 27:if(r.wrap){for(;l<32;){if(0===o)break e;o--,u|=n[s++]<<l,l+=8;}if(c-=h,e.total_out+=c,r.total+=c,c&&(e.adler=r.check=r.flags?B(r.check,i,c,a-c):O(r.check,i,c,a-c)),c=h,(r.flags?u:L(u))!==r.check){e.msg="incorrect data check",r.mode=30;break}l=u=0;}r.mode=28;case 28:if(r.wrap&&r.flags){for(;l<32;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}if(u!==(4294967295&r.total)){e.msg="incorrect length check",r.mode=30;break}l=u=0;}r.mode=29;case 29:x=1;break e;case 30:x=-3;break e;case 31:return -4;case 32:default:return U}return e.next_out=a,e.avail_out=h,e.next_in=s,e.avail_in=o,r.hold=u,r.bits=l,(r.wsize||c!==e.avail_out&&r.mode<30&&(r.mode<27||4!==t))&&Z(e,e.output,e.next_out,c-e.avail_out)?(r.mode=31,-4):(f-=e.avail_in,c-=e.avail_out,e.total_in+=f,e.total_out+=c,r.total+=c,r.wrap&&c&&(e.adler=r.check=r.flags?B(r.check,i,c,e.next_out-c):O(r.check,i,c,e.next_out-c)),e.data_type=r.bits+(r.last?64:0)+(12===r.mode?128:0)+(20===r.mode||15===r.mode?256:0),(0==f&&0===c||4===t)&&x===N&&(x=-5),x)},r.inflateEnd=function(e){if(!e||!e.state)return U;var t=e.state;return t.window&&(t.window=null),e.state=null,N},r.inflateGetHeader=function(e,t){var r;return e&&e.state?0==(2&(r=e.state).wrap)?U:((r.head=t).done=!1,N):U},r.inflateSetDictionary=function(e,t){var r,n=t.length;return e&&e.state?0!==(r=e.state).wrap&&11!==r.mode?U:11===r.mode&&O(1,t,n,0)!==r.check?-3:Z(e,t,n,n)?(r.mode=31,-4):(r.havedict=1,N):U},r.inflateInfo="pako inflate (from Nodeca project)";},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(e,t,r){var D=e("../utils/common"),F=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],N=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],U=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],P=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];t.exports=function(e,t,r,n,i,s,a,o){var h,u,l,f,c,d,p,m,_,g=o.bits,b=0,v=0,y=0,w=0,k=0,x=0,S=0,z=0,C=0,E=0,A=null,I=0,O=new D.Buf16(16),B=new D.Buf16(16),R=null,T=0;for(b=0;b<=15;b++)O[b]=0;for(v=0;v<n;v++)O[t[r+v]]++;for(k=g,w=15;1<=w&&0===O[w];w--);if(w<k&&(k=w),0===w)return i[s++]=20971520,i[s++]=20971520,o.bits=1,0;for(y=1;y<w&&0===O[y];y++);for(k<y&&(k=y),b=z=1;b<=15;b++)if(z<<=1,(z-=O[b])<0)return -1;if(0<z&&(0===e||1!==w))return -1;for(B[1]=0,b=1;b<15;b++)B[b+1]=B[b]+O[b];for(v=0;v<n;v++)0!==t[r+v]&&(a[B[t[r+v]]++]=v);if(d=0===e?(A=R=a,19):1===e?(A=F,I-=257,R=N,T-=257,256):(A=U,R=P,-1),b=y,c=s,S=v=E=0,l=-1,f=(C=1<<(x=k))-1,1===e&&852<C||2===e&&592<C)return 1;for(;;){for(p=b-S,_=a[v]<d?(m=0,a[v]):a[v]>d?(m=R[T+a[v]],A[I+a[v]]):(m=96,0),h=1<<b-S,y=u=1<<x;i[c+(E>>S)+(u-=h)]=p<<24|m<<16|_|0,0!==u;);for(h=1<<b-1;E&h;)h>>=1;if(0!==h?(E&=h-1,E+=h):E=0,v++,0==--O[b]){if(b===w)break;b=t[r+a[v]];}if(k<b&&(E&f)!==l){for(0===S&&(S=k),c+=y,z=1<<(x=b-S);x+S<w&&!((z-=O[x+S])<=0);)x++,z<<=1;if(C+=1<<x,1===e&&852<C||2===e&&592<C)return 1;i[l=E&f]=k<<24|x<<16|c-s|0;}}return 0!==E&&(i[c+E]=b-S<<24|64<<16|0),o.bits=k,0};},{"../utils/common":41}],51:[function(e,t,r){t.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"};},{}],52:[function(e,t,r){var i=e("../utils/common"),o=0,h=1;function n(e){for(var t=e.length;0<=--t;)e[t]=0;}var s=0,a=29,u=256,l=u+1+a,f=30,c=19,_=2*l+1,g=15,d=16,p=7,m=256,b=16,v=17,y=18,w=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],k=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],x=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],S=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],z=new Array(2*(l+2));n(z);var C=new Array(2*f);n(C);var E=new Array(512);n(E);var A=new Array(256);n(A);var I=new Array(a);n(I);var O,B,R,T=new Array(f);function D(e,t,r,n,i){this.static_tree=e,this.extra_bits=t,this.extra_base=r,this.elems=n,this.max_length=i,this.has_stree=e&&e.length;}function F(e,t){this.dyn_tree=e,this.max_code=0,this.stat_desc=t;}function N(e){return e<256?E[e]:E[256+(e>>>7)]}function U(e,t){e.pending_buf[e.pending++]=255&t,e.pending_buf[e.pending++]=t>>>8&255;}function P(e,t,r){e.bi_valid>d-r?(e.bi_buf|=t<<e.bi_valid&65535,U(e,e.bi_buf),e.bi_buf=t>>d-e.bi_valid,e.bi_valid+=r-d):(e.bi_buf|=t<<e.bi_valid&65535,e.bi_valid+=r);}function L(e,t,r){P(e,r[2*t],r[2*t+1]);}function j(e,t){for(var r=0;r|=1&e,e>>>=1,r<<=1,0<--t;);return r>>>1}function Z(e,t,r){var n,i,s=new Array(g+1),a=0;for(n=1;n<=g;n++)s[n]=a=a+r[n-1]<<1;for(i=0;i<=t;i++){var o=e[2*i+1];0!==o&&(e[2*i]=j(s[o]++,o));}}function W(e){var t;for(t=0;t<l;t++)e.dyn_ltree[2*t]=0;for(t=0;t<f;t++)e.dyn_dtree[2*t]=0;for(t=0;t<c;t++)e.bl_tree[2*t]=0;e.dyn_ltree[2*m]=1,e.opt_len=e.static_len=0,e.last_lit=e.matches=0;}function M(e){8<e.bi_valid?U(e,e.bi_buf):0<e.bi_valid&&(e.pending_buf[e.pending++]=e.bi_buf),e.bi_buf=0,e.bi_valid=0;}function H(e,t,r,n){var i=2*t,s=2*r;return e[i]<e[s]||e[i]===e[s]&&n[t]<=n[r]}function G(e,t,r){for(var n=e.heap[r],i=r<<1;i<=e.heap_len&&(i<e.heap_len&&H(t,e.heap[i+1],e.heap[i],e.depth)&&i++,!H(t,n,e.heap[i],e.depth));)e.heap[r]=e.heap[i],r=i,i<<=1;e.heap[r]=n;}function K(e,t,r){var n,i,s,a,o=0;if(0!==e.last_lit)for(;n=e.pending_buf[e.d_buf+2*o]<<8|e.pending_buf[e.d_buf+2*o+1],i=e.pending_buf[e.l_buf+o],o++,0===n?L(e,i,t):(L(e,(s=A[i])+u+1,t),0!==(a=w[s])&&P(e,i-=I[s],a),L(e,s=N(--n),r),0!==(a=k[s])&&P(e,n-=T[s],a)),o<e.last_lit;);L(e,m,t);}function Y(e,t){var r,n,i,s=t.dyn_tree,a=t.stat_desc.static_tree,o=t.stat_desc.has_stree,h=t.stat_desc.elems,u=-1;for(e.heap_len=0,e.heap_max=_,r=0;r<h;r++)0!==s[2*r]?(e.heap[++e.heap_len]=u=r,e.depth[r]=0):s[2*r+1]=0;for(;e.heap_len<2;)s[2*(i=e.heap[++e.heap_len]=u<2?++u:0)]=1,e.depth[i]=0,e.opt_len--,o&&(e.static_len-=a[2*i+1]);for(t.max_code=u,r=e.heap_len>>1;1<=r;r--)G(e,s,r);for(i=h;r=e.heap[1],e.heap[1]=e.heap[e.heap_len--],G(e,s,1),n=e.heap[1],e.heap[--e.heap_max]=r,e.heap[--e.heap_max]=n,s[2*i]=s[2*r]+s[2*n],e.depth[i]=(e.depth[r]>=e.depth[n]?e.depth[r]:e.depth[n])+1,s[2*r+1]=s[2*n+1]=i,e.heap[1]=i++,G(e,s,1),2<=e.heap_len;);e.heap[--e.heap_max]=e.heap[1],function(e,t){var r,n,i,s,a,o,h=t.dyn_tree,u=t.max_code,l=t.stat_desc.static_tree,f=t.stat_desc.has_stree,c=t.stat_desc.extra_bits,d=t.stat_desc.extra_base,p=t.stat_desc.max_length,m=0;for(s=0;s<=g;s++)e.bl_count[s]=0;for(h[2*e.heap[e.heap_max]+1]=0,r=e.heap_max+1;r<_;r++)p<(s=h[2*h[2*(n=e.heap[r])+1]+1]+1)&&(s=p,m++),h[2*n+1]=s,u<n||(e.bl_count[s]++,a=0,d<=n&&(a=c[n-d]),o=h[2*n],e.opt_len+=o*(s+a),f&&(e.static_len+=o*(l[2*n+1]+a)));if(0!==m){do{for(s=p-1;0===e.bl_count[s];)s--;e.bl_count[s]--,e.bl_count[s+1]+=2,e.bl_count[p]--,m-=2;}while(0<m);for(s=p;0!==s;s--)for(n=e.bl_count[s];0!==n;)u<(i=e.heap[--r])||(h[2*i+1]!==s&&(e.opt_len+=(s-h[2*i+1])*h[2*i],h[2*i+1]=s),n--);}}(e,t),Z(s,u,e.bl_count);}function X(e,t,r){var n,i,s=-1,a=t[1],o=0,h=7,u=4;for(0===a&&(h=138,u=3),t[2*(r+1)+1]=65535,n=0;n<=r;n++)i=a,a=t[2*(n+1)+1],++o<h&&i===a||(o<u?e.bl_tree[2*i]+=o:0!==i?(i!==s&&e.bl_tree[2*i]++,e.bl_tree[2*b]++):o<=10?e.bl_tree[2*v]++:e.bl_tree[2*y]++,s=i,u=(o=0)===a?(h=138,3):i===a?(h=6,3):(h=7,4));}function V(e,t,r){var n,i,s=-1,a=t[1],o=0,h=7,u=4;for(0===a&&(h=138,u=3),n=0;n<=r;n++)if(i=a,a=t[2*(n+1)+1],!(++o<h&&i===a)){if(o<u)for(;L(e,i,e.bl_tree),0!=--o;);else 0!==i?(i!==s&&(L(e,i,e.bl_tree),o--),L(e,b,e.bl_tree),P(e,o-3,2)):o<=10?(L(e,v,e.bl_tree),P(e,o-3,3)):(L(e,y,e.bl_tree),P(e,o-11,7));s=i,u=(o=0)===a?(h=138,3):i===a?(h=6,3):(h=7,4);}}n(T);var q=!1;function J(e,t,r,n){P(e,(s<<1)+(n?1:0),3),function(e,t,r,n){M(e),n&&(U(e,r),U(e,~r)),i.arraySet(e.pending_buf,e.window,t,r,e.pending),e.pending+=r;}(e,t,r,!0);}r._tr_init=function(e){q||(function(){var e,t,r,n,i,s=new Array(g+1);for(n=r=0;n<a-1;n++)for(I[n]=r,e=0;e<1<<w[n];e++)A[r++]=n;for(A[r-1]=n,n=i=0;n<16;n++)for(T[n]=i,e=0;e<1<<k[n];e++)E[i++]=n;for(i>>=7;n<f;n++)for(T[n]=i<<7,e=0;e<1<<k[n]-7;e++)E[256+i++]=n;for(t=0;t<=g;t++)s[t]=0;for(e=0;e<=143;)z[2*e+1]=8,e++,s[8]++;for(;e<=255;)z[2*e+1]=9,e++,s[9]++;for(;e<=279;)z[2*e+1]=7,e++,s[7]++;for(;e<=287;)z[2*e+1]=8,e++,s[8]++;for(Z(z,l+1,s),e=0;e<f;e++)C[2*e+1]=5,C[2*e]=j(e,5);O=new D(z,w,u+1,l,g),B=new D(C,k,0,f,g),R=new D(new Array(0),x,0,c,p);}(),q=!0),e.l_desc=new F(e.dyn_ltree,O),e.d_desc=new F(e.dyn_dtree,B),e.bl_desc=new F(e.bl_tree,R),e.bi_buf=0,e.bi_valid=0,W(e);},r._tr_stored_block=J,r._tr_flush_block=function(e,t,r,n){var i,s,a=0;0<e.level?(2===e.strm.data_type&&(e.strm.data_type=function(e){var t,r=4093624447;for(t=0;t<=31;t++,r>>>=1)if(1&r&&0!==e.dyn_ltree[2*t])return o;if(0!==e.dyn_ltree[18]||0!==e.dyn_ltree[20]||0!==e.dyn_ltree[26])return h;for(t=32;t<u;t++)if(0!==e.dyn_ltree[2*t])return h;return o}(e)),Y(e,e.l_desc),Y(e,e.d_desc),a=function(e){var t;for(X(e,e.dyn_ltree,e.l_desc.max_code),X(e,e.dyn_dtree,e.d_desc.max_code),Y(e,e.bl_desc),t=c-1;3<=t&&0===e.bl_tree[2*S[t]+1];t--);return e.opt_len+=3*(t+1)+5+5+4,t}(e),i=e.opt_len+3+7>>>3,(s=e.static_len+3+7>>>3)<=i&&(i=s)):i=s=r+5,r+4<=i&&-1!==t?J(e,t,r,n):4===e.strategy||s===i?(P(e,2+(n?1:0),3),K(e,z,C)):(P(e,4+(n?1:0),3),function(e,t,r,n){var i;for(P(e,t-257,5),P(e,r-1,5),P(e,n-4,4),i=0;i<n;i++)P(e,e.bl_tree[2*S[i]+1],3);V(e,e.dyn_ltree,t-1),V(e,e.dyn_dtree,r-1);}(e,e.l_desc.max_code+1,e.d_desc.max_code+1,a+1),K(e,e.dyn_ltree,e.dyn_dtree)),W(e),n&&M(e);},r._tr_tally=function(e,t,r){return e.pending_buf[e.d_buf+2*e.last_lit]=t>>>8&255,e.pending_buf[e.d_buf+2*e.last_lit+1]=255&t,e.pending_buf[e.l_buf+e.last_lit]=255&r,e.last_lit++,0===t?e.dyn_ltree[2*r]++:(e.matches++,t--,e.dyn_ltree[2*(A[r]+u+1)]++,e.dyn_dtree[2*N(t)]++),e.last_lit===e.lit_bufsize-1},r._tr_align=function(e){P(e,2,3),L(e,m,z),function(e){16===e.bi_valid?(U(e,e.bi_buf),e.bi_buf=0,e.bi_valid=0):8<=e.bi_valid&&(e.pending_buf[e.pending++]=255&e.bi_buf,e.bi_buf>>=8,e.bi_valid-=8);}(e);};},{"../utils/common":41}],53:[function(e,t,r){t.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0;};},{}],54:[function(e,t,r){(function(e){!function(r,n){if(!r.setImmediate){var i,s,t,a,o=1,h={},u=!1,l=r.document,e=Object.getPrototypeOf&&Object.getPrototypeOf(r);e=e&&e.setTimeout?e:r,i="[object process]"==={}.toString.call(r.process)?function(e){process.nextTick(function(){c(e);});}:function(){if(r.postMessage&&!r.importScripts){var e=!0,t=r.onmessage;return r.onmessage=function(){e=!1;},r.postMessage("","*"),r.onmessage=t,e}}()?(a="setImmediate$"+Math.random()+"$",r.addEventListener?r.addEventListener("message",d,!1):r.attachEvent("onmessage",d),function(e){r.postMessage(a+e,"*");}):r.MessageChannel?((t=new MessageChannel).port1.onmessage=function(e){c(e.data);},function(e){t.port2.postMessage(e);}):l&&"onreadystatechange"in l.createElement("script")?(s=l.documentElement,function(e){var t=l.createElement("script");t.onreadystatechange=function(){c(e),t.onreadystatechange=null,s.removeChild(t),t=null;},s.appendChild(t);}):function(e){setTimeout(c,0,e);},e.setImmediate=function(e){"function"!=typeof e&&(e=new Function(""+e));for(var t=new Array(arguments.length-1),r=0;r<t.length;r++)t[r]=arguments[r+1];var n={callback:e,args:t};return h[o]=n,i(o),o++},e.clearImmediate=f;}function f(e){delete h[e];}function c(e){if(u)setTimeout(c,0,e);else {var t=h[e];if(t){u=!0;try{!function(e){var t=e.callback,r=e.args;switch(r.length){case 0:t();break;case 1:t(r[0]);break;case 2:t(r[0],r[1]);break;case 3:t(r[0],r[1],r[2]);break;default:t.apply(n,r);}}(t);}finally{f(e),u=!1;}}}}function d(e){e.source===r&&"string"==typeof e.data&&0===e.data.indexOf(a)&&c(+e.data.slice(a.length));}}("undefined"==typeof self?void 0===e?this:e:self);}).call(this,"undefined"!=typeof commonjsGlobal?commonjsGlobal:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});},{}]},{},[10])(10)});
} (jszip_min));
var jszip_minExports = jszip_min.exports;
var JSZip = getDefaultExportFromCjs(jszip_minExports);var notiflixNotifyAio = {exports: {}};(function (module) {
	(function (root, factory) {
	  {
	    module.exports = factory(root);
	  }
	})(typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof window !== 'undefined' ? window : commonjsGlobal, function (window) {
	  if (typeof window === 'undefined' && typeof window.document === 'undefined') {
	    return false;
	  }
	  var notiflixNamespace = 'Notiflix';
	  var notiflixConsoleDocs = '\n\nVisit documentation page to learn more: https://notiflix.github.io/documentation';
	  var defaultFontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';
	  var typesNotify = {
	    Success: 'Success',
	    Failure: 'Failure',
	    Warning: 'Warning',
	    Info: 'Info',
	  };
	  var newNotifySettings;
	  var notifySettings = {
	    wrapID: 'NotiflixNotifyWrap',
	    overlayID: 'NotiflixNotifyOverlay',
	    width: '280px',
	    position: 'right-top',
	    distance: '10px',
	    opacity: 1,
	    borderRadius: '5px',
	    rtl: false,
	    timeout: 3000,
	    messageMaxLength: 110,
	    backOverlay: false,
	    backOverlayColor: 'rgba(0,0,0,0.5)',
	    plainText: true,
	    showOnlyTheLastOne: false,
	    clickToClose: false,
	    pauseOnHover: true,
	    ID: 'NotiflixNotify',
	    className: 'notiflix-notify',
	    zindex: 4001,
	    fontFamily: 'Quicksand',
	    fontSize: '13px',
	    cssAnimation: true,
	    cssAnimationDuration: 400,
	    cssAnimationStyle: 'fade',
	    closeButton: false,
	    useIcon: true,
	    useFontAwesome: false,
	    fontAwesomeIconStyle: 'basic',
	    fontAwesomeIconSize: '34px',
	    success: {
	      background: '#32c682',
	      textColor: '#fff',
	      childClassName: 'notiflix-notify-success',
	      notiflixIconColor: 'rgba(0,0,0,0.2)',
	      fontAwesomeClassName: 'fas fa-check-circle',
	      fontAwesomeIconColor: 'rgba(0,0,0,0.2)',
	      backOverlayColor: 'rgba(50,198,130,0.2)',
	    },
	    failure: {
	      background: '#ff5549',
	      textColor: '#fff',
	      childClassName: 'notiflix-notify-failure',
	      notiflixIconColor: 'rgba(0,0,0,0.2)',
	      fontAwesomeClassName: 'fas fa-times-circle',
	      fontAwesomeIconColor: 'rgba(0,0,0,0.2)',
	      backOverlayColor: 'rgba(255,85,73,0.2)',
	    },
	    warning: {
	      background: '#eebf31',
	      textColor: '#fff',
	      childClassName: 'notiflix-notify-warning',
	      notiflixIconColor: 'rgba(0,0,0,0.2)',
	      fontAwesomeClassName: 'fas fa-exclamation-circle',
	      fontAwesomeIconColor: 'rgba(0,0,0,0.2)',
	      backOverlayColor: 'rgba(238,191,49,0.2)',
	    },
	    info: {
	      background: '#26c0d3',
	      textColor: '#fff',
	      childClassName: 'notiflix-notify-info',
	      notiflixIconColor: 'rgba(0,0,0,0.2)',
	      fontAwesomeClassName: 'fas fa-info-circle',
	      fontAwesomeIconColor: 'rgba(0,0,0,0.2)',
	      backOverlayColor: 'rgba(38,192,211,0.2)',
	    },
	  };
	  var commonConsoleError = function (message) {
	    return console.error('%c ' + notiflixNamespace + ' Error ', 'padding:2px;border-radius:20px;color:#fff;background:#ff5549', '\n' + message + notiflixConsoleDocs);
	  };
	  var commonCheckHeadOrBody = function (element) {
	    if (!element) { element = 'head'; }
	    if (window.document[element] === null) {
	      commonConsoleError('\nNotiflix needs to be appended to the "<' + element + '>" element, but you called it before the "<' + element + '>" element has been created.');
	      return false;
	    }
	    return true;
	  };
	  var commonSetInternalCSSCodes = function (getInternalCSSCodes, styleElementId) {
	    if (!commonCheckHeadOrBody('head')) { return false; }
	    if (getInternalCSSCodes() !== null && !window.document.getElementById(styleElementId)) {
	      var internalCSS = window.document.createElement('style');
	      internalCSS.id = styleElementId;
	      internalCSS.innerHTML = getInternalCSSCodes();
	      window.document.head.appendChild(internalCSS);
	    }
	  };
	  var commonExtendOptions = function () {
	    var extended = {};
	    var deep = false;
	    var i = 0;
	    if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
	      deep = arguments[0];
	      i++;
	    }
	    var merge = function (obj) {
	      for (var prop in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
	          if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
	            extended[prop] = commonExtendOptions(extended[prop], obj[prop]);
	          } else {
	            extended[prop] = obj[prop];
	          }
	        }
	      }
	    };
	    for (; i < arguments.length; i++) {
	      merge(arguments[i]);
	    }
	    return extended;
	  };
	  var commonGetPlaintext = function (html) {
	    var htmlPool = window.document.createElement('div');
	    htmlPool.innerHTML = html;
	    return htmlPool.textContent || htmlPool.innerText || '';
	  };
	  var notifyGetInternalCSSCodes = function () {
	    var notifyCSS = '[id^=NotiflixNotifyWrap]{pointer-events:none;position:fixed;z-index:4001;opacity:1;right:10px;top:10px;width:280px;max-width:96%;-webkit-box-sizing:border-box;box-sizing:border-box;background:transparent}[id^=NotiflixNotifyWrap].nx-flex-center-center{max-height:calc(100vh - 20px);overflow-x:hidden;overflow-y:auto;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;margin:auto}[id^=NotiflixNotifyWrap]::-webkit-scrollbar{width:0;height:0}[id^=NotiflixNotifyWrap]::-webkit-scrollbar-thumb{background:transparent}[id^=NotiflixNotifyWrap]::-webkit-scrollbar-track{background:transparent}[id^=NotiflixNotifyWrap] *{-webkit-box-sizing:border-box;box-sizing:border-box}[id^=NotiflixNotifyOverlay]{-webkit-transition:background .3s ease-in-out;-o-transition:background .3s ease-in-out;transition:background .3s ease-in-out}[id^=NotiflixNotifyWrap]>div{pointer-events:all;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;font-family:"Quicksand",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;width:100%;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;position:relative;margin:0 0 10px;border-radius:5px;background:#1e1e1e;color:#fff;padding:10px 12px;font-size:14px;line-height:1.4}[id^=NotiflixNotifyWrap]>div:last-child{margin:0}[id^=NotiflixNotifyWrap]>div.nx-with-callback{cursor:pointer}[id^=NotiflixNotifyWrap]>div.nx-with-icon{padding:8px;min-height:56px}[id^=NotiflixNotifyWrap]>div.nx-paused{cursor:auto}[id^=NotiflixNotifyWrap]>div.nx-notify-click-to-close{cursor:pointer}[id^=NotiflixNotifyWrap]>div.nx-with-close-button{padding:10px 36px 10px 12px}[id^=NotiflixNotifyWrap]>div.nx-with-icon.nx-with-close-button{padding:6px 36px 6px 6px}[id^=NotiflixNotifyWrap]>div>span.nx-message{cursor:inherit;font-weight:normal;font-family:inherit!important;word-break:break-all;word-break:break-word}[id^=NotiflixNotifyWrap]>div>span.nx-close-button{cursor:pointer;-webkit-transition:all .2s ease-in-out;-o-transition:all .2s ease-in-out;transition:all .2s ease-in-out;position:absolute;right:8px;top:0;bottom:0;margin:auto;color:inherit;width:20px;height:20px}[id^=NotiflixNotifyWrap]>div>span.nx-close-button:hover{-webkit-transform:rotate(90deg);transform:rotate(90deg)}[id^=NotiflixNotifyWrap]>div>span.nx-close-button>svg{position:absolute;width:16px;height:16px;right:2px;top:2px}[id^=NotiflixNotifyWrap]>div>.nx-message-icon{position:absolute;width:40px;height:40px;font-size:30px;line-height:40px;text-align:center;left:8px;top:0;bottom:0;margin:auto;border-radius:inherit}[id^=NotiflixNotifyWrap]>div>.nx-message-icon-fa.nx-message-icon-fa-shadow{color:inherit;background:rgba(0,0,0,.15);-webkit-box-shadow:inset 0 0 34px rgba(0,0,0,.2);box-shadow:inset 0 0 34px rgba(0,0,0,.2);text-shadow:0 0 10px rgba(0,0,0,.3)}[id^=NotiflixNotifyWrap]>div>span.nx-with-icon{position:relative;float:left;width:calc(100% - 40px);margin:0 0 0 40px;padding:0 0 0 10px;-webkit-box-sizing:border-box;box-sizing:border-box}[id^=NotiflixNotifyWrap]>div.nx-rtl-on>.nx-message-icon{left:auto;right:8px}[id^=NotiflixNotifyWrap]>div.nx-rtl-on>span.nx-with-icon{padding:0 10px 0 0;margin:0 40px 0 0}[id^=NotiflixNotifyWrap]>div.nx-rtl-on>span.nx-close-button{right:auto;left:8px}[id^=NotiflixNotifyWrap]>div.nx-with-icon.nx-with-close-button.nx-rtl-on{padding:6px 6px 6px 36px}[id^=NotiflixNotifyWrap]>div.nx-with-close-button.nx-rtl-on{padding:10px 12px 10px 36px}[id^=NotiflixNotifyOverlay].nx-with-animation,[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-fade{-webkit-animation:notify-animation-fade .3s ease-in-out 0s normal;animation:notify-animation-fade .3s ease-in-out 0s normal}@-webkit-keyframes notify-animation-fade{0%{opacity:0}100%{opacity:1}}@keyframes notify-animation-fade{0%{opacity:0}100%{opacity:1}}[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-zoom{-webkit-animation:notify-animation-zoom .3s ease-in-out 0s normal;animation:notify-animation-zoom .3s ease-in-out 0s normal}@-webkit-keyframes notify-animation-zoom{0%{-webkit-transform:scale(0);transform:scale(0)}50%{-webkit-transform:scale(1.05);transform:scale(1.05)}100%{-webkit-transform:scale(1);transform:scale(1)}}@keyframes notify-animation-zoom{0%{-webkit-transform:scale(0);transform:scale(0)}50%{-webkit-transform:scale(1.05);transform:scale(1.05)}100%{-webkit-transform:scale(1);transform:scale(1)}}[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-from-right{-webkit-animation:notify-animation-from-right .3s ease-in-out 0s normal;animation:notify-animation-from-right .3s ease-in-out 0s normal}@-webkit-keyframes notify-animation-from-right{0%{right:-300px;opacity:0}50%{right:8px;opacity:1}100%{right:0;opacity:1}}@keyframes notify-animation-from-right{0%{right:-300px;opacity:0}50%{right:8px;opacity:1}100%{right:0;opacity:1}}[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-from-left{-webkit-animation:notify-animation-from-left .3s ease-in-out 0s normal;animation:notify-animation-from-left .3s ease-in-out 0s normal}@-webkit-keyframes notify-animation-from-left{0%{left:-300px;opacity:0}50%{left:8px;opacity:1}100%{left:0;opacity:1}}@keyframes notify-animation-from-left{0%{left:-300px;opacity:0}50%{left:8px;opacity:1}100%{left:0;opacity:1}}[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-from-top{-webkit-animation:notify-animation-from-top .3s ease-in-out 0s normal;animation:notify-animation-from-top .3s ease-in-out 0s normal}@-webkit-keyframes notify-animation-from-top{0%{top:-50px;opacity:0}50%{top:8px;opacity:1}100%{top:0;opacity:1}}@keyframes notify-animation-from-top{0%{top:-50px;opacity:0}50%{top:8px;opacity:1}100%{top:0;opacity:1}}[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-from-bottom{-webkit-animation:notify-animation-from-bottom .3s ease-in-out 0s normal;animation:notify-animation-from-bottom .3s ease-in-out 0s normal}@-webkit-keyframes notify-animation-from-bottom{0%{bottom:-50px;opacity:0}50%{bottom:8px;opacity:1}100%{bottom:0;opacity:1}}@keyframes notify-animation-from-bottom{0%{bottom:-50px;opacity:0}50%{bottom:8px;opacity:1}100%{bottom:0;opacity:1}}[id^=NotiflixNotifyOverlay].nx-with-animation.nx-remove,[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-fade.nx-remove{opacity:0;-webkit-animation:notify-remove-fade .3s ease-in-out 0s normal;animation:notify-remove-fade .3s ease-in-out 0s normal}@-webkit-keyframes notify-remove-fade{0%{opacity:1}100%{opacity:0}}@keyframes notify-remove-fade{0%{opacity:1}100%{opacity:0}}[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-zoom.nx-remove{-webkit-transform:scale(0);transform:scale(0);-webkit-animation:notify-remove-zoom .3s ease-in-out 0s normal;animation:notify-remove-zoom .3s ease-in-out 0s normal}@-webkit-keyframes notify-remove-zoom{0%{-webkit-transform:scale(1);transform:scale(1)}50%{-webkit-transform:scale(1.05);transform:scale(1.05)}100%{-webkit-transform:scale(0);transform:scale(0)}}@keyframes notify-remove-zoom{0%{-webkit-transform:scale(1);transform:scale(1)}50%{-webkit-transform:scale(1.05);transform:scale(1.05)}100%{-webkit-transform:scale(0);transform:scale(0)}}[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-from-top.nx-remove{opacity:0;-webkit-animation:notify-remove-to-top .3s ease-in-out 0s normal;animation:notify-remove-to-top .3s ease-in-out 0s normal}@-webkit-keyframes notify-remove-to-top{0%{top:0;opacity:1}50%{top:8px;opacity:1}100%{top:-50px;opacity:0}}@keyframes notify-remove-to-top{0%{top:0;opacity:1}50%{top:8px;opacity:1}100%{top:-50px;opacity:0}}[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-from-right.nx-remove{opacity:0;-webkit-animation:notify-remove-to-right .3s ease-in-out 0s normal;animation:notify-remove-to-right .3s ease-in-out 0s normal}@-webkit-keyframes notify-remove-to-right{0%{right:0;opacity:1}50%{right:8px;opacity:1}100%{right:-300px;opacity:0}}@keyframes notify-remove-to-right{0%{right:0;opacity:1}50%{right:8px;opacity:1}100%{right:-300px;opacity:0}}[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-from-bottom.nx-remove{opacity:0;-webkit-animation:notify-remove-to-bottom .3s ease-in-out 0s normal;animation:notify-remove-to-bottom .3s ease-in-out 0s normal}@-webkit-keyframes notify-remove-to-bottom{0%{bottom:0;opacity:1}50%{bottom:8px;opacity:1}100%{bottom:-50px;opacity:0}}@keyframes notify-remove-to-bottom{0%{bottom:0;opacity:1}50%{bottom:8px;opacity:1}100%{bottom:-50px;opacity:0}}[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-from-left.nx-remove{opacity:0;-webkit-animation:notify-remove-to-left .3s ease-in-out 0s normal;animation:notify-remove-to-left .3s ease-in-out 0s normal}@-webkit-keyframes notify-remove-to-left{0%{left:0;opacity:1}50%{left:8px;opacity:1}100%{left:-300px;opacity:0}}@keyframes notify-remove-to-left{0%{left:0;opacity:1}50%{left:8px;opacity:1}100%{left:-300px;opacity:0}}';
	    return notifyCSS || null;
	  };
	  var notifyCreateCounter = 0;
	  var notifyCreate = function (notifyType, message, callbackOrOptions, options) {
	    if (!commonCheckHeadOrBody('body')) { return false; }
	    if (!newNotifySettings) {
	      Notiflix.Notify.init({});
	    }
	    var newNotifySettingsBackup = commonExtendOptions(true, newNotifySettings, {});
	    if ((typeof callbackOrOptions === 'object' && !Array.isArray(callbackOrOptions)) || (typeof options === 'object' && !Array.isArray(options))) {
	      var newOptions = {};
	      if (typeof callbackOrOptions === 'object') {
	        newOptions = callbackOrOptions;
	      } else if (typeof options === 'object') {
	        newOptions = options;
	      }
	      newNotifySettings = commonExtendOptions(true, newNotifySettings, newOptions);
	    }
	    var theType = newNotifySettings[notifyType.toLocaleLowerCase('en')];
	    notifyCreateCounter++;
	    if (typeof message !== 'string') {
	      message = 'Notiflix ' + notifyType;
	    }
	    if (newNotifySettings.plainText) {
	      message = commonGetPlaintext(message);
	    }
	    if (!newNotifySettings.plainText && message.length > newNotifySettings.messageMaxLength) {
	      newNotifySettings = commonExtendOptions(true, newNotifySettings, { closeButton: true, messageMaxLength: 150 });
	      message = 'Possible HTML Tags Error: The "plainText" option is "false" and the notification content length is more than the "messageMaxLength" option.';
	    }
	    if (message.length > newNotifySettings.messageMaxLength) {
	      message = message.substring(0, newNotifySettings.messageMaxLength) + '...';
	    }
	    if (newNotifySettings.fontAwesomeIconStyle === 'shadow') {
	      theType.fontAwesomeIconColor = theType.background;
	    }
	    if (!newNotifySettings.cssAnimation) {
	      newNotifySettings.cssAnimationDuration = 0;
	    }
	    var ntflxNotifyWrap = window.document.getElementById(notifySettings.wrapID) || window.document.createElement('div');
	    ntflxNotifyWrap.id = notifySettings.wrapID;
	    ntflxNotifyWrap.style.width = newNotifySettings.width;
	    ntflxNotifyWrap.style.zIndex = newNotifySettings.zindex;
	    ntflxNotifyWrap.style.opacity = newNotifySettings.opacity;
	    if (newNotifySettings.position === 'center-center') {
	      ntflxNotifyWrap.style.left = newNotifySettings.distance;
	      ntflxNotifyWrap.style.top = newNotifySettings.distance;
	      ntflxNotifyWrap.style.right = newNotifySettings.distance;
	      ntflxNotifyWrap.style.bottom = newNotifySettings.distance;
	      ntflxNotifyWrap.style.margin = 'auto';
	      ntflxNotifyWrap.classList.add('nx-flex-center-center');
	      ntflxNotifyWrap.style.maxHeight = 'calc((100vh - ' + newNotifySettings.distance + ') - ' + newNotifySettings.distance + ')';
	      ntflxNotifyWrap.style.display = 'flex';
	      ntflxNotifyWrap.style.flexWrap = 'wrap';
	      ntflxNotifyWrap.style.flexDirection = 'column';
	      ntflxNotifyWrap.style.justifyContent = 'center';
	      ntflxNotifyWrap.style.alignItems = 'center';
	      ntflxNotifyWrap.style.pointerEvents = 'none';
	    } else if (newNotifySettings.position === 'center-top') {
	      ntflxNotifyWrap.style.left = newNotifySettings.distance;
	      ntflxNotifyWrap.style.right = newNotifySettings.distance;
	      ntflxNotifyWrap.style.top = newNotifySettings.distance;
	      ntflxNotifyWrap.style.bottom = 'auto';
	      ntflxNotifyWrap.style.margin = 'auto';
	    } else if (newNotifySettings.position === 'center-bottom') {
	      ntflxNotifyWrap.style.left = newNotifySettings.distance;
	      ntflxNotifyWrap.style.right = newNotifySettings.distance;
	      ntflxNotifyWrap.style.bottom = newNotifySettings.distance;
	      ntflxNotifyWrap.style.top = 'auto';
	      ntflxNotifyWrap.style.margin = 'auto';
	    } else if (newNotifySettings.position === 'right-bottom') {
	      ntflxNotifyWrap.style.right = newNotifySettings.distance;
	      ntflxNotifyWrap.style.bottom = newNotifySettings.distance;
	      ntflxNotifyWrap.style.top = 'auto';
	      ntflxNotifyWrap.style.left = 'auto';
	    } else if (newNotifySettings.position === 'left-top') {
	      ntflxNotifyWrap.style.left = newNotifySettings.distance;
	      ntflxNotifyWrap.style.top = newNotifySettings.distance;
	      ntflxNotifyWrap.style.right = 'auto';
	      ntflxNotifyWrap.style.bottom = 'auto';
	    } else if (newNotifySettings.position === 'left-bottom') {
	      ntflxNotifyWrap.style.left = newNotifySettings.distance;
	      ntflxNotifyWrap.style.bottom = newNotifySettings.distance;
	      ntflxNotifyWrap.style.top = 'auto';
	      ntflxNotifyWrap.style.right = 'auto';
	    } else {
	      ntflxNotifyWrap.style.right = newNotifySettings.distance;
	      ntflxNotifyWrap.style.top = newNotifySettings.distance;
	      ntflxNotifyWrap.style.left = 'auto';
	      ntflxNotifyWrap.style.bottom = 'auto';
	    }
	    if (newNotifySettings.backOverlay) {
	      var ntflxNotifyOverlay = window.document.getElementById(notifySettings.overlayID) || window.document.createElement('div');
	      ntflxNotifyOverlay.id = notifySettings.overlayID;
	      ntflxNotifyOverlay.style.width = '100%';
	      ntflxNotifyOverlay.style.height = '100%';
	      ntflxNotifyOverlay.style.position = 'fixed';
	      ntflxNotifyOverlay.style.zIndex = newNotifySettings.zindex - 1;
	      ntflxNotifyOverlay.style.left = 0;
	      ntflxNotifyOverlay.style.top = 0;
	      ntflxNotifyOverlay.style.right = 0;
	      ntflxNotifyOverlay.style.bottom = 0;
	      ntflxNotifyOverlay.style.background = theType.backOverlayColor || newNotifySettings.backOverlayColor;
	      ntflxNotifyOverlay.className = newNotifySettings.cssAnimation ? 'nx-with-animation' : '';
	      ntflxNotifyOverlay.style.animationDuration = newNotifySettings.cssAnimation ? newNotifySettings.cssAnimationDuration + 'ms' : '';
	      if (!window.document.getElementById(notifySettings.overlayID)) {
	        window.document.body.appendChild(ntflxNotifyOverlay);
	      }
	    }
	    if (!window.document.getElementById(notifySettings.wrapID)) {
	      window.document.body.appendChild(ntflxNotifyWrap);
	    }
	    var ntflxNotify = window.document.createElement('div');
	    ntflxNotify.id = newNotifySettings.ID + '-' + notifyCreateCounter;
	    ntflxNotify.className = newNotifySettings.className + ' ' + theType.childClassName + ' ' + (newNotifySettings.cssAnimation ? 'nx-with-animation' : '') + ' ' + (newNotifySettings.useIcon ? 'nx-with-icon' : '') + ' nx-' + newNotifySettings.cssAnimationStyle + ' ' + (newNotifySettings.closeButton && typeof callbackOrOptions !== 'function' ? 'nx-with-close-button' : '') + ' ' + (typeof callbackOrOptions === 'function' ? 'nx-with-callback' : '') + ' ' + (newNotifySettings.clickToClose ? 'nx-notify-click-to-close' : '');
	    ntflxNotify.style.fontSize = newNotifySettings.fontSize;
	    ntflxNotify.style.color = theType.textColor;
	    ntflxNotify.style.background = theType.background;
	    ntflxNotify.style.borderRadius = newNotifySettings.borderRadius;
	    ntflxNotify.style.pointerEvents = 'all';
	    if (newNotifySettings.rtl) {
	      ntflxNotify.setAttribute('dir', 'rtl');
	      ntflxNotify.classList.add('nx-rtl-on');
	    }
	    ntflxNotify.style.fontFamily = '"' + newNotifySettings.fontFamily + '", ' + defaultFontFamily;
	    if (newNotifySettings.cssAnimation) {
	      ntflxNotify.style.animationDuration = newNotifySettings.cssAnimationDuration + 'ms';
	    }
	    var closeButtonHTML = '';
	    if (newNotifySettings.closeButton && typeof callbackOrOptions !== 'function') {
	      closeButtonHTML = '<span class="nx-close-button"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><g><path fill="' + theType.notiflixIconColor + '" d="M0.38 2.19l7.8 7.81 -7.8 7.81c-0.51,0.5 -0.51,1.31 -0.01,1.81 0.25,0.25 0.57,0.38 0.91,0.38 0.34,0 0.67,-0.14 0.91,-0.38l7.81 -7.81 7.81 7.81c0.24,0.24 0.57,0.38 0.91,0.38 0.34,0 0.66,-0.14 0.9,-0.38 0.51,-0.5 0.51,-1.31 0,-1.81l-7.81 -7.81 7.81 -7.81c0.51,-0.5 0.51,-1.31 0,-1.82 -0.5,-0.5 -1.31,-0.5 -1.81,0l-7.81 7.81 -7.81 -7.81c-0.5,-0.5 -1.31,-0.5 -1.81,0 -0.51,0.51 -0.51,1.32 0,1.82z"/></g></svg></span>';
	    }
	    if (newNotifySettings.useIcon) {
	      if (newNotifySettings.useFontAwesome) {
	        ntflxNotify.innerHTML = '<i style="color:' + theType.fontAwesomeIconColor + '; font-size:' + newNotifySettings.fontAwesomeIconSize + ';" class="nx-message-icon nx-message-icon-fa ' + theType.fontAwesomeClassName + ' ' + (newNotifySettings.fontAwesomeIconStyle === 'shadow' ? 'nx-message-icon-fa-shadow' : 'nx-message-icon-fa-basic') + '"></i><span class="nx-message nx-with-icon">' + message + '</span>' + (newNotifySettings.closeButton ? closeButtonHTML : '');
	      }
	      else {
	        var svgIcon = '';
	        if (notifyType === typesNotify.Success) {
	          svgIcon = '<svg class="nx-message-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><g><path fill="' + theType.notiflixIconColor + '" d="M20 0c11.03,0 20,8.97 20,20 0,11.03 -8.97,20 -20,20 -11.03,0 -20,-8.97 -20,-20 0,-11.03 8.97,-20 20,-20zm0 37.98c9.92,0 17.98,-8.06 17.98,-17.98 0,-9.92 -8.06,-17.98 -17.98,-17.98 -9.92,0 -17.98,8.06 -17.98,17.98 0,9.92 8.06,17.98 17.98,17.98zm-2.4 -13.29l11.52 -12.96c0.37,-0.41 1.01,-0.45 1.42,-0.08 0.42,0.37 0.46,1 0.09,1.42l-12.16 13.67c-0.19,0.22 -0.46,0.34 -0.75,0.34 -0.23,0 -0.45,-0.07 -0.63,-0.22l-7.6 -6.07c-0.43,-0.35 -0.5,-0.99 -0.16,-1.42 0.35,-0.43 0.99,-0.5 1.42,-0.16l6.85 5.48z"/></g></svg>';
	        } else if (notifyType === typesNotify.Failure) {
	          svgIcon = '<svg class="nx-message-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><g><path fill="' + theType.notiflixIconColor + '" d="M20 0c11.03,0 20,8.97 20,20 0,11.03 -8.97,20 -20,20 -11.03,0 -20,-8.97 -20,-20 0,-11.03 8.97,-20 20,-20zm0 37.98c9.92,0 17.98,-8.06 17.98,-17.98 0,-9.92 -8.06,-17.98 -17.98,-17.98 -9.92,0 -17.98,8.06 -17.98,17.98 0,9.92 8.06,17.98 17.98,17.98zm1.42 -17.98l6.13 6.12c0.39,0.4 0.39,1.04 0,1.43 -0.19,0.19 -0.45,0.29 -0.71,0.29 -0.27,0 -0.53,-0.1 -0.72,-0.29l-6.12 -6.13 -6.13 6.13c-0.19,0.19 -0.44,0.29 -0.71,0.29 -0.27,0 -0.52,-0.1 -0.71,-0.29 -0.39,-0.39 -0.39,-1.03 0,-1.43l6.13 -6.12 -6.13 -6.13c-0.39,-0.39 -0.39,-1.03 0,-1.42 0.39,-0.39 1.03,-0.39 1.42,0l6.13 6.12 6.12 -6.12c0.4,-0.39 1.04,-0.39 1.43,0 0.39,0.39 0.39,1.03 0,1.42l-6.13 6.13z"/></g></svg>';
	        } else if (notifyType === typesNotify.Warning) {
	          svgIcon = '<svg class="nx-message-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><g><path fill="' + theType.notiflixIconColor + '" d="M21.91 3.48l17.8 30.89c0.84,1.46 -0.23,3.25 -1.91,3.25l-35.6 0c-1.68,0 -2.75,-1.79 -1.91,-3.25l17.8 -30.89c0.85,-1.47 2.97,-1.47 3.82,0zm16.15 31.84l-17.8 -30.89c-0.11,-0.2 -0.41,-0.2 -0.52,0l-17.8 30.89c-0.12,0.2 0.05,0.4 0.26,0.4l35.6 0c0.21,0 0.38,-0.2 0.26,-0.4zm-19.01 -4.12l0 -1.05c0,-0.53 0.42,-0.95 0.95,-0.95 0.53,0 0.95,0.42 0.95,0.95l0 1.05c0,0.53 -0.42,0.95 -0.95,0.95 -0.53,0 -0.95,-0.42 -0.95,-0.95zm0 -4.66l0 -13.39c0,-0.52 0.42,-0.95 0.95,-0.95 0.53,0 0.95,0.43 0.95,0.95l0 13.39c0,0.53 -0.42,0.96 -0.95,0.96 -0.53,0 -0.95,-0.43 -0.95,-0.96z"/></g></svg>';
	        } else if (notifyType === typesNotify.Info) {
	          svgIcon = '<svg class="nx-message-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><g><path fill="' + theType.notiflixIconColor + '" d="M20 0c11.03,0 20,8.97 20,20 0,11.03 -8.97,20 -20,20 -11.03,0 -20,-8.97 -20,-20 0,-11.03 8.97,-20 20,-20zm0 37.98c9.92,0 17.98,-8.06 17.98,-17.98 0,-9.92 -8.06,-17.98 -17.98,-17.98 -9.92,0 -17.98,8.06 -17.98,17.98 0,9.92 8.06,17.98 17.98,17.98zm-0.99 -23.3c0,-0.54 0.44,-0.98 0.99,-0.98 0.55,0 0.99,0.44 0.99,0.98l0 15.86c0,0.55 -0.44,0.99 -0.99,0.99 -0.55,0 -0.99,-0.44 -0.99,-0.99l0 -15.86zm0 -5.22c0,-0.55 0.44,-0.99 0.99,-0.99 0.55,0 0.99,0.44 0.99,0.99l0 1.09c0,0.54 -0.44,0.99 -0.99,0.99 -0.55,0 -0.99,-0.45 -0.99,-0.99l0 -1.09z"/></g></svg>';
	        }
	        ntflxNotify.innerHTML = svgIcon + '<span class="nx-message nx-with-icon">' + message + '</span>' + (newNotifySettings.closeButton ? closeButtonHTML : '');
	      }
	    }
	    else {
	      ntflxNotify.innerHTML = '<span class="nx-message">' + message + '</span>' + (newNotifySettings.closeButton ? closeButtonHTML : '');
	    }
	    if (newNotifySettings.position === 'left-bottom' || newNotifySettings.position === 'right-bottom') {
	      var notifyWrap = window.document.getElementById(notifySettings.wrapID);
	      notifyWrap.insertBefore(ntflxNotify, notifyWrap.firstChild);
	    } else {
	      window.document.getElementById(notifySettings.wrapID).appendChild(ntflxNotify);
	    }
	    var eachNotifyElement = window.document.getElementById(ntflxNotify.id);
	    if (eachNotifyElement) {
	      var timeoutHide;
	      var timeoutRemove;
	      var hideNotifyElementsAndOverlay = function () {
	        eachNotifyElement.classList.add('nx-remove');
	        var removeOverlay = window.document.getElementById(notifySettings.overlayID);
	        if (removeOverlay && ntflxNotifyWrap.childElementCount <= 0) {
	          removeOverlay.classList.add('nx-remove');
	        }
	        clearTimeout(timeoutHide);
	      };
	      var removeNotifyElmentsAndWrapper = function () {
	        if (eachNotifyElement && eachNotifyElement.parentNode !== null) {
	          eachNotifyElement.parentNode.removeChild(eachNotifyElement);
	        }
	        if (ntflxNotifyWrap.childElementCount <= 0 && ntflxNotifyWrap.parentNode !== null) {
	          ntflxNotifyWrap.parentNode.removeChild(ntflxNotifyWrap);
	          var removeOverlay = window.document.getElementById(notifySettings.overlayID);
	          if (removeOverlay && removeOverlay.parentNode !== null) {
	            removeOverlay.parentNode.removeChild(removeOverlay);
	          }
	        }
	        clearTimeout(timeoutRemove);
	      };
	      if (newNotifySettings.closeButton && typeof callbackOrOptions !== 'function') {
	        var closeButtonElm = window.document.getElementById(ntflxNotify.id).querySelector('span.nx-close-button');
	        closeButtonElm.addEventListener('click', function () {
	          hideNotifyElementsAndOverlay();
	          var clickToCloseTimeout = setTimeout(function () {
	            removeNotifyElmentsAndWrapper();
	            clearTimeout(clickToCloseTimeout);
	          }, newNotifySettings.cssAnimationDuration);
	        });
	      }
	      if (typeof callbackOrOptions === 'function' || newNotifySettings.clickToClose) {
	        eachNotifyElement.addEventListener('click', function () {
	          if (typeof callbackOrOptions === 'function') {
	            callbackOrOptions();
	          }
	          hideNotifyElementsAndOverlay();
	          var callbackTimeout = setTimeout(function () {
	            removeNotifyElmentsAndWrapper();
	            clearTimeout(callbackTimeout);
	          }, newNotifySettings.cssAnimationDuration);
	        });
	      }
	      if (!newNotifySettings.closeButton && typeof callbackOrOptions !== 'function') {
	        var autoRemove = function () {
	          timeoutHide = setTimeout(function () {
	            hideNotifyElementsAndOverlay();
	          }, newNotifySettings.timeout);
	          timeoutRemove = setTimeout(function () {
	            removeNotifyElmentsAndWrapper();
	          }, newNotifySettings.timeout + newNotifySettings.cssAnimationDuration);
	        };
	        autoRemove();
	        if (newNotifySettings.pauseOnHover) {
	          eachNotifyElement.addEventListener('mouseenter', function () {
	            eachNotifyElement.classList.add('nx-paused');
	            clearTimeout(timeoutHide);
	            clearTimeout(timeoutRemove);
	          });
	          eachNotifyElement.addEventListener('mouseleave', function () {
	            eachNotifyElement.classList.remove('nx-paused');
	            autoRemove();
	          });
	        }
	      }
	    }
	    if (newNotifySettings.showOnlyTheLastOne && notifyCreateCounter > 0) {
	      var allNotifyElmNotTheLastOne = window.document.querySelectorAll('[id^=' + newNotifySettings.ID + '-]:not([id=' + newNotifySettings.ID + '-' + notifyCreateCounter + '])');
	      for (var i = 0; i < allNotifyElmNotTheLastOne.length; i++) {
	        var eachNotifyElmNotLastOne = allNotifyElmNotTheLastOne[i];
	        if (eachNotifyElmNotLastOne.parentNode !== null) {
	          eachNotifyElmNotLastOne.parentNode.removeChild(eachNotifyElmNotLastOne);
	        }
	      }
	    }
	    newNotifySettings = commonExtendOptions(true, newNotifySettings, newNotifySettingsBackup);
	  };
	  var Notiflix = {
	    Notify: {
	      init: function (userNotifyOptions) {
	        newNotifySettings = commonExtendOptions(true, notifySettings, userNotifyOptions);
	        commonSetInternalCSSCodes(notifyGetInternalCSSCodes, 'NotiflixNotifyInternalCSS');
	      },
	      merge: function (userNotifyExtendOptions) {
	        if (newNotifySettings) {
	          newNotifySettings = commonExtendOptions(true, newNotifySettings, userNotifyExtendOptions);
	        }
	        else {
	          commonConsoleError('You have to initialize the Notify module before call Merge function.');
	          return false;
	        }
	      },
	      success: function (message, callbackOrOptions, options) {
	        notifyCreate(typesNotify.Success, message, callbackOrOptions, options);
	      },
	      failure: function (message, callbackOrOptions, options) {
	        notifyCreate(typesNotify.Failure, message, callbackOrOptions, options);
	      },
	      warning: function (message, callbackOrOptions, options) {
	        notifyCreate(typesNotify.Warning, message, callbackOrOptions, options);
	      },
	      info: function (message, callbackOrOptions, options) {
	        notifyCreate(typesNotify.Info, message, callbackOrOptions, options);
	      },
	    },
	  };
	  if (typeof window.Notiflix === 'object') {
	    return commonExtendOptions(true, window.Notiflix, { Notify: Notiflix.Notify });
	  } else {
	    return { Notify: Notiflix.Notify };
	  }
	});
} (notiflixNotifyAio));
var notiflixNotifyAioExports = notiflixNotifyAio.exports;
getDefaultExportFromCjs(notiflixNotifyAioExports);function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;
  if (!css || typeof document === 'undefined') { return; }
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}var css_248z$3 = "[id^=NotiflixNotifyWrap]{background:transparent;box-sizing:border-box;max-width:96%;opacity:1;pointer-events:none;position:fixed;right:10px;top:10px;width:280px;z-index:4001}[id^=NotiflixNotifyWrap].nx-flex-center-center{-webkit-box-pack:center;-ms-flex-pack:center;align-items:center;display:flex;flex-direction:column;flex-wrap:wrap;justify-content:center;margin:auto;max-height:calc(100vh - 20px);overflow-x:hidden;overflow-y:auto}[id^=NotiflixNotifyWrap]::-webkit-scrollbar{height:0;width:0}[id^=NotiflixNotifyWrap]::-webkit-scrollbar-thumb,[id^=NotiflixNotifyWrap]::-webkit-scrollbar-track{background:transparent}[id^=NotiflixNotifyWrap] *{box-sizing:border-box}[id^=NotiflixNotifyOverlay]{transition:background .3s ease-in-out}[id^=NotiflixNotifyWrap]>div{align-items:center;background:#1e1e1e;border-radius:5px;color:#fff;display:inline-flex;flex-wrap:wrap;font-family:Quicksand,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;font-size:14px;line-height:1.4;margin:0 0 10px;padding:10px 12px;pointer-events:all;position:relative;-webkit-user-select:none;-moz-user-select:none;user-select:none;width:100%}[id^=NotiflixNotifyWrap]>div:last-child{margin:0}[id^=NotiflixNotifyWrap]>div.nx-with-callback{cursor:pointer}[id^=NotiflixNotifyWrap]>div.nx-with-icon{min-height:56px;padding:8px}[id^=NotiflixNotifyWrap]>div.nx-paused{cursor:auto}[id^=NotiflixNotifyWrap]>div.nx-notify-click-to-close{cursor:pointer}[id^=NotiflixNotifyWrap]>div.nx-with-close-button{padding:10px 36px 10px 12px}[id^=NotiflixNotifyWrap]>div.nx-with-icon.nx-with-close-button{padding:6px 36px 6px 6px}[id^=NotiflixNotifyWrap]>div>span.nx-message{cursor:inherit;font-family:inherit!important;font-weight:400;word-break:break-all;word-break:break-word}[id^=NotiflixNotifyWrap]>div>span.nx-close-button{bottom:0;color:inherit;cursor:pointer;height:20px;margin:auto;position:absolute;right:8px;top:0;transition:all .2s ease-in-out;width:20px}[id^=NotiflixNotifyWrap]>div>span.nx-close-button:hover{transform:rotate(90deg)}[id^=NotiflixNotifyWrap]>div>span.nx-close-button>svg{height:16px;position:absolute;right:2px;top:2px;width:16px}[id^=NotiflixNotifyWrap]>div>.nx-message-icon{border-radius:inherit;bottom:0;font-size:30px;height:40px;left:8px;line-height:40px;margin:auto;position:absolute;text-align:center;top:0;width:40px}[id^=NotiflixNotifyWrap]>div>.nx-message-icon-fa.nx-message-icon-fa-shadow{background:rgba(0,0,0,.15);box-shadow:inset 0 0 34px rgba(0,0,0,.2);color:inherit;text-shadow:0 0 10px rgba(0,0,0,.3)}[id^=NotiflixNotifyWrap]>div>span.nx-with-icon{box-sizing:border-box;float:left;margin:0 0 0 40px;padding:0 0 0 10px;position:relative;width:calc(100% - 40px)}[id^=NotiflixNotifyWrap]>div.nx-rtl-on>.nx-message-icon{left:auto;right:8px}[id^=NotiflixNotifyWrap]>div.nx-rtl-on>span.nx-with-icon{margin:0 40px 0 0;padding:0 10px 0 0}[id^=NotiflixNotifyWrap]>div.nx-rtl-on>span.nx-close-button{left:8px;right:auto}[id^=NotiflixNotifyWrap]>div.nx-with-icon.nx-with-close-button.nx-rtl-on{padding:6px 6px 6px 36px}[id^=NotiflixNotifyWrap]>div.nx-with-close-button.nx-rtl-on{padding:10px 12px 10px 36px}[id^=NotiflixNotifyOverlay].nx-with-animation,[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-fade{animation:notify-animation-fade .3s ease-in-out 0s normal}@keyframes notify-animation-fade{0%{opacity:0}to{opacity:1}}[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-zoom{animation:notify-animation-zoom .3s ease-in-out 0s normal}@keyframes notify-animation-zoom{0%{transform:scale(0)}50%{transform:scale(1.05)}to{transform:scale(1)}}[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-from-right{animation:notify-animation-from-right .3s ease-in-out 0s normal}@keyframes notify-animation-from-right{0%{opacity:0;right:-300px}50%{opacity:1;right:8px}to{opacity:1;right:0}}[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-from-left{animation:notify-animation-from-left .3s ease-in-out 0s normal}@keyframes notify-animation-from-left{0%{left:-300px;opacity:0}50%{left:8px;opacity:1}to{left:0;opacity:1}}[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-from-top{animation:notify-animation-from-top .3s ease-in-out 0s normal}@keyframes notify-animation-from-top{0%{opacity:0;top:-50px}50%{opacity:1;top:8px}to{opacity:1;top:0}}[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-from-bottom{animation:notify-animation-from-bottom .3s ease-in-out 0s normal}@keyframes notify-animation-from-bottom{0%{bottom:-50px;opacity:0}50%{bottom:8px;opacity:1}to{bottom:0;opacity:1}}[id^=NotiflixNotifyOverlay].nx-with-animation.nx-remove,[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-fade.nx-remove{animation:notify-remove-fade .3s ease-in-out 0s normal;opacity:0}@keyframes notify-remove-fade{0%{opacity:1}to{opacity:0}}[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-zoom.nx-remove{animation:notify-remove-zoom .3s ease-in-out 0s normal;transform:scale(0)}@keyframes notify-remove-zoom{0%{transform:scale(1)}50%{transform:scale(1.05)}to{transform:scale(0)}}[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-from-top.nx-remove{animation:notify-remove-to-top .3s ease-in-out 0s normal;opacity:0}@keyframes notify-remove-to-top{0%{opacity:1;top:0}50%{opacity:1;top:8px}to{opacity:0;top:-50px}}[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-from-right.nx-remove{animation:notify-remove-to-right .3s ease-in-out 0s normal;opacity:0}@keyframes notify-remove-to-right{0%{opacity:1;right:0}50%{opacity:1;right:8px}to{opacity:0;right:-300px}}[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-from-bottom.nx-remove{animation:notify-remove-to-bottom .3s ease-in-out 0s normal;opacity:0}@keyframes notify-remove-to-bottom{0%{bottom:0;opacity:1}50%{bottom:8px;opacity:1}to{bottom:-50px;opacity:0}}[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-from-left.nx-remove{animation:notify-remove-to-left .3s ease-in-out 0s normal;opacity:0}@keyframes notify-remove-to-left{0%{left:0;opacity:1}50%{left:8px;opacity:1}to{left:-300px;opacity:0}}[id^=NotiflixReportWrap]{-webkit-box-align:center;-ms-flex-align:center;-webkit-box-pack:center;-ms-flex-pack:center;align-items:center;background:transparent;border-radius:25px;color:#1e1e1e;display:flex;flex-direction:column;flex-wrap:wrap;font-family:Quicksand,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;height:100%;justify-content:center;left:0;padding:10px;position:fixed;top:0;width:100%;z-index:4002}[id^=NotiflixReportWrap],[id^=NotiflixReportWrap] *{box-sizing:border-box}[id^=NotiflixReportWrap]>div[class*=-overlay]{background:hsla(0,0%,100%,.5);height:100%;left:0;position:fixed;top:0;width:100%;z-index:0}[id^=NotiflixReportWrap]>div.nx-report-click-to-close{cursor:pointer}[id^=NotiflixReportWrap]>div[class*=-content]{background:#f8f8f8;border:1px solid rgba(0,0,0,.03);border-radius:inherit;filter:drop-shadow(0 0 5px rgba(0,0,0,.05));max-height:96vh;max-width:100%;overflow-x:hidden;overflow-y:auto;padding:10px;position:relative;width:320px;z-index:1}[id^=NotiflixReportWrap]>div[class*=-content]::-webkit-scrollbar{height:0;width:0}[id^=NotiflixReportWrap]>div[class*=-content]::-webkit-scrollbar-thumb,[id^=NotiflixReportWrap]>div[class*=-content]::-webkit-scrollbar-track{background:transparent}[id^=NotiflixReportWrap]>div[class*=-content]>div[class$=-icon]{display:block;height:110px;margin:6px auto 12px;-webkit-user-select:none;-moz-user-select:none;user-select:none;width:110px}[id^=NotiflixReportWrap]>div[class*=-content]>div[class$=-icon] svg{height:auto;max-width:100%;min-width:100%}[id^=NotiflixReportWrap]>*>h5{border-bottom:1px solid rgba(0,0,0,.1);font-size:16px;font-weight:500;padding:0 0 10px;text-align:center}[id^=NotiflixReportWrap]>*>h5,[id^=NotiflixReportWrap]>*>p{float:left;font-family:inherit!important;line-height:1.4;margin:0 0 10px;width:100%;word-break:break-all;word-break:break-word}[id^=NotiflixReportWrap]>*>p{font-size:13px;font-weight:400;padding:0 10px}[id^=NotiflixReportWrap] a#NXReportButton{background:#32c682;border-radius:inherit!important;color:#fff;cursor:pointer;float:right;font-family:inherit!important;font-size:14px;font-weight:500;line-height:1.4;padding:7px 17px;transition:all .25s ease-in-out;-webkit-user-select:none;-moz-user-select:none;user-select:none;word-break:break-all;word-break:break-word}[id^=NotiflixReportWrap] a#NXReportButton:hover{box-shadow:inset 0 -60px 5px -5px rgba(0,0,0,.25)}[id^=NotiflixReportWrap].nx-rtl-on a#NXReportButton{float:left}[id^=NotiflixReportWrap]>div[class*=-overlay].nx-with-animation{animation:report-overlay-animation .3s ease-in-out 0s normal}@keyframes report-overlay-animation{0%{opacity:0}to{opacity:1}}[id^=NotiflixReportWrap]>div[class*=-content].nx-with-animation.nx-fade{animation:report-animation-fade .3s ease-in-out 0s normal}@keyframes report-animation-fade{0%{opacity:0}to{opacity:1}}[id^=NotiflixReportWrap]>div[class*=-content].nx-with-animation.nx-zoom{animation:report-animation-zoom .3s ease-in-out 0s normal}@keyframes report-animation-zoom{0%{opacity:0;transform:scale(.5)}50%{opacity:1;transform:scale(1.05)}to{opacity:1;transform:scale(1)}}[id^=NotiflixReportWrap].nx-remove>div[class*=-overlay].nx-with-animation{animation:report-overlay-animation-remove .3s ease-in-out 0s normal;opacity:0}@keyframes report-overlay-animation-remove{0%{opacity:1}to{opacity:0}}[id^=NotiflixReportWrap].nx-remove>div[class*=-content].nx-with-animation.nx-fade{animation:report-animation-fade-remove .3s ease-in-out 0s normal;opacity:0}@keyframes report-animation-fade-remove{0%{opacity:1}to{opacity:0}}[id^=NotiflixReportWrap].nx-remove>div[class*=-content].nx-with-animation.nx-zoom{animation:report-animation-zoom-remove .3s ease-in-out 0s normal;opacity:0}@keyframes report-animation-zoom-remove{0%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.05)}to{opacity:0;transform:scale(0)}}[id^=NotiflixConfirmWrap]{-webkit-box-align:center;-ms-flex-align:center;-webkit-box-pack:center;-ms-flex-pack:center;align-items:center;background:transparent;box-sizing:border-box;display:flex;flex-direction:column;flex-wrap:wrap;font-family:Quicksand,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;height:100%;justify-content:center;left:0;padding:10px;position:fixed;top:0;width:100%;z-index:4003}[id^=NotiflixConfirmWrap].nx-position-center-top{justify-content:flex-start}[id^=NotiflixConfirmWrap].nx-position-center-bottom{justify-content:flex-end}[id^=NotiflixConfirmWrap].nx-position-left-top{justify-content:flex-start}[id^=NotiflixConfirmWrap].nx-position-left-bottom,[id^=NotiflixConfirmWrap].nx-position-left-center,[id^=NotiflixConfirmWrap].nx-position-left-top{align-items:flex-start}[id^=NotiflixConfirmWrap].nx-position-left-bottom{justify-content:flex-end}[id^=NotiflixConfirmWrap].nx-position-right-top{justify-content:flex-start}[id^=NotiflixConfirmWrap].nx-position-right-bottom,[id^=NotiflixConfirmWrap].nx-position-right-center,[id^=NotiflixConfirmWrap].nx-position-right-top{align-items:flex-end}[id^=NotiflixConfirmWrap].nx-position-right-bottom{justify-content:flex-end}[id^=NotiflixConfirmWrap] *{box-sizing:border-box}[id^=NotiflixConfirmWrap]>div[class*=-overlay]{background:hsla(0,0%,100%,.5);height:100%;left:0;position:fixed;top:0;width:100%;z-index:0}[id^=NotiflixConfirmWrap]>div[class*=-overlay].nx-with-animation{animation:confirm-overlay-animation .3s ease-in-out 0s normal}@keyframes confirm-overlay-animation{0%{opacity:0}to{opacity:1}}[id^=NotiflixConfirmWrap].nx-remove>div[class*=-overlay].nx-with-animation{animation:confirm-overlay-animation-remove .3s ease-in-out 0s normal;opacity:0}@keyframes confirm-overlay-animation-remove{0%{opacity:1}to{opacity:0}}[id^=NotiflixConfirmWrap]>div[class*=-content]{background:#f8f8f8;border-radius:25px;color:#1e1e1e;filter:drop-shadow(0 0 5px rgba(0,0,0,.05));margin:0;max-height:96vh;max-width:100%;overflow-x:hidden;overflow-y:auto;padding:10px;position:relative;text-align:center;width:300px;z-index:1}[id^=NotiflixConfirmWrap]>div[class*=-content]::-webkit-scrollbar{height:0;width:0}[id^=NotiflixConfirmWrap]>div[class*=-content]::-webkit-scrollbar-thumb,[id^=NotiflixConfirmWrap]>div[class*=-content]::-webkit-scrollbar-track{background:transparent}[id^=NotiflixConfirmWrap]>div[class*=-content]>div[class*=-head]{float:left;text-align:inherit;width:100%}[id^=NotiflixConfirmWrap]>div[class*=-content]>div[class*=-head]>h5{border-bottom:1px solid rgba(0,0,0,.1);color:#32c682;float:left;font-family:inherit!important;font-size:16px;font-weight:500;line-height:1.4;margin:0;padding:0 0 10px;text-align:inherit;width:100%}[id^=NotiflixConfirmWrap]>div[class*=-content]>div[class*=-head]>div{color:inherit;float:left;font-family:inherit!important;font-size:14px;font-weight:400;line-height:1.4;margin:15px 0 20px;padding:0 10px;text-align:inherit;width:100%}[id^=NotiflixConfirmWrap]>div[class*=-content]>div[class*=-head]>div>div{float:left;font-family:inherit!important;margin:15px 0 0;padding:0;width:100%}[id^=NotiflixConfirmWrap]>div[class*=-content]>div[class*=-head]>div>div>input{border:1px solid rgba(0,0,0,.1);border-radius:25px;float:left;font-family:inherit!important;font-size:14px;font-weight:400;height:40px;line-height:1;margin:0;padding:0 15px;text-align:left;transition:all .25s ease-in-out;width:100%}[id^=NotiflixConfirmWrap].nx-rtl-on>div[class*=-content]>div[class*=-head]>div>div>input{text-align:right}[id^=NotiflixConfirmWrap]>div[class*=-content]>div[class*=-head]>div>div>input:hover{border-color:rgba(0,0,0,.1)}[id^=NotiflixConfirmWrap]>div[class*=-content]>div[class*=-head]>div>div>input:focus{border-color:rgba(0,0,0,.3)}[id^=NotiflixConfirmWrap]>div[class*=-content]>div[class*=-head]>div>div>input.nx-validation-failure{border-color:#ff5549}[id^=NotiflixConfirmWrap]>div[class*=-content]>div[class*=-head]>div>div>input.nx-validation-success{border-color:#32c682}[id^=NotiflixConfirmWrap]>div[class*=-content]>div[class*=-buttons]{border-radius:inherit;float:left;text-align:inherit;-webkit-user-select:none;-moz-user-select:none;user-select:none;width:100%}[id^=NotiflixConfirmWrap]>div[class*=-content]>div[class*=-buttons]>a{border-radius:inherit!important;color:#f8f8f8;cursor:pointer;float:left;font-family:inherit!important;font-size:15px;font-weight:500;line-height:1.4;padding:9px 5px;text-align:inherit;transition:all .25s ease-in-out;width:48%}[id^=NotiflixConfirmWrap]>div[class*=-content]>div[class*=-buttons]>a.nx-confirm-button-ok{background:#32c682;margin:0 2% 0 0}[id^=NotiflixConfirmWrap]>div[class*=-content]>div[class*=-buttons]>a.nx-confirm-button-cancel{background:#a9a9a9;margin:0 0 0 2%}[id^=NotiflixConfirmWrap]>div[class*=-content]>div[class*=-buttons]>a.nx-full{margin:0;width:100%}[id^=NotiflixConfirmWrap]>div[class*=-content]>div[class*=-buttons]>a:hover{box-shadow:inset 0 -60px 5px -5px rgba(0,0,0,.25)}[id^=NotiflixConfirmWrap].nx-rtl-on>div[class*=-content]>div[class*=-buttons],[id^=NotiflixConfirmWrap].nx-rtl-on>div[class*=-content]>div[class*=-buttons]>a{transform:rotateY(180deg)}[id^=NotiflixConfirmWrap].nx-with-animation.nx-fade>div[class*=-content]{animation:confirm-animation-fade .3s ease-in-out 0s normal}@keyframes confirm-animation-fade{0%{opacity:0}to{opacity:1}}[id^=NotiflixConfirmWrap].nx-with-animation.nx-zoom>div[class*=-content]{animation:confirm-animation-zoom .3s ease-in-out 0s normal}@keyframes confirm-animation-zoom{0%{opacity:0;transform:scale(.5)}50%{opacity:1;transform:scale(1.05)}to{opacity:1;transform:scale(1)}}[id^=NotiflixConfirmWrap].nx-with-animation.nx-fade.nx-remove>div[class*=-content]{animation:confirm-animation-fade-remove .3s ease-in-out 0s normal;opacity:0}@keyframes confirm-animation-fade-remove{0%{opacity:1}to{opacity:0}}[id^=NotiflixConfirmWrap].nx-with-animation.nx-zoom.nx-remove>div[class*=-content]{animation:confirm-animation-zoom-remove .3s ease-in-out 0s normal;opacity:0}@keyframes confirm-animation-zoom-remove{0%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.05)}to{opacity:0;transform:scale(0)}}[id^=NotiflixLoadingWrap]{-webkit-box-align:center;-ms-flex-align:center;-webkit-box-pack:center;-ms-flex-pack:center;align-items:center;background:rgba(0,0,0,.8);bottom:0;display:flex;flex-direction:column;flex-wrap:wrap;font-family:Quicksand,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;height:100%;justify-content:center;left:0;margin:auto;position:fixed;right:0;text-align:center;top:0;-webkit-user-select:none;-moz-user-select:none;user-select:none;width:100%;z-index:4000}[id^=NotiflixLoadingWrap],[id^=NotiflixLoadingWrap] *{box-sizing:border-box}[id^=NotiflixLoadingWrap].nx-loading-click-to-close{cursor:pointer}[id^=NotiflixLoadingWrap]>div[class*=-icon]{height:60px;margin:0 auto;position:relative;transition:top .2s ease-in-out;width:60px}[id^=NotiflixLoadingWrap]>div[class*=-icon] img,[id^=NotiflixLoadingWrap]>div[class*=-icon] svg{height:auto;left:0;max-height:unset;max-width:unset;position:absolute;top:0;width:100%}[id^=NotiflixLoadingWrap]>p{font-family:inherit!important;font-size:15px;font-weight:400;line-height:1.4;margin:10px auto 0;padding:0 10px;position:relative;text-align:center;width:100%}[id^=NotiflixLoadingWrap].nx-with-animation{animation:loading-animation-fade .3s ease-in-out 0s normal}@keyframes loading-animation-fade{0%{opacity:0}to{opacity:1}}[id^=NotiflixLoadingWrap].nx-with-animation.nx-remove{animation:loading-animation-fade-remove .3s ease-in-out 0s normal;opacity:0}@keyframes loading-animation-fade-remove{0%{opacity:1}to{opacity:0}}[id^=NotiflixLoadingWrap]>p.nx-loading-message-new{animation:loading-new-message-fade .3s ease-in-out 0s normal}@keyframes loading-new-message-fade{0%{opacity:0}to{opacity:1}}[id^=NotiflixBlockWrap]{-webkit-box-align:center;-ms-flex-align:center;-webkit-box-pack:center;-ms-flex-pack:center;align-items:center;animation-duration:.4s;background:hsla(0,0%,100%,.9);border-radius:inherit;display:flex;flex-direction:column;flex-wrap:wrap;font-family:Quicksand,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;height:100%;justify-content:center;left:0;position:absolute;text-align:center;top:0;-webkit-user-select:none;-moz-user-select:none;user-select:none;width:100%;z-index:1000}[id^=NotiflixBlockWrap],[id^=NotiflixBlockWrap] *{box-sizing:border-box}[id^=NotiflixBlockWrap]>span[class*=-icon]{display:block;height:45px;margin:0 auto;position:relative;width:45px}[id^=NotiflixBlockWrap]>span[class*=-icon] svg{height:inherit;width:inherit}[id^=NotiflixBlockWrap]>span[class*=-message]{display:block;font-family:inherit!important;font-size:14px;font-weight:400;line-height:1.4;margin:10px auto 0;padding:0 10px;position:relative;width:100%}[id^=NotiflixBlockWrap].nx-with-animation{animation:block-animation-fade .3s ease-in-out 0s normal}@keyframes block-animation-fade{0%{opacity:0}to{opacity:1}}[id^=NotiflixBlockWrap].nx-with-animation.nx-remove{animation:block-animation-fade-remove .3s ease-in-out 0s normal;opacity:0}@keyframes block-animation-fade-remove{0%{opacity:1}to{opacity:0}}";
styleInject(css_248z$3);var css_248z$2 = ".notiflix-notify{text-align:left}";
styleInject(css_248z$2);notiflixNotifyAioExports.Notify.init({
    ID: "notiflix_notify_" + new Date().getTime()
});
var notify = notiflixNotifyAioExports.Notify;var css_248z$1 = ".swal2-popup.swal2-toast{background:#fff;box-shadow:0 0 1px rgba(0,0,0,.075),0 1px 2px rgba(0,0,0,.075),1px 2px 4px rgba(0,0,0,.075),1px 3px 8px rgba(0,0,0,.075),2px 4px 16px rgba(0,0,0,.075);box-sizing:border-box;grid-column:1/4!important;grid-row:1/4!important;grid-template-columns:min-content auto min-content;overflow-y:hidden;padding:1em;pointer-events:all}.swal2-popup.swal2-toast>*{grid-column:2}.swal2-popup.swal2-toast .swal2-title{font-size:1em;margin:.5em 1em;padding:0;text-align:initial}.swal2-popup.swal2-toast .swal2-loading{justify-content:center}.swal2-popup.swal2-toast .swal2-input{font-size:1em;height:2em;margin:.5em}.swal2-popup.swal2-toast .swal2-validation-message{font-size:1em}.swal2-popup.swal2-toast .swal2-footer{font-size:.8em;margin:.5em 0 0;padding:.5em 0 0}.swal2-popup.swal2-toast .swal2-close{align-self:center;font-size:2em;grid-column:3/3;grid-row:1/99;height:.8em;margin:0;width:.8em}.swal2-popup.swal2-toast .swal2-html-container{font-size:1em;margin:.5em 1em;overflow:initial;padding:0;text-align:initial}.swal2-popup.swal2-toast .swal2-html-container:empty{padding:0}.swal2-popup.swal2-toast .swal2-loader{align-self:center;grid-column:1;grid-row:1/99;height:2em;margin:.25em;width:2em}.swal2-popup.swal2-toast .swal2-icon{align-self:center;grid-column:1;grid-row:1/99;height:2em;margin:0 .5em 0 0;min-width:2em;width:2em}.swal2-popup.swal2-toast .swal2-icon .swal2-icon-content{align-items:center;display:flex;font-size:1.8em;font-weight:700}.swal2-popup.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{height:2em;width:2em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-popup.swal2-toast .swal2-actions{height:auto;justify-content:flex-start;margin:.5em 0 0;padding:0 .5em}.swal2-popup.swal2-toast .swal2-styled{font-size:1em;margin:.25em .5em;padding:.4em .6em}.swal2-popup.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line]{border-radius:50%;height:3em;position:absolute;transform:rotate(45deg);width:1.6em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{border-radius:4em 0 0 4em;left:-.5em;top:-.8em;transform:rotate(-45deg);transform-origin:2em 2em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{border-radius:0 4em 4em 0;left:.9375em;top:-.25em;transform-origin:0 1.5em}.swal2-popup.swal2-toast .swal2-success .swal2-success-ring{height:2em;width:2em}.swal2-popup.swal2-toast .swal2-success .swal2-success-fix{height:2.6875em;left:.4375em;top:0;width:.4375em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{left:.1875em;top:1.125em;width:.75em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{right:.1875em;top:.9375em;width:1.375em}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-toast-animate-success-line-tip .75s}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-toast-animate-success-line-long .75s}.swal2-popup.swal2-toast.swal2-show{animation:swal2-toast-show .5s}.swal2-popup.swal2-toast.swal2-hide{animation:swal2-toast-hide .1s forwards}div:where(.swal2-container){-webkit-overflow-scrolling:touch;box-sizing:border-box;display:grid;grid-template-areas:\"top-start     top            top-end\" \"center-start  center         center-end\" \"bottom-start  bottom-center  bottom-end\";grid-template-rows:minmax(min-content,auto) minmax(min-content,auto) minmax(min-content,auto);height:100%;inset:0;overflow-x:hidden;padding:.625em;position:fixed;transition:background-color .1s;z-index:1060}div:where(.swal2-container).swal2-backdrop-show,div:where(.swal2-container).swal2-noanimation{background:rgba(0,0,0,.4)}div:where(.swal2-container).swal2-backdrop-hide{background:transparent!important}div:where(.swal2-container).swal2-bottom-start,div:where(.swal2-container).swal2-center-start,div:where(.swal2-container).swal2-top-start{grid-template-columns:minmax(0,1fr) auto auto}div:where(.swal2-container).swal2-bottom,div:where(.swal2-container).swal2-center,div:where(.swal2-container).swal2-top{grid-template-columns:auto minmax(0,1fr) auto}div:where(.swal2-container).swal2-bottom-end,div:where(.swal2-container).swal2-center-end,div:where(.swal2-container).swal2-top-end{grid-template-columns:auto auto minmax(0,1fr)}div:where(.swal2-container).swal2-top-start>.swal2-popup{align-self:start}div:where(.swal2-container).swal2-top>.swal2-popup{align-self:start;grid-column:2;justify-self:center}div:where(.swal2-container).swal2-top-end>.swal2-popup,div:where(.swal2-container).swal2-top-right>.swal2-popup{align-self:start;grid-column:3;justify-self:end}div:where(.swal2-container).swal2-center-left>.swal2-popup,div:where(.swal2-container).swal2-center-start>.swal2-popup{align-self:center;grid-row:2}div:where(.swal2-container).swal2-center>.swal2-popup{align-self:center;grid-column:2;grid-row:2;justify-self:center}div:where(.swal2-container).swal2-center-end>.swal2-popup,div:where(.swal2-container).swal2-center-right>.swal2-popup{align-self:center;grid-column:3;grid-row:2;justify-self:end}div:where(.swal2-container).swal2-bottom-left>.swal2-popup,div:where(.swal2-container).swal2-bottom-start>.swal2-popup{align-self:end;grid-column:1;grid-row:3}div:where(.swal2-container).swal2-bottom>.swal2-popup{align-self:end;grid-column:2;grid-row:3;justify-self:center}div:where(.swal2-container).swal2-bottom-end>.swal2-popup,div:where(.swal2-container).swal2-bottom-right>.swal2-popup{align-self:end;grid-column:3;grid-row:3;justify-self:end}div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup,div:where(.swal2-container).swal2-grow-row>.swal2-popup{grid-column:1/4;width:100%}div:where(.swal2-container).swal2-grow-column>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{align-self:stretch;grid-row:1/4}div:where(.swal2-container).swal2-no-transition{transition:none!important}div:where(.swal2-container) div:where(.swal2-popup){background:#fff;border:none;border-radius:5px;box-sizing:border-box;color:#545454;display:none;font-family:inherit;font-size:1rem;grid-template-columns:minmax(0,100%);max-width:100%;padding:0 0 1.25em;position:relative;width:32em}div:where(.swal2-container) div:where(.swal2-popup):focus{outline:none}div:where(.swal2-container) div:where(.swal2-popup).swal2-loading{overflow-y:hidden}div:where(.swal2-container) h2:where(.swal2-title){word-wrap:break-word;color:inherit;font-size:1.875em;font-weight:600;margin:0;max-width:100%;padding:.8em 1em 0;position:relative;text-align:center;text-transform:none}div:where(.swal2-container) div:where(.swal2-actions){align-items:center;box-sizing:border-box;display:flex;flex-wrap:wrap;justify-content:center;margin:1.25em auto 0;padding:0;width:auto;z-index:1}div:where(.swal2-container) div:where(.swal2-actions):not(.swal2-loading) .swal2-styled[disabled]{opacity:.4}div:where(.swal2-container) div:where(.swal2-actions):not(.swal2-loading) .swal2-styled:hover{background-image:linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.1))}div:where(.swal2-container) div:where(.swal2-actions):not(.swal2-loading) .swal2-styled:active{background-image:linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.2))}div:where(.swal2-container) div:where(.swal2-loader){align-items:center;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-color:#2778c4 transparent;border-radius:100%;border-style:solid;border-width:.25em;display:none;height:2.2em;justify-content:center;margin:0 1.875em;width:2.2em}div:where(.swal2-container) button:where(.swal2-styled){box-shadow:0 0 0 3px transparent;font-weight:500;margin:.3125em;padding:.625em 1.1em;transition:box-shadow .1s}div:where(.swal2-container) button:where(.swal2-styled):not([disabled]){cursor:pointer}div:where(.swal2-container) button:where(.swal2-styled).swal2-confirm{background:initial;background-color:#7066e0;border:0;border-radius:.25em;color:#fff;font-size:1em}div:where(.swal2-container) button:where(.swal2-styled).swal2-confirm:focus{box-shadow:0 0 0 3px rgba(112,102,224,.5)}div:where(.swal2-container) button:where(.swal2-styled).swal2-deny{background:initial;background-color:#dc3741;border:0;border-radius:.25em;color:#fff;font-size:1em}div:where(.swal2-container) button:where(.swal2-styled).swal2-deny:focus{box-shadow:0 0 0 3px rgba(220,55,65,.5)}div:where(.swal2-container) button:where(.swal2-styled).swal2-cancel{background:initial;background-color:#6e7881;border:0;border-radius:.25em;color:#fff;font-size:1em}div:where(.swal2-container) button:where(.swal2-styled).swal2-cancel:focus{box-shadow:0 0 0 3px hsla(208,8%,47%,.5)}div:where(.swal2-container) button:where(.swal2-styled).swal2-default-outline:focus{box-shadow:0 0 0 3px rgba(100,150,200,.5)}div:where(.swal2-container) button:where(.swal2-styled):focus{outline:none}div:where(.swal2-container) button:where(.swal2-styled)::-moz-focus-inner{border:0}div:where(.swal2-container) div:where(.swal2-footer){border-top:1px solid #eee;color:inherit;font-size:1em;margin:1em 0 0;padding:1em 1em 0;text-align:center}div:where(.swal2-container) .swal2-timer-progress-bar-container{border-bottom-left-radius:5px;border-bottom-right-radius:5px;bottom:0;grid-column:auto!important;left:0;overflow:hidden;position:absolute;right:0}div:where(.swal2-container) div:where(.swal2-timer-progress-bar){background:rgba(0,0,0,.2);height:.25em;width:100%}div:where(.swal2-container) img:where(.swal2-image){margin:2em auto 1em;max-width:100%}div:where(.swal2-container) button:where(.swal2-close){align-items:center;background:transparent;border:none;border-radius:5px;color:#ccc;cursor:pointer;font-family:monospace;font-size:2.5em;height:1.2em;justify-content:center;justify-self:end;margin-bottom:-1.2em;margin-right:0;margin-top:0;overflow:hidden;padding:0;transition:color .1s,box-shadow .1s;width:1.2em;z-index:2}div:where(.swal2-container) button:where(.swal2-close):hover{background:transparent;color:#f27474;transform:none}div:where(.swal2-container) button:where(.swal2-close):focus{box-shadow:inset 0 0 0 3px rgba(100,150,200,.5);outline:none}div:where(.swal2-container) button:where(.swal2-close)::-moz-focus-inner{border:0}div:where(.swal2-container) .swal2-html-container{word-wrap:break-word;color:inherit;font-size:1.125em;font-weight:400;justify-content:center;line-height:normal;margin:1em 1.6em .3em;overflow:auto;padding:0;text-align:center;word-break:break-word;z-index:1}div:where(.swal2-container) div:where(.swal2-radio),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) label:where(.swal2-checkbox),div:where(.swal2-container) select:where(.swal2-select),div:where(.swal2-container) textarea:where(.swal2-textarea){margin:1em 2em 3px}div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) textarea:where(.swal2-textarea){background:transparent;border:1px solid #d9d9d9;border-radius:.1875em;box-shadow:inset 0 1px 1px rgba(0,0,0,.06),0 0 0 3px transparent;box-sizing:border-box;color:inherit;font-size:1.125em;transition:border-color .1s,box-shadow .1s;width:auto}div:where(.swal2-container) input:where(.swal2-file).swal2-inputerror,div:where(.swal2-container) input:where(.swal2-input).swal2-inputerror,div:where(.swal2-container) textarea:where(.swal2-textarea).swal2-inputerror{border-color:#f27474!important;box-shadow:0 0 2px #f27474!important}div:where(.swal2-container) input:where(.swal2-file):focus,div:where(.swal2-container) input:where(.swal2-input):focus,div:where(.swal2-container) textarea:where(.swal2-textarea):focus{border:1px solid #b4dbed;box-shadow:inset 0 1px 1px rgba(0,0,0,.06),0 0 0 3px rgba(100,150,200,.5);outline:none}div:where(.swal2-container) input:where(.swal2-file)::-moz-placeholder, div:where(.swal2-container) input:where(.swal2-input)::-moz-placeholder, div:where(.swal2-container) textarea:where(.swal2-textarea)::-moz-placeholder{color:#ccc}div:where(.swal2-container) input:where(.swal2-file)::placeholder,div:where(.swal2-container) input:where(.swal2-input)::placeholder,div:where(.swal2-container) textarea:where(.swal2-textarea)::placeholder{color:#ccc}div:where(.swal2-container) .swal2-range{background:#fff;margin:1em 2em 3px}div:where(.swal2-container) .swal2-range input{width:80%}div:where(.swal2-container) .swal2-range output{color:inherit;font-weight:600;text-align:center;width:20%}div:where(.swal2-container) .swal2-range input,div:where(.swal2-container) .swal2-range output{font-size:1.125em;height:2.625em;line-height:2.625em;padding:0}div:where(.swal2-container) .swal2-input{height:2.625em;padding:0 .75em}div:where(.swal2-container) .swal2-file{background:transparent;font-size:1.125em;margin-left:auto;margin-right:auto;width:75%}div:where(.swal2-container) .swal2-textarea{height:6.75em;padding:.75em}div:where(.swal2-container) .swal2-select{background:transparent;color:inherit;font-size:1.125em;max-width:100%;min-width:50%;padding:.375em .625em}div:where(.swal2-container) .swal2-checkbox,div:where(.swal2-container) .swal2-radio{align-items:center;background:#fff;color:inherit;justify-content:center}div:where(.swal2-container) .swal2-checkbox label,div:where(.swal2-container) .swal2-radio label{font-size:1.125em;margin:0 .6em}div:where(.swal2-container) .swal2-checkbox input,div:where(.swal2-container) .swal2-radio input{flex-shrink:0;margin:0 .4em}div:where(.swal2-container) label:where(.swal2-input-label){display:flex;justify-content:center;margin:1em auto 0}div:where(.swal2-container) div:where(.swal2-validation-message){align-items:center;background:#f0f0f0;color:#666;font-size:1em;font-weight:300;justify-content:center;margin:1em 0 0;overflow:hidden;padding:.625em}div:where(.swal2-container) div:where(.swal2-validation-message):before{background-color:#f27474;border-radius:50%;color:#fff;content:\"!\";display:inline-block;font-weight:600;height:1.5em;line-height:1.5em;margin:0 .625em;min-width:1.5em;text-align:center;width:1.5em}div:where(.swal2-container) .swal2-progress-steps{align-items:center;background:transparent;flex-wrap:wrap;font-weight:600;margin:1.25em auto;max-width:100%;padding:0}div:where(.swal2-container) .swal2-progress-steps li{display:inline-block;position:relative}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step{background:#2778c4;border-radius:2em;color:#fff;flex-shrink:0;height:2em;line-height:2em;text-align:center;width:2em;z-index:20}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:#add8e6;color:#fff}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:#add8e6}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step-line{background:#2778c4;flex-shrink:0;height:.4em;margin:0 -1px;width:2.5em;z-index:10}div:where(.swal2-icon){border:.25em solid #000;border-radius:50%;box-sizing:content-box;cursor:default;font-family:inherit;height:5em;justify-content:center;line-height:5em;margin:2.5em auto .6em;position:relative;-webkit-user-select:none;-moz-user-select:none;user-select:none;width:5em}div:where(.swal2-icon) .swal2-icon-content{align-items:center;display:flex;font-size:3.75em}div:where(.swal2-icon).swal2-error{border-color:#f27474;color:#f27474}div:where(.swal2-icon).swal2-error .swal2-x-mark{flex-grow:1;position:relative}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line]{background-color:#f27474;border-radius:.125em;display:block;height:.3125em;position:absolute;top:2.3125em;width:2.9375em}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-error.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-error.swal2-icon-show .swal2-x-mark{animation:swal2-animate-error-x-mark .5s}div:where(.swal2-icon).swal2-warning{border-color:#facea8;color:#f8bb86}div:where(.swal2-icon).swal2-warning.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-warning.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .5s}div:where(.swal2-icon).swal2-info{border-color:#9de0f6;color:#3fc3ee}div:where(.swal2-icon).swal2-info.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-info.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .8s}div:where(.swal2-icon).swal2-question{border-color:#c9dae1;color:#87adbd}div:where(.swal2-icon).swal2-question.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-question.swal2-icon-show .swal2-icon-content{animation:swal2-animate-question-mark .8s}div:where(.swal2-icon).swal2-success{border-color:#a5dc86;color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line]{border-radius:50%;height:7.5em;position:absolute;transform:rotate(45deg);width:3.75em}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=left]{border-radius:7.5em 0 0 7.5em;left:-2.0635em;top:-.4375em;transform:rotate(-45deg);transform-origin:3.75em 3.75em}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=right]{border-radius:0 7.5em 7.5em 0;left:1.875em;top:-.6875em;transform:rotate(-45deg);transform-origin:0 3.75em}div:where(.swal2-icon).swal2-success .swal2-success-ring{border:.25em solid hsla(98,55%,69%,.3);border-radius:50%;box-sizing:content-box;height:100%;left:-.25em;position:absolute;top:-.25em;width:100%;z-index:2}div:where(.swal2-icon).swal2-success .swal2-success-fix{height:5.625em;left:1.625em;position:absolute;top:.5em;transform:rotate(-45deg);width:.4375em;z-index:1}div:where(.swal2-icon).swal2-success [class^=swal2-success-line]{background-color:#a5dc86;border-radius:.125em;display:block;height:.3125em;position:absolute;z-index:2}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=tip]{left:.8125em;top:2.875em;transform:rotate(45deg);width:1.5625em}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=long]{right:.5em;top:2.375em;transform:rotate(-45deg);width:2.9375em}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-animate-success-line-tip .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-animate-success-line-long .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-circular-line-right{animation:swal2-rotate-success-circular-line 4.25s ease-in}[class^=swal2]{-webkit-tap-highlight-color:rgba(0,0,0,0)}.swal2-show{animation:swal2-show .3s}.swal2-hide{animation:swal2-hide .15s forwards}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{height:50px;overflow:scroll;position:absolute;top:-9999px;width:50px}.swal2-rtl .swal2-close{margin-left:0;margin-right:0}.swal2-rtl .swal2-timer-progress-bar{left:auto;right:0}@keyframes swal2-toast-show{0%{transform:translateY(-.625em) rotate(2deg)}33%{transform:translateY(0) rotate(-2deg)}66%{transform:translateY(.3125em) rotate(2deg)}to{transform:translateY(0) rotate(0deg)}}@keyframes swal2-toast-hide{to{opacity:0;transform:rotate(1deg)}}@keyframes swal2-toast-animate-success-line-tip{0%{left:.0625em;top:.5625em;width:0}54%{left:.125em;top:.125em;width:0}70%{left:-.25em;top:.625em;width:1.625em}84%{left:.75em;top:1.0625em;width:.5em}to{left:.1875em;top:1.125em;width:.75em}}@keyframes swal2-toast-animate-success-line-long{0%{right:1.375em;top:1.625em;width:0}65%{right:.9375em;top:1.25em;width:0}84%{right:0;top:.9375em;width:1.125em}to{right:.1875em;top:.9375em;width:1.375em}}@keyframes swal2-show{0%{transform:scale(.7)}45%{transform:scale(1.05)}80%{transform:scale(.95)}to{transform:scale(1)}}@keyframes swal2-hide{0%{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.5)}}@keyframes swal2-animate-success-line-tip{0%{left:.0625em;top:1.1875em;width:0}54%{left:.125em;top:1.0625em;width:0}70%{left:-.375em;top:2.1875em;width:3.125em}84%{left:1.3125em;top:3em;width:1.0625em}to{left:.8125em;top:2.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-long{0%{right:2.875em;top:3.375em;width:0}65%{right:2.875em;top:3.375em;width:0}84%{right:0;top:2.1875em;width:3.4375em}to{right:.5em;top:2.375em;width:2.9375em}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}to{transform:rotate(-405deg)}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;opacity:0;transform:scale(.4)}50%{margin-top:1.625em;opacity:0;transform:scale(.4)}80%{margin-top:-.375em;transform:scale(1.15)}to{margin-top:0;opacity:1;transform:scale(1)}}@keyframes swal2-animate-error-icon{0%{opacity:0;transform:rotateX(100deg)}to{opacity:1;transform:rotateX(0deg)}}@keyframes swal2-rotate-loading{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}@keyframes swal2-animate-question-mark{0%{transform:rotateY(-1turn)}to{transform:rotateY(0)}}@keyframes swal2-animate-i-mark{0%{opacity:0;transform:rotate(45deg)}25%{opacity:.4;transform:rotate(-25deg)}50%{opacity:.8;transform:rotate(15deg)}75%{opacity:1;transform:rotate(-5deg)}to{opacity:1;transform:rotateX(0)}}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto!important}body.swal2-no-backdrop .swal2-container{background-color:transparent!important;pointer-events:none}body.swal2-no-backdrop .swal2-container .swal2-popup{pointer-events:all}body.swal2-no-backdrop .swal2-container .swal2-modal{box-shadow:0 0 10px rgba(0,0,0,.4)}@media print{body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow-y:scroll!important}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown) .swal2-container{position:static!important}}body.swal2-toast-shown .swal2-container{background-color:transparent;box-sizing:border-box;max-width:100%;pointer-events:none;width:360px}body.swal2-toast-shown .swal2-container.swal2-top{inset:0 auto auto 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{inset:0 0 auto auto}body.swal2-toast-shown .swal2-container.swal2-top-left,body.swal2-toast-shown .swal2-container.swal2-top-start{inset:0 auto auto 0}body.swal2-toast-shown .swal2-container.swal2-center-left,body.swal2-toast-shown .swal2-container.swal2-center-start{inset:50% auto auto 0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{inset:50% auto auto 50%;transform:translate(-50%,-50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{inset:50% 0 auto auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-left,body.swal2-toast-shown .swal2-container.swal2-bottom-start{inset:auto auto 0 0}body.swal2-toast-shown .swal2-container.swal2-bottom{inset:auto auto 0 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{inset:auto 0 0 auto}";
styleInject(css_248z$1);var sweetalert2_all = {exports: {}};/*!
* sweetalert2 v11.7.25
* Released under the MIT License.
*/
(function (module, exports) {
	(function (global, factory) {
	  module.exports = factory() ;
	})(commonjsGlobal, (function () {	  const RESTORE_FOCUS_TIMEOUT = 100;
	  const globalState = {};
	  const focusPreviousActiveElement = () => {
	    if (globalState.previousActiveElement instanceof HTMLElement) {
	      globalState.previousActiveElement.focus();
	      globalState.previousActiveElement = null;
	    } else if (document.body) {
	      document.body.focus();
	    }
	  };
	  const restoreActiveElement = returnFocus => {
	    return new Promise(resolve => {
	      if (!returnFocus) {
	        return resolve();
	      }
	      const x = window.scrollX;
	      const y = window.scrollY;
	      globalState.restoreFocusTimeout = setTimeout(() => {
	        focusPreviousActiveElement();
	        resolve();
	      }, RESTORE_FOCUS_TIMEOUT);
	      window.scrollTo(x, y);
	    });
	  };
	  var privateProps = {
	    promise: new WeakMap(),
	    innerParams: new WeakMap(),
	    domCache: new WeakMap()
	  };
	  const swalPrefix = 'swal2-';
	  const classNames = ['container', 'shown', 'height-auto', 'iosfix', 'popup', 'modal', 'no-backdrop', 'no-transition', 'toast', 'toast-shown', 'show', 'hide', 'close', 'title', 'html-container', 'actions', 'confirm', 'deny', 'cancel', 'default-outline', 'footer', 'icon', 'icon-content', 'image', 'input', 'file', 'range', 'select', 'radio', 'checkbox', 'label', 'textarea', 'inputerror', 'input-label', 'validation-message', 'progress-steps', 'active-progress-step', 'progress-step', 'progress-step-line', 'loader', 'loading', 'styled', 'top', 'top-start', 'top-end', 'top-left', 'top-right', 'center', 'center-start', 'center-end', 'center-left', 'center-right', 'bottom', 'bottom-start', 'bottom-end', 'bottom-left', 'bottom-right', 'grow-row', 'grow-column', 'grow-fullscreen', 'rtl', 'timer-progress-bar', 'timer-progress-bar-container', 'scrollbar-measure', 'icon-success', 'icon-warning', 'icon-info', 'icon-question', 'icon-error'];
	  const swalClasses = classNames.reduce((acc, className) => {
	    acc[className] = swalPrefix + className;
	    return acc;
	  }, {});
	  const icons = ['success', 'warning', 'info', 'question', 'error'];
	  const iconTypes = icons.reduce((acc, icon) => {
	    acc[icon] = swalPrefix + icon;
	    return acc;
	  }, {});
	  const consolePrefix = 'SweetAlert2:';
	  const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);
	  const warn = message => {
	    console.warn("".concat(consolePrefix, " ").concat(typeof message === 'object' ? message.join(' ') : message));
	  };
	  const error = message => {
	    console.error("".concat(consolePrefix, " ").concat(message));
	  };
	  const previousWarnOnceMessages = [];
	  const warnOnce = message => {
	    if (!previousWarnOnceMessages.includes(message)) {
	      previousWarnOnceMessages.push(message);
	      warn(message);
	    }
	  };
	  const warnAboutDeprecation = (deprecatedParam, useInstead) => {
	    warnOnce("\"".concat(deprecatedParam, "\" is deprecated and will be removed in the next major release. Please use \"").concat(useInstead, "\" instead."));
	  };
	  const callIfFunction = arg => typeof arg === 'function' ? arg() : arg;
	  const hasToPromiseFn = arg => arg && typeof arg.toPromise === 'function';
	  const asPromise = arg => hasToPromiseFn(arg) ? arg.toPromise() : Promise.resolve(arg);
	  const isPromise = arg => arg && Promise.resolve(arg) === arg;
	  const getContainer = () => document.body.querySelector(".".concat(swalClasses.container));
	  const elementBySelector = selectorString => {
	    const container = getContainer();
	    return container ? container.querySelector(selectorString) : null;
	  };
	  const elementByClass = className => {
	    return elementBySelector(".".concat(className));
	  };
	  const getPopup = () => elementByClass(swalClasses.popup);
	  const getIcon = () => elementByClass(swalClasses.icon);
	  const getIconContent = () => elementByClass(swalClasses['icon-content']);
	  const getTitle = () => elementByClass(swalClasses.title);
	  const getHtmlContainer = () => elementByClass(swalClasses['html-container']);
	  const getImage = () => elementByClass(swalClasses.image);
	  const getProgressSteps = () => elementByClass(swalClasses['progress-steps']);
	  const getValidationMessage = () => elementByClass(swalClasses['validation-message']);
	  const getConfirmButton = () => elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.confirm));
	  const getCancelButton = () => elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.cancel));
	  const getDenyButton = () => elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.deny));
	  const getInputLabel = () => elementByClass(swalClasses['input-label']);
	  const getLoader = () => elementBySelector(".".concat(swalClasses.loader));
	  const getActions = () => elementByClass(swalClasses.actions);
	  const getFooter = () => elementByClass(swalClasses.footer);
	  const getTimerProgressBar = () => elementByClass(swalClasses['timer-progress-bar']);
	  const getCloseButton = () => elementByClass(swalClasses.close);
	  const focusable = "\n  a[href],\n  area[href],\n  input:not([disabled]),\n  select:not([disabled]),\n  textarea:not([disabled]),\n  button:not([disabled]),\n  iframe,\n  object,\n  embed,\n  [tabindex=\"0\"],\n  [contenteditable],\n  audio[controls],\n  video[controls],\n  summary\n";
	  const getFocusableElements = () => {
	    const popup = getPopup();
	    if (!popup) {
	      return [];
	    }
	    const focusableElementsWithTabindex = popup.querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])');
	    const focusableElementsWithTabindexSorted = Array.from(focusableElementsWithTabindex)
	    .sort((a, b) => {
	      const tabindexA = parseInt(a.getAttribute('tabindex') || '0');
	      const tabindexB = parseInt(b.getAttribute('tabindex') || '0');
	      if (tabindexA > tabindexB) {
	        return 1;
	      } else if (tabindexA < tabindexB) {
	        return -1;
	      }
	      return 0;
	    });
	    const otherFocusableElements = popup.querySelectorAll(focusable);
	    const otherFocusableElementsFiltered = Array.from(otherFocusableElements).filter(el => el.getAttribute('tabindex') !== '-1');
	    return [...new Set(focusableElementsWithTabindexSorted.concat(otherFocusableElementsFiltered))].filter(el => isVisible$1(el));
	  };
	  const isModal = () => {
	    return hasClass(document.body, swalClasses.shown) && !hasClass(document.body, swalClasses['toast-shown']) && !hasClass(document.body, swalClasses['no-backdrop']);
	  };
	  const isToast = () => {
	    const popup = getPopup();
	    if (!popup) {
	      return false;
	    }
	    return hasClass(popup, swalClasses.toast);
	  };
	  const isLoading = () => {
	    const popup = getPopup();
	    if (!popup) {
	      return false;
	    }
	    return popup.hasAttribute('data-loading');
	  };
	  const setInnerHtml = (elem, html) => {
	    elem.textContent = '';
	    if (html) {
	      const parser = new DOMParser();
	      const parsed = parser.parseFromString(html, "text/html");
	      const head = parsed.querySelector('head');
	      head && Array.from(head.childNodes).forEach(child => {
	        elem.appendChild(child);
	      });
	      const body = parsed.querySelector('body');
	      body && Array.from(body.childNodes).forEach(child => {
	        if (child instanceof HTMLVideoElement || child instanceof HTMLAudioElement) {
	          elem.appendChild(child.cloneNode(true));
	        } else {
	          elem.appendChild(child);
	        }
	      });
	    }
	  };
	  const hasClass = (elem, className) => {
	    if (!className) {
	      return false;
	    }
	    const classList = className.split(/\s+/);
	    for (let i = 0; i < classList.length; i++) {
	      if (!elem.classList.contains(classList[i])) {
	        return false;
	      }
	    }
	    return true;
	  };
	  const removeCustomClasses = (elem, params) => {
	    Array.from(elem.classList).forEach(className => {
	      if (!Object.values(swalClasses).includes(className) && !Object.values(iconTypes).includes(className) && !Object.values(params.showClass || {}).includes(className)) {
	        elem.classList.remove(className);
	      }
	    });
	  };
	  const applyCustomClass = (elem, params, className) => {
	    removeCustomClasses(elem, params);
	    if (params.customClass && params.customClass[className]) {
	      if (typeof params.customClass[className] !== 'string' && !params.customClass[className].forEach) {
	        warn("Invalid type of customClass.".concat(className, "! Expected string or iterable object, got \"").concat(typeof params.customClass[className], "\""));
	        return;
	      }
	      addClass(elem, params.customClass[className]);
	    }
	  };
	  const getInput$1 = (popup, inputClass) => {
	    if (!inputClass) {
	      return null;
	    }
	    switch (inputClass) {
	      case 'select':
	      case 'textarea':
	      case 'file':
	        return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses[inputClass]));
	      case 'checkbox':
	        return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.checkbox, " input"));
	      case 'radio':
	        return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.radio, " input:checked")) || popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.radio, " input:first-child"));
	      case 'range':
	        return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.range, " input"));
	      default:
	        return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.input));
	    }
	  };
	  const focusInput = input => {
	    input.focus();
	    if (input.type !== 'file') {
	      const val = input.value;
	      input.value = '';
	      input.value = val;
	    }
	  };
	  const toggleClass = (target, classList, condition) => {
	    if (!target || !classList) {
	      return;
	    }
	    if (typeof classList === 'string') {
	      classList = classList.split(/\s+/).filter(Boolean);
	    }
	    classList.forEach(className => {
	      if (Array.isArray(target)) {
	        target.forEach(elem => {
	          condition ? elem.classList.add(className) : elem.classList.remove(className);
	        });
	      } else {
	        condition ? target.classList.add(className) : target.classList.remove(className);
	      }
	    });
	  };
	  const addClass = (target, classList) => {
	    toggleClass(target, classList, true);
	  };
	  const removeClass = (target, classList) => {
	    toggleClass(target, classList, false);
	  };
	  const getDirectChildByClass = (elem, className) => {
	    const children = Array.from(elem.children);
	    for (let i = 0; i < children.length; i++) {
	      const child = children[i];
	      if (child instanceof HTMLElement && hasClass(child, className)) {
	        return child;
	      }
	    }
	  };
	  const applyNumericalStyle = (elem, property, value) => {
	    if (value === "".concat(parseInt(value))) {
	      value = parseInt(value);
	    }
	    if (value || parseInt(value) === 0) {
	      elem.style[property] = typeof value === 'number' ? "".concat(value, "px") : value;
	    } else {
	      elem.style.removeProperty(property);
	    }
	  };
	  const show = function (elem) {
	    let display = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'flex';
	    elem && (elem.style.display = display);
	  };
	  const hide = elem => {
	    elem && (elem.style.display = 'none');
	  };
	  const setStyle = (parent, selector, property, value) => {
	    const el = parent.querySelector(selector);
	    if (el) {
	      el.style[property] = value;
	    }
	  };
	  const toggle = function (elem, condition) {
	    let display = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'flex';
	    condition ? show(elem, display) : hide(elem);
	  };
	  const isVisible$1 = elem => !!(elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length));
	  const allButtonsAreHidden = () => !isVisible$1(getConfirmButton()) && !isVisible$1(getDenyButton()) && !isVisible$1(getCancelButton());
	  const isScrollable = elem => !!(elem.scrollHeight > elem.clientHeight);
	  const hasCssAnimation = elem => {
	    const style = window.getComputedStyle(elem);
	    const animDuration = parseFloat(style.getPropertyValue('animation-duration') || '0');
	    const transDuration = parseFloat(style.getPropertyValue('transition-duration') || '0');
	    return animDuration > 0 || transDuration > 0;
	  };
	  const animateTimerProgressBar = function (timer) {
	    let reset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	    const timerProgressBar = getTimerProgressBar();
	    if (!timerProgressBar) {
	      return;
	    }
	    if (isVisible$1(timerProgressBar)) {
	      if (reset) {
	        timerProgressBar.style.transition = 'none';
	        timerProgressBar.style.width = '100%';
	      }
	      setTimeout(() => {
	        timerProgressBar.style.transition = "width ".concat(timer / 1000, "s linear");
	        timerProgressBar.style.width = '0%';
	      }, 10);
	    }
	  };
	  const stopTimerProgressBar = () => {
	    const timerProgressBar = getTimerProgressBar();
	    if (!timerProgressBar) {
	      return;
	    }
	    const timerProgressBarWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
	    timerProgressBar.style.removeProperty('transition');
	    timerProgressBar.style.width = '100%';
	    const timerProgressBarFullWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
	    const timerProgressBarPercent = timerProgressBarWidth / timerProgressBarFullWidth * 100;
	    timerProgressBar.style.width = "".concat(timerProgressBarPercent, "%");
	  };
	  const isNodeEnv = () => typeof window === 'undefined' || typeof document === 'undefined';
	  const sweetHTML = "\n <div aria-labelledby=\"".concat(swalClasses.title, "\" aria-describedby=\"").concat(swalClasses['html-container'], "\" class=\"").concat(swalClasses.popup, "\" tabindex=\"-1\">\n   <button type=\"button\" class=\"").concat(swalClasses.close, "\"></button>\n   <ul class=\"").concat(swalClasses['progress-steps'], "\"></ul>\n   <div class=\"").concat(swalClasses.icon, "\"></div>\n   <img class=\"").concat(swalClasses.image, "\" />\n   <h2 class=\"").concat(swalClasses.title, "\" id=\"").concat(swalClasses.title, "\"></h2>\n   <div class=\"").concat(swalClasses['html-container'], "\" id=\"").concat(swalClasses['html-container'], "\"></div>\n   <input class=\"").concat(swalClasses.input, "\" id=\"").concat(swalClasses.input, "\" />\n   <input type=\"file\" class=\"").concat(swalClasses.file, "\" />\n   <div class=\"").concat(swalClasses.range, "\">\n     <input type=\"range\" />\n     <output></output>\n   </div>\n   <select class=\"").concat(swalClasses.select, "\" id=\"").concat(swalClasses.select, "\"></select>\n   <div class=\"").concat(swalClasses.radio, "\"></div>\n   <label class=\"").concat(swalClasses.checkbox, "\">\n     <input type=\"checkbox\" id=\"").concat(swalClasses.checkbox, "\" />\n     <span class=\"").concat(swalClasses.label, "\"></span>\n   </label>\n   <textarea class=\"").concat(swalClasses.textarea, "\" id=\"").concat(swalClasses.textarea, "\"></textarea>\n   <div class=\"").concat(swalClasses['validation-message'], "\" id=\"").concat(swalClasses['validation-message'], "\"></div>\n   <div class=\"").concat(swalClasses.actions, "\">\n     <div class=\"").concat(swalClasses.loader, "\"></div>\n     <button type=\"button\" class=\"").concat(swalClasses.confirm, "\"></button>\n     <button type=\"button\" class=\"").concat(swalClasses.deny, "\"></button>\n     <button type=\"button\" class=\"").concat(swalClasses.cancel, "\"></button>\n   </div>\n   <div class=\"").concat(swalClasses.footer, "\"></div>\n   <div class=\"").concat(swalClasses['timer-progress-bar-container'], "\">\n     <div class=\"").concat(swalClasses['timer-progress-bar'], "\"></div>\n   </div>\n </div>\n").replace(/(^|\n)\s*/g, '');
	  const resetOldContainer = () => {
	    const oldContainer = getContainer();
	    if (!oldContainer) {
	      return false;
	    }
	    oldContainer.remove();
	    removeClass([document.documentElement, document.body], [swalClasses['no-backdrop'], swalClasses['toast-shown'], swalClasses['has-column']]);
	    return true;
	  };
	  const resetValidationMessage$1 = () => {
	    globalState.currentInstance.resetValidationMessage();
	  };
	  const addInputChangeListeners = () => {
	    const popup = getPopup();
	    const input = getDirectChildByClass(popup, swalClasses.input);
	    const file = getDirectChildByClass(popup, swalClasses.file);
	    const range = popup.querySelector(".".concat(swalClasses.range, " input"));
	    const rangeOutput = popup.querySelector(".".concat(swalClasses.range, " output"));
	    const select = getDirectChildByClass(popup, swalClasses.select);
	    const checkbox = popup.querySelector(".".concat(swalClasses.checkbox, " input"));
	    const textarea = getDirectChildByClass(popup, swalClasses.textarea);
	    input.oninput = resetValidationMessage$1;
	    file.onchange = resetValidationMessage$1;
	    select.onchange = resetValidationMessage$1;
	    checkbox.onchange = resetValidationMessage$1;
	    textarea.oninput = resetValidationMessage$1;
	    range.oninput = () => {
	      resetValidationMessage$1();
	      rangeOutput.value = range.value;
	    };
	    range.onchange = () => {
	      resetValidationMessage$1();
	      rangeOutput.value = range.value;
	    };
	  };
	  const getTarget = target => typeof target === 'string' ? document.querySelector(target) : target;
	  const setupAccessibility = params => {
	    const popup = getPopup();
	    popup.setAttribute('role', params.toast ? 'alert' : 'dialog');
	    popup.setAttribute('aria-live', params.toast ? 'polite' : 'assertive');
	    if (!params.toast) {
	      popup.setAttribute('aria-modal', 'true');
	    }
	  };
	  const setupRTL = targetElement => {
	    if (window.getComputedStyle(targetElement).direction === 'rtl') {
	      addClass(getContainer(), swalClasses.rtl);
	    }
	  };
	  const init = params => {
	    const oldContainerExisted = resetOldContainer();
	    if (isNodeEnv()) {
	      error('SweetAlert2 requires document to initialize');
	      return;
	    }
	    const container = document.createElement('div');
	    container.className = swalClasses.container;
	    if (oldContainerExisted) {
	      addClass(container, swalClasses['no-transition']);
	    }
	    setInnerHtml(container, sweetHTML);
	    const targetElement = getTarget(params.target);
	    targetElement.appendChild(container);
	    setupAccessibility(params);
	    setupRTL(targetElement);
	    addInputChangeListeners();
	  };
	  const parseHtmlToContainer = (param, target) => {
	    if (param instanceof HTMLElement) {
	      target.appendChild(param);
	    }
	    else if (typeof param === 'object') {
	      handleObject(param, target);
	    }
	    else if (param) {
	      setInnerHtml(target, param);
	    }
	  };
	  const handleObject = (param, target) => {
	    if (param.jquery) {
	      handleJqueryElem(target, param);
	    }
	    else {
	      setInnerHtml(target, param.toString());
	    }
	  };
	  const handleJqueryElem = (target, elem) => {
	    target.textContent = '';
	    if (0 in elem) {
	      for (let i = 0; (i in elem); i++) {
	        target.appendChild(elem[i].cloneNode(true));
	      }
	    } else {
	      target.appendChild(elem.cloneNode(true));
	    }
	  };
	  const animationEndEvent = (() => {
	    if (isNodeEnv()) {
	      return false;
	    }
	    const testEl = document.createElement('div');
	    if (typeof testEl.style.webkitAnimation !== 'undefined') {
	      return 'webkitAnimationEnd';
	    }
	    if (typeof testEl.style.animation !== 'undefined') {
	      return 'animationend';
	    }
	    return false;
	  })();
	  const renderActions = (instance, params) => {
	    const actions = getActions();
	    const loader = getLoader();
	    if (!actions || !loader) {
	      return;
	    }
	    if (!params.showConfirmButton && !params.showDenyButton && !params.showCancelButton) {
	      hide(actions);
	    } else {
	      show(actions);
	    }
	    applyCustomClass(actions, params, 'actions');
	    renderButtons(actions, loader, params);
	    setInnerHtml(loader, params.loaderHtml || '');
	    applyCustomClass(loader, params, 'loader');
	  };
	  function renderButtons(actions, loader, params) {
	    const confirmButton = getConfirmButton();
	    const denyButton = getDenyButton();
	    const cancelButton = getCancelButton();
	    if (!confirmButton || !denyButton || !cancelButton) {
	      return;
	    }
	    renderButton(confirmButton, 'confirm', params);
	    renderButton(denyButton, 'deny', params);
	    renderButton(cancelButton, 'cancel', params);
	    handleButtonsStyling(confirmButton, denyButton, cancelButton, params);
	    if (params.reverseButtons) {
	      if (params.toast) {
	        actions.insertBefore(cancelButton, confirmButton);
	        actions.insertBefore(denyButton, confirmButton);
	      } else {
	        actions.insertBefore(cancelButton, loader);
	        actions.insertBefore(denyButton, loader);
	        actions.insertBefore(confirmButton, loader);
	      }
	    }
	  }
	  function handleButtonsStyling(confirmButton, denyButton, cancelButton, params) {
	    if (!params.buttonsStyling) {
	      removeClass([confirmButton, denyButton, cancelButton], swalClasses.styled);
	      return;
	    }
	    addClass([confirmButton, denyButton, cancelButton], swalClasses.styled);
	    if (params.confirmButtonColor) {
	      confirmButton.style.backgroundColor = params.confirmButtonColor;
	      addClass(confirmButton, swalClasses['default-outline']);
	    }
	    if (params.denyButtonColor) {
	      denyButton.style.backgroundColor = params.denyButtonColor;
	      addClass(denyButton, swalClasses['default-outline']);
	    }
	    if (params.cancelButtonColor) {
	      cancelButton.style.backgroundColor = params.cancelButtonColor;
	      addClass(cancelButton, swalClasses['default-outline']);
	    }
	  }
	  function renderButton(button, buttonType, params) {
	    const buttonName = capitalizeFirstLetter(buttonType);
	    toggle(button, params["show".concat(buttonName, "Button")], 'inline-block');
	    setInnerHtml(button, params["".concat(buttonType, "ButtonText")] || '');
	    button.setAttribute('aria-label', params["".concat(buttonType, "ButtonAriaLabel")] || '');
	    button.className = swalClasses[buttonType];
	    applyCustomClass(button, params, "".concat(buttonType, "Button"));
	  }
	  const renderCloseButton = (instance, params) => {
	    const closeButton = getCloseButton();
	    if (!closeButton) {
	      return;
	    }
	    setInnerHtml(closeButton, params.closeButtonHtml || '');
	    applyCustomClass(closeButton, params, 'closeButton');
	    toggle(closeButton, params.showCloseButton);
	    closeButton.setAttribute('aria-label', params.closeButtonAriaLabel || '');
	  };
	  const renderContainer = (instance, params) => {
	    const container = getContainer();
	    if (!container) {
	      return;
	    }
	    handleBackdropParam(container, params.backdrop);
	    handlePositionParam(container, params.position);
	    handleGrowParam(container, params.grow);
	    applyCustomClass(container, params, 'container');
	  };
	  function handleBackdropParam(container, backdrop) {
	    if (typeof backdrop === 'string') {
	      container.style.background = backdrop;
	    } else if (!backdrop) {
	      addClass([document.documentElement, document.body], swalClasses['no-backdrop']);
	    }
	  }
	  function handlePositionParam(container, position) {
	    if (!position) {
	      return;
	    }
	    if (position in swalClasses) {
	      addClass(container, swalClasses[position]);
	    } else {
	      warn('The "position" parameter is not valid, defaulting to "center"');
	      addClass(container, swalClasses.center);
	    }
	  }
	  function handleGrowParam(container, grow) {
	    if (!grow) {
	      return;
	    }
	    addClass(container, swalClasses["grow-".concat(grow)]);
	  }
	  const inputClasses = ['input', 'file', 'range', 'select', 'radio', 'checkbox', 'textarea'];
	  const renderInput = (instance, params) => {
	    const popup = getPopup();
	    if (!popup) {
	      return;
	    }
	    const innerParams = privateProps.innerParams.get(instance);
	    const rerender = !innerParams || params.input !== innerParams.input;
	    inputClasses.forEach(inputClass => {
	      const inputContainer = getDirectChildByClass(popup, swalClasses[inputClass]);
	      if (!inputContainer) {
	        return;
	      }
	      setAttributes(inputClass, params.inputAttributes);
	      inputContainer.className = swalClasses[inputClass];
	      if (rerender) {
	        hide(inputContainer);
	      }
	    });
	    if (params.input) {
	      if (rerender) {
	        showInput(params);
	      }
	      setCustomClass(params);
	    }
	  };
	  const showInput = params => {
	    if (!params.input) {
	      return;
	    }
	    if (!renderInputType[params.input]) {
	      error("Unexpected type of input! Expected \"text\", \"email\", \"password\", \"number\", \"tel\", \"select\", \"radio\", \"checkbox\", \"textarea\", \"file\" or \"url\", got \"".concat(params.input, "\""));
	      return;
	    }
	    const inputContainer = getInputContainer(params.input);
	    const input = renderInputType[params.input](inputContainer, params);
	    show(inputContainer);
	    if (params.inputAutoFocus) {
	      setTimeout(() => {
	        focusInput(input);
	      });
	    }
	  };
	  const removeAttributes = input => {
	    for (let i = 0; i < input.attributes.length; i++) {
	      const attrName = input.attributes[i].name;
	      if (!['id', 'type', 'value', 'style'].includes(attrName)) {
	        input.removeAttribute(attrName);
	      }
	    }
	  };
	  const setAttributes = (inputClass, inputAttributes) => {
	    const input = getInput$1(getPopup(), inputClass);
	    if (!input) {
	      return;
	    }
	    removeAttributes(input);
	    for (const attr in inputAttributes) {
	      input.setAttribute(attr, inputAttributes[attr]);
	    }
	  };
	  const setCustomClass = params => {
	    const inputContainer = getInputContainer(params.input);
	    if (typeof params.customClass === 'object') {
	      addClass(inputContainer, params.customClass.input);
	    }
	  };
	  const setInputPlaceholder = (input, params) => {
	    if (!input.placeholder || params.inputPlaceholder) {
	      input.placeholder = params.inputPlaceholder;
	    }
	  };
	  const setInputLabel = (input, prependTo, params) => {
	    if (params.inputLabel) {
	      const label = document.createElement('label');
	      const labelClass = swalClasses['input-label'];
	      label.setAttribute('for', input.id);
	      label.className = labelClass;
	      if (typeof params.customClass === 'object') {
	        addClass(label, params.customClass.inputLabel);
	      }
	      label.innerText = params.inputLabel;
	      prependTo.insertAdjacentElement('beforebegin', label);
	    }
	  };
	  const getInputContainer = inputType => {
	    return getDirectChildByClass(getPopup(), swalClasses[inputType] || swalClasses.input);
	  };
	  const checkAndSetInputValue = (input, inputValue) => {
	    if (['string', 'number'].includes(typeof inputValue)) {
	      input.value = "".concat(inputValue);
	    } else if (!isPromise(inputValue)) {
	      warn("Unexpected type of inputValue! Expected \"string\", \"number\" or \"Promise\", got \"".concat(typeof inputValue, "\""));
	    }
	  };
	  const renderInputType = {};
	  renderInputType.text = renderInputType.email = renderInputType.password = renderInputType.number = renderInputType.tel = renderInputType.url = (input, params) => {
	    checkAndSetInputValue(input, params.inputValue);
	    setInputLabel(input, input, params);
	    setInputPlaceholder(input, params);
	    input.type = params.input;
	    return input;
	  };
	  renderInputType.file = (input, params) => {
	    setInputLabel(input, input, params);
	    setInputPlaceholder(input, params);
	    return input;
	  };
	  renderInputType.range = (range, params) => {
	    const rangeInput = range.querySelector('input');
	    const rangeOutput = range.querySelector('output');
	    checkAndSetInputValue(rangeInput, params.inputValue);
	    rangeInput.type = params.input;
	    checkAndSetInputValue(rangeOutput, params.inputValue);
	    setInputLabel(rangeInput, range, params);
	    return range;
	  };
	  renderInputType.select = (select, params) => {
	    select.textContent = '';
	    if (params.inputPlaceholder) {
	      const placeholder = document.createElement('option');
	      setInnerHtml(placeholder, params.inputPlaceholder);
	      placeholder.value = '';
	      placeholder.disabled = true;
	      placeholder.selected = true;
	      select.appendChild(placeholder);
	    }
	    setInputLabel(select, select, params);
	    return select;
	  };
	  renderInputType.radio = radio => {
	    radio.textContent = '';
	    return radio;
	  };
	  renderInputType.checkbox = (checkboxContainer, params) => {
	    const checkbox = getInput$1(getPopup(), 'checkbox');
	    checkbox.value = '1';
	    checkbox.checked = Boolean(params.inputValue);
	    const label = checkboxContainer.querySelector('span');
	    setInnerHtml(label, params.inputPlaceholder);
	    return checkbox;
	  };
	  renderInputType.textarea = (textarea, params) => {
	    checkAndSetInputValue(textarea, params.inputValue);
	    setInputPlaceholder(textarea, params);
	    setInputLabel(textarea, textarea, params);
	    const getMargin = el => parseInt(window.getComputedStyle(el).marginLeft) + parseInt(window.getComputedStyle(el).marginRight);
	    setTimeout(() => {
	      if ('MutationObserver' in window) {
	        const initialPopupWidth = parseInt(window.getComputedStyle(getPopup()).width);
	        const textareaResizeHandler = () => {
	          if (!document.body.contains(textarea)) {
	            return;
	          }
	          const textareaWidth = textarea.offsetWidth + getMargin(textarea);
	          if (textareaWidth > initialPopupWidth) {
	            getPopup().style.width = "".concat(textareaWidth, "px");
	          } else {
	            applyNumericalStyle(getPopup(), 'width', params.width);
	          }
	        };
	        new MutationObserver(textareaResizeHandler).observe(textarea, {
	          attributes: true,
	          attributeFilter: ['style']
	        });
	      }
	    });
	    return textarea;
	  };
	  const renderContent = (instance, params) => {
	    const htmlContainer = getHtmlContainer();
	    if (!htmlContainer) {
	      return;
	    }
	    applyCustomClass(htmlContainer, params, 'htmlContainer');
	    if (params.html) {
	      parseHtmlToContainer(params.html, htmlContainer);
	      show(htmlContainer, 'block');
	    }
	    else if (params.text) {
	      htmlContainer.textContent = params.text;
	      show(htmlContainer, 'block');
	    }
	    else {
	      hide(htmlContainer);
	    }
	    renderInput(instance, params);
	  };
	  const renderFooter = (instance, params) => {
	    const footer = getFooter();
	    if (!footer) {
	      return;
	    }
	    toggle(footer, params.footer, 'block');
	    if (params.footer) {
	      parseHtmlToContainer(params.footer, footer);
	    }
	    applyCustomClass(footer, params, 'footer');
	  };
	  const renderIcon = (instance, params) => {
	    const innerParams = privateProps.innerParams.get(instance);
	    const icon = getIcon();
	    if (!icon) {
	      return;
	    }
	    if (innerParams && params.icon === innerParams.icon) {
	      setContent(icon, params);
	      applyStyles(icon, params);
	      return;
	    }
	    if (!params.icon && !params.iconHtml) {
	      hide(icon);
	      return;
	    }
	    if (params.icon && Object.keys(iconTypes).indexOf(params.icon) === -1) {
	      error("Unknown icon! Expected \"success\", \"error\", \"warning\", \"info\" or \"question\", got \"".concat(params.icon, "\""));
	      hide(icon);
	      return;
	    }
	    show(icon);
	    setContent(icon, params);
	    applyStyles(icon, params);
	    addClass(icon, params.showClass && params.showClass.icon);
	  };
	  const applyStyles = (icon, params) => {
	    for (const [iconType, iconClassName] of Object.entries(iconTypes)) {
	      if (params.icon !== iconType) {
	        removeClass(icon, iconClassName);
	      }
	    }
	    addClass(icon, params.icon && iconTypes[params.icon]);
	    setColor(icon, params);
	    adjustSuccessIconBackgroundColor();
	    applyCustomClass(icon, params, 'icon');
	  };
	  const adjustSuccessIconBackgroundColor = () => {
	    const popup = getPopup();
	    if (!popup) {
	      return;
	    }
	    const popupBackgroundColor = window.getComputedStyle(popup).getPropertyValue('background-color');
	    const successIconParts = popup.querySelectorAll('[class^=swal2-success-circular-line], .swal2-success-fix');
	    for (let i = 0; i < successIconParts.length; i++) {
	      successIconParts[i].style.backgroundColor = popupBackgroundColor;
	    }
	  };
	  const successIconHtml = "\n  <div class=\"swal2-success-circular-line-left\"></div>\n  <span class=\"swal2-success-line-tip\"></span> <span class=\"swal2-success-line-long\"></span>\n  <div class=\"swal2-success-ring\"></div> <div class=\"swal2-success-fix\"></div>\n  <div class=\"swal2-success-circular-line-right\"></div>\n";
	  const errorIconHtml = "\n  <span class=\"swal2-x-mark\">\n    <span class=\"swal2-x-mark-line-left\"></span>\n    <span class=\"swal2-x-mark-line-right\"></span>\n  </span>\n";
	  const setContent = (icon, params) => {
	    if (!params.icon && !params.iconHtml) {
	      return;
	    }
	    let oldContent = icon.innerHTML;
	    let newContent = '';
	    if (params.iconHtml) {
	      newContent = iconContent(params.iconHtml);
	    } else if (params.icon === 'success') {
	      newContent = successIconHtml;
	      oldContent = oldContent.replace(/ style=".*?"/g, '');
	    } else if (params.icon === 'error') {
	      newContent = errorIconHtml;
	    } else if (params.icon) {
	      const defaultIconHtml = {
	        question: '?',
	        warning: '!',
	        info: 'i'
	      };
	      newContent = iconContent(defaultIconHtml[params.icon]);
	    }
	    if (oldContent.trim() !== newContent.trim()) {
	      setInnerHtml(icon, newContent);
	    }
	  };
	  const setColor = (icon, params) => {
	    if (!params.iconColor) {
	      return;
	    }
	    icon.style.color = params.iconColor;
	    icon.style.borderColor = params.iconColor;
	    for (const sel of ['.swal2-success-line-tip', '.swal2-success-line-long', '.swal2-x-mark-line-left', '.swal2-x-mark-line-right']) {
	      setStyle(icon, sel, 'backgroundColor', params.iconColor);
	    }
	    setStyle(icon, '.swal2-success-ring', 'borderColor', params.iconColor);
	  };
	  const iconContent = content => "<div class=\"".concat(swalClasses['icon-content'], "\">").concat(content, "</div>");
	  const renderImage = (instance, params) => {
	    const image = getImage();
	    if (!image) {
	      return;
	    }
	    if (!params.imageUrl) {
	      hide(image);
	      return;
	    }
	    show(image, '');
	    image.setAttribute('src', params.imageUrl);
	    image.setAttribute('alt', params.imageAlt || '');
	    applyNumericalStyle(image, 'width', params.imageWidth);
	    applyNumericalStyle(image, 'height', params.imageHeight);
	    image.className = swalClasses.image;
	    applyCustomClass(image, params, 'image');
	  };
	  const renderPopup = (instance, params) => {
	    const container = getContainer();
	    const popup = getPopup();
	    if (!container || !popup) {
	      return;
	    }
	    if (params.toast) {
	      applyNumericalStyle(container, 'width', params.width);
	      popup.style.width = '100%';
	      const loader = getLoader();
	      loader && popup.insertBefore(loader, getIcon());
	    } else {
	      applyNumericalStyle(popup, 'width', params.width);
	    }
	    applyNumericalStyle(popup, 'padding', params.padding);
	    if (params.color) {
	      popup.style.color = params.color;
	    }
	    if (params.background) {
	      popup.style.background = params.background;
	    }
	    hide(getValidationMessage());
	    addClasses$1(popup, params);
	  };
	  const addClasses$1 = (popup, params) => {
	    const showClass = params.showClass || {};
	    popup.className = "".concat(swalClasses.popup, " ").concat(isVisible$1(popup) ? showClass.popup : '');
	    if (params.toast) {
	      addClass([document.documentElement, document.body], swalClasses['toast-shown']);
	      addClass(popup, swalClasses.toast);
	    } else {
	      addClass(popup, swalClasses.modal);
	    }
	    applyCustomClass(popup, params, 'popup');
	    if (typeof params.customClass === 'string') {
	      addClass(popup, params.customClass);
	    }
	    if (params.icon) {
	      addClass(popup, swalClasses["icon-".concat(params.icon)]);
	    }
	  };
	  const renderProgressSteps = (instance, params) => {
	    const progressStepsContainer = getProgressSteps();
	    if (!progressStepsContainer) {
	      return;
	    }
	    const {
	      progressSteps,
	      currentProgressStep
	    } = params;
	    if (!progressSteps || progressSteps.length === 0 || currentProgressStep === undefined) {
	      hide(progressStepsContainer);
	      return;
	    }
	    show(progressStepsContainer);
	    progressStepsContainer.textContent = '';
	    if (currentProgressStep >= progressSteps.length) {
	      warn('Invalid currentProgressStep parameter, it should be less than progressSteps.length ' + '(currentProgressStep like JS arrays starts from 0)');
	    }
	    progressSteps.forEach((step, index) => {
	      const stepEl = createStepElement(step);
	      progressStepsContainer.appendChild(stepEl);
	      if (index === currentProgressStep) {
	        addClass(stepEl, swalClasses['active-progress-step']);
	      }
	      if (index !== progressSteps.length - 1) {
	        const lineEl = createLineElement(params);
	        progressStepsContainer.appendChild(lineEl);
	      }
	    });
	  };
	  const createStepElement = step => {
	    const stepEl = document.createElement('li');
	    addClass(stepEl, swalClasses['progress-step']);
	    setInnerHtml(stepEl, step);
	    return stepEl;
	  };
	  const createLineElement = params => {
	    const lineEl = document.createElement('li');
	    addClass(lineEl, swalClasses['progress-step-line']);
	    if (params.progressStepsDistance) {
	      applyNumericalStyle(lineEl, 'width', params.progressStepsDistance);
	    }
	    return lineEl;
	  };
	  const renderTitle = (instance, params) => {
	    const title = getTitle();
	    if (!title) {
	      return;
	    }
	    toggle(title, params.title || params.titleText, 'block');
	    if (params.title) {
	      parseHtmlToContainer(params.title, title);
	    }
	    if (params.titleText) {
	      title.innerText = params.titleText;
	    }
	    applyCustomClass(title, params, 'title');
	  };
	  const render = (instance, params) => {
	    renderPopup(instance, params);
	    renderContainer(instance, params);
	    renderProgressSteps(instance, params);
	    renderIcon(instance, params);
	    renderImage(instance, params);
	    renderTitle(instance, params);
	    renderCloseButton(instance, params);
	    renderContent(instance, params);
	    renderActions(instance, params);
	    renderFooter(instance, params);
	    const popup = getPopup();
	    if (typeof params.didRender === 'function' && popup) {
	      params.didRender(popup);
	    }
	  };
	  const isVisible = () => {
	    return isVisible$1(getPopup());
	  };
	  const clickConfirm = () => {
	    var _dom$getConfirmButton;
	    return (_dom$getConfirmButton = getConfirmButton()) === null || _dom$getConfirmButton === void 0 ? void 0 : _dom$getConfirmButton.click();
	  };
	  const clickDeny = () => {
	    var _dom$getDenyButton;
	    return (_dom$getDenyButton = getDenyButton()) === null || _dom$getDenyButton === void 0 ? void 0 : _dom$getDenyButton.click();
	  };
	  const clickCancel = () => {
	    var _dom$getCancelButton;
	    return (_dom$getCancelButton = getCancelButton()) === null || _dom$getCancelButton === void 0 ? void 0 : _dom$getCancelButton.click();
	  };
	  const DismissReason = Object.freeze({
	    cancel: 'cancel',
	    backdrop: 'backdrop',
	    close: 'close',
	    esc: 'esc',
	    timer: 'timer'
	  });
	  const removeKeydownHandler = globalState => {
	    if (globalState.keydownTarget && globalState.keydownHandlerAdded) {
	      globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, {
	        capture: globalState.keydownListenerCapture
	      });
	      globalState.keydownHandlerAdded = false;
	    }
	  };
	  const addKeydownHandler = (instance, globalState, innerParams, dismissWith) => {
	    removeKeydownHandler(globalState);
	    if (!innerParams.toast) {
	      globalState.keydownHandler = e => keydownHandler(instance, e, dismissWith);
	      globalState.keydownTarget = innerParams.keydownListenerCapture ? window : getPopup();
	      globalState.keydownListenerCapture = innerParams.keydownListenerCapture;
	      globalState.keydownTarget.addEventListener('keydown', globalState.keydownHandler, {
	        capture: globalState.keydownListenerCapture
	      });
	      globalState.keydownHandlerAdded = true;
	    }
	  };
	  const setFocus = (index, increment) => {
	    const focusableElements = getFocusableElements();
	    if (focusableElements.length) {
	      index = index + increment;
	      if (index === focusableElements.length) {
	        index = 0;
	      } else if (index === -1) {
	        index = focusableElements.length - 1;
	      }
	      focusableElements[index].focus();
	      return;
	    }
	    getPopup().focus();
	  };
	  const arrowKeysNextButton = ['ArrowRight', 'ArrowDown'];
	  const arrowKeysPreviousButton = ['ArrowLeft', 'ArrowUp'];
	  const keydownHandler = (instance, event, dismissWith) => {
	    const innerParams = privateProps.innerParams.get(instance);
	    if (!innerParams) {
	      return;
	    }
	    if (event.isComposing || event.keyCode === 229) {
	      return;
	    }
	    if (innerParams.stopKeydownPropagation) {
	      event.stopPropagation();
	    }
	    if (event.key === 'Enter') {
	      handleEnter(instance, event, innerParams);
	    }
	    else if (event.key === 'Tab') {
	      handleTab(event);
	    }
	    else if ([...arrowKeysNextButton, ...arrowKeysPreviousButton].includes(event.key)) {
	      handleArrows(event.key);
	    }
	    else if (event.key === 'Escape') {
	      handleEsc(event, innerParams, dismissWith);
	    }
	  };
	  const handleEnter = (instance, event, innerParams) => {
	    if (!callIfFunction(innerParams.allowEnterKey)) {
	      return;
	    }
	    if (event.target && instance.getInput() && event.target instanceof HTMLElement && event.target.outerHTML === instance.getInput().outerHTML) {
	      if (['textarea', 'file'].includes(innerParams.input)) {
	        return;
	      }
	      clickConfirm();
	      event.preventDefault();
	    }
	  };
	  const handleTab = event => {
	    const targetElement = event.target;
	    const focusableElements = getFocusableElements();
	    let btnIndex = -1;
	    for (let i = 0; i < focusableElements.length; i++) {
	      if (targetElement === focusableElements[i]) {
	        btnIndex = i;
	        break;
	      }
	    }
	    if (!event.shiftKey) {
	      setFocus(btnIndex, 1);
	    }
	    else {
	      setFocus(btnIndex, -1);
	    }
	    event.stopPropagation();
	    event.preventDefault();
	  };
	  const handleArrows = key => {
	    const confirmButton = getConfirmButton();
	    const denyButton = getDenyButton();
	    const cancelButton = getCancelButton();
	    const buttons = [confirmButton, denyButton, cancelButton];
	    if (document.activeElement instanceof HTMLElement && !buttons.includes(document.activeElement)) {
	      return;
	    }
	    const sibling = arrowKeysNextButton.includes(key) ? 'nextElementSibling' : 'previousElementSibling';
	    let buttonToFocus = document.activeElement;
	    for (let i = 0; i < getActions().children.length; i++) {
	      buttonToFocus = buttonToFocus[sibling];
	      if (!buttonToFocus) {
	        return;
	      }
	      if (buttonToFocus instanceof HTMLButtonElement && isVisible$1(buttonToFocus)) {
	        break;
	      }
	    }
	    if (buttonToFocus instanceof HTMLButtonElement) {
	      buttonToFocus.focus();
	    }
	  };
	  const handleEsc = (event, innerParams, dismissWith) => {
	    if (callIfFunction(innerParams.allowEscapeKey)) {
	      event.preventDefault();
	      dismissWith(DismissReason.esc);
	    }
	  };
	  var privateMethods = {
	    swalPromiseResolve: new WeakMap(),
	    swalPromiseReject: new WeakMap()
	  };
	  const setAriaHidden = () => {
	    const bodyChildren = Array.from(document.body.children);
	    bodyChildren.forEach(el => {
	      if (el === getContainer() || el.contains(getContainer())) {
	        return;
	      }
	      if (el.hasAttribute('aria-hidden')) {
	        el.setAttribute('data-previous-aria-hidden', el.getAttribute('aria-hidden') || '');
	      }
	      el.setAttribute('aria-hidden', 'true');
	    });
	  };
	  const unsetAriaHidden = () => {
	    const bodyChildren = Array.from(document.body.children);
	    bodyChildren.forEach(el => {
	      if (el.hasAttribute('data-previous-aria-hidden')) {
	        el.setAttribute('aria-hidden', el.getAttribute('data-previous-aria-hidden') || '');
	        el.removeAttribute('data-previous-aria-hidden');
	      } else {
	        el.removeAttribute('aria-hidden');
	      }
	    });
	  };
	  const isSafariOrIOS = typeof window !== 'undefined' && !!window.GestureEvent;
	  const iOSfix = () => {
	    if (isSafariOrIOS && !hasClass(document.body, swalClasses.iosfix)) {
	      const offset = document.body.scrollTop;
	      document.body.style.top = "".concat(offset * -1, "px");
	      addClass(document.body, swalClasses.iosfix);
	      lockBodyScroll();
	    }
	  };
	  const lockBodyScroll = () => {
	    const container = getContainer();
	    if (!container) {
	      return;
	    }
	    let preventTouchMove;
	    container.ontouchstart = event => {
	      preventTouchMove = shouldPreventTouchMove(event);
	    };
	    container.ontouchmove = event => {
	      if (preventTouchMove) {
	        event.preventDefault();
	        event.stopPropagation();
	      }
	    };
	  };
	  const shouldPreventTouchMove = event => {
	    const target = event.target;
	    const container = getContainer();
	    const htmlContainer = getHtmlContainer();
	    if (!container || !htmlContainer) {
	      return false;
	    }
	    if (isStylus(event) || isZoom(event)) {
	      return false;
	    }
	    if (target === container) {
	      return true;
	    }
	    if (!isScrollable(container) && target instanceof HTMLElement && target.tagName !== 'INPUT' &&
	    target.tagName !== 'TEXTAREA' &&
	    !(isScrollable(htmlContainer) &&
	    htmlContainer.contains(target))) {
	      return true;
	    }
	    return false;
	  };
	  const isStylus = event => {
	    return event.touches && event.touches.length && event.touches[0].touchType === 'stylus';
	  };
	  const isZoom = event => {
	    return event.touches && event.touches.length > 1;
	  };
	  const undoIOSfix = () => {
	    if (hasClass(document.body, swalClasses.iosfix)) {
	      const offset = parseInt(document.body.style.top, 10);
	      removeClass(document.body, swalClasses.iosfix);
	      document.body.style.top = '';
	      document.body.scrollTop = offset * -1;
	    }
	  };
	  const measureScrollbar = () => {
	    const scrollDiv = document.createElement('div');
	    scrollDiv.className = swalClasses['scrollbar-measure'];
	    document.body.appendChild(scrollDiv);
	    const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
	    document.body.removeChild(scrollDiv);
	    return scrollbarWidth;
	  };
	  let previousBodyPadding = null;
	  const fixScrollbar = () => {
	    const bodyStyles = window.getComputedStyle(document.body);
	    if (previousBodyPadding !== null) {
	      return;
	    }
	    if (document.body.scrollHeight > window.innerHeight || bodyStyles.overflowY === 'scroll'
	    ) {
	      previousBodyPadding = parseInt(bodyStyles.getPropertyValue('padding-right'));
	      document.body.style.paddingRight = "".concat(previousBodyPadding + measureScrollbar(), "px");
	    }
	  };
	  const undoScrollbar = () => {
	    if (previousBodyPadding !== null) {
	      document.body.style.paddingRight = "".concat(previousBodyPadding, "px");
	      previousBodyPadding = null;
	    }
	  };
	  function removePopupAndResetState(instance, container, returnFocus, didClose) {
	    if (isToast()) {
	      triggerDidCloseAndDispose(instance, didClose);
	    } else {
	      restoreActiveElement(returnFocus).then(() => triggerDidCloseAndDispose(instance, didClose));
	      removeKeydownHandler(globalState);
	    }
	    if (isSafariOrIOS) {
	      container.setAttribute('style', 'display:none !important');
	      container.removeAttribute('class');
	      container.innerHTML = '';
	    } else {
	      container.remove();
	    }
	    if (isModal()) {
	      undoScrollbar();
	      undoIOSfix();
	      unsetAriaHidden();
	    }
	    removeBodyClasses();
	  }
	  function removeBodyClasses() {
	    removeClass([document.documentElement, document.body], [swalClasses.shown, swalClasses['height-auto'], swalClasses['no-backdrop'], swalClasses['toast-shown']]);
	  }
	  function close(resolveValue) {
	    resolveValue = prepareResolveValue(resolveValue);
	    const swalPromiseResolve = privateMethods.swalPromiseResolve.get(this);
	    const didClose = triggerClosePopup(this);
	    if (this.isAwaitingPromise) {
	      if (!resolveValue.isDismissed) {
	        handleAwaitingPromise(this);
	        swalPromiseResolve(resolveValue);
	      }
	    } else if (didClose) {
	      swalPromiseResolve(resolveValue);
	    }
	  }
	  const triggerClosePopup = instance => {
	    const popup = getPopup();
	    if (!popup) {
	      return false;
	    }
	    const innerParams = privateProps.innerParams.get(instance);
	    if (!innerParams || hasClass(popup, innerParams.hideClass.popup)) {
	      return false;
	    }
	    removeClass(popup, innerParams.showClass.popup);
	    addClass(popup, innerParams.hideClass.popup);
	    const backdrop = getContainer();
	    removeClass(backdrop, innerParams.showClass.backdrop);
	    addClass(backdrop, innerParams.hideClass.backdrop);
	    handlePopupAnimation(instance, popup, innerParams);
	    return true;
	  };
	  function rejectPromise(error) {
	    const rejectPromise = privateMethods.swalPromiseReject.get(this);
	    handleAwaitingPromise(this);
	    if (rejectPromise) {
	      rejectPromise(error);
	    }
	  }
	  const handleAwaitingPromise = instance => {
	    if (instance.isAwaitingPromise) {
	      delete instance.isAwaitingPromise;
	      if (!privateProps.innerParams.get(instance)) {
	        instance._destroy();
	      }
	    }
	  };
	  const prepareResolveValue = resolveValue => {
	    if (typeof resolveValue === 'undefined') {
	      return {
	        isConfirmed: false,
	        isDenied: false,
	        isDismissed: true
	      };
	    }
	    return Object.assign({
	      isConfirmed: false,
	      isDenied: false,
	      isDismissed: false
	    }, resolveValue);
	  };
	  const handlePopupAnimation = (instance, popup, innerParams) => {
	    const container = getContainer();
	    const animationIsSupported = animationEndEvent && hasCssAnimation(popup);
	    if (typeof innerParams.willClose === 'function') {
	      innerParams.willClose(popup);
	    }
	    if (animationIsSupported) {
	      animatePopup(instance, popup, container, innerParams.returnFocus, innerParams.didClose);
	    } else {
	      removePopupAndResetState(instance, container, innerParams.returnFocus, innerParams.didClose);
	    }
	  };
	  const animatePopup = (instance, popup, container, returnFocus, didClose) => {
	    if (!animationEndEvent) {
	      return;
	    }
	    globalState.swalCloseEventFinishedCallback = removePopupAndResetState.bind(null, instance, container, returnFocus, didClose);
	    popup.addEventListener(animationEndEvent, function (e) {
	      if (e.target === popup) {
	        globalState.swalCloseEventFinishedCallback();
	        delete globalState.swalCloseEventFinishedCallback;
	      }
	    });
	  };
	  const triggerDidCloseAndDispose = (instance, didClose) => {
	    setTimeout(() => {
	      if (typeof didClose === 'function') {
	        didClose.bind(instance.params)();
	      }
	      if (instance._destroy) {
	        instance._destroy();
	      }
	    });
	  };
	  const showLoading = buttonToReplace => {
	    let popup = getPopup();
	    if (!popup) {
	      new Swal();
	    }
	    popup = getPopup();
	    if (!popup) {
	      return;
	    }
	    const loader = getLoader();
	    if (isToast()) {
	      hide(getIcon());
	    } else {
	      replaceButton(popup, buttonToReplace);
	    }
	    show(loader);
	    popup.setAttribute('data-loading', 'true');
	    popup.setAttribute('aria-busy', 'true');
	    popup.focus();
	  };
	  const replaceButton = (popup, buttonToReplace) => {
	    const actions = getActions();
	    const loader = getLoader();
	    if (!actions || !loader) {
	      return;
	    }
	    if (!buttonToReplace && isVisible$1(getConfirmButton())) {
	      buttonToReplace = getConfirmButton();
	    }
	    show(actions);
	    if (buttonToReplace) {
	      hide(buttonToReplace);
	      loader.setAttribute('data-button-to-replace', buttonToReplace.className);
	      actions.insertBefore(loader, buttonToReplace);
	    }
	    addClass([popup, actions], swalClasses.loading);
	  };
	  const handleInputOptionsAndValue = (instance, params) => {
	    if (params.input === 'select' || params.input === 'radio') {
	      handleInputOptions(instance, params);
	    } else if (['text', 'email', 'number', 'tel', 'textarea'].some(i => i === params.input) && (hasToPromiseFn(params.inputValue) || isPromise(params.inputValue))) {
	      showLoading(getConfirmButton());
	      handleInputValue(instance, params);
	    }
	  };
	  const getInputValue = (instance, innerParams) => {
	    const input = instance.getInput();
	    if (!input) {
	      return null;
	    }
	    switch (innerParams.input) {
	      case 'checkbox':
	        return getCheckboxValue(input);
	      case 'radio':
	        return getRadioValue(input);
	      case 'file':
	        return getFileValue(input);
	      default:
	        return innerParams.inputAutoTrim ? input.value.trim() : input.value;
	    }
	  };
	  const getCheckboxValue = input => input.checked ? 1 : 0;
	  const getRadioValue = input => input.checked ? input.value : null;
	  const getFileValue = input => input.files && input.files.length ? input.getAttribute('multiple') !== null ? input.files : input.files[0] : null;
	  const handleInputOptions = (instance, params) => {
	    const popup = getPopup();
	    if (!popup) {
	      return;
	    }
	    const processInputOptions = inputOptions => {
	      if (params.input === 'select') {
	        populateSelectOptions(popup, formatInputOptions(inputOptions), params);
	      } else if (params.input === 'radio') {
	        populateRadioOptions(popup, formatInputOptions(inputOptions), params);
	      }
	    };
	    if (hasToPromiseFn(params.inputOptions) || isPromise(params.inputOptions)) {
	      showLoading(getConfirmButton());
	      asPromise(params.inputOptions).then(inputOptions => {
	        instance.hideLoading();
	        processInputOptions(inputOptions);
	      });
	    } else if (typeof params.inputOptions === 'object') {
	      processInputOptions(params.inputOptions);
	    } else {
	      error("Unexpected type of inputOptions! Expected object, Map or Promise, got ".concat(typeof params.inputOptions));
	    }
	  };
	  const handleInputValue = (instance, params) => {
	    const input = instance.getInput();
	    if (!input) {
	      return;
	    }
	    hide(input);
	    asPromise(params.inputValue).then(inputValue => {
	      input.value = params.input === 'number' ? "".concat(parseFloat(inputValue) || 0) : "".concat(inputValue);
	      show(input);
	      input.focus();
	      instance.hideLoading();
	    }).catch(err => {
	      error("Error in inputValue promise: ".concat(err));
	      input.value = '';
	      show(input);
	      input.focus();
	      instance.hideLoading();
	    });
	  };
	  function populateSelectOptions(popup, inputOptions, params) {
	    const select = getDirectChildByClass(popup, swalClasses.select);
	    if (!select) {
	      return;
	    }
	    const renderOption = (parent, optionLabel, optionValue) => {
	      const option = document.createElement('option');
	      option.value = optionValue;
	      setInnerHtml(option, optionLabel);
	      option.selected = isSelected(optionValue, params.inputValue);
	      parent.appendChild(option);
	    };
	    inputOptions.forEach(inputOption => {
	      const optionValue = inputOption[0];
	      const optionLabel = inputOption[1];
	      if (Array.isArray(optionLabel)) {
	        const optgroup = document.createElement('optgroup');
	        optgroup.label = optionValue;
	        optgroup.disabled = false;
	        select.appendChild(optgroup);
	        optionLabel.forEach(o => renderOption(optgroup, o[1], o[0]));
	      } else {
	        renderOption(select, optionLabel, optionValue);
	      }
	    });
	    select.focus();
	  }
	  function populateRadioOptions(popup, inputOptions, params) {
	    const radio = getDirectChildByClass(popup, swalClasses.radio);
	    if (!radio) {
	      return;
	    }
	    inputOptions.forEach(inputOption => {
	      const radioValue = inputOption[0];
	      const radioLabel = inputOption[1];
	      const radioInput = document.createElement('input');
	      const radioLabelElement = document.createElement('label');
	      radioInput.type = 'radio';
	      radioInput.name = swalClasses.radio;
	      radioInput.value = radioValue;
	      if (isSelected(radioValue, params.inputValue)) {
	        radioInput.checked = true;
	      }
	      const label = document.createElement('span');
	      setInnerHtml(label, radioLabel);
	      label.className = swalClasses.label;
	      radioLabelElement.appendChild(radioInput);
	      radioLabelElement.appendChild(label);
	      radio.appendChild(radioLabelElement);
	    });
	    const radios = radio.querySelectorAll('input');
	    if (radios.length) {
	      radios[0].focus();
	    }
	  }
	  const formatInputOptions = inputOptions => {
	    const result = [];
	    if (inputOptions instanceof Map) {
	      inputOptions.forEach((value, key) => {
	        let valueFormatted = value;
	        if (typeof valueFormatted === 'object') {
	          valueFormatted = formatInputOptions(valueFormatted);
	        }
	        result.push([key, valueFormatted]);
	      });
	    } else {
	      Object.keys(inputOptions).forEach(key => {
	        let valueFormatted = inputOptions[key];
	        if (typeof valueFormatted === 'object') {
	          valueFormatted = formatInputOptions(valueFormatted);
	        }
	        result.push([key, valueFormatted]);
	      });
	    }
	    return result;
	  };
	  const isSelected = (optionValue, inputValue) => {
	    return !!inputValue && inputValue.toString() === optionValue.toString();
	  };
	  const handleConfirmButtonClick = instance => {
	    const innerParams = privateProps.innerParams.get(instance);
	    instance.disableButtons();
	    if (innerParams.input) {
	      handleConfirmOrDenyWithInput(instance, 'confirm');
	    } else {
	      confirm(instance, true);
	    }
	  };
	  const handleDenyButtonClick = instance => {
	    const innerParams = privateProps.innerParams.get(instance);
	    instance.disableButtons();
	    if (innerParams.returnInputValueOnDeny) {
	      handleConfirmOrDenyWithInput(instance, 'deny');
	    } else {
	      deny(instance, false);
	    }
	  };
	  const handleCancelButtonClick = (instance, dismissWith) => {
	    instance.disableButtons();
	    dismissWith(DismissReason.cancel);
	  };
	  const handleConfirmOrDenyWithInput = (instance, type) => {
	    const innerParams = privateProps.innerParams.get(instance);
	    if (!innerParams.input) {
	      error("The \"input\" parameter is needed to be set when using returnInputValueOn".concat(capitalizeFirstLetter(type)));
	      return;
	    }
	    const input = instance.getInput();
	    const inputValue = getInputValue(instance, innerParams);
	    if (innerParams.inputValidator) {
	      handleInputValidator(instance, inputValue, type);
	    } else if (input && !input.checkValidity()) {
	      instance.enableButtons();
	      instance.showValidationMessage(innerParams.validationMessage);
	    } else if (type === 'deny') {
	      deny(instance, inputValue);
	    } else {
	      confirm(instance, inputValue);
	    }
	  };
	  const handleInputValidator = (instance, inputValue, type) => {
	    const innerParams = privateProps.innerParams.get(instance);
	    instance.disableInput();
	    const validationPromise = Promise.resolve().then(() => asPromise(innerParams.inputValidator(inputValue, innerParams.validationMessage)));
	    validationPromise.then(validationMessage => {
	      instance.enableButtons();
	      instance.enableInput();
	      if (validationMessage) {
	        instance.showValidationMessage(validationMessage);
	      } else if (type === 'deny') {
	        deny(instance, inputValue);
	      } else {
	        confirm(instance, inputValue);
	      }
	    });
	  };
	  const deny = (instance, value) => {
	    const innerParams = privateProps.innerParams.get(instance || undefined);
	    if (innerParams.showLoaderOnDeny) {
	      showLoading(getDenyButton());
	    }
	    if (innerParams.preDeny) {
	      instance.isAwaitingPromise = true;
	      const preDenyPromise = Promise.resolve().then(() => asPromise(innerParams.preDeny(value, innerParams.validationMessage)));
	      preDenyPromise.then(preDenyValue => {
	        if (preDenyValue === false) {
	          instance.hideLoading();
	          handleAwaitingPromise(instance);
	        } else {
	          instance.close({
	            isDenied: true,
	            value: typeof preDenyValue === 'undefined' ? value : preDenyValue
	          });
	        }
	      }).catch(error => rejectWith(instance || undefined, error));
	    } else {
	      instance.close({
	        isDenied: true,
	        value
	      });
	    }
	  };
	  const succeedWith = (instance, value) => {
	    instance.close({
	      isConfirmed: true,
	      value
	    });
	  };
	  const rejectWith = (instance, error) => {
	    instance.rejectPromise(error);
	  };
	  const confirm = (instance, value) => {
	    const innerParams = privateProps.innerParams.get(instance || undefined);
	    if (innerParams.showLoaderOnConfirm) {
	      showLoading();
	    }
	    if (innerParams.preConfirm) {
	      instance.resetValidationMessage();
	      instance.isAwaitingPromise = true;
	      const preConfirmPromise = Promise.resolve().then(() => asPromise(innerParams.preConfirm(value, innerParams.validationMessage)));
	      preConfirmPromise.then(preConfirmValue => {
	        if (isVisible$1(getValidationMessage()) || preConfirmValue === false) {
	          instance.hideLoading();
	          handleAwaitingPromise(instance);
	        } else {
	          succeedWith(instance, typeof preConfirmValue === 'undefined' ? value : preConfirmValue);
	        }
	      }).catch(error => rejectWith(instance || undefined, error));
	    } else {
	      succeedWith(instance, value);
	    }
	  };
	  function hideLoading() {
	    const innerParams = privateProps.innerParams.get(this);
	    if (!innerParams) {
	      return;
	    }
	    const domCache = privateProps.domCache.get(this);
	    hide(domCache.loader);
	    if (isToast()) {
	      if (innerParams.icon) {
	        show(getIcon());
	      }
	    } else {
	      showRelatedButton(domCache);
	    }
	    removeClass([domCache.popup, domCache.actions], swalClasses.loading);
	    domCache.popup.removeAttribute('aria-busy');
	    domCache.popup.removeAttribute('data-loading');
	    domCache.confirmButton.disabled = false;
	    domCache.denyButton.disabled = false;
	    domCache.cancelButton.disabled = false;
	  }
	  const showRelatedButton = domCache => {
	    const buttonToReplace = domCache.popup.getElementsByClassName(domCache.loader.getAttribute('data-button-to-replace'));
	    if (buttonToReplace.length) {
	      show(buttonToReplace[0], 'inline-block');
	    } else if (allButtonsAreHidden()) {
	      hide(domCache.actions);
	    }
	  };
	  function getInput() {
	    const innerParams = privateProps.innerParams.get(this);
	    const domCache = privateProps.domCache.get(this);
	    if (!domCache) {
	      return null;
	    }
	    return getInput$1(domCache.popup, innerParams.input);
	  }
	  function setButtonsDisabled(instance, buttons, disabled) {
	    const domCache = privateProps.domCache.get(instance);
	    buttons.forEach(button => {
	      domCache[button].disabled = disabled;
	    });
	  }
	  function setInputDisabled(input, disabled) {
	    const popup = getPopup();
	    if (!popup || !input) {
	      return;
	    }
	    if (input.type === 'radio') {
	      const radios = popup.querySelectorAll("[name=\"".concat(swalClasses.radio, "\"]"));
	      for (let i = 0; i < radios.length; i++) {
	        radios[i].disabled = disabled;
	      }
	    } else {
	      input.disabled = disabled;
	    }
	  }
	  function enableButtons() {
	    setButtonsDisabled(this, ['confirmButton', 'denyButton', 'cancelButton'], false);
	  }
	  function disableButtons() {
	    setButtonsDisabled(this, ['confirmButton', 'denyButton', 'cancelButton'], true);
	  }
	  function enableInput() {
	    setInputDisabled(this.getInput(), false);
	  }
	  function disableInput() {
	    setInputDisabled(this.getInput(), true);
	  }
	  function showValidationMessage(error) {
	    const domCache = privateProps.domCache.get(this);
	    const params = privateProps.innerParams.get(this);
	    setInnerHtml(domCache.validationMessage, error);
	    domCache.validationMessage.className = swalClasses['validation-message'];
	    if (params.customClass && params.customClass.validationMessage) {
	      addClass(domCache.validationMessage, params.customClass.validationMessage);
	    }
	    show(domCache.validationMessage);
	    const input = this.getInput();
	    if (input) {
	      input.setAttribute('aria-invalid', true);
	      input.setAttribute('aria-describedby', swalClasses['validation-message']);
	      focusInput(input);
	      addClass(input, swalClasses.inputerror);
	    }
	  }
	  function resetValidationMessage() {
	    const domCache = privateProps.domCache.get(this);
	    if (domCache.validationMessage) {
	      hide(domCache.validationMessage);
	    }
	    const input = this.getInput();
	    if (input) {
	      input.removeAttribute('aria-invalid');
	      input.removeAttribute('aria-describedby');
	      removeClass(input, swalClasses.inputerror);
	    }
	  }
	  const defaultParams = {
	    title: '',
	    titleText: '',
	    text: '',
	    html: '',
	    footer: '',
	    icon: undefined,
	    iconColor: undefined,
	    iconHtml: undefined,
	    template: undefined,
	    toast: false,
	    showClass: {
	      popup: 'swal2-show',
	      backdrop: 'swal2-backdrop-show',
	      icon: 'swal2-icon-show'
	    },
	    hideClass: {
	      popup: 'swal2-hide',
	      backdrop: 'swal2-backdrop-hide',
	      icon: 'swal2-icon-hide'
	    },
	    customClass: {},
	    target: 'body',
	    color: undefined,
	    backdrop: true,
	    heightAuto: true,
	    allowOutsideClick: true,
	    allowEscapeKey: true,
	    allowEnterKey: true,
	    stopKeydownPropagation: true,
	    keydownListenerCapture: false,
	    showConfirmButton: true,
	    showDenyButton: false,
	    showCancelButton: false,
	    preConfirm: undefined,
	    preDeny: undefined,
	    confirmButtonText: 'OK',
	    confirmButtonAriaLabel: '',
	    confirmButtonColor: undefined,
	    denyButtonText: 'No',
	    denyButtonAriaLabel: '',
	    denyButtonColor: undefined,
	    cancelButtonText: 'Cancel',
	    cancelButtonAriaLabel: '',
	    cancelButtonColor: undefined,
	    buttonsStyling: true,
	    reverseButtons: false,
	    focusConfirm: true,
	    focusDeny: false,
	    focusCancel: false,
	    returnFocus: true,
	    showCloseButton: false,
	    closeButtonHtml: '&times;',
	    closeButtonAriaLabel: 'Close this dialog',
	    loaderHtml: '',
	    showLoaderOnConfirm: false,
	    showLoaderOnDeny: false,
	    imageUrl: undefined,
	    imageWidth: undefined,
	    imageHeight: undefined,
	    imageAlt: '',
	    timer: undefined,
	    timerProgressBar: false,
	    width: undefined,
	    padding: undefined,
	    background: undefined,
	    input: undefined,
	    inputPlaceholder: '',
	    inputLabel: '',
	    inputValue: '',
	    inputOptions: {},
	    inputAutoFocus: true,
	    inputAutoTrim: true,
	    inputAttributes: {},
	    inputValidator: undefined,
	    returnInputValueOnDeny: false,
	    validationMessage: undefined,
	    grow: false,
	    position: 'center',
	    progressSteps: [],
	    currentProgressStep: undefined,
	    progressStepsDistance: undefined,
	    willOpen: undefined,
	    didOpen: undefined,
	    didRender: undefined,
	    willClose: undefined,
	    didClose: undefined,
	    didDestroy: undefined,
	    scrollbarPadding: true
	  };
	  const updatableParams = ['allowEscapeKey', 'allowOutsideClick', 'background', 'buttonsStyling', 'cancelButtonAriaLabel', 'cancelButtonColor', 'cancelButtonText', 'closeButtonAriaLabel', 'closeButtonHtml', 'color', 'confirmButtonAriaLabel', 'confirmButtonColor', 'confirmButtonText', 'currentProgressStep', 'customClass', 'denyButtonAriaLabel', 'denyButtonColor', 'denyButtonText', 'didClose', 'didDestroy', 'footer', 'hideClass', 'html', 'icon', 'iconColor', 'iconHtml', 'imageAlt', 'imageHeight', 'imageUrl', 'imageWidth', 'preConfirm', 'preDeny', 'progressSteps', 'returnFocus', 'reverseButtons', 'showCancelButton', 'showCloseButton', 'showConfirmButton', 'showDenyButton', 'text', 'title', 'titleText', 'willClose'];
	  const deprecatedParams = {};
	  const toastIncompatibleParams = ['allowOutsideClick', 'allowEnterKey', 'backdrop', 'focusConfirm', 'focusDeny', 'focusCancel', 'returnFocus', 'heightAuto', 'keydownListenerCapture'];
	  const isValidParameter = paramName => {
	    return Object.prototype.hasOwnProperty.call(defaultParams, paramName);
	  };
	  const isUpdatableParameter = paramName => {
	    return updatableParams.indexOf(paramName) !== -1;
	  };
	  const isDeprecatedParameter = paramName => {
	    return deprecatedParams[paramName];
	  };
	  const checkIfParamIsValid = param => {
	    if (!isValidParameter(param)) {
	      warn("Unknown parameter \"".concat(param, "\""));
	    }
	  };
	  const checkIfToastParamIsValid = param => {
	    if (toastIncompatibleParams.includes(param)) {
	      warn("The parameter \"".concat(param, "\" is incompatible with toasts"));
	    }
	  };
	  const checkIfParamIsDeprecated = param => {
	    const isDeprecated = isDeprecatedParameter(param);
	    if (isDeprecated) {
	      warnAboutDeprecation(param, isDeprecated);
	    }
	  };
	  const showWarningsForParams = params => {
	    if (params.backdrop === false && params.allowOutsideClick) {
	      warn('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`');
	    }
	    for (const param in params) {
	      checkIfParamIsValid(param);
	      if (params.toast) {
	        checkIfToastParamIsValid(param);
	      }
	      checkIfParamIsDeprecated(param);
	    }
	  };
	  function update(params) {
	    const popup = getPopup();
	    const innerParams = privateProps.innerParams.get(this);
	    if (!popup || hasClass(popup, innerParams.hideClass.popup)) {
	      warn("You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.");
	      return;
	    }
	    const validUpdatableParams = filterValidParams(params);
	    const updatedParams = Object.assign({}, innerParams, validUpdatableParams);
	    render(this, updatedParams);
	    privateProps.innerParams.set(this, updatedParams);
	    Object.defineProperties(this, {
	      params: {
	        value: Object.assign({}, this.params, params),
	        writable: false,
	        enumerable: true
	      }
	    });
	  }
	  const filterValidParams = params => {
	    const validUpdatableParams = {};
	    Object.keys(params).forEach(param => {
	      if (isUpdatableParameter(param)) {
	        validUpdatableParams[param] = params[param];
	      } else {
	        warn("Invalid parameter to update: ".concat(param));
	      }
	    });
	    return validUpdatableParams;
	  };
	  function _destroy() {
	    const domCache = privateProps.domCache.get(this);
	    const innerParams = privateProps.innerParams.get(this);
	    if (!innerParams) {
	      disposeWeakMaps(this);
	      return;
	    }
	    if (domCache.popup && globalState.swalCloseEventFinishedCallback) {
	      globalState.swalCloseEventFinishedCallback();
	      delete globalState.swalCloseEventFinishedCallback;
	    }
	    if (typeof innerParams.didDestroy === 'function') {
	      innerParams.didDestroy();
	    }
	    disposeSwal(this);
	  }
	  const disposeSwal = instance => {
	    disposeWeakMaps(instance);
	    delete instance.params;
	    delete globalState.keydownHandler;
	    delete globalState.keydownTarget;
	    delete globalState.currentInstance;
	  };
	  const disposeWeakMaps = instance => {
	    if (instance.isAwaitingPromise) {
	      unsetWeakMaps(privateProps, instance);
	      instance.isAwaitingPromise = true;
	    } else {
	      unsetWeakMaps(privateMethods, instance);
	      unsetWeakMaps(privateProps, instance);
	      delete instance.isAwaitingPromise;
	      delete instance.disableButtons;
	      delete instance.enableButtons;
	      delete instance.getInput;
	      delete instance.disableInput;
	      delete instance.enableInput;
	      delete instance.hideLoading;
	      delete instance.disableLoading;
	      delete instance.showValidationMessage;
	      delete instance.resetValidationMessage;
	      delete instance.close;
	      delete instance.closePopup;
	      delete instance.closeModal;
	      delete instance.closeToast;
	      delete instance.rejectPromise;
	      delete instance.update;
	      delete instance._destroy;
	    }
	  };
	  const unsetWeakMaps = (obj, instance) => {
	    for (const i in obj) {
	      obj[i].delete(instance);
	    }
	  };
	  var instanceMethods = Object.freeze({
	    __proto__: null,
	    _destroy: _destroy,
	    close: close,
	    closeModal: close,
	    closePopup: close,
	    closeToast: close,
	    disableButtons: disableButtons,
	    disableInput: disableInput,
	    disableLoading: hideLoading,
	    enableButtons: enableButtons,
	    enableInput: enableInput,
	    getInput: getInput,
	    handleAwaitingPromise: handleAwaitingPromise,
	    hideLoading: hideLoading,
	    rejectPromise: rejectPromise,
	    resetValidationMessage: resetValidationMessage,
	    showValidationMessage: showValidationMessage,
	    update: update
	  });
	  const handlePopupClick = (instance, domCache, dismissWith) => {
	    const innerParams = privateProps.innerParams.get(instance);
	    if (innerParams.toast) {
	      handleToastClick(instance, domCache, dismissWith);
	    } else {
	      handleModalMousedown(domCache);
	      handleContainerMousedown(domCache);
	      handleModalClick(instance, domCache, dismissWith);
	    }
	  };
	  const handleToastClick = (instance, domCache, dismissWith) => {
	    domCache.popup.onclick = () => {
	      const innerParams = privateProps.innerParams.get(instance);
	      if (innerParams && (isAnyButtonShown(innerParams) || innerParams.timer || innerParams.input)) {
	        return;
	      }
	      dismissWith(DismissReason.close);
	    };
	  };
	  const isAnyButtonShown = innerParams => {
	    return innerParams.showConfirmButton || innerParams.showDenyButton || innerParams.showCancelButton || innerParams.showCloseButton;
	  };
	  let ignoreOutsideClick = false;
	  const handleModalMousedown = domCache => {
	    domCache.popup.onmousedown = () => {
	      domCache.container.onmouseup = function (e) {
	        domCache.container.onmouseup = undefined;
	        if (e.target === domCache.container) {
	          ignoreOutsideClick = true;
	        }
	      };
	    };
	  };
	  const handleContainerMousedown = domCache => {
	    domCache.container.onmousedown = () => {
	      domCache.popup.onmouseup = function (e) {
	        domCache.popup.onmouseup = undefined;
	        if (e.target === domCache.popup || domCache.popup.contains(e.target)) {
	          ignoreOutsideClick = true;
	        }
	      };
	    };
	  };
	  const handleModalClick = (instance, domCache, dismissWith) => {
	    domCache.container.onclick = e => {
	      const innerParams = privateProps.innerParams.get(instance);
	      if (ignoreOutsideClick) {
	        ignoreOutsideClick = false;
	        return;
	      }
	      if (e.target === domCache.container && callIfFunction(innerParams.allowOutsideClick)) {
	        dismissWith(DismissReason.backdrop);
	      }
	    };
	  };
	  const isJqueryElement = elem => typeof elem === 'object' && elem.jquery;
	  const isElement = elem => elem instanceof Element || isJqueryElement(elem);
	  const argsToParams = args => {
	    const params = {};
	    if (typeof args[0] === 'object' && !isElement(args[0])) {
	      Object.assign(params, args[0]);
	    } else {
	      ['title', 'html', 'icon'].forEach((name, index) => {
	        const arg = args[index];
	        if (typeof arg === 'string' || isElement(arg)) {
	          params[name] = arg;
	        } else if (arg !== undefined) {
	          error("Unexpected type of ".concat(name, "! Expected \"string\" or \"Element\", got ").concat(typeof arg));
	        }
	      });
	    }
	    return params;
	  };
	  function fire() {
	    const Swal = this;
	    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	    return new Swal(...args);
	  }
	  function mixin(mixinParams) {
	    class MixinSwal extends this {
	      _main(params, priorityMixinParams) {
	        return super._main(params, Object.assign({}, mixinParams, priorityMixinParams));
	      }
	    }
	    return MixinSwal;
	  }
	  const getTimerLeft = () => {
	    return globalState.timeout && globalState.timeout.getTimerLeft();
	  };
	  const stopTimer = () => {
	    if (globalState.timeout) {
	      stopTimerProgressBar();
	      return globalState.timeout.stop();
	    }
	  };
	  const resumeTimer = () => {
	    if (globalState.timeout) {
	      const remaining = globalState.timeout.start();
	      animateTimerProgressBar(remaining);
	      return remaining;
	    }
	  };
	  const toggleTimer = () => {
	    const timer = globalState.timeout;
	    return timer && (timer.running ? stopTimer() : resumeTimer());
	  };
	  const increaseTimer = n => {
	    if (globalState.timeout) {
	      const remaining = globalState.timeout.increase(n);
	      animateTimerProgressBar(remaining, true);
	      return remaining;
	    }
	  };
	  const isTimerRunning = () => {
	    return !!(globalState.timeout && globalState.timeout.isRunning());
	  };
	  let bodyClickListenerAdded = false;
	  const clickHandlers = {};
	  function bindClickHandler() {
	    let attr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'data-swal-template';
	    clickHandlers[attr] = this;
	    if (!bodyClickListenerAdded) {
	      document.body.addEventListener('click', bodyClickListener);
	      bodyClickListenerAdded = true;
	    }
	  }
	  const bodyClickListener = event => {
	    for (let el = event.target; el && el !== document; el = el.parentNode) {
	      for (const attr in clickHandlers) {
	        const template = el.getAttribute(attr);
	        if (template) {
	          clickHandlers[attr].fire({
	            template
	          });
	          return;
	        }
	      }
	    }
	  };
	  var staticMethods = Object.freeze({
	    __proto__: null,
	    argsToParams: argsToParams,
	    bindClickHandler: bindClickHandler,
	    clickCancel: clickCancel,
	    clickConfirm: clickConfirm,
	    clickDeny: clickDeny,
	    enableLoading: showLoading,
	    fire: fire,
	    getActions: getActions,
	    getCancelButton: getCancelButton,
	    getCloseButton: getCloseButton,
	    getConfirmButton: getConfirmButton,
	    getContainer: getContainer,
	    getDenyButton: getDenyButton,
	    getFocusableElements: getFocusableElements,
	    getFooter: getFooter,
	    getHtmlContainer: getHtmlContainer,
	    getIcon: getIcon,
	    getIconContent: getIconContent,
	    getImage: getImage,
	    getInputLabel: getInputLabel,
	    getLoader: getLoader,
	    getPopup: getPopup,
	    getProgressSteps: getProgressSteps,
	    getTimerLeft: getTimerLeft,
	    getTimerProgressBar: getTimerProgressBar,
	    getTitle: getTitle,
	    getValidationMessage: getValidationMessage,
	    increaseTimer: increaseTimer,
	    isDeprecatedParameter: isDeprecatedParameter,
	    isLoading: isLoading,
	    isTimerRunning: isTimerRunning,
	    isUpdatableParameter: isUpdatableParameter,
	    isValidParameter: isValidParameter,
	    isVisible: isVisible,
	    mixin: mixin,
	    resumeTimer: resumeTimer,
	    showLoading: showLoading,
	    stopTimer: stopTimer,
	    toggleTimer: toggleTimer
	  });
	  class Timer {
	    constructor(callback, delay) {
	      this.callback = callback;
	      this.remaining = delay;
	      this.running = false;
	      this.start();
	    }
	    start() {
	      if (!this.running) {
	        this.running = true;
	        this.started = new Date();
	        this.id = setTimeout(this.callback, this.remaining);
	      }
	      return this.remaining;
	    }
	    stop() {
	      if (this.started && this.running) {
	        this.running = false;
	        clearTimeout(this.id);
	        this.remaining -= new Date().getTime() - this.started.getTime();
	      }
	      return this.remaining;
	    }
	    increase(n) {
	      const running = this.running;
	      if (running) {
	        this.stop();
	      }
	      this.remaining += n;
	      if (running) {
	        this.start();
	      }
	      return this.remaining;
	    }
	    getTimerLeft() {
	      if (this.running) {
	        this.stop();
	        this.start();
	      }
	      return this.remaining;
	    }
	    isRunning() {
	      return this.running;
	    }
	  }
	  const swalStringParams = ['swal-title', 'swal-html', 'swal-footer'];
	  const getTemplateParams = params => {
	    const template = typeof params.template === 'string' ? document.querySelector(params.template) : params.template;
	    if (!template) {
	      return {};
	    }
	    const templateContent = template.content;
	    showWarningsForElements(templateContent);
	    const result = Object.assign(getSwalParams(templateContent), getSwalFunctionParams(templateContent), getSwalButtons(templateContent), getSwalImage(templateContent), getSwalIcon(templateContent), getSwalInput(templateContent), getSwalStringParams(templateContent, swalStringParams));
	    return result;
	  };
	  const getSwalParams = templateContent => {
	    const result = {};
	    const swalParams = Array.from(templateContent.querySelectorAll('swal-param'));
	    swalParams.forEach(param => {
	      showWarningsForAttributes(param, ['name', 'value']);
	      const paramName = param.getAttribute('name');
	      const value = param.getAttribute('value');
	      if (typeof defaultParams[paramName] === 'boolean') {
	        result[paramName] = value !== 'false';
	      } else if (typeof defaultParams[paramName] === 'object') {
	        result[paramName] = JSON.parse(value);
	      } else {
	        result[paramName] = value;
	      }
	    });
	    return result;
	  };
	  const getSwalFunctionParams = templateContent => {
	    const result = {};
	    const swalFunctions = Array.from(templateContent.querySelectorAll('swal-function-param'));
	    swalFunctions.forEach(param => {
	      const paramName = param.getAttribute('name');
	      const value = param.getAttribute('value');
	      result[paramName] = new Function("return ".concat(value))();
	    });
	    return result;
	  };
	  const getSwalButtons = templateContent => {
	    const result = {};
	    const swalButtons = Array.from(templateContent.querySelectorAll('swal-button'));
	    swalButtons.forEach(button => {
	      showWarningsForAttributes(button, ['type', 'color', 'aria-label']);
	      const type = button.getAttribute('type');
	      result["".concat(type, "ButtonText")] = button.innerHTML;
	      result["show".concat(capitalizeFirstLetter(type), "Button")] = true;
	      if (button.hasAttribute('color')) {
	        result["".concat(type, "ButtonColor")] = button.getAttribute('color');
	      }
	      if (button.hasAttribute('aria-label')) {
	        result["".concat(type, "ButtonAriaLabel")] = button.getAttribute('aria-label');
	      }
	    });
	    return result;
	  };
	  const getSwalImage = templateContent => {
	    const result = {};
	    const image = templateContent.querySelector('swal-image');
	    if (image) {
	      showWarningsForAttributes(image, ['src', 'width', 'height', 'alt']);
	      if (image.hasAttribute('src')) {
	        result.imageUrl = image.getAttribute('src');
	      }
	      if (image.hasAttribute('width')) {
	        result.imageWidth = image.getAttribute('width');
	      }
	      if (image.hasAttribute('height')) {
	        result.imageHeight = image.getAttribute('height');
	      }
	      if (image.hasAttribute('alt')) {
	        result.imageAlt = image.getAttribute('alt');
	      }
	    }
	    return result;
	  };
	  const getSwalIcon = templateContent => {
	    const result = {};
	    const icon = templateContent.querySelector('swal-icon');
	    if (icon) {
	      showWarningsForAttributes(icon, ['type', 'color']);
	      if (icon.hasAttribute('type')) {
	        result.icon = icon.getAttribute('type');
	      }
	      if (icon.hasAttribute('color')) {
	        result.iconColor = icon.getAttribute('color');
	      }
	      result.iconHtml = icon.innerHTML;
	    }
	    return result;
	  };
	  const getSwalInput = templateContent => {
	    const result = {};
	    const input = templateContent.querySelector('swal-input');
	    if (input) {
	      showWarningsForAttributes(input, ['type', 'label', 'placeholder', 'value']);
	      result.input = input.getAttribute('type') || 'text';
	      if (input.hasAttribute('label')) {
	        result.inputLabel = input.getAttribute('label');
	      }
	      if (input.hasAttribute('placeholder')) {
	        result.inputPlaceholder = input.getAttribute('placeholder');
	      }
	      if (input.hasAttribute('value')) {
	        result.inputValue = input.getAttribute('value');
	      }
	    }
	    const inputOptions = Array.from(templateContent.querySelectorAll('swal-input-option'));
	    if (inputOptions.length) {
	      result.inputOptions = {};
	      inputOptions.forEach(option => {
	        showWarningsForAttributes(option, ['value']);
	        const optionValue = option.getAttribute('value');
	        const optionName = option.innerHTML;
	        result.inputOptions[optionValue] = optionName;
	      });
	    }
	    return result;
	  };
	  const getSwalStringParams = (templateContent, paramNames) => {
	    const result = {};
	    for (const i in paramNames) {
	      const paramName = paramNames[i];
	      const tag = templateContent.querySelector(paramName);
	      if (tag) {
	        showWarningsForAttributes(tag, []);
	        result[paramName.replace(/^swal-/, '')] = tag.innerHTML.trim();
	      }
	    }
	    return result;
	  };
	  const showWarningsForElements = templateContent => {
	    const allowedElements = swalStringParams.concat(['swal-param', 'swal-function-param', 'swal-button', 'swal-image', 'swal-icon', 'swal-input', 'swal-input-option']);
	    Array.from(templateContent.children).forEach(el => {
	      const tagName = el.tagName.toLowerCase();
	      if (!allowedElements.includes(tagName)) {
	        warn("Unrecognized element <".concat(tagName, ">"));
	      }
	    });
	  };
	  const showWarningsForAttributes = (el, allowedAttributes) => {
	    Array.from(el.attributes).forEach(attribute => {
	      if (allowedAttributes.indexOf(attribute.name) === -1) {
	        warn(["Unrecognized attribute \"".concat(attribute.name, "\" on <").concat(el.tagName.toLowerCase(), ">."), "".concat(allowedAttributes.length ? "Allowed attributes are: ".concat(allowedAttributes.join(', ')) : 'To set the value, use HTML within the element.')]);
	      }
	    });
	  };
	  const SHOW_CLASS_TIMEOUT = 10;
	  const openPopup = params => {
	    const container = getContainer();
	    const popup = getPopup();
	    if (typeof params.willOpen === 'function') {
	      params.willOpen(popup);
	    }
	    const bodyStyles = window.getComputedStyle(document.body);
	    const initialBodyOverflow = bodyStyles.overflowY;
	    addClasses(container, popup, params);
	    setTimeout(() => {
	      setScrollingVisibility(container, popup);
	    }, SHOW_CLASS_TIMEOUT);
	    if (isModal()) {
	      fixScrollContainer(container, params.scrollbarPadding, initialBodyOverflow);
	      setAriaHidden();
	    }
	    if (!isToast() && !globalState.previousActiveElement) {
	      globalState.previousActiveElement = document.activeElement;
	    }
	    if (typeof params.didOpen === 'function') {
	      setTimeout(() => params.didOpen(popup));
	    }
	    removeClass(container, swalClasses['no-transition']);
	  };
	  const swalOpenAnimationFinished = event => {
	    const popup = getPopup();
	    if (event.target !== popup || !animationEndEvent) {
	      return;
	    }
	    const container = getContainer();
	    popup.removeEventListener(animationEndEvent, swalOpenAnimationFinished);
	    container.style.overflowY = 'auto';
	  };
	  const setScrollingVisibility = (container, popup) => {
	    if (animationEndEvent && hasCssAnimation(popup)) {
	      container.style.overflowY = 'hidden';
	      popup.addEventListener(animationEndEvent, swalOpenAnimationFinished);
	    } else {
	      container.style.overflowY = 'auto';
	    }
	  };
	  const fixScrollContainer = (container, scrollbarPadding, initialBodyOverflow) => {
	    iOSfix();
	    if (scrollbarPadding && initialBodyOverflow !== 'hidden') {
	      fixScrollbar();
	    }
	    setTimeout(() => {
	      container.scrollTop = 0;
	    });
	  };
	  const addClasses = (container, popup, params) => {
	    addClass(container, params.showClass.backdrop);
	    popup.style.setProperty('opacity', '0', 'important');
	    show(popup, 'grid');
	    setTimeout(() => {
	      addClass(popup, params.showClass.popup);
	      popup.style.removeProperty('opacity');
	    }, SHOW_CLASS_TIMEOUT);
	    addClass([document.documentElement, document.body], swalClasses.shown);
	    if (params.heightAuto && params.backdrop && !params.toast) {
	      addClass([document.documentElement, document.body], swalClasses['height-auto']);
	    }
	  };
	  var defaultInputValidators = {
	    email: (string, validationMessage) => {
	      return /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]{2,24}$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || 'Invalid email address');
	    },
	    url: (string, validationMessage) => {
	      return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || 'Invalid URL');
	    }
	  };
	  function setDefaultInputValidators(params) {
	    if (params.inputValidator) {
	      return;
	    }
	    if (params.input === 'email') {
	      params.inputValidator = defaultInputValidators['email'];
	    }
	    if (params.input === 'url') {
	      params.inputValidator = defaultInputValidators['url'];
	    }
	  }
	  function validateCustomTargetElement(params) {
	    if (!params.target || typeof params.target === 'string' && !document.querySelector(params.target) || typeof params.target !== 'string' && !params.target.appendChild) {
	      warn('Target parameter is not valid, defaulting to "body"');
	      params.target = 'body';
	    }
	  }
	  function setParameters(params) {
	    setDefaultInputValidators(params);
	    if (params.showLoaderOnConfirm && !params.preConfirm) {
	      warn('showLoaderOnConfirm is set to true, but preConfirm is not defined.\n' + 'showLoaderOnConfirm should be used together with preConfirm, see usage example:\n' + 'https://sweetalert2.github.io/#ajax-request');
	    }
	    validateCustomTargetElement(params);
	    if (typeof params.title === 'string') {
	      params.title = params.title.split('\n').join('<br />');
	    }
	    init(params);
	  }
	  let currentInstance;
	  class SweetAlert {
	    constructor() {
	      if (typeof window === 'undefined') {
	        return;
	      }
	      currentInstance = this;
	      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }
	      const outerParams = Object.freeze(this.constructor.argsToParams(args));
	      this.params = outerParams;
	      this.isAwaitingPromise = false;
	      const promise = currentInstance._main(currentInstance.params);
	      privateProps.promise.set(this, promise);
	    }
	    _main(userParams) {
	      let mixinParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	      showWarningsForParams(Object.assign({}, mixinParams, userParams));
	      if (globalState.currentInstance) {
	        globalState.currentInstance._destroy();
	        if (isModal()) {
	          unsetAriaHidden();
	        }
	      }
	      globalState.currentInstance = currentInstance;
	      const innerParams = prepareParams(userParams, mixinParams);
	      setParameters(innerParams);
	      Object.freeze(innerParams);
	      if (globalState.timeout) {
	        globalState.timeout.stop();
	        delete globalState.timeout;
	      }
	      clearTimeout(globalState.restoreFocusTimeout);
	      const domCache = populateDomCache(currentInstance);
	      render(currentInstance, innerParams);
	      privateProps.innerParams.set(currentInstance, innerParams);
	      return swalPromise(currentInstance, domCache, innerParams);
	    }
	    then(onFulfilled) {
	      const promise = privateProps.promise.get(this);
	      return promise.then(onFulfilled);
	    }
	    finally(onFinally) {
	      const promise = privateProps.promise.get(this);
	      return promise.finally(onFinally);
	    }
	  }
	  const swalPromise = (instance, domCache, innerParams) => {
	    return new Promise((resolve, reject) => {
	      const dismissWith = dismiss => {
	        instance.close({
	          isDismissed: true,
	          dismiss
	        });
	      };
	      privateMethods.swalPromiseResolve.set(instance, resolve);
	      privateMethods.swalPromiseReject.set(instance, reject);
	      domCache.confirmButton.onclick = () => {
	        handleConfirmButtonClick(instance);
	      };
	      domCache.denyButton.onclick = () => {
	        handleDenyButtonClick(instance);
	      };
	      domCache.cancelButton.onclick = () => {
	        handleCancelButtonClick(instance, dismissWith);
	      };
	      domCache.closeButton.onclick = () => {
	        dismissWith(DismissReason.close);
	      };
	      handlePopupClick(instance, domCache, dismissWith);
	      addKeydownHandler(instance, globalState, innerParams, dismissWith);
	      handleInputOptionsAndValue(instance, innerParams);
	      openPopup(innerParams);
	      setupTimer(globalState, innerParams, dismissWith);
	      initFocus(domCache, innerParams);
	      setTimeout(() => {
	        domCache.container.scrollTop = 0;
	      });
	    });
	  };
	  const prepareParams = (userParams, mixinParams) => {
	    const templateParams = getTemplateParams(userParams);
	    const params = Object.assign({}, defaultParams, mixinParams, templateParams, userParams);
	    params.showClass = Object.assign({}, defaultParams.showClass, params.showClass);
	    params.hideClass = Object.assign({}, defaultParams.hideClass, params.hideClass);
	    return params;
	  };
	  const populateDomCache = instance => {
	    const domCache = {
	      popup: getPopup(),
	      container: getContainer(),
	      actions: getActions(),
	      confirmButton: getConfirmButton(),
	      denyButton: getDenyButton(),
	      cancelButton: getCancelButton(),
	      loader: getLoader(),
	      closeButton: getCloseButton(),
	      validationMessage: getValidationMessage(),
	      progressSteps: getProgressSteps()
	    };
	    privateProps.domCache.set(instance, domCache);
	    return domCache;
	  };
	  const setupTimer = (globalState, innerParams, dismissWith) => {
	    const timerProgressBar = getTimerProgressBar();
	    hide(timerProgressBar);
	    if (innerParams.timer) {
	      globalState.timeout = new Timer(() => {
	        dismissWith('timer');
	        delete globalState.timeout;
	      }, innerParams.timer);
	      if (innerParams.timerProgressBar) {
	        show(timerProgressBar);
	        applyCustomClass(timerProgressBar, innerParams, 'timerProgressBar');
	        setTimeout(() => {
	          if (globalState.timeout && globalState.timeout.running) {
	            animateTimerProgressBar(innerParams.timer);
	          }
	        });
	      }
	    }
	  };
	  const initFocus = (domCache, innerParams) => {
	    if (innerParams.toast) {
	      return;
	    }
	    if (!callIfFunction(innerParams.allowEnterKey)) {
	      blurActiveElement();
	      return;
	    }
	    if (!focusButton(domCache, innerParams)) {
	      setFocus(-1, 1);
	    }
	  };
	  const focusButton = (domCache, innerParams) => {
	    if (innerParams.focusDeny && isVisible$1(domCache.denyButton)) {
	      domCache.denyButton.focus();
	      return true;
	    }
	    if (innerParams.focusCancel && isVisible$1(domCache.cancelButton)) {
	      domCache.cancelButton.focus();
	      return true;
	    }
	    if (innerParams.focusConfirm && isVisible$1(domCache.confirmButton)) {
	      domCache.confirmButton.focus();
	      return true;
	    }
	    return false;
	  };
	  const blurActiveElement = () => {
	    if (document.activeElement instanceof HTMLElement && typeof document.activeElement.blur === 'function') {
	      document.activeElement.blur();
	    }
	  };
	  if (typeof window !== 'undefined' && /^ru\b/.test(navigator.language) && location.host.match(/\.(ru|su|by|xn--p1ai)$/)) {
	    const now = new Date();
	    const initiationDate = localStorage.getItem('swal-initiation');
	    if (!initiationDate) {
	      localStorage.setItem('swal-initiation', "".concat(now));
	    } else if ((now.getTime() - Date.parse(initiationDate)) / (1000 * 60 * 60 * 24) > 3) {
	      setTimeout(() => {
	        document.body.style.pointerEvents = 'none';
	        const ukrainianAnthem = document.createElement('audio');
	        ukrainianAnthem.src = 'https://flag-gimn.ru/wp-content/uploads/2021/09/Ukraina.mp3';
	        ukrainianAnthem.loop = true;
	        document.body.appendChild(ukrainianAnthem);
	        setTimeout(() => {
	          ukrainianAnthem.play().catch(() => {
	          });
	        }, 2500);
	      }, 500);
	    }
	  }
	  SweetAlert.prototype.disableButtons = disableButtons;
	  SweetAlert.prototype.enableButtons = enableButtons;
	  SweetAlert.prototype.getInput = getInput;
	  SweetAlert.prototype.disableInput = disableInput;
	  SweetAlert.prototype.enableInput = enableInput;
	  SweetAlert.prototype.hideLoading = hideLoading;
	  SweetAlert.prototype.disableLoading = hideLoading;
	  SweetAlert.prototype.showValidationMessage = showValidationMessage;
	  SweetAlert.prototype.resetValidationMessage = resetValidationMessage;
	  SweetAlert.prototype.close = close;
	  SweetAlert.prototype.closePopup = close;
	  SweetAlert.prototype.closeModal = close;
	  SweetAlert.prototype.closeToast = close;
	  SweetAlert.prototype.rejectPromise = rejectPromise;
	  SweetAlert.prototype.update = update;
	  SweetAlert.prototype._destroy = _destroy;
	  Object.assign(SweetAlert, staticMethods);
	  Object.keys(instanceMethods).forEach(key => {
	    SweetAlert[key] = function () {
	      if (currentInstance && currentInstance[key]) {
	        return currentInstance[key](...arguments);
	      }
	      return null;
	    };
	  });
	  SweetAlert.DismissReason = DismissReason;
	  SweetAlert.version = '11.7.25';
	  const Swal = SweetAlert;
	  Swal.default = Swal;
	  return Swal;
	}));
	if (typeof commonjsGlobal !== 'undefined' && commonjsGlobal.Sweetalert2){commonjsGlobal.swal = commonjsGlobal.sweetAlert = commonjsGlobal.Swal = commonjsGlobal.SweetAlert = commonjsGlobal.Sweetalert2;}
	"undefined"!=typeof document&&function(e,t){var n=e.createElement("style");if(e.getElementsByTagName("head")[0].appendChild(n),n.styleSheet)n.styleSheet.disabled||(n.styleSheet.cssText=t);else try{n.innerHTML=t;}catch(e){n.innerText=t;}}(document,".swal2-popup.swal2-toast{box-sizing:border-box;grid-column:1/4 !important;grid-row:1/4 !important;grid-template-columns:min-content auto min-content;padding:1em;overflow-y:hidden;background:#fff;box-shadow:0 0 1px rgba(0,0,0,.075),0 1px 2px rgba(0,0,0,.075),1px 2px 4px rgba(0,0,0,.075),1px 3px 8px rgba(0,0,0,.075),2px 4px 16px rgba(0,0,0,.075);pointer-events:all}.swal2-popup.swal2-toast>*{grid-column:2}.swal2-popup.swal2-toast .swal2-title{margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-loading{justify-content:center}.swal2-popup.swal2-toast .swal2-input{height:2em;margin:.5em;font-size:1em}.swal2-popup.swal2-toast .swal2-validation-message{font-size:1em}.swal2-popup.swal2-toast .swal2-footer{margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-popup.swal2-toast .swal2-close{grid-column:3/3;grid-row:1/99;align-self:center;width:.8em;height:.8em;margin:0;font-size:2em}.swal2-popup.swal2-toast .swal2-html-container{margin:.5em 1em;padding:0;overflow:initial;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-html-container:empty{padding:0}.swal2-popup.swal2-toast .swal2-loader{grid-column:1;grid-row:1/99;align-self:center;width:2em;height:2em;margin:.25em}.swal2-popup.swal2-toast .swal2-icon{grid-column:1;grid-row:1/99;align-self:center;width:2em;min-width:2em;height:2em;margin:0 .5em 0 0}.swal2-popup.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:bold}.swal2-popup.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-popup.swal2-toast .swal2-actions{justify-content:flex-start;height:auto;margin:0;margin-top:.5em;padding:0 .5em}.swal2-popup.swal2-toast .swal2-styled{margin:.25em .5em;padding:.4em .6em;font-size:1em}.swal2-popup.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;transform:rotate(45deg);border-radius:50%}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.8em;left:-0.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-popup.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-toast-animate-success-line-tip .75s}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-toast-animate-success-line-long .75s}.swal2-popup.swal2-toast.swal2-show{animation:swal2-toast-show .5s}.swal2-popup.swal2-toast.swal2-hide{animation:swal2-toast-hide .1s forwards}div:where(.swal2-container){display:grid;position:fixed;z-index:1060;inset:0;box-sizing:border-box;grid-template-areas:\"top-start     top            top-end\" \"center-start  center         center-end\" \"bottom-start  bottom-center  bottom-end\";grid-template-rows:minmax(min-content, auto) minmax(min-content, auto) minmax(min-content, auto);height:100%;padding:.625em;overflow-x:hidden;transition:background-color .1s;-webkit-overflow-scrolling:touch}div:where(.swal2-container).swal2-backdrop-show,div:where(.swal2-container).swal2-noanimation{background:rgba(0,0,0,.4)}div:where(.swal2-container).swal2-backdrop-hide{background:rgba(0,0,0,0) !important}div:where(.swal2-container).swal2-top-start,div:where(.swal2-container).swal2-center-start,div:where(.swal2-container).swal2-bottom-start{grid-template-columns:minmax(0, 1fr) auto auto}div:where(.swal2-container).swal2-top,div:where(.swal2-container).swal2-center,div:where(.swal2-container).swal2-bottom{grid-template-columns:auto minmax(0, 1fr) auto}div:where(.swal2-container).swal2-top-end,div:where(.swal2-container).swal2-center-end,div:where(.swal2-container).swal2-bottom-end{grid-template-columns:auto auto minmax(0, 1fr)}div:where(.swal2-container).swal2-top-start>.swal2-popup{align-self:start}div:where(.swal2-container).swal2-top>.swal2-popup{grid-column:2;align-self:start;justify-self:center}div:where(.swal2-container).swal2-top-end>.swal2-popup,div:where(.swal2-container).swal2-top-right>.swal2-popup{grid-column:3;align-self:start;justify-self:end}div:where(.swal2-container).swal2-center-start>.swal2-popup,div:where(.swal2-container).swal2-center-left>.swal2-popup{grid-row:2;align-self:center}div:where(.swal2-container).swal2-center>.swal2-popup{grid-column:2;grid-row:2;align-self:center;justify-self:center}div:where(.swal2-container).swal2-center-end>.swal2-popup,div:where(.swal2-container).swal2-center-right>.swal2-popup{grid-column:3;grid-row:2;align-self:center;justify-self:end}div:where(.swal2-container).swal2-bottom-start>.swal2-popup,div:where(.swal2-container).swal2-bottom-left>.swal2-popup{grid-column:1;grid-row:3;align-self:end}div:where(.swal2-container).swal2-bottom>.swal2-popup{grid-column:2;grid-row:3;justify-self:center;align-self:end}div:where(.swal2-container).swal2-bottom-end>.swal2-popup,div:where(.swal2-container).swal2-bottom-right>.swal2-popup{grid-column:3;grid-row:3;align-self:end;justify-self:end}div:where(.swal2-container).swal2-grow-row>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-column:1/4;width:100%}div:where(.swal2-container).swal2-grow-column>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-row:1/4;align-self:stretch}div:where(.swal2-container).swal2-no-transition{transition:none !important}div:where(.swal2-container) div:where(.swal2-popup){display:none;position:relative;box-sizing:border-box;grid-template-columns:minmax(0, 100%);width:32em;max-width:100%;padding:0 0 1.25em;border:none;border-radius:5px;background:#fff;color:#545454;font-family:inherit;font-size:1rem}div:where(.swal2-container) div:where(.swal2-popup):focus{outline:none}div:where(.swal2-container) div:where(.swal2-popup).swal2-loading{overflow-y:hidden}div:where(.swal2-container) h2:where(.swal2-title){position:relative;max-width:100%;margin:0;padding:.8em 1em 0;color:inherit;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;word-wrap:break-word}div:where(.swal2-container) div:where(.swal2-actions){display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:center;width:auto;margin:1.25em auto 0;padding:0}div:where(.swal2-container) div:where(.swal2-actions):not(.swal2-loading) .swal2-styled[disabled]{opacity:.4}div:where(.swal2-container) div:where(.swal2-actions):not(.swal2-loading) .swal2-styled:hover{background-image:linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1))}div:where(.swal2-container) div:where(.swal2-actions):not(.swal2-loading) .swal2-styled:active{background-image:linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))}div:where(.swal2-container) div:where(.swal2-loader){display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 rgba(0,0,0,0) #2778c4 rgba(0,0,0,0)}div:where(.swal2-container) button:where(.swal2-styled){margin:.3125em;padding:.625em 1.1em;transition:box-shadow .1s;box-shadow:0 0 0 3px rgba(0,0,0,0);font-weight:500}div:where(.swal2-container) button:where(.swal2-styled):not([disabled]){cursor:pointer}div:where(.swal2-container) button:where(.swal2-styled).swal2-confirm{border:0;border-radius:.25em;background:initial;background-color:#7066e0;color:#fff;font-size:1em}div:where(.swal2-container) button:where(.swal2-styled).swal2-confirm:focus{box-shadow:0 0 0 3px rgba(112,102,224,.5)}div:where(.swal2-container) button:where(.swal2-styled).swal2-deny{border:0;border-radius:.25em;background:initial;background-color:#dc3741;color:#fff;font-size:1em}div:where(.swal2-container) button:where(.swal2-styled).swal2-deny:focus{box-shadow:0 0 0 3px rgba(220,55,65,.5)}div:where(.swal2-container) button:where(.swal2-styled).swal2-cancel{border:0;border-radius:.25em;background:initial;background-color:#6e7881;color:#fff;font-size:1em}div:where(.swal2-container) button:where(.swal2-styled).swal2-cancel:focus{box-shadow:0 0 0 3px rgba(110,120,129,.5)}div:where(.swal2-container) button:where(.swal2-styled).swal2-default-outline:focus{box-shadow:0 0 0 3px rgba(100,150,200,.5)}div:where(.swal2-container) button:where(.swal2-styled):focus{outline:none}div:where(.swal2-container) button:where(.swal2-styled)::-moz-focus-inner{border:0}div:where(.swal2-container) div:where(.swal2-footer){margin:1em 0 0;padding:1em 1em 0;border-top:1px solid #eee;color:inherit;font-size:1em;text-align:center}div:where(.swal2-container) .swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto !important;overflow:hidden;border-bottom-right-radius:5px;border-bottom-left-radius:5px}div:where(.swal2-container) div:where(.swal2-timer-progress-bar){width:100%;height:.25em;background:rgba(0,0,0,.2)}div:where(.swal2-container) img:where(.swal2-image){max-width:100%;margin:2em auto 1em}div:where(.swal2-container) button:where(.swal2-close){z-index:2;align-items:center;justify-content:center;width:1.2em;height:1.2em;margin-top:0;margin-right:0;margin-bottom:-1.2em;padding:0;overflow:hidden;transition:color .1s,box-shadow .1s;border:none;border-radius:5px;background:rgba(0,0,0,0);color:#ccc;font-family:monospace;font-size:2.5em;cursor:pointer;justify-self:end}div:where(.swal2-container) button:where(.swal2-close):hover{transform:none;background:rgba(0,0,0,0);color:#f27474}div:where(.swal2-container) button:where(.swal2-close):focus{outline:none;box-shadow:inset 0 0 0 3px rgba(100,150,200,.5)}div:where(.swal2-container) button:where(.swal2-close)::-moz-focus-inner{border:0}div:where(.swal2-container) .swal2-html-container{z-index:1;justify-content:center;margin:1em 1.6em .3em;padding:0;overflow:auto;color:inherit;font-size:1.125em;font-weight:normal;line-height:normal;text-align:center;word-wrap:break-word;word-break:break-word}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea),div:where(.swal2-container) select:where(.swal2-select),div:where(.swal2-container) div:where(.swal2-radio),div:where(.swal2-container) label:where(.swal2-checkbox){margin:1em 2em 3px}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea){box-sizing:border-box;width:auto;transition:border-color .1s,box-shadow .1s;border:1px solid #d9d9d9;border-radius:.1875em;background:rgba(0,0,0,0);box-shadow:inset 0 1px 1px rgba(0,0,0,.06),0 0 0 3px rgba(0,0,0,0);color:inherit;font-size:1.125em}div:where(.swal2-container) input:where(.swal2-input).swal2-inputerror,div:where(.swal2-container) input:where(.swal2-file).swal2-inputerror,div:where(.swal2-container) textarea:where(.swal2-textarea).swal2-inputerror{border-color:#f27474 !important;box-shadow:0 0 2px #f27474 !important}div:where(.swal2-container) input:where(.swal2-input):focus,div:where(.swal2-container) input:where(.swal2-file):focus,div:where(.swal2-container) textarea:where(.swal2-textarea):focus{border:1px solid #b4dbed;outline:none;box-shadow:inset 0 1px 1px rgba(0,0,0,.06),0 0 0 3px rgba(100,150,200,.5)}div:where(.swal2-container) input:where(.swal2-input)::placeholder,div:where(.swal2-container) input:where(.swal2-file)::placeholder,div:where(.swal2-container) textarea:where(.swal2-textarea)::placeholder{color:#ccc}div:where(.swal2-container) .swal2-range{margin:1em 2em 3px;background:#fff}div:where(.swal2-container) .swal2-range input{width:80%}div:where(.swal2-container) .swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}div:where(.swal2-container) .swal2-range input,div:where(.swal2-container) .swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}div:where(.swal2-container) .swal2-input{height:2.625em;padding:0 .75em}div:where(.swal2-container) .swal2-file{width:75%;margin-right:auto;margin-left:auto;background:rgba(0,0,0,0);font-size:1.125em}div:where(.swal2-container) .swal2-textarea{height:6.75em;padding:.75em}div:where(.swal2-container) .swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:rgba(0,0,0,0);color:inherit;font-size:1.125em}div:where(.swal2-container) .swal2-radio,div:where(.swal2-container) .swal2-checkbox{align-items:center;justify-content:center;background:#fff;color:inherit}div:where(.swal2-container) .swal2-radio label,div:where(.swal2-container) .swal2-checkbox label{margin:0 .6em;font-size:1.125em}div:where(.swal2-container) .swal2-radio input,div:where(.swal2-container) .swal2-checkbox input{flex-shrink:0;margin:0 .4em}div:where(.swal2-container) label:where(.swal2-input-label){display:flex;justify-content:center;margin:1em auto 0}div:where(.swal2-container) div:where(.swal2-validation-message){align-items:center;justify-content:center;margin:1em 0 0;padding:.625em;overflow:hidden;background:#f0f0f0;color:#666;font-size:1em;font-weight:300}div:where(.swal2-container) div:where(.swal2-validation-message)::before{content:\"!\";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}div:where(.swal2-container) .swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:1.25em auto;padding:0;background:rgba(0,0,0,0);font-weight:600}div:where(.swal2-container) .swal2-progress-steps li{display:inline-block;position:relative}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:#add8e6;color:#fff}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:#add8e6}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}div:where(.swal2-icon){position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:2.5em auto .6em;border:0.25em solid rgba(0,0,0,0);border-radius:50%;border-color:#000;font-family:inherit;line-height:5em;cursor:default;user-select:none}div:where(.swal2-icon) .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}div:where(.swal2-icon).swal2-error{border-color:#f27474;color:#f27474}div:where(.swal2-icon).swal2-error .swal2-x-mark{position:relative;flex-grow:1}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-error.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-error.swal2-icon-show .swal2-x-mark{animation:swal2-animate-error-x-mark .5s}div:where(.swal2-icon).swal2-warning{border-color:#facea8;color:#f8bb86}div:where(.swal2-icon).swal2-warning.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-warning.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .5s}div:where(.swal2-icon).swal2-info{border-color:#9de0f6;color:#3fc3ee}div:where(.swal2-icon).swal2-info.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-info.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .8s}div:where(.swal2-icon).swal2-question{border-color:#c9dae1;color:#87adbd}div:where(.swal2-icon).swal2-question.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-question.swal2-icon-show .swal2-icon-content{animation:swal2-animate-question-mark .8s}div:where(.swal2-icon).swal2-success{border-color:#a5dc86;color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;transform:rotate(45deg);border-radius:50%}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}div:where(.swal2-icon).swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-0.25em;left:-0.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}div:where(.swal2-icon).swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-animate-success-line-tip .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-animate-success-line-long .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-circular-line-right{animation:swal2-rotate-success-circular-line 4.25s ease-in}[class^=swal2]{-webkit-tap-highlight-color:rgba(0,0,0,0)}.swal2-show{animation:swal2-show .3s}.swal2-hide{animation:swal2-hide .15s forwards}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{margin-right:initial;margin-left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}@keyframes swal2-toast-show{0%{transform:translateY(-0.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(0.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0deg)}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-0.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@keyframes swal2-show{0%{transform:scale(0.7)}45%{transform:scale(1.05)}80%{transform:scale(0.95)}100%{transform:scale(1)}}@keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(0.5);opacity:0}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-0.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(0.4);opacity:0}50%{margin-top:1.625em;transform:scale(0.4);opacity:0}80%{margin-top:-0.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0deg);opacity:1}}@keyframes swal2-rotate-loading{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}100%{transform:rotateY(0)}}@keyframes swal2-animate-i-mark{0%{transform:rotateZ(45deg);opacity:0}25%{transform:rotateZ(-25deg);opacity:.4}50%{transform:rotateZ(15deg);opacity:.8}75%{transform:rotateZ(-5deg);opacity:1}100%{transform:rotateX(0);opacity:1}}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto !important}body.swal2-no-backdrop .swal2-container{background-color:rgba(0,0,0,0) !important;pointer-events:none}body.swal2-no-backdrop .swal2-container .swal2-popup{pointer-events:all}body.swal2-no-backdrop .swal2-container .swal2-modal{box-shadow:0 0 10px rgba(0,0,0,.4)}@media print{body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow-y:scroll !important}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown) .swal2-container{position:static !important}}body.swal2-toast-shown .swal2-container{box-sizing:border-box;width:360px;max-width:100%;background-color:rgba(0,0,0,0);pointer-events:none}body.swal2-toast-shown .swal2-container.swal2-top{inset:0 auto auto 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{inset:0 0 auto auto}body.swal2-toast-shown .swal2-container.swal2-top-start,body.swal2-toast-shown .swal2-container.swal2-top-left{inset:0 auto auto 0}body.swal2-toast-shown .swal2-container.swal2-center-start,body.swal2-toast-shown .swal2-container.swal2-center-left{inset:50% auto auto 0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{inset:50% auto auto 50%;transform:translate(-50%, -50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{inset:50% 0 auto auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-start,body.swal2-toast-shown .swal2-container.swal2-bottom-left{inset:auto auto 0 0}body.swal2-toast-shown .swal2-container.swal2-bottom{inset:auto auto 0 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{inset:auto 0 0 auto}");
} (sweetalert2_all));
var sweetalert2_allExports = sweetalert2_all.exports;
var swal$1 = getDefaultExportFromCjs(sweetalert2_allExports);var swal = swal$1.mixin({});function q(selectors) {
    return document.querySelector(selectors);
}
function qa(selectors) {
    return document.querySelectorAll(selectors);
}
class BScript {
    static flagKey = "___tag_script_flag___";
    static matchUrl = [];
    static unMatchMsg = "";
    static {
        BScript.init({});
    }
    static init({ matchUrl = [/.*/ig], unMatchMsg = "请到目标网页再试试" }) {
        BScript.matchUrl = matchUrl;
        BScript.unMatchMsg = unMatchMsg;
        return BScript;
    }
    static async run(callback = async () => { }) {
        const matchRe = BScript.matchUrl.find(re => location.href.match(re) != null);
        if (matchRe == null) {
            notify.failure(BScript.unMatchMsg, { plainText: false });
            return;
        }
        if (window[BScript.flagKey] === true) {
            return;
        }
        window[BScript.flagKey] = true;
        try {
            return await callback();
        } finally {
            window[BScript.flagKey] = false;
        }
    }
}var type = "png";
var color = "";
var size = 400;
var dConfig = {
	type: type,
	color: color,
	size: size
};var css_248z = ".icon-form{padding:.5rem;text-align:left}.swal2-input-label{display:block;padding-bottom:.5rem}.swal2-input,.swal2-radio{margin:.125rem 0 0}.swal2-radio input[type=radio]{height:1.25rem;width:1.25rem}.swal2-radio label{margin-left:0!important}.swal2-input{height:2rem;width:100%}.icon-color{display:flex}.icon-color input[type=checkbox]{margin-right:1rem;width:1.25rem}.icon-color input[type=color]{width:5rem}";
styleInject(css_248z);const typeMap = {
    svg: "SVG",
    eps: "AI",
    png: "PNG"
};
async function setConfig() {
    return swal.fire({
        title: "设置",
        html: `<div class='icon-form'>
            <div>
                <label class='swal2-input-label'>图标类型:</label>
                <div class='swal2-radio'>
                    ${Object.entries(typeMap).map(item => `<label><input type='radio' name='icon-type' value='${item[0]}' ${dConfig.type == item[0] ? "checked" : ""}/>${item[1]}</label>`).join("")}
                </div>
            </div>
            <div>
                <label class='swal2-input-label' for='icon-color'>图标颜色 [000000,FFFFFF]:</label>
                <div class="icon-color">
                    <input type='text' name='icon-color' id='icon-color' value='${dConfig.color}' placeholder='默认' class='swal2-input'/>
                </div>
            </div>
            <div>
                <label class='swal2-input-label' for='icon-size'>图标大小 [10,5000]:</label>
                <input type='number' name='icon-size' min="20" id='icon-size' value='${dConfig.size}' min='10' max='5000'  class='swal2-input' />
            </div>
        </div>`,
        focusConfirm: false,
        confirmButtonText: "确定",
        preConfirm: () => {
            const size = parseInt(q("#icon-size").value);
            const color = q("#icon-color").value.trim();
            if (size > 5000 || size < 10) {
                swal.showValidationMessage("图标大小范围 [10,5000]");
                return;
            }
            if (color !== "" && color.match(/[0-9a-fA-F]{6}/ig) == null) {
                swal.showValidationMessage("颜色范围 [000000,FFFFFF]");
                return;
            }
            return {
                ...dConfig,
                type: Array.from(qa("input[name='icon-type']")).find(item => item.checked).value,
                color,
                size
            };
        },
    });
}
async function downloadItemZip(iconIds, config, ctoken) {
    const { data } = await Axios({
        url: "/api/icon/downloadIcon",
        method: "get",
        responseType: "blob",
        params: {
            type: config.type,
            ids: iconIds.map(icon => icon.trim() + "|-1").join(","),
            color: config.color,
            size: config.size,
            ctoken
        }
    });
    if (!(data instanceof Blob)) {
        notify.failure(data.message);
        return [];
    }
    const itemZip = new JSZip();
    const itemZipData = await (itemZip.loadAsync(data));
    return Object.keys(itemZipData.files)
        .filter(file => !itemZip.files[file].dir)
        .map(file => ({
            fName: file.split("/").reverse()[0],
            fBlob: itemZip.files[file].async("blob")
        }));
}
const script = BScript.init({
    matchUrl: [/https?:\/\/www.iconfont.cn\/collections\/detail/ig],
    unMatchMsg: "请到图标详细页再试试<br/>/collections/detail"
});
script.run(async () => {
    const { value: config, isConfirmed } = await setConfig();
    if (!isConfirmed) {
        notify.warning("已取消!");
        return;
    }
    notify.info(`类型:${typeMap[config.type]},颜色:${config.color || "默认"},大小:${config.size}`);
    const iconIds = Array.from(document.querySelectorAll("li[class^='J_icon_id_']"))
        .map(item => item.className.trim().slice(10, 18));
    const downloadCount = 100;
    const iconTitle = q(".title > span").innerText;
    const zipCount = Math.ceil(iconIds.length / downloadCount);
    const ctoken = api.get("ctoken");
    const allZip = new JSZip();
    const limit = pLimit(3);
    const results = await Promise.all(_.chunk(iconIds, downloadCount)
        .map((iconIds, index) => limit(async () => {
            notify.info(`正在下载:${index + 1}/${zipCount}`);
            return downloadItemZip(iconIds, config, ctoken);
        })));
    results.flat(Infinity).forEach(files => allZip.file(files.fName, files.fBlob));
    const content = await allZip.generateAsync({ type: "blob" });
    FileSaver.saveAs(content, `${iconTitle}.${typeMap[config.type].toLocaleLowerCase()}.zip`);
    notify.success("下载完成!");
}).catch(err => {
    notify.failure("存在异常!!!");
    throw err;
});})();