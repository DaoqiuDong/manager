import fetch from '@/utils/fetch';

export function login(loginName, password,smsCode) {
  return fetch({
    url: 'credit/web/sys/login',
    method:'post',
    data: {
      smsCode,
      loginName,
      password
    }
  });
}

export function getInfo(token) {
  return fetch({
    url: 'credit/web/sys/account/find',
    method: 'post',
    data: { token }
  });
}

export function logout() {
  return fetch({
    url: 'credit/web/sys/layout',
    method: 'post'
  });
}
