from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from modules.data_loader import load_data
from modules.vector_store import build_vector_store
from modules.qa_chain import build_qa_chain
import traceback

load_dotenv()

app = FastAPI(title="Triết học Chatbot API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Trong production nên giới hạn origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Khởi tạo qa_chain khi server start
print("[INFO] Dang khoi tao he thong...")
qa_chain = None
retriever = None
try:
    docs = load_data()
    db = build_vector_store(docs)
    qa_chain, retriever = build_qa_chain(db, GROQ_API_KEY)
    print("[SUCCESS] He thong da san sang!")
except Exception as e:
    print(f"[ERROR] Loi khi khoi tao he thong: {e}")
    traceback.print_exc()

# Request models
class QuestionRequest(BaseModel):
    question: str

class CompareRequest(BaseModel):
    tech1: str
    tech2: str

class TimelineRequest(BaseModel):
    year: int
    technology: str

class PolicyRequest(BaseModel):
    technology: str
    context: str = ""

@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "initialized": qa_chain is not None
    }

@app.post("/api/chatbot")
async def chatbot(request: QuestionRequest):
    """Endpoint cơ bản cho câu hỏi về công nghệ"""
    if not qa_chain:
        raise HTTPException(status_code=500, detail="Hệ thống chưa được khởi tạo")
    
    try:
        question = request.question
        if not question:
            raise HTTPException(status_code=400, detail="Câu hỏi không được để trống")
        
        answer = qa_chain.invoke(question)
        answer_clean = answer.replace("\n", " ").replace("\r", " ").replace("  ", " ").strip()
        
        return {"answer": answer_clean}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi xử lý câu hỏi: {str(e)}")

@app.post("/api/ask")
async def ask_free_question(request: QuestionRequest):
    """Endpoint cho câu hỏi tùy ý về LLSX - QHSX"""
    if not qa_chain:
        raise HTTPException(status_code=500, detail="Hệ thống chưa được khởi tạo")
    
    try:
        question = request.question
        if not question:
            raise HTTPException(status_code=400, detail="Câu hỏi không được để trống")
        
        # Thêm context về LLSX - QHSX nếu chưa có
        enhanced_question = f"{question} (Phân tích trong bối cảnh lực lượng sản xuất LLSX và quan hệ sản xuất QHSX)"
        
        answer = qa_chain.invoke(enhanced_question)
        answer_clean = answer.replace("\n", " ").replace("\r", " ").replace("  ", " ").strip()
        
        return {"answer": answer_clean}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi xử lý câu hỏi: {str(e)}")

@app.post("/api/compare")
async def compare_technologies(request: CompareRequest):
    """So sánh 2 công nghệ về LLSX và QHSX"""
    if not qa_chain:
        raise HTTPException(status_code=500, detail="Hệ thống chưa được khởi tạo")
    
    try:
        tech1 = request.tech1
        tech2 = request.tech2
        
        question = f"""
        So sánh công nghệ {tech1} và {tech2} về:
        1. Cái nào là lực lượng sản xuất (LLSX) mạnh hơn?
        2. Cái nào gây xung đột với quan hệ sản xuất (QHSX) nhiều hơn?
        3. Phân tích mâu thuẫn LLSX - QHSX của từng công nghệ.
        4. Đưa ra điểm số từ 1-10 cho mỗi tiêu chí: LLSX mạnh, QHSX xung đột, Tác động kinh tế.
        
        Trả lời dưới dạng JSON với format:
        {{
            "tech1": "{tech1}",
            "tech2": "{tech2}",
            "llsx_comparison": "Công nghệ nào mạnh hơn và tại sao",
            "qhsx_conflict": "Công nghệ nào gây xung đột nhiều hơn",
            "scores": {{
                "tech1": {{"llsx": số, "qhsx_conflict": số, "economic_impact": số}},
                "tech2": {{"llsx": số, "qhsx_conflict": số, "economic_impact": số}}
            }},
            "analysis": "Phân tích chi tiết"
        }}
        """
        
        answer = qa_chain.invoke(question)
        answer_clean = answer.replace("\n", " ").replace("\r", " ").replace("  ", " ").strip()
        
        return {"answer": answer_clean, "tech1": tech1, "tech2": tech2}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi so sánh: {str(e)}")

