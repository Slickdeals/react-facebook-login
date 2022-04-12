export const decodeParams = (param: string, key: string) =>
  decodeURIComponent(
    param.replace(
      new RegExp(
        '^(?:.*[&\\?]' +
          encodeURIComponent(key).replace(/[\.\+\*]/g, '\\$&') +
          '(?:\\=([^&]*))?)?.*$',
        'i'
      ),
      '$1'
    )
  )

export const getParams = (params: Object) =>
  '?' + Object.keys(params)
  .map(param => `${param}=${encodeURIComponent(params[param])}`)
  .join('&');


export const isRedirectedFromFb = () => {
  const params = window.location.search
  return (
    decodeParams(params, 'state') === 'facebookdirect' &&
    (decodeParams(params, 'code') ||
      decodeParams(params, 'granted_scopes'))
  )
}

export const loadSdkAsynchronously = (language: string) =>
  ((d, s, id) => {
    const element = d.getElementsByTagName(s)[0]
    const fjs: any = element
    let js: any = element
    if (d.getElementById(id)) {
      return
    }
    js = d.createElement(s)
    js.id = id
    js.src = `https://connect.facebook.net/${language}/sdk.js`
    fjs.parentNode.insertBefore(js, fjs)
  })(document, 'script', 'facebook-jssdk')

export const isMobile = () => {
  let hasTouchScreen = false;
    if ("maxTouchPoints" in navigator) {
      hasTouchScreen = navigator.maxTouchPoints > 0;
    } else if ("msMaxTouchPoints" in navigator) {
      //  @ts-ignore
      hasTouchScreen = navigator.msMaxTouchPoints > 0;
    } else {
      //  @ts-ignore
      const mQ = window.matchMedia && matchMedia("(pointer:coarse)");
      if (mQ && mQ.media === "(pointer:coarse)") {
        hasTouchScreen = !!mQ.matches;
      } else if ("orientation" in window) {
        hasTouchScreen = true; // deprecated, but good fallback
      } else {
        var UA = navigator.userAgent;
        hasTouchScreen =
          /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
          /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
      }
    }
    
    return hasTouchScreen
}