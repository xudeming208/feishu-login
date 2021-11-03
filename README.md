<h1 align="center">
  feishu-login
</h1>
<br>
<p align="center">
  <a href="https://travis-ci.org/xudeming208/feishu-login"><img src="https://travis-ci.org/xudeming208/feishu-login.svg?branch=master" alt="Travis Status"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/node/v/feishu-login.svg" alt="Nodejs"></a>
  <a href="https://www.npmjs.com/package/feishu-login"><img src="https://img.shields.io/npm/v/feishu-login.svg" alt="Version"></a>
  <a href="https://npmcharts.com/compare/feishu-login?minimal=true"><img src="https://img.shields.io/npm/dm/feishu-login.svg" alt="Downloads"></a>
  <a href="https://github.com/xudeming208/feishu-login/graphs/contributors"><img src="https://img.shields.io/github/contributors/xudeming208/feishu-login.svg" alt="Contributors"></a>
  <a href="https://www.npmjs.com/package/feishu-login"><img src="https://img.shields.io/github/license/xudeming208/feishu-login.svg" alt="License"></a>
</p>

## 介绍
飞书应用登录

## 安装

```javascript
npm i feishu-login -S
```

## 飞书应用登录流程
1、进入[飞书开放平台](https://open.feishu.cn/)，并且创建应用，获取应用的`App ID`，启用网页或者小程序，然后将页面URL添加到重定向URL中，否则会提示`请求非法, 请联系应用开发者`，具体参考[飞书文档](https://open.feishu.cn/document/ukTMukTMukTM/uMTNz4yM1MjLzUzM)

2、`npm i feishu-login -S`

3、在调用接口的文件中，示例代码：

```javascript
  
  const FeishuLogin = require('FeishuLogin');
  
  const feishuLogin = new FeishuLogin({
    appId: 'xxx',
    // 因为飞书应用的重定向URL无法设置通配符，所以这里新建一个入口页面，避免每个需要登录的页面URL都需要配置到飞书应用后台中的重定向URL中。
    // 当然也可以不新建统一入口页面，将redirectUrl设置为真正页面的URL也可以
    // 配置重定向页面URL（需要将redirectUrl配置到飞书应用重定向URL中，否则会提示`请求非法, 请联系应用开发者`）
    // 比如：//www.xxx.com/#/redirect
    redirectUrl: 'xxx',
    ajaxConfig: {
      method: 'POST',
      url: 'xxx',
      data: {},
      // 其他axios配置
      ...
    },
    success: (res, url) => {
      ...
      // 如果登录成功后需要跳转到真正的URL，设置如下：
      window.location.href = url;
    },
    error: err => {
      // Indicator.close();
      ...
    }
  })
```

4、在接口返回未登录时，未登录的回调函数中，示例代码：

```javascript
  // Toast(`未登录，即将登录`);
  feishuLogin.login();
  
```

5、`redirectUrl `页面（redirectUrl/redirectUrl.vue）示例代码：

```javascript
<template>
    <div class="main-router-view">
        <div class="redirect-wrap">
            
        </div>
    </div>
</template>
<script>
    import { Indicator } from 'mint-ui';

    export default {
        data() {
            return {
                
            }
        },
        created(){
            Indicator.open({
                text: '登录中...',
                spinnerType: 'fading-circle'
            });

            // 没有登录cookie、或者登录cookie无效时，调用登录
            this.feishuLogin.login();
        },
    }
</script>
```

## Options

参数 | 解释 | 默认值
-|-|-
appId | 飞书应用app id | ''
redirectUrl | 配置重定向页面URL（需要将redirectUrl配置到飞书应用重定向URL中，否则会提示`请求非法, 请联系应用开发者`） | ''
ajaxConfig | 后端接口配置 | {}
success | 接口成功的回调。第一个参数为后端接口response，第二个参数为页面真正的URL | function () {}
error | 接口失败的回调。参数为error | function () {}
