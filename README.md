# 黑盘羊沉香商城小程序

基于 uni-app（Vue 3）开发的微信小程序商城。界面参考黑盘羊沉香商城截图，实现首页、品牌历程、商品列表、商品详情、购物车、下单支付模拟、订单追踪、个人中心、地址和设置。H5 仅作为可选的浏览器调试方式，不是正式交付端。

## 技术栈

- uni-app + Vue 3
- Pinia
- uni-ui
- Promise 风格请求封装
- 本地 RESTful Mock 数据

## 微信小程序运行

```bash
npm install
npm run configure:appid -- wx1234567890abcdef
npm run dev
```

将示例 AppID 替换成你在微信公众平台获得的真实小程序 AppID。然后用微信开发者工具导入：

```text
dist/dev/mp-weixin
```

没有 AppID 时也可以跳过配置并编译，生成项目会使用 `touristappid`，但无法进行完整真机调试、上传和发布。

可选的 H5 快速预览：

```bash
npm run dev:h5
```

浏览器打开 `http://localhost:5174`。

## 构建

```bash
npm run build
```

正式微信小程序产物位于 `dist/build/mp-weixin`。所有展示图片均已存入 `src/static/images`，不需要配置第三方图片下载域名。

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
git remote add github https://github.com/CJHtutou/chengxiangshop-mini-program.git
git push -u origin main
git push -u github main
```

本项目目录已完成初始化、提交和远端关联。配置好 Gitee 凭据后，只需执行：

```bash
git push -u origin main
git push -u github main
```

其中 `origin` 对应 Gitee，`github` 对应 GitHub；两边都推送成功后即可保持双仓库同步。

如果远端仓库已有提交，先执行 `git pull --rebase origin main`，解决冲突后再推送；不要使用强制推送覆盖远端历史。
