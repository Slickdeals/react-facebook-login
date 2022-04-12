# @odyssoft/react-facebook-login

## Prerequisites
This package was built using [React](https://reactjs.org/), and [Next UI](https://nextui.org/)
 - react
 - react-dom
- @nextui-org/react

`npm i react react-dom @nextui-org/react`

## Getting Started
Install the package to your existing or new react application
`npm i @odyssoft/react-facebook-login` or `yarn add @odyssoft/react-facebook-login`

## Usage
Replace YOUR_APP_ID with your actual Facebook app ID.
If you're unsure how to get your Facebook app ID or haven't created a Facebook login app yet, see [this link](https://stackoverflow.com/questions/3203649/where-can-i-find-my-facebook-application-id-and-secret-key) to find out how.
### Basic usage / Default button
```ts
import React from 'react'
import FacebookLogin, { FacebookResponse } from 'react-facebook-login'

const App = () => {
	const handleLogin = (response: FacebookResponse ) => {
		console.log({ response })
	}
	return (
		<FacebookLogin
			appId={'YOUR_APP_ID'}
			callback={handleLogin}
		/>
	)
}
```

### Custom Button
```ts
import React from 'react'
import FacebookLogin, {
	FacebookLoginRenderProps,
	FacebookResponse
} from 'react-facebook-login'

const App = () => {
	const handleLogin = (response: FacebookResponse ) => {
		console.log({ response })
	}
	
	const YourComponent = (props: FacebookLoginRenderProps) => (
		<div {...props}>{'Login with Facebook'}</div>
	)
	
	return (
		<FacebookLogin
			appId={'YOUR_APP_ID'}
			callback={handleLogin}
			render={YourComponent}
		/>
	)
}
```

## FacebookLogin Props
|Prop|Type|Default Value|
|--|--|--|
|appId|string - Required|None|
|callback|function - Required|None|
|fields|string - Optional|'name'|
|isDisabled|boolean - Optional|false|
|language|string - Optional|'en_US'|
|onClick|function - Optional|None|
|onFailure|function - Optional|None|
|render|JSX.Element - Optional|None|
|scope|string - Optional|None