@app.post("/api/timeline")
async def analyze_timeline(request: TimelineRequest):
    """Phân tích mâu thuẫn LLSX - QHSX theo thời gian"""
    if not qa_chain:
        raise HTTPException(status_code=500, detail="Hệ thống chưa được khởi tạo")
    
    try:
        year = request.year
        technology = request.technology
        
        question = f"""
        Phân tích mâu thuẫn giữa lực lượng sản xuất (LLSX) và quan hệ sản xuất (QHSX) 
        của công nghệ {technology} vào năm {year}.
        
        Dự đoán:
        1. Mức độ phát triển LLSX (1-10)
        2. Mức độ xung đột với QHSX (1-10)
        3. Các vấn đề chính về pháp lý, kinh tế, xã hội
        4. Dự báo xu hướng đến năm {year + 3}
        
        Trả lời dưới dạng JSON:
        {{
            "year": {year},
            "technology": "{technology}",
            "llsx_level": số từ 1-10,
            "qhsx_conflict_level": số từ 1-10,
            "issues": ["vấn đề 1", "vấn đề 2"],
            "forecast": "Dự báo xu hướng",
            "analysis": "Phân tích chi tiết"
        }}
        """
        
        answer = qa_chain.invoke(question)
        answer_clean = answer.replace("\n", " ").replace("\r", " ").replace("  ", " ").strip()
        
        return {"answer": answer_clean, "year": year, "technology": technology}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi phân tích timeline: {str(e)}")

@app.post("/api/policy")
async def get_policy_suggestions(request: PolicyRequest):
    """Gợi ý chính sách cho công nghệ"""
    if not qa_chain:
        raise HTTPException(status_code=500, detail="Hệ thống chưa được khởi tạo")
    
    try:
        technology = request.technology
        context = request.context or ""
        
        question = f"""
        Đưa ra gợi ý chính sách để giải quyết mâu thuẫn LLSX - QHSX cho công nghệ {technology}.
        {f"Bối cảnh: {context}" if context else ""}
        
        Phân tích theo 3 góc độ:
        1. Giải pháp chính sách Nhà nước (pháp luật, quy định, đầu tư)
        2. Giải pháp doanh nghiệp (mô hình kinh doanh, đổi mới)
        3. Giải pháp người lao động (kỹ năng, bảo vệ quyền lợi)
        
        Trả lời dưới dạng JSON:
        {{
            "technology": "{technology}",
            "state_policies": ["chính sách 1", "chính sách 2"],
            "enterprise_solutions": ["giải pháp 1", "giải pháp 2"],
            "worker_solutions": ["giải pháp 1", "giải pháp 2"],
            "recommendations": "Tổng hợp khuyến nghị"
        }}
        """
        
        answer = qa_chain.invoke(question)
        answer_clean = answer.replace("\n", " ").replace("\r", " ").replace("  ", " ").strip()
        
        return {"answer": answer_clean, "technology": technology}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi tạo gợi ý chính sách: {str(e)}")

@app.post("/api/upload")
async def upload_and_analyze(file: UploadFile = File(...)):
    """Upload và phân tích file PDF hoặc hình ảnh"""
    if not qa_chain:
        raise HTTPException(status_code=500, detail="Hệ thống chưa được khởi tạo")
    
    try:
        # Kiểm tra file type
        allowed_types = ["application/pdf", "image/png", "image/jpeg", "image/jpg"]
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400, 
                detail=f"File type không được hỗ trợ. Chỉ chấp nhận: PDF, PNG, JPEG"
            )
        
        # Đọc file content
        content = await file.read()
        
        # TODO: Xử lý file PDF hoặc hình ảnh
        # Hiện tại chỉ trả về thông báo
        # Có thể tích hợp với OCR hoặc PDF parser sau
        
        question = f"""
        Phân tích file {file.filename} (loại: {file.content_type}) 
        để tìm các vấn đề liên quan đến lực lượng sản xuất (LLSX) và quan hệ sản xuất (QHSX).
        
        Trích xuất:
        1. Các công nghệ được đề cập
        2. Mâu thuẫn LLSX - QHSX
        3. Tác động kinh tế - xã hội
        4. Khuyến nghị
        """
        
        # Tạm thời chỉ phân tích tên file và loại file
        answer = f"""
        Đã nhận file: {file.filename} (loại: {file.content_type}, kích thước: {len(content)} bytes)
        
        Tính năng phân tích nội dung file đang được phát triển.
        Hiện tại hệ thống chỉ có thể phân tích dựa trên tên file và metadata.
        
        Để phân tích nội dung chi tiết, vui lòng mô tả nội dung file hoặc đặt câu hỏi cụ thể.
        """
        
        return {
            "answer": answer,
            "filename": file.filename,
            "content_type": file.content_type,
            "size": len(content)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi xử lý file: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
