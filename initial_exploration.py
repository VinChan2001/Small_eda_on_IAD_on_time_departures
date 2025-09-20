#!/usr/bin/env python3
"""
Initial Data Exploration Script for IAD Flight Data
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

def load_and_explore_data():
    """Load and perform initial exploration of the flight data"""

    # Load the dataset
    print("Loading dataset...")
    df = pd.read_csv('Combined Data_Detailed_Statistics_Departures.csv')

    print(f"Dataset Shape: {df.shape}")
    print(f"Total flights: {len(df):,}")

    # Column analysis
    print("\nColumn Analysis:")
    print("================")
    for i, col in enumerate(df.columns, 1):
        print(f"{i:2d}. {col}")

    # Basic statistics
    print(f"\nBasic Statistics:")
    print("=================")
    print(df.describe(include='all'))

    # Data types
    print(f"\nData Types:")
    print("===========")
    print(df.dtypes)

    # Missing values analysis
    print(f"\nMissing Values Analysis:")
    print("========================")
    missing_data = df.isnull().sum()
    missing_percent = (missing_data / len(df)) * 100
    missing_df = pd.DataFrame({
        'Missing Count': missing_data,
        'Percentage': missing_percent
    }).sort_values('Missing Count', ascending=False)

    print(missing_df[missing_df['Missing Count'] > 0])

    # Unique values analysis
    print(f"\nUnique Values Analysis:")
    print("=======================")
    for col in df.columns:
        unique_count = df[col].nunique()
        print(f"{col}: {unique_count:,} unique values")

    # Date range analysis
    print(f"\nDate Range Analysis:")
    print("====================")
    df['Date (MM/DD/YYYY)'] = pd.to_datetime(df['Date (MM/DD/YYYY)'])
    print(f"Date range: {df['Date (MM/DD/YYYY)'].min()} to {df['Date (MM/DD/YYYY)'].max()}")
    print(f"Total days: {(df['Date (MM/DD/YYYY)'].max() - df['Date (MM/DD/YYYY)'].min()).days}")

    # Carrier analysis
    print(f"\nCarrier Analysis:")
    print("=================")
    carrier_counts = df['Carrier Code'].value_counts()
    print(carrier_counts)

    # Destination analysis
    print(f"\nTop 10 Destinations:")
    print("====================")
    dest_counts = df['Destination Airport'].value_counts().head(10)
    print(dest_counts)

    # Delay analysis summary
    print(f"\nDelay Analysis Summary:")
    print("=======================")
    delay_cols = ['Departure delay (Minutes)', 'Delay Carrier (Minutes)',
                  'Delay Weather (Minutes)', 'Delay National Aviation System (Minutes)',
                  'Delay Security (Minutes)', 'Delay Late Aircraft Arrival (Minutes)']

    for col in delay_cols:
        if col in df.columns:
            print(f"{col}:")
            print(f"  Mean: {df[col].mean():.2f} minutes")
            print(f"  Median: {df[col].median():.2f} minutes")
            print(f"  Max: {df[col].max():.2f} minutes")
            print(f"  % with delays > 0: {(df[col] > 0).mean()*100:.1f}%")
            print()

    return df

if __name__ == "__main__":
    df = load_and_explore_data()
    print(f"\nDataset loaded successfully with {len(df):,} flights")