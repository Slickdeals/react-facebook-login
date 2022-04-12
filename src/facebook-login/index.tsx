import { Button, ButtonProps } from '@nextui-org/react'
import React from 'react'
import {
  FacebookLoginProps,
  ReactFacebookFailureResponse,
  ReactFacebookLoginInfo,
} from '../'

const decodeParams = (param: string, key: string) =>
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

const getParams = (params: Object) =>
  '?' +
  Object.keys(params)
    .map((param) => `${param}=${encodeURIComponent(params[param])}`)
    .join('&')

export const isMobile = () => {
  let hasTouchScreen = false
  if ('maxTouchPoints' in navigator) {
    hasTouchScreen = navigator.maxTouchPoints > 0
  } else if ('msMaxTouchPoints' in navigator) {
    //  @ts-ignore
    hasTouchScreen = navigator.msMaxTouchPoints > 0
  } else {
    //  @ts-ignore
    const mQ = window.matchMedia && matchMedia('(pointer:coarse)')
    if (mQ && mQ.media === '(pointer:coarse)') {
      hasTouchScreen = !!mQ.matches
    } else if ('orientation' in window) {
      hasTouchScreen = true
    } else {
      var UA = navigator.userAgent
      hasTouchScreen =
        /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
        /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
    }
  }

  return hasTouchScreen
}

const isRedirected = (params = window.location.search) =>
  decodeParams(params, 'state') === 'facebookdirect' &&
  (decodeParams(params, 'code') || decodeParams(params, 'granted_scopes'))

const loadSdk = (lang: string) => {
  console.log(' loading sdk ')
  if (document.getElementById('facebook-jssdk')) {
    return
  }
  const element = document.getElementsByTagName('script')[0]
  const clone: any = element
  let source: any = element
  source = document.createElement('script')
  source.id = 'facebook-jssdk'
  source.src = `https://connect.facebook.net/${lang}/sdk.js`
  clone.parentNode.insertBefore(source, clone)
  console.log('done')
}

const FacebookLogin = ({
  appId,
  callback,
  fields,
  isDisabled,
  language,
  onClick,
  onFailure,
  render,
  scope,
}: FacebookLoginProps) => {
  const [isSdkLoaded, setIsSdkLoaded] = React.useState<boolean>(false)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const initFB = () => {
    console.log('called init')
    window.fbAsyncInit = () => {
      window.FB.init({
        version: 'v3.1',
        appId,
        xfbml: false,
        cookie: false,
      })
      setIsSdkLoaded(true)
      if (isRedirected()) {
        window.FB.getLoginStatus(checkLogin)
      }
    }
  }

  const responseApi = (
    authResponse: ReactFacebookLoginInfo | ReactFacebookFailureResponse
  ) =>
    window.FB.api(
      '/me',
      { locale: language ?? 'en_US', fields: fields ?? 'name' },
      (response: any) => {
        Object.assign(response, authResponse)
        callback(response)
      }
    )

  const checkLogin = (response: any) =>
    response.status === 'connected'
      ? checkState(response)
      : window.FB.login((loginResponse: any) => checkState(loginResponse), true)

  const checkState = ({ authResponse, status }: any) => {
    setIsLoading(false)
    if (authResponse) {
      return responseApi(authResponse)
    }
    return onFailure ? onFailure({ status }) : callback({ status })
  }

  const handleClick = (e: any) => {
    console.log({ clicked: e })
    if (!isSdkLoaded || isLoading || isDisabled) {
      console.log({ isSdkLoaded })
      console.log({ isLoading })
      console.log({ isDisabled: !!isDisabled })
      return
    }
    setIsLoading(true)

    if (typeof onClick === 'function') {
      onClick(e)
      if (e.defaultPrevented) {
        setIsLoading(false)
        return
      }
    }

    const params = {
      client_id: appId,
      redirect_uri: 'window.location.href (mobile-only)',
      return_scopes: false,
      response_type: 'code',
    }

    if (isMobile()) {
      const locParams = getParams(params)
      window.location.href = `https://www.facebook.com/dialog/oauth${locParams}`
    } else {
      if (!window.FB) {
        if (onFailure) {
          onFailure({ status: 'facebookNotLoaded' })
        }

        return
      }

      window.FB.getLoginStatus((response: any) => {
        if (response.status === 'connected') {
          checkState(response)
        } else {
          window.FB.login(checkState, {
            scope,
            return_scopes: params.return_scopes,
          })
        }
      })
    }
    onClick && onClick(e)
  }

  const FacebookButton = (props: ButtonProps) => (
    <Button
      auto
      css={{
        background: '#1778f2',
        color: 'white',
        fontWeight: 600,
        fontSize: '1.1rem',
        '&:hover': {
          background: '#4C69BA',
        },
        '& .nextui-button-icon': {
          marginLeft: '-11px',
          marginRight: '6px',
        },
      }}
      icon={
        <svg
          xmlns='http://www.w3.org/2000/svg'
          height={'1.5rem'}
          width={'1.5rem'}
          viewBox='0 0 512 512'
        >
          <path
            d={
              'M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z'
            }
            fill={'currentColor'}
          />
        </svg>
      }
      light
      rounded
      {...props}
    >
      Login with facebook
    </Button>
  )

  React.useEffect(() => {
    if (document.getElementById('facebook-jssdk')) {
      setIsSdkLoaded(true)
      return
    }
    initFB()
    loadSdk(language ?? 'en_US')
    let fbRoot = document.getElementById('fb-root')
    if (!fbRoot) {
      fbRoot = document.createElement('div')
      fbRoot.id = 'fb-root'
      document.body.appendChild(fbRoot)
    }
  }, [])
  if (render) {
    return render({
      onClick: handleClick,
      isDisabled: !!isDisabled,
      isLoading,
      isSdkLoaded,
    })
  }
  return <FacebookButton onClick={handleClick} />
}

export default FacebookLogin
