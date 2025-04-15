const { translateText } = require("./translator");

// 模拟 OpenAI 模块
jest.mock("openai", () => {
  const mockCreate = jest.fn();
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  }));
});

// 导入模拟后的 OpenAI
const OpenAI = require("openai");

describe("翻译功能测试", () => {
  let mockOpenAI;
  const mockCreate = jest.fn();

  beforeEach(() => {
    // 清除所有模拟的调用记录
    jest.clearAllMocks();

    // 设置模拟实现
    mockCreate.mockReset();
    OpenAI.mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    }));

    mockOpenAI = new OpenAI();
  });

  test("成功翻译俄语文本", async () => {
    // 设置模拟响应
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: "你好，你好吗？",
          },
        },
      ],
    });

    const result = await translateText("Привет, как дела?");

    expect(result).toEqual({
      original: "Привет, как дела?",
      translated: "你好，你好吗？",
    });

    // 验证调用参数
    expect(mockCreate).toHaveBeenCalledWith({
      model: "qwen-plus",
      messages: [
        {
          role: "system",
          content:
            "你是一个专业的翻译助手，请将用户输入的俄语文本翻译成中文。只需要返回翻译结果，不需要其他解释。",
        },
        {
          role: "user",
          content: "Привет, как дела?",
        },
      ],
      temperature: 0.3,
    });
  });

  test("处理空文本", async () => {
    // 空文本应该在调用 API 之前就被拦截
    await expect(translateText("")).rejects.toThrow("翻译文本不能为空");
    // 验证 API 没有被调用
    expect(mockCreate).not.toHaveBeenCalled();
  });

  test("处理长文本", async () => {
    const longText = "这是一段很长的俄语文本 ".repeat(10);
    const translatedText = "这是一段很长的中文文本 ".repeat(10);

    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: translatedText,
          },
        },
      ],
    });

    const result = await translateText(longText);

    expect(result.original).toBe(longText);
    expect(result.translated).toBe(translatedText);
  });

  test("处理特殊字符", async () => {
    const specialText = "Привет! @#$%^&*()_+ 你好！";
    const translatedText = "你好！ @#$%^&*()_+ Hello！";

    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: translatedText,
          },
        },
      ],
    });

    const result = await translateText(specialText);

    expect(result).toEqual({
      original: specialText,
      translated: translatedText,
    });
  });

  test("处理翻译错误", async () => {
    const error = new Error("API 调用失败");
    error.code = "invalid_api_key";
    mockCreate.mockRejectedValueOnce(error);

    await expect(translateText("测试文本")).rejects.toThrow("API 认证失败");
  });

  test("处理无效的响应格式", async () => {
    // 模拟一个无效的响应格式
    mockCreate.mockResolvedValueOnce({
      choices: [], // 空的 choices 数组
    });

    await expect(translateText("测试文本")).rejects.toThrow(
      "翻译服务返回数据格式错误"
    );
  });
});
