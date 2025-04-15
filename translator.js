require("dotenv").config();
const OpenAI = require("openai");

// 验证环境变量
function validateEnvironment() {
  if (!process.env.DASHSCOPE_API_KEY) {
    throw new Error("缺少必要的环境变量: DASHSCOPE_API_KEY");
  }
}

// 创建 OpenAI 客户端
let openai;
try {
  validateEnvironment();
  openai = new OpenAI({
    apiKey: process.env.DASHSCOPE_API_KEY,
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  });
} catch (error) {
  console.error("初始化翻译服务失败:", error.message);
  process.exit(1);
}

async function translateText(text) {
  if (!text) {
    throw new Error("翻译文本不能为空");
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "qwen-plus",
      messages: [
        {
          role: "system",
          content:
            "你是一个专业的翻译助手，请将用户输入的俄语文本翻译成中文。只需要返回翻译结果，不需要其他解释。",
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.3,
    });

    if (!completion?.choices?.[0]?.message?.content) {
      throw new Error("翻译服务返回数据格式错误");
    }

    return {
      original: text,
      translated: completion.choices[0].message.content.trim(),
    };
  } catch (error) {
    if (error.code === "invalid_api_key") {
      throw new Error("API 认证失败。请确保已正确设置 DashScope API Key。");
    }
    if (error.message.includes("API 认证失败")) {
      throw error;
    }
    throw new Error(`翻译失败: ${error.message}`);
  }
}

// 如果直接运行此文件
if (require.main === module) {
  const text = process.argv[2];

  if (!text) {
    console.log("请提供要翻译的俄语文本");
    console.log('使用方法: node translator.js "要翻译的文本"');
    process.exit(1);
  }

  translateText(text)
    .then((result) => {
      console.log("\n原文:", result.original);
      console.log("译文:", result.translated);
    })
    .catch((error) => {
      console.error("错误:", error.message);
      process.exit(1);
    });
}

module.exports = { translateText };
