/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlregex.test(textval);
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}

export function isEmpty(value) {
  if (value == null || typeof value === "undefined") {
    return true;
  }
  if (typeof value === "string" && value == "") {
    return true;
  }
  if (typeof value === "object") {
    for (var i in value) {
      if (value.hasOwnProperty(i)) {
        return false;
      }
    }
    return true;
  }
  return false;
}

export function isNumber(value) {
  if (typeof value !== "undefined" && typeof value === "number" && value > 0) {
    return true;
  }
  return false;
}

export function isNotEmpty(value) {
  return !this.isEmpty(value);
}

export function isQQ(qq) {
  if (this.isEmpty(qq)) {
    return false;
  }
  return /^[1-9]\d{4,11}$/.test(qq);
}
/**
 * 检查是否是非数值，而且小数只能保留6位
 * @param	value 需要检查格式的值
 * @return	{"result":检查结果,"value":格式化后的值}
 */
export function isNumAndFormat(value, fixed) {
  //检查是否是非数字值
  if (this.isEmpty(value)) {
    value = "";
    return {
      result: false,
      value: value
    };
  }
  if (isNaN(value)) {
    value = "";
    return {
      result: false,
      value: value
    };
  }
  fixed = this.isEmpty(fixed) ? 2 : fixed;
  //检查小数点后是否多余于fixed位
  if (
    value.toString().split(".").length > 1 &&
    value.toString().split(".")[1].length > fixed
  ) {
    value = Number(value).toFixed(fixed);
    return {
      result: false,
      value: value
    };
  }
  return {
    result: true,
    value: value
  };
}
/**
 * @param obj  html  input对象
 */
export function numFormat(obj, fixed) {
  var returnObj = this.isNumAndFormat(obj.value, fixed);
  obj.value = returnObj.value;
}
/**
 * 验证是否是手机号
 * @param	value 需要验证的值
 * @return	true 是手机号码格式
 * 			false 不是手机号码格式
 */
export function isMobile(value) {
  if (this.isEmpty(value)) {
    return false;
  }
  return /^1(3(4[0-8]\d{7}|[0-3,5-9]\d{8})|(4[579]|5[0-3,5-9]|7[0,1,3,5-8]|8\d)\d{8})$/.test(
    value
  );
}

export function isEmail(value) {
  if (value == null || typeof value == "undefined" || value == "") {
    return false;
  }
  var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
  if (!reg.test(value)) {
    return false;
  }
  return true;
}

export function isIdcard(idcard) {
  if (this.isEmpty(idcard)) {
    return false;
  }
  return /^((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5]))(\d{13}|\d{16}|(\d{15}[x|X]))$/.test(
    idcard
  );
}

export function isNotMobile(value) {
  return !this.isMobile(value);
}
