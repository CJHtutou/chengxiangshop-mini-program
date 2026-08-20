# 微信小程序端

`mini-app` 是商城的 uni-app + Vue 3 微信小程序前端。生产端只通过 `wx.cloud.callFunction` 调用 CloudBase 的 `api` 云函数；H5 仅用于页面预览，不提供可替代的生产请求通道。

## 职责与边界

- 入口：`src/main.js`。仅在 `MP-WEIXIN` 条件编译分支初始化 `wx.cloud`。
- 请求：`src/api/` 将 REST 风格调用转换为 `{ path, method, query, body }` 的云函数载荷。
- 状态：`src/stores/` 管理登录外观、购物车、本地短期缓存和弹窗展示状态。
- 页面与组件：只渲染服务端认可的数据，不能决定订单价格、库存、订单状态、优惠券库存或支付成功。
- 允许依赖 uni-app、Vue、Pinia、uni-ui 和小程序 CloudBase API；禁止导入 `server/`、直接访问数据库、在生产代码中依赖 `shared/mock`。

普通用户身份来自云函数 `cloud.getWXContext().OPENID`。前端传入的 userId、openid、价格和库存均不可信。`requestId` 会附加在云函数错误上，提单时应一并提供该值。

## 目录说明

| 目录 | 用途 |
| --- | --- |
| `src/platform/` | 小程序 CloudBase 初始化、函数调用和文件上传适配。 |
| `src/api/` | 云函数请求、商城、内容、营销和媒体接口。 |
| `src/stores/` | Pinia 状态；页面/商城配置缓存有效期为五分钟。 |
| `src/pages/` | 小程序页面；首页下拉刷新会刷新发布内容、分类、商品和营销弹窗。 |
| `src/components/` | 通用、首页、品牌和营销展示组件。 |
| `src/mock/` | 仅 `VITE_BACKEND_MODE=mock` 的开发模拟数据。 |
| `dist/build/mp-weixin/` | 编译产物，禁止手工修改。 |

## 环境变量

复制 `.env.example` 为本地环境文件并仅填写真实环境值：

| 变量名 | 是否必填 | 说明 | 示例格式 |
| --- | --- | --- | --- |
| `VITE_BACKEND_MODE` | 是 | 生产必须为 `cloudbase`；开发可显式使用 `mock`。 | `cloudbase` |
| `VITE_CLOUDBASE_ENV_ID` | 生产必填 | 微信云开发环境 ID，由构建注入。 | `env-id` |
| `VITE_CLOUDBASE_REGION` | 按部署需要 | 环境地域标识，当前运行时代码不直接读取。 | `ap-shanghai` |
| `VITE_DATA_MODE` | 仅旧开发兼容 | 历史前端变量，生产 CloudBase 请求层不读取。 | `api` |
| `VITE_API_BASE_URL` | 否 | 旧 Fastify Mock/API 配置，生产 CloudBase 模式禁止依赖。 | `https://...` |

不要在小程序环境变量写入 AppSecret、支付密钥或管理员令牌。

## 本地运行与构建

```powershell
npm install
$env:VITE_BACKEND_MODE = 'mock' # 仅本地演示可选
npm run dev:mp-weixin
```

生产构建前设置 `VITE_CLOUDBASE_ENV_ID` 和 `VITE_BACKEND_MODE=cloudbase`：

```powershell
$env:VITE_CLOUDBASE_ENV_ID = '你的环境 ID'
$env:VITE_BACKEND_MODE = 'cloudbase'
npm run build:mp-weixin
```

输出位于 `dist/build/mp-weixin`。根目录 `npm run build:cloud` 会额外复制 `cloudbase/functions` 到该产物的 `cloudfunctions/`，用于微信开发者工具导入和部署。

首次配置 AppID：

```powershell
npm run configure:appid -- wx1234567890abcdef
```

`project.config.json` 的 `cloudfunctionRoot` 指向构建产物中的 `cloudfunctions/`。不要手改构建后的项目配置。

## 测试与常见修改

```powershell
npm run lint
npm run test
npm run test:e2e
```

- 新增公开页面内容：先扩展 `cloudbase/functions/api` 的公开路由，再在 `src/api`、Store、页面组件逐层接入。
- 修改首页/品牌/弹窗：后端只公开发布快照；小程序只能读取，不应保存草稿。
- 增加图片：先调用 `uploadCloudFile`，再调用媒体 complete 接口取得 `mediaId`；fileID 不能当永久 URL。
- 修改下单：保持服务端重算价格和库存。当前下单请求携带 `idempotencyKey`，但云函数尚未落地幂等记录，见 [CloudBase 排障与上线前事项](../docs/cloudbase/TROUBLESHOOTING.md)。

完整生产部署见 [CloudBase 部署文档](../docs/cloudbase/DEPLOYMENT.md)。
