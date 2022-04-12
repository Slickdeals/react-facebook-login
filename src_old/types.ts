export interface FacebookLoginProps {
  appId: string,
  authType?: string,
  autoLoad?: boolean,
  callback(userInfo: ReactFacebookLoginInfo | ReactFacebookFailureResponse): void,
  cookie?: boolean,
  disableMobileRedirect?: boolean,
  fields?: string,
  isDisabled?: boolean,
  isMobile?: boolean,
  language?: string,
  onClick?: Function,
  onFailure?(response: ReactFacebookFailureResponse): void,
  redirectUri?: string,
  render?(props: any): JSX.Element,
  responseType?: string,
  returnScopes?: boolean,
  scope?: string,
  state?: string,
  version?: string,
  xfbml?: boolean,
}

export interface FacebookLoginRenderProps {
  onClick: any,
  isDisabled: boolean,
  isProcessing: boolean,
  isSdkLoaded: boolean,
}

export interface ReactFacebookFailureResponse {
  status?: string | undefined;
}

export interface ReactFacebookLoginInfo {
  id: string;
  userID: string;
  accessToken: string;
  name?: string | undefined;
  email?: string | undefined;
  picture?: {
    data: {
      height?: number | undefined,
      is_silhouette?: boolean | undefined,
      url?: string | undefined,
      width?: number | undefined,
    },
  } | undefined;
}

export interface ReactFacebookLoginState {
  isSdkLoaded?: boolean | undefined;
  isProcessing?: boolean | undefined;
}