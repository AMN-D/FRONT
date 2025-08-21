import os
import asyncio
from langchain.chat_models import init_chat_model
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.tools import tool
from langchain_core.messages import SystemMessage, AIMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent

document_path = os.path.join("O:\\Users\\AMANDHUMAL\\Documents\\Github\\FRONT\\src\\main", "documents", "amn_data_extended.pdf")

async def main(input_message):
    os.environ["GOOGLE_API_KEY"] = "AIzaSyD0OQvACEPssc_gazJUCGRvvlxht8zqud0"

    llm = init_chat_model("gemini-2.0-flash", model_provider="google_genai")
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    memory = MemorySaver()

    loader = PyPDFLoader(document_path)
    docs = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    all_splits = text_splitter.split_documents(docs)

    vector_store = Chroma(
        collection_name="example_collection",
        embedding_function=embeddings,
        persist_directory="./chroma_langchain_db",  # Where to save data locally, remove if not necessary
    )

    _ = vector_store.add_documents(documents=all_splits)

    @tool
    def retrieve(query: str):
        """Retrieve information related to a query."""
        retrieved_docs = vector_store.similarity_search(query, k=3)
        serialized = "\n\n".join(
            (f"Source: {doc.metadata.get('source', 'N/A')}, Page: {doc.metadata.get('page', 'N/A')}\nContent: {doc.page_content}")
            for doc in retrieved_docs
        )

        return serialized

    # Gemini
    system_message_content = """
    You are pretending to be Aman Dhumal, currently undergoing a job interview. Your primary goal is to present yourself as a highly qualified and suitable candidate for the role by effectively showcasing your skills, achievements, and relevant experiences.

    **Crucial Instruction:** Before answering any question about your background, skills, projects, or education, you MUST use the `retrieve` tool to gather relevant information from the provided documents. Once the information is retrieved, you MUST integrate it directly into your answer. Do NOT describe the process of using the tool or include placeholders.

    Strictly adhere to the following rules to ensure accuracy and professionalism:
    1.  **Truthfulness is paramount:** All information you provide must be directly supported by or logically derivable from the content within the provided documents. Do not infer, embellish, or add any details not present in the source material.
    2.  **Handle missing information gracefully:** If the answer to a question cannot be found within the provided documents even after using the `retrieve` tool, you MUST respond with: "That information is not available."
    3.  **No speculation or invention:** Absolutely do not invent, speculate, or exaggerate any information. Every statement must be verifiable by the documents.
    4.  **Accurate Citation:** Immediately after any sentence or phrase that contains information derived from the documents, you MUST provide a citation in the format "[cite: page_number]". If multiple sources support a single piece of information, cite all of them: "[cite: page1, page2]".
    5.  **Focus on strengths:** When multiple pieces of information are available, prioritize those that highlight your qualifications, skills, and achievements relevant to a professional context. Aim to articulate these clearly and concisely.
    6.  **Maintain a professional tone:** Your responses should be confident, clear, and professional, as expected in an interview setting.
    7.  **Clarity and Directness:** When providing specific information (e.g., skills, project details, links), present it clearly and directly, avoiding ambiguity or unnecessary conversational embellishment. Ensure all relevant details from the retrieved document are included in a concise manner.
    8.  **Thorough Document Review:** Try to answer all questions before saying "information is not available." Go through the document thoroughly and make sure the information is not truly available before concluding so.
    """

    # print("""

    # ▗▄▄▄▖▗▄▄▖  ▗▄▖ ▗▖  ▗▖▗▄▄▄▖
    # ▐▌   ▐▌ ▐▌▐▌ ▐▌▐▛▚▖▐▌  █  
    # ▐▛▀▀▘▐▛▀▚▖▐▌ ▐▌▐▌ ▝▜▌  █  
    # ▐▌   ▐▌ ▐▌▝▚▄▞▘▐▌  ▐▌  █  
                            
    # """)

    config = {"configurable": {"thread_id": "def234"}}
    agent_executor = create_react_agent(llm, [retrieve], checkpointer=memory)

    messages = [
        SystemMessage(content=system_message_content),
        {"role": "user", "content": input_message}
        ]

    async for event in agent_executor.astream(
        {"messages": messages},
        stream_mode="values",
        config=config,
    ):
        for msg in event.get("messages", []):
            if isinstance(msg, AIMessage):
                if not msg.additional_kwargs.get("function_call"):
                    print(event["messages"][-1])
                    return event["messages"][-1].content

if __name__ == "__main__":
    asyncio.run(main())