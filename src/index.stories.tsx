import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import FacebookLogin from './facebook-login'

import {
  FacebookLoginRenderProps,
  FacebookFailureResponse,
  FacebookLoginInfo,
} from './'

export default {
  title: 'Facebook Login Button',
  component: FacebookLogin,
} as ComponentMeta<typeof FacebookLogin>

const Template: ComponentStory<typeof FacebookLogin> = (args: any) => (
  <FacebookLogin
    appId={'1257990027970358'}
    onClick={(e: any) => {
      console.log({ clicked: e })
    }}
    callback={(response: FacebookLoginInfo | FacebookFailureResponse) => {
      console.log({ response })
    }}
    {...args}
  />
)

//  @ts-ignore
export const _FacebookLogin = () => <Template />

export const _FacebookLoginRender = () => {
  const TestComponent = (props: FacebookLoginRenderProps) => (
    <div style={{ background: 'red' }} {...props}>
      Click to login
    </div>
  )
  return (
    //  @ts-ignore
    <Template render={TestComponent} />
  )
}
