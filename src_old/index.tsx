import React, { useEffect, useState } from 'react'
import FacebookButton from './components/facebookButton'
import {
  getParams,
  isRedirectedFromFb,
  loadSdkAsynchronously,
} from './functions'
import {
  FacebookLoginProps,
  ReactFacebookFailureResponse,
  ReactFacebookLoginInfo,
} from './types'

export const FacebookLogin = ({
  appId,
  autoLoad: auto,
  callback,
  render,
  ...props
}: FacebookLoginProps) => {
  const [autoload] = useState<boolean>(Boolean(auto))
  const [isSdkLoaded, setIsSdkLoaded] = useState<boolean>(false)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const setFbAsyncInit = () => {
    window.fbAsyncInit = () => {
      window.FB.init({
        version: `v${props.version ?? '3.1'}`,
        appId,
        xfbml: props.xfbml ?? false,
        cookie: props.cookie ?? false,
      })
      setIsSdkLoaded(true)
      if (autoload || isRedirectedFromFb()) {
        window.FB.getLoginStatus(checkLoginAfterRefresh)
      }
    }
  }

  const responseApi = (
    authResponse: ReactFacebookLoginInfo | ReactFacebookFailureResponse
  ) =>
    window.FB.api(
      '/me',
      { locale: props.language ?? 'en_US', fields: props.fields ?? 'name' },
      (me: any) => {
        Object.assign(me, authResponse)
        callback(me)
      }
    )

  const checkLoginAfterRefresh = (response: any) =>
    response.status === 'connected'
      ? checkLoginState(response)
      : window.FB.login(
          (loginResponse: any) => checkLoginState(loginResponse),
          true
        )

  const checkLoginState = ({ authResponse, status }: any) => {
    setIsProcessing(false)
    if (authResponse) {
      return responseApi(authResponse)
    }
    if (props.onFailure) {
      return props.onFailure({ status })
    }
    callback({ status })
  }

  const handleClick = (e: any) => {
    if (!isSdkLoaded || isProcessing || props.isDisabled) {
      return
    }
    setIsProcessing(true)
    const {
      scope,
      onClick,
      returnScopes,
      responseType,
      redirectUri,
      disableMobileRedirect,
      authType,
      state,
    } = props

    if (typeof onClick === 'function') {
      onClick(e)
      if (e.defaultPrevented) {
        setIsProcessing(false)
        return
      }
    }

    const params = {
      client_id: appId,
      redirect_uri: redirectUri,
      state,
      return_scopes: returnScopes,
      scope,
      response_type: responseType,
      auth_type: authType,
    }

    if (props.isMobile && !disableMobileRedirect) {
      const locParams = getParams(params)
      window.location.href = `https://www.facebook.com/dialog/oauth${locParams}`
    } else {
      if (!window.FB) {
        if (props.onFailure) {
          props.onFailure({ status: 'facebookNotLoaded' })
        }

        return
      }

      window.FB.getLoginStatus((response: any) => {
        if (response.status === 'connected') {
          checkLoginState(response)
        } else {
          window.FB.login(checkLoginState, {
            scope,
            return_scopes: returnScopes,
            auth_type: params.auth_type,
          })
        }
      })
    }
    props.onClick && props.onClick(e)
  }

  useEffect(() => {
    if (isSdkLoaded && autoload) {
      window.FB.getLoginStatus(checkLoginAfterRefresh)
    }
  }, [auto, autoload])

  useEffect(() => {
    if (document.getElementById('facebook-jssdk')) {
      setIsSdkLoaded(true)
      return
    }
    setFbAsyncInit()
    loadSdkAsynchronously(props.language ?? 'en_US')
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
      isDisabled: !!props.isDisabled,
      isProcessing,
      isSdkLoaded,
    })
  }
  return <FacebookButton onClick={handleClick} />
}

export default FacebookLogin
