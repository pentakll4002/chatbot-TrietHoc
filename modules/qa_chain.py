from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

def build_qa_chain(db, groq_api_key):
    """
    Build RAG chain with DeepSeek R1 model via Groq
    
    Args:
        db: FAISS vector database
        groq_api_key: Groq API key string
        
    Returns:
        tuple: (rag_chain, retriever)
    """

    llm = ChatGroq(
        model="openai/gpt-oss-120b",
        groq_api_key=groq_api_key,
        temperature=0.6
    )

    retriever = db.as_retriever(
        search_type="similarity", 
        search_kwargs={"k": 3}
    )

    template = """Sử dụng ngữ cảnh sau để trả lời câu hỏi. 
Nếu bạn không biết câu trả lời, hãy nói rằng bạn không biết. 
Sử dụng tối đa ba câu và giữ câu trả lời ngắn gọn.

Ngữ cảnh: {context}

Câu hỏi: {question}

Trả lời:"""
    
    prompt = ChatPromptTemplate.from_template(template)

    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)

    rag_chain = (
        {
            "context": retriever | format_docs,
            "question": RunnablePassthrough()
        }
        | prompt
        | llm
        | StrOutputParser()
    )
    return rag_chain, retriever