import streamlit as st
from dotenv import load_dotenv
import os
from modules.data_loader import load_data
from modules.vector_store import build_vector_store
from modules.qa_chain import build_qa_chain
import traceback

load_dotenv()
st.set_page_config(
    page_title="Triết Chatbot - Marx & Engels",
    page_icon="📘",
    layout="wide"
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if "messages" not in st.session_state:
    st.session_state.messages = []
if "initialized" not in st.session_state:
    st.session_state.initialized = False

st.title("📘 Chatbot Triết học Karl Marx & Friedrich Engels")
st.markdown("*Hỏi tôi về chủ nghĩa duy vật biện chứng, kinh tế chính trị, hay Engels và Marx...*")
st.divider()

with st.sidebar:
    st.header("⚙️ Trạng thái hệ thống")

    if not GROQ_API_KEY:
        st.error("❌ GROQ_API_KEY không tìm thấy!")
    else:
        masked_key = f"{GROQ_API_KEY[:10]}...{GROQ_API_KEY[-5:]}"
        st.success(f"✅ API Key: `{masked_key}`")

        if not st.session_state.initialized:
            st.warning("🟡 Đang khởi tạo hệ thống... (vui lòng chờ vài giây)")
            try:
                docs = load_data()
                db = build_vector_store(docs)
                qa_chain, retriever = build_qa_chain(db, GROQ_API_KEY)
                st.session_state.qa_chain = qa_chain
                st.session_state.retriever = retriever
                st.session_state.initialized = True
                st.success("🟢 Hệ thống đã sẵn sàng!")
            except Exception as e:
                st.error("❌ Lỗi khi khởi tạo hệ thống!")
                st.code(traceback.format_exc())
        else:
            st.success("🟢 Đang hoạt động bình thường")

    st.divider()
    st.subheader("📊 Thống kê")
    st.metric("Số tin nhắn", len(st.session_state.messages))

    st.divider()
    if st.button("🗑️ Xóa lịch sử chat", use_container_width=True):
        st.session_state.messages = []
        st.rerun()

if not st.session_state.initialized:
    st.info("🤖 Hệ thống đang khởi động... Vui lòng chờ vài giây trước khi bắt đầu trò chuyện.")
else:
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    if prompt := st.chat_input("💭 Nhập câu hỏi của bạn..."):
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        with st.chat_message("assistant"):
            with st.spinner("🤔 Đang suy luận..."):
                try:
                    answer = st.session_state.qa_chain.invoke(prompt)
                    answer_clean = (
                        answer.replace("\n", " ")
                              .replace("\r", " ")
                              .replace("  ", " ")
                              .strip()
                    )
                    st.markdown(answer_clean)
                    st.session_state.messages.append({
                        "role": "assistant",
                        "content": answer_clean
                    })
                except Exception as e:
                    st.error(f"❌ Lỗi: {str(e)}")
                    with st.expander("🔍 Chi tiết lỗi"):
                        st.code(traceback.format_exc())
                    st.session_state.messages.append({
                        "role": "assistant",
                        "content": f"❌ Lỗi: {str(e)}"
                    })

st.divider()
