import FacebookLogin from './facebook-login'
export * from './facebook-login'

export default FacebookLogin

export interface FacebookLoginProps {
  appId: string
  callback(userInfo: FacebookResponse): void
  fields?: string
  isDisabled?: boolean
  language?: string
  onClick?: Function
  onFailure?(response: FacebookFailureResponse): void
  render?(props: any): JSX.Element
  scope?: string
}

export type FacebookResponse = FacebookLoginInfo | FacebookFailureResponse

export interface FacebookLoginRenderProps {
  onClick: any
  isDisabled: boolean
  isLoading: boolean
  isSdkLoaded: boolean
}

export interface FacebookFailureResponse {
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

export interface FacebookLoginInfo {
  id: string
  userID: string
  accessToken: string
  name?: string | undefined
  email?: string | undefined
  picture?: FacebookPicture | undefined
}

export interface FacebookLoginState {
  isSdkLoaded?: boolean | undefined
  isLoading?: boolean | undefined
}
