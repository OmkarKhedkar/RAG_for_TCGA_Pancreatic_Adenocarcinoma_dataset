<div align="center">

# 🧬 Pancreatic Cancer Genomics RAG Application

<img src="https://github.com/OmkarKhedkar/RAG_for_TCGA_Pancreatic_Adenocarcinoma_dataset/blob/main/Pancreatic_Cancer_Genomics_RAG_logo.png" alt="Project Logo" width="200"/>

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

Empowering pancreatic cancer research through AI-driven genomic data analysis.

[Explore the docs »](https://github.com/yourusername/pancreatic-cancer-genomics-rag)

[View Demo](https://your-demo-link.com) · [Report Bug](https://github.com/OmkarKhedkar/RAG_for_TCGA_Pancreatic_Adenocarcinoma_dataset/issues) · [Request Feature](https://github.com/OmkarKhedkar/RAG_for_TCGA_Pancreatic_Adenocarcinoma_dataset/issues)

</div>

## 🌟 About The Project

<p align="center">
  <img src="https://github.com/OmkarKhedkar/RAG_for_TCGA_Pancreatic_Adenocarcinoma_dataset/blob/main/project_screenshot.png" alt="Project Screenshot" width="600"/>
</p>

The Pancreatic Cancer Genomics RAG Application is a cutting-edge tool designed to revolutionize how researchers and clinicians interact with pancreatic cancer genomic data. By leveraging the power of Retrieval-Augmented Generation (RAG) and OpenAI's advanced language models, this application provides an intuitive interface for querying complex genomic datasets and obtaining AI-generated insights.

### Key Features

- 📊 Upload and process clinical and gene expression data
- 🔍 Natural language querying of processed genomic data
- 🧠 AI-powered responses using OpenAI's GPT model
- 🛡️ Robust error handling and rate limiting
- 🚀 Fast and efficient data processing with Pandas

## 🛠️ Built With

* [FastAPI](https://fastapi.tiangolo.com/) - Backend framework
* [React](https://reactjs.org/) - Frontend library
* [OpenAI API](https://openai.com/api/) - AI language model
* [Pandas](https://pandas.pydata.org/) - Data manipulation and analysis
* [TypeScript](https://www.typescriptlang.org/) - Frontend language

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Python 3.8+
* Node.js 14+
* npm

### Installation

1. Clone the repo
   git clone https://github.com/OmkarKhedkar/RAG_for_TCGA_Pancreatic_Adenocarcinoma_dataset.git
2. Set up the backend
  cd backend
python -m venv venv
  source venv/bin/activate  # On Windows use `venv\Scripts\activate`
  pip install -r requirements.txt

3. Set up your OpenAI API key
  echo "OPENAI_API_KEY=your_api_key_here" > .env

4. Set up the frontend
  cd ../frontend
  npm install


### Usage

1. Start the backend server
  cd backend
  uvicorn app:app --reload --host 0.0.0.0 --port 8000

2. Start the frontend development server
  cd frontend
  npm start

3. Open your browser and navigate to http://localhost:3000
4. Upload your pancreatic cancer genomic data files
5. Start querying and exploring the data!

## Sample Questions

Here are some example questions you can ask our Pancreatic Cancer Genomics RAG:

1. **Basic Information:**
   - What are the most common genetic mutations in pancreatic cancer?
   - How does the KRAS gene contribute to pancreatic cancer development?

2. **Diagnosis and Prognosis:**
   - What genomic markers are used for early detection of pancreatic cancer?
   - How do specific gene expressions correlate with survival rates in pancreatic cancer patients?

3. **Treatment-related:**
   - Which genetic profiles respond best to chemotherapy in pancreatic cancer?
   - How does the BRCA mutation affect treatment options for pancreatic cancer?

4. **Research and Clinical Trials:**
   - What are the latest genomic targets for pancreatic cancer immunotherapy?
   - How do epigenetic changes influence pancreatic cancer progression?

5. **Comparative Analysis:**
   - How do genomic profiles of pancreatic cancer differ from those of other gastrointestinal cancers?
   - What genetic similarities exist between familial and sporadic cases of pancreatic cancer?

Note: The accuracy and depth of answers will depend on the data uploaded and processed by the system.

To use these sample questions, simply copy and paste them into the query input field of the application after uploading your genomic data files.

## Roadmap

- [x] Basic RAG implementation
- [x] File upload and processing
- [ ] Vector database integration for similarity search
- [ ] Advanced data visualization
- [ ] User authentication and data privacy

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
License
Distributed under the MIT License. See LICENSE for more information.

Project Link: https://github.com/OmkarKhedkar/RAG_for_TCGA_Pancreatic_Adenocarcinoma_dataset
