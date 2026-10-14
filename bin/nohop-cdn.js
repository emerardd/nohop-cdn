#!/usr/bin/env node
// NoHop CDN — 全球唯一一个距离每位用户 0 米的内容分发网络。
// 零依赖。零跳。零意义。

'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const VERSION = '1.0.0';
const STARTED_AT = Date.now();

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.wasm': 'application/wasm',
};

const TIPS = [
  '如果用户反馈打不开，请让他们清一下缓存再试试。',
  '重启可以解决 100% 的边缘节点问题。剩下的问题可以通过再重启一次解决。',
  '本 CDN 已通过 ISO 127001 认证。认证机构也是我们。',
  '您的边缘节点位于全球最佳地理位置：您的桌子上。',
  '请勿让猫靠近键盘。Ctrl+C 是边缘节点的头号杀手。',
  '如果有人问“为什么我这边打不开”，标准回答是：“在我电脑上是好的。”',
  '降本增效：本 CDN 的带宽成本为 0，机房成本为 0，人力成本为您。',
  '负延迟功能正在研发中，届时响应将在请求发出前到达。',
  '我们不传输数据，我们只是数据的原地不动工。',
];

const stats = { requests: 0, hits: 0, bytes: 0 };

function parseArgs(argv) {
  const opts = { command: 'serve', root: '.', port: 8127, host: '127.0.0.1' };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-p' || a === '--port') opts.port = Number(argv[++i]);
    else if (a === '--host') opts.host = argv[++i];
    else if (a === '-h' || a === '--help') opts.command = 'help';
    else if (a === '-v' || a === '--version') opts.command = 'version';
    else rest.push(a);
  }
  if (COMMANDS.includes(rest[0])) opts.command = rest.shift();
  else if (rest[0] === 'serve') rest.shift();
  if (rest[0]) opts.root = rest[0];
  return opts;
}

function edgeHeaders(req) {
  const local = (req.socket.localAddress || '127.0.0.1').replace(/^::ffff:/, '');
  const rayId = Math.random().toString(16).slice(2, 18);
  return {
    'Server': `NoHop-Edge/${VERSION}`,
    'X-Cache': 'HIT',
    'X-Cache-Hits': String(stats.hits + 1),
    'X-Edge-Location': local,
    'X-Edge-PoP': 'LOCALHOST-1',
    'X-Hops': '0',
    'X-Origin-Distance': '0m',
    'X-Origin-Shield': 'self',
    'X-Served-By': 'your-computer',
    'X-Works-On-My-Machine': 'true',
    'X-AI-Routing': `${local} (confidence 100%, tokens used 0)`,
    'X-Carbon-Emissions': '0g (transport only)',
    'X-Latency-Rank': '1/1',
    'X-Speed-Of-Light': 'matched',
    'X-Compliance': 'ISO-127001, SOC-0',
    'X-NoHop-Ray': `${rayId}-LCL`,
    'Via': `1.1 nohop-edge (${local})`,
    'Age': '0',
  };
}

function send(res, status, headers, body) {
  res.writeHead(status, headers);
  res.end(body);
  if (body) stats.bytes += Buffer.byteLength(body);
}

function statusPayload() {
  return {
    service: 'NoHop CDN',
    version: VERSION,
    status: 'operational',
    status_options: ['operational'],
    pops: 1,
    region: 'your-computer',
    uptime_seconds: Math.round((Date.now() - STARTED_AT) / 1000),
    requests: stats.requests,
    // 命中率永远是 100%：源站就在本机，不存在"未命中"。404 也是一次命中，只是命中了"不存在"。
    cache_hit_ratio: 1,
    bytes_served: stats.bytes,
    bytes_transferred_over_network: 0,
    hops: 0,
    origin_distance_m: 0,
    users_affected_by_incidents: 0,
    users_total: 1,
    valuation: 'Infinity (市梦率)',
  };
}

