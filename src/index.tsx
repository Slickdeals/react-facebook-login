export * from './facebook-login'

export interface FacebookLoginProps {
  appId: string
  callback(
    userInfo: ReactFacebookLoginInfo | ReactFacebookFailureResponse
  ): void
  fields?: string
  isDisabled?: boolean
  language?: string
  onClick?: Function
  onFailure?(response: ReactFacebookFailureResponse): void
  render?(props: any): JSX.Element
  scope?: string
}

export interface FacebookLoginRenderProps {
  onClick: any
  isDisabled: boolean
  isLoading: boolean
  isSdkLoaded: boolean
}

export interface ReactFacebookFailureResponse {
  status?: string | undefined
}

export interface FacebookPicture {
  data: {
    height?: number | undefined
    is_silhouette?: boolean | undefined
    url?: string | undefined
    width?: number | undefined
  }
}

export interface ReactFacebookLoginInfo {
  id: string
  userID: string
  accessToken: string
  name?: string | undefined
  email?: string | undefined
  picture?: FacebookPicture | undefined
}

export interface ReactFacebookLoginState {
  isSdkLoaded?: boolean | undefined
  isLoading?: boolean | undefined
}
