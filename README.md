# 俄语到中文翻译工具

这是一个使用 Node.js 实现的俄语到中文翻译工具，使用阿里云 DashScope API 的 Qwen-Plus 模型进行翻译。

## 功能特点

- 支持俄语到中文的翻译
- 使用阿里云 DashScope API 的 Qwen-Plus 模型
- 支持命令行和模块化使用
- 完整的错误处理
- 包含单元测试

## 安装

1. 确保您已安装 Node.js (版本 12 或更高)
2. 安装依赖：

   ```bash
   npm install
   ```

3. 配置 DashScope API Key：
   - 访问 [阿里云 DashScope](https://dashscope.console.aliyun.com/)
   - 注册并登录
   - 创建 API Key
   - 复制 `.env.example` 为 `.env` 并填写您的 API Key：

     ```
     DASHSCOPE_API_KEY=your-api-key
     ```

## 使用方法

1. 命令行使用：

   ```bash
   node translator.js "要翻译的俄语文本"
   ```

2. 作为模块使用：

   ```javascript
   const { translateText } = require('./translator');
   
   async function example() {
     const result = await translateText('Привет, как дела?');
     console.log(result.translated);
   }
   ```

## 运行测试

```bash
npm test
```

## 注意事项

- 需要有效的阿里云 DashScope API Key
- 使用 Qwen-Plus 模型进行翻译
- 请确保妥善保管您的 API Key
- 翻译服务可能有调用频率限制
