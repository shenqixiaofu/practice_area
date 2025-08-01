const express = require('express');
const app = express();
const port = 3000;

// 让 Express 托管当前目录下的静态文件 (html, css, js)
app.use(express.static('.'));

// 启动服务器
app.listen(port, () => {
  console.log(`服务器已启动，正在监听 http://localhost:${port}`);
});