import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import io
import base64
import json
from scipy import stats

def run_analysis():
    # 1. Create a Pandas DataFrame
    data = np.random.normal(100, 15, 200)
    df = pd.DataFrame(data, columns=['Score'])

    # 2. Generate a Matplotlib Plot
    plt.clf() 
    plt.hist(df['Score'], bins=20, color='skyblue', edgecolor='black')
    plt.title("Distribution of Sci-Hub Test Scores")

    # 3. Convert plot to base64
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')

    # 4. Return results as a JSON string
    return json.dumps({
        "image": img_base64,
        "mean": float(df['Score'].mean()),
        "std": float(df['Score'].std())
    })

# This call ensures the function runs when Pyodide executes the file
run_analysis()