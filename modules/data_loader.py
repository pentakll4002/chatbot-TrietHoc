from langchain_community.document_loaders import PyPDFLoader, WikipediaLoader

def load_data():
    pdf_docs_triet = PyPDFLoader("data/Triết.pdf").load()
    pdf_docs_tieu_luan = PyPDFLoader("data/TIỂU LUẬN - TRIẾT.pdf").load()

    return pdf_docs_triet + pdf_docs_tieu_luan
