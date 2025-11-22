# Hướng dẫn chạy API Server

## Cài đặt dependencies

```bash
pip install -r requirements.txt
```

## Chạy API Server

```bash
# Cách 1: Dùng uvicorn trực tiếp
uvicorn api_server:app --host 0.0.0.0 --port 5000 --reload

# Cách 2: Chạy file Python
python api_server.py
```

## API Endpoints

- `GET /api/health` - Kiểm tra trạng thái server
- `POST /api/chatbot` - Câu hỏi cơ bản về công nghệ
- `POST /api/ask` - Câu hỏi tùy ý về LLSX - QHSX
- `POST /api/compare` - So sánh 2 công nghệ
- `POST /api/timeline` - Phân tích timeline
- `POST /api/policy` - Gợi ý chính sách
- `POST /api/upload` - Upload và phân tích file

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend sẽ chạy tại `http://localhost:5173` (hoặc port khác nếu 5173 đã được dùng)

API Server cần chạy tại `http://localhost:5000`


