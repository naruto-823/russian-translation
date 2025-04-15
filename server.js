const express = require("express");
const cors = require("cors");
const { translateText } = require("./translator");

const app = express();
const port = process.env.PORT || 3000;

// 启用 CORS 和 JSON 解析
app.use(cors());
app.use(express.json());

// 提供静态文件
app.use(express.static("public"));

// 翻译 API 端点
app.post("/api/translate", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "请提供要翻译的文本" });
    }

    const result = await translateText(text);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
