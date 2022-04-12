var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { Button } from '@nextui-org/react';
import React from 'react';
var decodeParams = function (param, key) {
    return decodeURIComponent(param.replace(new RegExp('^(?:.*[&\\?]' +
        encodeURIComponent(key).replace(/[\.\+\*]/g, '\\$&') +
        '(?:\\=([^&]*))?)?.*$', 'i'), '$1'));
};
var getParams = function (params) {
    return '?' +
        Object.keys(params)
            .map(function (param) { return "".concat(param, "=").concat(encodeURIComponent(params[param])); })
            .join('&');
};
export var isMobile = function () {
    var hasTouchScreen = false;
    if ('maxTouchPoints' in navigator) {
        hasTouchScreen = navigator.maxTouchPoints > 0;
    }
    else if ('msMaxTouchPoints' in navigator) {
        //  @ts-ignore
        hasTouchScreen = navigator.msMaxTouchPoints > 0;
    }
    else {
        //  @ts-ignore
        var mQ = window.matchMedia && matchMedia('(pointer:coarse)');
        if (mQ && mQ.media === '(pointer:coarse)') {
            hasTouchScreen = !!mQ.matches;
        }
        else if ('orientation' in window) {
            hasTouchScreen = true;
        }
        else {
            var UA = navigator.userAgent;
            hasTouchScreen =
                /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
                    /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
        }
    }
    return hasTouchScreen;
};
var isRedirected = function (params) {
    if (params === void 0) { params = window.location.search; }
    return decodeParams(params, 'state') === 'facebookdirect' &&
        (decodeParams(params, 'code') || decodeParams(params, 'granted_scopes'));
};
var loadSdk = function (lang) {
    console.log(' loading sdk ');
    if (document.getElementById('facebook-jssdk')) {
        return;
    }
    var element = document.getElementsByTagName('script')[0];
    var clone = element;
    var source = element;
    source = document.createElement('script');
    source.id = 'facebook-jssdk';
    source.src = "https://connect.facebook.net/".concat(lang, "/sdk.js");
    clone.parentNode.insertBefore(source, clone);
    console.log('done');
};
var FacebookLogin = function (_a) {
    var appId = _a.appId, callback = _a.callback, fields = _a.fields, isDisabled = _a.isDisabled, language = _a.language, onClick = _a.onClick, onFailure = _a.onFailure, render = _a.render, scope = _a.scope;
    var _b = React.useState(false), isSdkLoaded = _b[0], setIsSdkLoaded = _b[1];
    var _c = React.useState(false), isLoading = _c[0], setIsLoading = _c[1];
    var initFB = function () {
        console.log('called init');
        window.fbAsyncInit = function () {
            window.FB.init({
                version: 'v3.1',
                appId: appId,
                xfbml: false,
                cookie: false,
            });
            setIsSdkLoaded(true);
            if (isRedirected()) {
                window.FB.getLoginStatus(checkLogin);
            }
        };
    };
    var responseApi = function (authResponse) {
        return window.FB.api('/me', { locale: language !== null && language !== void 0 ? language : 'en_US', fields: fields !== null && fields !== void 0 ? fields : 'name' }, function (response) {
            Object.assign(response, authResponse);
            callback(response);
        });
    };
    var checkLogin = function (response) {
        return response.status === 'connected'
            ? checkState(response)
            : window.FB.login(function (loginResponse) { return checkState(loginResponse); }, true);
    };
    var checkState = function (_a) {
        var authResponse = _a.authResponse, status = _a.status;
        setIsLoading(false);
        if (authResponse) {
            return responseApi(authResponse);
        }
        return onFailure ? onFailure({ status: status }) : callback({ status: status });
    };
    var handleClick = function (e) {
        console.log({ clicked: e });
        if (!isSdkLoaded || isLoading || isDisabled) {
            console.log({ isSdkLoaded: isSdkLoaded });
            console.log({ isLoading: isLoading });
            console.log({ isDisabled: !!isDisabled });
            return;
        }
        setIsLoading(true);
        if (typeof onClick === 'function') {
            onClick(e);
            if (e.defaultPrevented) {
                setIsLoading(false);
                return;
            }
        }
        var params = {
            client_id: appId,
            redirect_uri: 'window.location.href (mobile-only)',
            return_scopes: false,
            response_type: 'code',
        };
        if (isMobile()) {
            var locParams = getParams(params);
            window.location.href = "https://www.facebook.com/dialog/oauth".concat(locParams);
        }
        else {
            if (!window.FB) {
                if (onFailure) {
                    onFailure({ status: 'facebookNotLoaded' });
                }
                return;
            }
            window.FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    checkState(response);
                }
                else {
                    window.FB.login(checkState, {
                        scope: scope,
                        return_scopes: params.return_scopes,
                    });
                }
            });
        }
        onClick && onClick(e);
    };
    var FacebookButton = function (props) { return (React.createElement(Button, __assign({ auto: true, css: {
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
        }, icon: React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', height: '1.5rem', width: '1.5rem', viewBox: '0 0 512 512' },
            React.createElement("path", { d: 'M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z', fill: 'currentColor' })), light: true, rounded: true }, props), "Login with facebook")); };
    React.useEffect(function () {
        if (document.getElementById('facebook-jssdk')) {
            setIsSdkLoaded(true);
            return;
        }
        initFB();
        loadSdk(language !== null && language !== void 0 ? language : 'en_US');
        var fbRoot = document.getElementById('fb-root');
        if (!fbRoot) {
            fbRoot = document.createElement('div');
            fbRoot.id = 'fb-root';
            document.body.appendChild(fbRoot);
        }
    }, []);
    if (render) {
        return render({
            onClick: handleClick,
            isDisabled: !!isDisabled,
            isLoading: isLoading,
            isSdkLoaded: isSdkLoaded,
        });
    }
    return React.createElement(FacebookButton, { onClick: handleClick });
};
export default FacebookLogin;
//# sourceMappingURL=index.js.map