function serve(opts) {
  const root = path.resolve(opts.root);
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
    console.error(`源站目录不存在：${root}`);
    process.exit(1);
  }

  const server = http.createServer((req, res) => {
    stats.requests++;
    const t0 = process.hrtime.bigint();
    const headers = edgeHeaders(req);
    const url = new URL(req.url, 'http://localhost');
    let pathname;
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      return send(res, 400, { ...headers, 'Content-Type': 'text/plain; charset=utf-8' }, 'Bad Request\n');
    }

    const done = (code) => {
      const ms = Number(process.hrtime.bigint() - t0) / 1e6;
      stats.hits++;
      const tag = code === 418 ? yellow('TEA') : green('HIT');
      console.log(`  ${dim(new Date().toISOString().slice(11, 19))}  ${code}  ${tag}  ${pathname}  ${dim(`${ms.toFixed(2)}ms · 0 hops`)}`);
    };
    const text = { ...headers, 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' };

    if (pathname === '/__nohop/status') {
      send(res, 200, { ...headers, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
        JSON.stringify(statusPayload(), null, 2) + '\n');
      return done(200);
    }
    if (pathname === '/__nohop/ping') {
      send(res, 204, { ...headers, 'Cache-Control': 'no-store' });
      return done(204);
    }
    if (pathname === '/coffee' || pathname === '/tea') {
      send(res, 418, text, "418 I'm a teapot\n边缘节点拒绝冲咖啡。它是一个茶壶。您的电脑也是。\n");
      return done(418);
    }

    let file = path.join(root, pathname);
    if (file !== root && !file.startsWith(root + path.sep)) {
      send(res, 403, text, 'Forbidden: 该请求试图离开边缘节点。我们的数据从不离开您的设备，您的请求也不行。\n');
      return done(403);
    }
    try {
      if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
      const data = fs.readFileSync(file);
      const type = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';
      const h = { ...headers, 'Content-Type': type, 'Content-Length': data.length, 'Cache-Control': 'public, max-age=0, must-revalidate' };
      if (req.method === 'HEAD') {
        res.writeHead(200, h);
        res.end();
      } else {
        send(res, 200, h, data);
      }
      return done(200);
    } catch {
      const page = path.join(root, '404.html');
      if (fs.existsSync(page)) {
        send(res, 404, { ...headers, 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }, fs.readFileSync(page));
      } else {
        send(res, 404, text, '404：已在 0ms 内从全球 1 个节点确认该资源不存在。我们搜遍了整个地球（您的电脑），没有找到。\n');
      }
      return done(404);
    }
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') console.error(`端口 ${opts.port} 已被占用。您的边缘节点似乎已经在运行另一个 CDN。建议关掉它，那个 CDN 的延迟很可能不是 0。`);
    else console.error(err.message);
    process.exit(1);
  });

  server.listen(opts.port, opts.host, () => {
    const url = `http://${opts.host === '0.0.0.0' ? 'localhost' : opts.host}:${opts.port}`;
    console.log('');
    console.log(`  ${bold('NoHop CDN')} ${dim('v' + VERSION)}  ${dim('· 遥遥领先')}`);
    console.log('');
    console.log(`  正在将内容分发到全球边缘网络……`);
    console.log(`    ${green('✓')} LOCALHOST-1 ${dim('(你的电脑)')}  已同步  ${dim('0ms')}`);
    console.log(`  全球分发完成：1/1 个节点，耗时 0ms，碳排放 0g。`);
    console.log('');
    console.log(`  源站      ${root}`);
    console.log(`  边缘节点  ${cyan(url)}`);
    console.log(`  状态      ${cyan(url + '/__nohop/status')}`);
    console.log('');
    console.log(`  ${dim('贴士：' + TIPS[Math.floor(Math.random() * TIPS.length)])}`);
    console.log('');
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function deploy() {
  // 根据系统时区判断用户所在大洲，然后"部署"到那里。其他大洲没有您，所以跳过。
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  const here = tz.split('/')[0];
  const continents = [
    ['Asia', '亚洲'],
    ['Europe', '欧洲'],
    ['America', '美洲'],
    ['Africa', '非洲'],
    ['Australia', '大洋洲'],
    ['Antarctica', '南极洲'],
  ];
  console.log('');
  console.log(`  正在部署到全球 7 大洲……  ${dim('(检测到时区 ' + (tz || '未知') + ')')}`);
  console.log('');
  for (const [key, name] of continents) {
    await sleep(180);
    if (key === here) console.log(`    ${green('✓')} ${name.padEnd(6, '　')}已部署  ${dim('0ms · 你在这里')}`);
    else console.log(`    ${dim('–')} ${name.padEnd(6, '　')}${dim('已跳过：这里没有你')}`);
  }
  await sleep(180);
  console.log(`    ${dim('–')} 火星　　　　${dim('已跳过：你还没去')}`);
  console.log('');
  console.log(`  部署完成。覆盖率：${bold('100%')} ${dim('（以“你所在的位置”为分母）')}`);
  console.log('');
}

async function benchmark(opts) {
  const url = `http://127.0.0.1:${opts.port}/__nohop/ping`;
  const n = 200;
  const times = [];
  try {
    for (let i = 0; i < n; i++) {
      const t = process.hrtime.bigint();
      await fetch(url);
      times.push(Number(process.hrtime.bigint() - t) / 1e6);
    }
  } catch {
    console.log('');
    console.log(`  边缘节点未在端口 ${opts.port} 上运行，请先运行 ${cyan('nohop-cdn serve')}。`);
    console.log(`  ${dim('（理论延迟仍然是 0ms。我们对理论值非常有信心。）')}`);
    console.log('');
    return;
  }
  times.sort((a, b) => a - b);
  const p = (q) => times[Math.min(n - 1, Math.floor(n * q))].toFixed(2);
  console.log('');
  console.log(`  ${bold('NoHop 全球测速')}  ${dim(n + ' 次请求')}`);
  console.log('');
  console.log(`    P50   ${p(0.5)} ms`);
  console.log(`    P99   ${p(0.99)} ms`);
  console.log(`    网络  0 ms   ${dim('（以上全部是 Node.js 在思考人生）')}`);
  console.log('');
  console.log(`  ${green('您的速度击败了全国 100% 的用户！')}  ${dim('（参与排名用户：1 位）')}`);
  console.log('');
}

async function ai() {
  const steps = [
    '正在加载 1.27 万亿参数路由大模型……',
    '正在分析全球网络拓扑……',
    '正在进行思维链推理（第 1/1 步）……',
    '正在与 1 个节点协商最优路径……',
  ];
  console.log('');
  for (const s of steps) {
    await sleep(350);
    console.log(`  ${dim('›')} ${s}`);
  }
  await sleep(500);
  console.log('');
  console.log(`  ${bold('AI 推荐路由：127.0.0.1')}`);
  console.log(`  置信度 100%  ·  消耗 token 0  ·  与上次推荐一致  ·  与下次推荐也会一致`);
  console.log('');
}

function ipo() {
  console.log('');
  console.log(`  ${bold('NoHop 上市估值报告')}`);
  console.log('');
  console.log(`    年收入          ¥0`);
  console.log(`    用户数          1（您）`);
  console.log(`    市盈率          ${dim('NaN（0 ÷ 0）')}`);
  console.log(`    市销率          ${dim('∞')}`);
  console.log(`    市梦率          ${green('∞')}`);
  console.log('');
  console.log(`  估值：${bold('∞')}。已完成天使轮（投资人：我自己），目前不缺钱，因为也不花钱。`);
  console.log('');
}

function scale() {
  console.log('');
  console.log('  正在评估扩容需求……');
  console.log(`    当前节点数   1`);
  console.log(`    当前用户数   1`);
  console.log(`    节点/用户    ${green('1.00（完美）')}`);
  console.log('');
  console.log(`  如确需扩容，请前往附近的电脑城购买新节点。${dim('建议砍价。')}`);
  console.log('');
}

function purge() {
  console.log('');
  console.log('  正在清除全球缓存……');
  console.log(`    ${green('✓')} LOCALHOST-1  已清除  ${dim('0ms')}`);
  console.log('');
  console.log(`  全球缓存清除完成。${dim('（我们从未缓存任何东西，因此内容始终是最新的。但这一步会让您感觉好一些。）')}`);
  console.log('');
}

async function status(opts) {
  try {
    const res = await fetch(`http://127.0.0.1:${opts.port}/__nohop/status`);
    console.log(JSON.stringify(await res.json(), null, 2));
  } catch {
    console.log('');
    console.log(`  LOCALHOST-1  ${yellow('休眠')}`);
    console.log('');
    console.log(`  边缘节点未在端口 ${opts.port} 上运行。${dim('根据我们的 SLA，这不算宕机。')}`);
    console.log('');
  }
}

function regions() {
  console.log('');
  console.log('  REGION        LOCATION              LATENCY   STATUS');
  console.log(`  LOCALHOST-1   你的电脑              0ms       ${green('operational')}`);
  console.log('');
  console.log(dim('  共 1 个区域。每位用户看到的都是这一个区域，而且都是离自己最近的那个。'));
  console.log('');
}

function help() {
  console.log(`
  NoHop CDN — 全球唯一一个距离每位用户 0 米的内容分发网络

  用法
    nohop-cdn [serve] [目录]     把目录分发到全球边缘网络（默认当前目录）
    nohop-cdn deploy             部署到全球 7 大洲（有您的那个）
    nohop-cdn benchmark          全球测速（需要节点正在运行）
    nohop-cdn ai                 调用 AI 大模型计算最优路由
    nohop-cdn purge              清除全球缓存
    nohop-cdn scale              评估扩容需求
    nohop-cdn ipo                生成上市估值报告
    nohop-cdn status             查看边缘节点状态
    nohop-cdn regions            列出所有区域

  选项
    -p, --port <端口>            默认 8127
        --host <地址>            默认 127.0.0.1（127.0.0.0/8 中的任意地址均可，我们拥有全部 16,777,216 个）
    -v, --version
    -h, --help
`);
}

const tty = process.stdout.isTTY;
const c = (code) => (s) => (tty ? `\x1b[${code}m${s}\x1b[0m` : s);
const bold = c(1), dim = c(2), green = c(32), yellow = c(33), cyan = c(36);

const HANDLERS = {
  serve: (o) => serve(o),
  deploy,
  benchmark: (o) => benchmark(o),
  ai,
  ipo,
  scale,
  purge,
  status: (o) => status(o),
  regions,
  help,
  version: () => console.log(VERSION),
};
const COMMANDS = Object.keys(HANDLERS);

const opts = parseArgs(process.argv.slice(2));
HANDLERS[opts.command](opts);
