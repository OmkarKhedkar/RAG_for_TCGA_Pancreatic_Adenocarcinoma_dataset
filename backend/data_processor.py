# data_processor.py
import pandas as pd
import numpy as np

def process_clinical_data(file_path):
    df = pd.read_csv(file_path, sep='\t')
    # Select relevant columns
    columns = ['case_id', 'age_at_diagnosis', 'gender', 'ajcc_pathologic_stage', 'vital_status', 'days_to_death', 'days_to_last_follow_up']
    df = df[columns]
    return df

def process_gene_expression_data(file_path):
    df = pd.read_csv(file_path, sep='\t', index_col=0)
    # Transpose so that genes are columns
    df = df.transpose()
    return df

def combine_data(clinical_df, expression_df):
    combined_df = clinical_df.merge(expression_df, left_on='case_id', right_index=True)
    return combined_df

def create_text_entries(combined_df):
    text_entries = []
    for _, row in combined_df.iterrows():
        text = f"Patient ID: {row['case_id']}\n"
        text += f"Age at diagnosis: {row['age_at_diagnosis']}\n"
        text += f"Gender: {row['gender']}\n"
        text += f"Cancer stage: {row['ajcc_pathologic_stage']}\n"
        text += f"Vital status: {row['vital_status']}\n"
        
        # Add top 10 most expressed genes
        gene_expr = row.drop(['case_id', 'age_at_diagnosis', 'gender', 'ajcc_pathologic_stage', 'vital_status', 'days_to_death', 'days_to_last_followup'])
        top_genes = gene_expr.nlargest(10)
        text += "Top expressed genes:\n"
        for gene, value in top_genes.items():
            text += f"{gene}: {value:.2f}\n"
        
        text_entries.append(text)
    return text_entries