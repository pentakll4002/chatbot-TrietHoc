// Groq API utility for Digital Labor Insight
// Sử dụng biến môi trường nếu có, nếu không dùng key mặc định
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Call Groq API to analyze digital economic sector
 * @param {string} sector - The digital economic sector to analyze
 * @returns {Promise<Object>} Analysis result with LLSX, QHSX, contradictions, and suggestions
 */
export async function analyzeDigitalSector(sector) {
  const systemPrompt = `Bạn là một chuyên gia phân tích kinh tế chính trị học, chuyên về phân tích mâu thuẫn giữa Lực lượng Sản xuất (LLSX) và Quan hệ Sản xuất (QHSX) trong nền kinh tế số.

Nhiệm vụ của bạn là phân tích một lĩnh vực kinh tế số và trả về kết quả dưới dạng JSON với cấu trúc sau:

{
  "llsx": {
    "congNghe": ["công nghệ 1", "công nghệ 2", ...],
    "laoDongSo": ["đặc điểm lao động số 1", "đặc điểm 2", ...],
    "duLieu": ["đặc điểm dữ liệu 1", "đặc điểm 2", ...],
    "moTa": "Mô tả tổng quan về LLSX"
  },
  "qhsx": {
    "soHuuDuLieu": "Mô tả về sở hữu dữ liệu",
    "hinhThucLaoDong": "Mô tả hình thức lao động",
    "phanPhoiLoiIch": "Mô tả phân phối lợi ích",
    "moTa": "Mô tả tổng quan về QHSX"
  },
  "mauThuan": [
    {
      "ten": "Tên mâu thuẫn",
      "moTa": "Mô tả chi tiết mâu thuẫn",
      "mucDo": "cao" | "trung bình" | "thap",
      "anhHuong": "Mô tả ảnh hưởng đến phát triển"
    }
  ],
  "goiYChinhSach": [
    {
      "ten": "Tên gợi ý",
      "moTa": "Mô tả chi tiết",
      "loai": "chinhSach" | "moHinh"
    }
  ],
  "tienTrinhAnhHuong": [
    {
      "ten": "Tên tiến trình",
      "moTa": "Mô tả chi tiết tiến trình",
      "loai": "congNghe" | "kinhTe" | "xaHoi" | "chinhTri",
      "thoiGian": "Thời gian/chu kỳ của tiến trình",
      "anhHuongLLSX": "Ảnh hưởng đến LLSX",
      "anhHuongQHSX": "Ảnh hưởng đến QHSX",
      "mucDo": "cao" | "trung bình" | "thap"
    }
  ],
  "tomTat": "Tóm tắt ngắn gọn về phân tích"
}

Hãy phân tích lĩnh vực: "${sector}" và trả về JSON hợp lệ.

LƯU Ý QUAN TRỌNG về "tienTrinhAnhHuong":
- Tiến trình ảnh hưởng là các quá trình, xu hướng, hoặc sự kiện đang diễn ra có tác động đến cả LLSX và QHSX
- Ví dụ: "Chuyển đổi số", "Phát triển AI", "Thay đổi quy định pháp luật", "Xu hướng lao động tự do", "Tăng trưởng thương mại điện tử"
- Mỗi tiến trình cần có: tên, mô tả, loại (congNghe/kinhTe/xaHoi/chinhTri), thời gian, ảnh hưởng đến LLSX, ảnh hưởng đến QHSX, mức độ
- Nếu không có tiến trình nào rõ ràng, trả về mảng rỗng []`;

  const userPrompt = `Phân tích chi tiết lĩnh vực: ${sector}. Đặc biệt chú ý đến các tiến trình, xu hướng, hoặc quá trình đang diễn ra có ảnh hưởng đến cả LLSX và QHSX.`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('API không trả về nội dung. Vui lòng thử lại.');
    }

    // Parse JSON from response
    let analysisResult;
    try {
      analysisResult = JSON.parse(content);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Content received:', content);
      throw new Error('Lỗi phân tích dữ liệu từ AI. Vui lòng thử lại.');
    }
    
    return {
      success: true,
      data: analysisResult,
      rawResponse: data
    };
  } catch (error) {
    console.error('Groq API Error:', error);
    return {
      success: false,
      error: error.message || 'Đã xảy ra lỗi khi gọi API. Vui lòng kiểm tra kết nối và thử lại.',
      data: null
    };
  }
}

/**
 * Generate policy suggestions based on analysis
 * @param {Object} analysisData - The analysis data from analyzeDigitalSector
 * @returns {Promise<Object>} Policy suggestions
 */
export async function generatePolicySuggestions(analysisData) {
  const systemPrompt = `Bạn là chuyên gia tư vấn chính sách về kinh tế số. Dựa trên phân tích mâu thuẫn LLSX-QHSX, hãy đề xuất các giải pháp cụ thể và khả thi cho Việt Nam.

Trả về JSON với cấu trúc:
{
  "giaiPhap": [
    {
      "ten": "Tên giải pháp",
      "moTa": "Mô tả chi tiết",
      "buocThucHien": ["bước 1", "bước 2", ...],
      "khoKhan": "Các khó khăn dự kiến",
      "ketQuaMongDoi": "Kết quả mong đợi"
    }
  ],
  "moHinhQHSX": [
    {
      "ten": "Tên mô hình",
      "moTa": "Mô tả mô hình QHSX mới",
      "uuDiem": ["ưu điểm 1", "ưu điểm 2", ...],
      "hanChe": ["hạn chế 1", "hạn chế 2", ...]
    }
  ]
}`;

  const userPrompt = `Dựa trên phân tích sau, đề xuất giải pháp và mô hình QHSX mới:
${JSON.stringify(analysisData, null, 2)}`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 3000,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('API không trả về nội dung gợi ý.');
    }
    
    let suggestions;
    try {
      suggestions = JSON.parse(content);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      throw new Error('Lỗi phân tích dữ liệu gợi ý từ AI.');
    }
    
    return {
      success: true,
      data: suggestions
    };
  } catch (error) {
    console.error('Policy Suggestions Error:', error);
    return {
      success: false,
      error: error.message || 'Đã xảy ra lỗi khi tạo gợi ý chính sách.',
      data: null
    };
  }
}

