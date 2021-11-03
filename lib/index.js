'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const axios = require('axios');

// class FeishuLogin
class FeishuLogin {
	constructor(config = {}) {
		// 飞书应用App Id
		this.appId = config.appId || '';
		// 因为飞书应用的重定向URL无法设置通配符，所以这里新建一个入口页面，避免每个需要登录的页面URL都需要配置到飞书应用后台中的重定向URL中。
		// 当然也可以不新建统一入口页面，将redirectUrl设置为真正页面的URL也可以
		// 配置重定向页面URL（需要将redirectUrl配置到飞书应用重定向URL中，否则会提示`请求非法, 请联系应用开发者`）
		// 比如：//www.xxx.com/#/redirect
		this.redirectUrl = config.redirectUrl || '';
		// 后端接口配置
		this.ajaxConfig = config.ajaxConfig || {};
		// 接口成功的回调。第一个参数为后端接口response，第二个参数为页面真正的URL
		this.success = config.success || function () {};
		// 接口失败的回调。参数为error
		this.error = config.error || function () {};
	}

	isType(type) {
		return obj => {
			return {}.toString.call(obj) === '[object ' + type + ']';
		};
	}

	errorCatch() {
		if (!!this.appId.trim()) {
			console.error('必须配置appId');
			return false;
		}

		if (!!this.ajaxConfig.url.trim()) {
			console.error('必须配置后端接口URL');
			return false;
		}

		if (!!this.redirectUrl.trim()) {
			console.error('必须配置重定向页面URL');
			return false;
		}

		return true;
	}

	// 登录
	login() {
		if (!this.errorCatch()) {
			return console.error('配置不对，请检查！');
		}

		// 判断是否有飞书code：
		// 有code，则根据code调用后端接口拿到登录用户信息(此时后端会将登录用户信息种到cookie中)，然后执行后面的逻辑
		// 没有code，页面跳转到飞书提供的URI，登录成功后会生成登录预授权码code，并作为参数放到重定向URL（redirectUrl）后面

		// 获取飞书code
		// code会跟在hash后面，不是query，而是作为hash的value了
		// let code = new URL(location.href).searchParams.get('code');
		// IOS不支持正则的断言
		// let reg = /(?<=code=).*(?=&)/g;
		let reg = /code=.*(?=&)/g;
		let matchStr = location.href.match(reg) ? location.href.match(reg)[0] : '';
		let code = matchStr.substr(5) || '';

		// 有code时，代表飞书已经登录成功，需要将code传给后端，后端成功后会set-cookie
		if (!!code) {
			axios({
				method: this.ajaxConfig.method || 'POST',
				url: this.ajaxConfig.url,
				data: (0, _assign2.default)({}, this.ajaxConfig.data, {
					code,
					app_id: this.appId
				})
			}).then(res => {
				// 获取页面真正的URL
				let reg = /state=.*/g;
				let matchStr = location.href.match(reg) ? location.href.match(reg)[0] : '';
				let state = matchStr.substr(6) || '';
				let stateObj = state ? JSON.parse(decodeURIComponent(state)) : {};
				let url = stateObj.url || '';

				this.success && this.isType('Function')(this.success) && this.success(res, decodeURIComponent(stateObj.url));
				// window.location.href = decodeURIComponent(stateObj.url);
			}).catch(err => {
				this.error && this.isType('Function')(this.error) && this.error(err);
			});
		} else {
			// 将页面真正的URL放置在自定义参数后面，方便登录成功后跳转到真正的页面
			let state = {
				url: encodeURIComponent(location.href)
			};
			window.location.href = `https://open.feishu.cn/open-apis/authen/v1/index?redirect_uri=${encodeURIComponent(this.redirectUrl)}&app_id=${this.appId}&state=${(0, _stringify2.default)(state)}`;
		}
	}
}

module.exports = FeishuLogin;