# main.py
from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import openai
from pinecone import Pinecone, ServerlessSpec
import os
from typing import List
from data_processor import process_clinical_data, process_gene_expression_data, combine_data, create_text_entries
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
from openai import OpenAI
import pinecone
import os
from typing import List
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
import logging
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import pandas as pd

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app's address
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# In-memory storage for processed data (replace with database in production)
processed_data = None


# Initialize OpenAI and Pinecone
OPENAI_API_KEY = ""
pc = Pinecone(
        api_key="",
        environment=""
    )
#pinecone.init(api_key=os.getenv("PINECONE_API_KEY"), environment=os.getenv("PINECONE_ENVIRONMENT"))
index =pc.Index("")

class Query(BaseModel):
    text: str

logging.basicConfig(level=logging.INFO)

@app.post("/upload")
async def upload_files(clinical_file: UploadFile = File(...), expression_file: UploadFile = File(...)):
    logging.info(f"Received files: {clinical_file.filename}, {expression_file.filename}")

    try:
        # Read clinical data
        clinical_content = await clinical_file.read()
        clinical_df = pd.read_csv(io.StringIO(clinical_content.decode('utf-8')), sep='\t')
        logging.info(f"Clinical data shape: {clinical_df.shape}")

        # Read expression data
        expression_content = await expression_file.read()
        expression_df = pd.read_csv(io.StringIO(expression_content.decode('utf-8')), sep='\t')
        logging.info(f"Expression data shape: {expression_df.shape}")

        # Process the data (example: merge on a common column, assuming 'patient_id' exists in both)
        processed_data = pd.merge(clinical_df, expression_df, on='case_id', how='inner')
        
        num_records = len(processed_data)
        logging.info(f"Processed {num_records} records")

        # Here you would typically save this data or process it further

        return {"status": "processed", "records": num_records}
    except Exception as e:
        logging.error(f"Error processing files: {str(e)}")
        return {"status": "error", "message": str(e)}

class Query(BaseModel):
    text: str

def get_embedding(text, model="text-embedding-ada-002"):
    client = OpenAI(api_key=OPENAI_API_KEY)
    try:
        response = client.embeddings.create(input=[text], model=model)
        return response.data[0].embedding
    except Exception as e:
        logger.error(f"Error getting embedding: {str(e)}")
        raise

@app.post("/query")
async def process_query(query: Query):
    global processed_data
    logger.info(f"Received query: {query.text}")

    '''if processed_data is None:
        logger.warning("No data has been uploaded yet")
        raise HTTPException(status_code=400, detail="No data has been uploaded yet")'''
    try:
        # Get embeddings for the query
        client = OpenAI(api_key=OPENAI_API_KEY)
        query_embedding = get_embedding(query.text)#client.embeddings.create(input=query.text, model="text-embedding-ada-002")["data"][0]["embedding"]
        
        # Search Pinecone
        results = index.query(vector=query_embedding, top_k=5)
        
        # Generate response using OpenAI
        context = "\n".join([result["metadata"]["text"] for result in results["matches"]])
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant specializing in pancreatic cancer genomics. Use the following context to answer the user's question about pancreatic cancer patients and their genomic data."},
                {"role": "user", "content": f"Context: {context}\n\nQuestion: {query.text}"}
            ]
        )
    except Exception as e:
        logging.error(f"Error processing query: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    
    return {"response": response.choices[0].message.content}