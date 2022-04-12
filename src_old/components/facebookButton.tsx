import { Button, ButtonProps } from '@nextui-org/react'
import React from 'react'
import Logo from '../logo'

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
    icon={<Logo size={24} />}
    light
    rounded
    {...props}
  >
    Login with facebook
  </Button>
)

export default FacebookButton
