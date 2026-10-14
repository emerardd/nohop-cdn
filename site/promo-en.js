// 宣传片英文对照表。键是 promo.html 中的中文原文（去掉首尾空白）。
i18nApply({
  // S1
  '每一秒，': 'Every second,',
  '都有数十亿个数据包': 'billions of packets',
  '在地球上奔跑。': 'race across the planet.',
  // S2
  '路由跳数': 'Router hops',
  '穿过海底光缆，': 'Through undersea cables,',
  '经过一个又一个路由器，': 'across router after router,',
  '只为了把一个网页，送到你面前。': 'just to bring one web page to you.',
  // S3
  '我们一直在问自己一个问题：': 'We kept asking ourselves one question:',
  '最后一公里，': 'What if the last mile',
  '能不能是': 'was ',
  '公里？': ' miles?',
  // S4
  '距离每位用户': "The CDN that's",
  '0 米': '0 meters',
  '的内容分发网络': ' from every user',
  // S5
  '回源延迟': 'Origin latency',
  '0 跳': '0 hops',
  '缓存命中率': 'Cache hit ratio',
  '个专属环回地址': 'dedicated loopback addresses',
  // S6
  '已覆盖全球 100% 的联网设备。': 'Now covering 100% of connected devices.',
  '每一位用户，都拥有离自己最近的节点——': 'Every user gets the node closest to them —',
  '自己的电脑。': 'their own computer.',
  // S7
  '100 万': '1M', '1 万': '10K',
  '1 月': 'Jan', '3 月': 'Mar', '5 月': 'May', '7 月': 'Jul', '9 月': 'Sep',
  '投资人期待的曲线': 'What investors expect',
  '我们的用户数：': 'Our user count: ',
  '。': '.',
  '极其稳定。': ' Remarkably stable.',
  '留存率': 'Retention', '获客成本': 'CAC', '流失率': 'Churn',
  '¥0': '$0',
  // S8
  '全球所有联网设备': 'Every connected device on Earth',
  '数百亿台': 'Tens of billions',
  '其中拥有 localhost 的设备': 'Those with a localhost',
  '同上': 'Same as above',
  '你的电脑': 'Your computer',
  '1 台': '1 unit',
  '一个数百亿级的市场。我们已经拿下了其中的': "A tens-of-billions-unit market. We've already captured ",
  // S9
  '创始团队': 'Founding team',
  '你': 'You',
  '创始人': 'Founder',
  '一支精简、高效、高度对齐的团队。成员之间从未出现分歧。': 'A lean, efficient, deeply aligned team. Zero internal disagreements to date.',
  // S10
  '“我不理解，': '“I have no idea what this is.',
  '但我大受震撼。”': 'I’m in.”',
  '—— 某知名投资人（已投）': '— Prominent investor (already wired the money)',
  // S11
  '本轮融资': 'Raising',
  '投后估值': 'Post-money valuation',
  '按市梦率计算。资金用途：无。': 'Valued on a price-to-dreams basis. Use of funds: none.',
  // S12
  '我们相信，': 'We believe',
  '最好的网络，': 'the best network',
  '是': 'is ',
  '不需要网络': 'no network',
  '的网络。': ' at all.',
  // 封面与播放器
  'NoHop · 品牌宣传片': 'NoHop · Brand Film',
  '约 90 秒 · 建议开启声音并全屏观看（按 F）': '~90 seconds · Best with sound, in fullscreen (press F)',
  '播放宣传片': 'Play the film',
  '暂停': 'Pause', '静音': 'Mute', '全屏': 'Fullscreen',
  '返回官网': 'Back to site',
}, {
  fine: '* NoHop is available only within 127.0.0.0/8. Other people cannot access content you serve through NoHop; this is a feature. The 0 ms latency figure comes from ping 127.0.0.1 on the author’s laptop. The “∞% performance improvement” is the result of dividing 0 by 0. The investor testimonial is fictional; the level of being impressed is real. The user growth chart in this film is real data. TAM and SAM being the same size is not a layout error. Valuation is calculated on a price-to-dreams basis and does not constitute investment advice. Use of funds is “none” because there is genuinely nothing to spend money on. Past performance (0 ms) is not indicative of future results (also 0 ms). NoHop does not cover round-trip travel to Mars.',
}, 'NoHop · Brand Film');

(function () {
  var b = document.getElementById('lang-btn');
  // 按钮在封面里，点击封面会开始播放，所以要拦住冒泡
  b.addEventListener('click', function (e) { e.stopPropagation(); });
  i18nToggle(b);
})();
