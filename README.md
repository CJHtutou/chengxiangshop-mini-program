# 黑盘羊沉香商城小程序

基于 uni-app（Vue 3）开发的沉香电商用户端，可运行到 H5 与微信小程序。界面参考黑盘羊沉香商城截图，实现首页、品牌历程、商品列表、商品详情、购物车、下单支付模拟、订单追踪、个人中心、地址和设置。

## 技术栈

- uni-app + Vue 3
- Pinia
- uni-ui
- Promise 风格请求封装
- 本地 RESTful Mock 数据

## 运行

```bash
npm install
npm run dev:h5
```

浏览器打开 `http://localhost:5174`。

微信小程序开发模式：

```bash
npm run dev:mp-weixin
```

然后用微信开发者工具导入 `dist/dev/mp-weixin`。正式发布前请在 `src/manifest.json` 中填写小程序 AppID。

## 构建

```bash
npm run build:h5
npm run build:mp-weixin
```

## Mock 与真实接口

本地数据位于 `src/mock/index.js`，请求入口位于 `src/api`。接口按照下列资源组织，统一响应格式为 `{ code: 200, data: {}, msg: '' }`：

- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/orders`
- `POST /api/orders`
- `PATCH /api/cart/:id`

接入后端时，在 `src/api/request.js` 配置 `BASE_URL`，并将 `src/api/mall.js` 中的本地 Mock 调用替换为 `request()`。

## Git 初始化与 Gitee 推送

首次创建仓库时执行：

```bash
git init
git add .
git commit -m "feat: build chengxiangshop mini program"
git branch -M main
git remote add origin https://gitee.com/Cjhtutou/chengxiangshop-mini-program.git
git push -u origin main
```

本项目目录已完成初始化、提交和远端关联。配置好 Gitee 凭据后，只需执行：

```bash
git push -u origin main
```

如果远端仓库已有提交，先执行 `git pull --rebase origin main`，解决冲突后再推送；不要使用强制推送覆盖远端历史。
