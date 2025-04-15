const { translateText } = require("./translator");

// 这些测试需要有效的 Google Cloud 凭证
describe("翻译功能集成测试", () => {
  test("实际API调用测试", async () => {
    const result = await translateText("Привет, как дела?");

    expect(result).toHaveProperty("original");
    expect(result).toHaveProperty("translated");
    expect(typeof result.translated).toBe("string");
    expect(result.translated.length).toBeGreaterThan(0);
  }, 10000); // 设置较长的超时时间，因为需要实际API调用

  test("实际长文本测试", async () => {
    const longText = "Это длинный текст на русском языке. ".repeat(5);
    const result = await translateText(longText);

    expect(result.original).toBe(longText);
    expect(result.translated.length).toBeGreaterThan(0);
  }, 10000);
});
