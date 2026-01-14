import OpenAI from "openai";

const openai = new OpenAI({
//them api o day
  // THÊM DÒNG NÀY ĐỂ SỬA LỖI
  dangerouslyAllowBrowser: true, 
});

export const askGPT = async (question: string): Promise<string> => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: question },
      ],
    });

    return completion.choices[0].message.content || "Không có phản hồi từ AI";
  } catch (error: any) {
    console.error("Lỗi OpenAI:", error);
    if (error.status === 429) return "Lỗi: Tài khoản chưa nạp tiền (Billing).";
    return "Hệ thống đang bận, thử lại sau nhé!";
  }
};