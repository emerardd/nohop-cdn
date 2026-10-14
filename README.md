# NoHop CDN

全球唯一一个距离每位用户 0 米的内容分发网络。

*The only CDN that is 0 meters from every user. The site, status page and brand film are available in English: add `?lang=en` or use the toggle in the top-right corner.*

NoHop 在每一台设备上都部署了边缘节点。无论用户身在何处，他们访问的永远是离自己最近的节点：他们自己的电脑。

> ⚠️ 本网站已被部署到公网：https://nohop.emerard.com/ 。这是 NoHop 成立以来第一起影响他人的事故。
> 为获得最佳体验，请按下面的步骤在您自己的电脑上访问。

## 快速开始

```bash
node bin/nohop-cdn.js site
```

然后打开 http://127.0.0.1:8127 。官网本身就由 NoHop 分发，页面上会实时显示你刚收到的边缘响应头。

分发任意目录：

```bash
node bin/nohop-cdn.js path/to/dir
```

## 命令

| 命令 | 作用 |
|---|---|
| `nohop-cdn [serve] [目录]` | 把目录分发到全球边缘网络（默认当前目录，端口 8127） |
| `nohop-cdn deploy` | 按系统时区部署到全球 7 大洲（只有你在的那个会成功） |
| `nohop-cdn benchmark` | 真实测速，然后宣布你击败了全国 100% 的用户 |
| `nohop-cdn ai` | 调用 1.27 万亿参数大模型计算最优路由（答案是 127.0.0.1） |
| `nohop-cdn purge` | 清除全球缓存（0 ms，没有任何效果） |
| `nohop-cdn scale` | 评估扩容需求（建议去电脑城砍价） |
| `nohop-cdn ipo` | 生成上市估值报告（市梦率 ∞） |
| `nohop-cdn status` | 查看边缘节点状态 |
| `nohop-cdn regions` | 列出所有区域（1 个） |

彩蛋：`/coffee` 返回 418 I'm a teapot；找不到的页面会显示 `site/404.html`。

选项：`-p, --port`、`--host`（127.0.0.0/8 内任意地址均可）。

## 响应头

每个响应都带有：

```
Server: NoHop-Edge/1.0.0
X-Cache: HIT
X-Edge-Location: 127.0.0.1
X-Edge-PoP: LOCALHOST-1
X-Hops: 0
X-Origin-Distance: 0m
X-Origin-Shield: self
X-Served-By: your-computer
Via: 1.1 nohop-edge (127.0.0.1)
```

另有 `/__nohop/status` 返回 JSON 格式的节点状态。

## 实测数据

在作者的 Windows 11 笔记本上（即本次测试中唯一的边缘节点）：

- `ping 127.0.0.1`：20 个包，丢包率 0%，平均 0 ms
- HTTP 首字节时间（300 次请求）：P50 1.40 ms，P99 10.57 ms

## 结构

```
bin/nohop-cdn.js   零依赖 CLI（Node >= 18）
site/index.html    官网
site/status.html   全球网络状态页
```

## 待办

- [ ] 博客文章：《我们如何把 CDN 延迟降到 0》
- [ ] 发布到 npm，让 `npx nohop-cdn` 真的能用
