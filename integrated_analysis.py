#!/usr/bin/env python3
"""
Integrated Analysis with All Datasets
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from scipy import stats
import warnings
warnings.filterwarnings('ignore')

# Set style for better plots
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

def load_and_integrate_all_data():
    """Load and integrate all datasets"""
    print("Loading and integrating all datasets...")

    # Load primary flight data
    flights_df = pd.read_csv('Combined Data_Detailed_Statistics_Departures.csv')
    flights_df['Date (MM/DD/YYYY)'] = pd.to_datetime(flights_df['Date (MM/DD/YYYY)'])
    flights_df['Date'] = flights_df['Date (MM/DD/YYYY)'].dt.date

    # Load additional datasets
    weather_df = pd.read_csv('iad_weather_data.csv')
    weather_df['Date'] = pd.to_datetime(weather_df['Date']).dt.date

    tsa_df = pd.read_csv('tsa_checkpoint_data.csv')
    tsa_df['Date'] = pd.to_datetime(tsa_df['Date']).dt.date

    economic_df = pd.read_csv('economic_indicators.csv')
    economic_df['Date'] = pd.to_datetime(economic_df['Date']).dt.date

    fuel_df = pd.read_csv('fuel_price_data.csv')
    fuel_df['Date'] = pd.to_datetime(fuel_df['Date']).dt.date

    holiday_df = pd.read_csv('holiday_calendar.csv')
    holiday_df['Date'] = pd.to_datetime(holiday_df['Date']).dt.date

    print(f"Loaded datasets:")
    print(f"- Flights: {len(flights_df):,} records")
    print(f"- Weather: {len(weather_df):,} records")
    print(f"- TSA: {len(tsa_df):,} records")
    print(f"- Economic: {len(economic_df):,} records")
    print(f"- Fuel: {len(fuel_df):,} records")
    print(f"- Holidays: {len(holiday_df):,} records")

    # Aggregate flight data by date for integration
    daily_flights = flights_df.groupby('Date').agg({
        'Flight Number': 'count',
        'Departure delay (Minutes)': ['mean', 'median', 'std'],
        'Delay Weather (Minutes)': 'mean',
        'Delay Carrier (Minutes)': 'mean',
        'Delay National Aviation System (Minutes)': 'mean',
        'Taxi-Out time (Minutes)': 'mean',
        'Actual elapsed time (Minutes)': 'mean'
    }).round(2)

    # Flatten column names
    daily_flights.columns = [
        'Flight_Count', 'Avg_Delay', 'Median_Delay', 'Delay_StdDev',
        'Weather_Delay', 'Carrier_Delay', 'NAS_Delay',
        'Avg_Taxi_Time', 'Avg_Flight_Time'
    ]
    daily_flights = daily_flights.reset_index()

    # Merge all datasets
    integrated_df = daily_flights.merge(weather_df, on='Date', how='left')
    integrated_df = integrated_df.merge(tsa_df, on='Date', how='left')

    # Merge economic data (monthly, so forward fill)
    integrated_df['Year_Month'] = pd.to_datetime(integrated_df['Date']).dt.to_period('M')
    economic_df['Year_Month'] = pd.to_datetime(economic_df['Date']).dt.to_period('M')
    integrated_df = integrated_df.merge(
        economic_df[['Year_Month', 'GDP_Growth', 'Unemployment_Rate', 'Consumer_Confidence']],
        on='Year_Month', how='left'
    )

    # Merge fuel data (weekly, so forward fill)
    # Convert dates to datetime for merge_asof
    integrated_df['Date_dt'] = pd.to_datetime(integrated_df['Date'])
    fuel_df['Date_dt'] = pd.to_datetime(fuel_df['Date'])

    fuel_df_sorted = fuel_df.sort_values('Date_dt')
    integrated_df_sorted = integrated_df.sort_values('Date_dt')

    integrated_df = pd.merge_asof(
        integrated_df_sorted,
        fuel_df_sorted[['Date_dt', 'Jet_Fuel_Price', 'Crude_Oil_Price']],
        on='Date_dt', direction='backward'
    )

    # Remove the temporary datetime column
    integrated_df = integrated_df.drop('Date_dt', axis=1)

    # Add holiday indicators
    integrated_df['Is_Holiday'] = integrated_df['Date'].isin(holiday_df['Date'])

    # Add derived features
    integrated_df['Year'] = pd.to_datetime(integrated_df['Date']).dt.year
    integrated_df['Month'] = pd.to_datetime(integrated_df['Date']).dt.month
    integrated_df['DayOfWeek'] = pd.to_datetime(integrated_df['Date']).dt.dayofweek
    integrated_df['Is_Weekend'] = integrated_df['DayOfWeek'].isin([5, 6])

    # COVID period indicator
    integrated_df['COVID_Period'] = (
        (integrated_df['Year'] == 2020) |
        ((integrated_df['Year'] == 2021) & (integrated_df['Month'] <= 6))
    )

    print(f"\nIntegrated dataset: {len(integrated_df):,} records")
    print(f"Date range: {integrated_df['Date'].min()} to {integrated_df['Date'].max()}")

    return integrated_df

def weather_delay_analysis(df):
    """Analyze weather impact on delays"""
    print("\n" + "="*50)
    print("WEATHER-DELAY CORRELATION ANALYSIS")
    print("="*50)

    plt.figure(figsize=(20, 12))

    # 1. Weather conditions vs delays
    plt.subplot(2, 4, 1)
    weather_delays = df.groupby('Weather_Condition')['Avg_Delay'].mean().sort_values(ascending=False)
    weather_delays.plot(kind='bar', color='lightcoral')
    plt.title('Average Delay by Weather Condition')
    plt.xlabel('Weather Condition')
    plt.ylabel('Average Delay (Minutes)')
    plt.xticks(rotation=45)

    # 2. Precipitation vs delays
    plt.subplot(2, 4, 2)
    # Create precipitation bins
    df['Precip_Category'] = pd.cut(df['Precipitation'],
                                   bins=[0, 0.01, 0.1, 0.5, np.inf],
                                   labels=['None', 'Light', 'Moderate', 'Heavy'])
    precip_delays = df.groupby('Precip_Category')['Avg_Delay'].mean()
    precip_delays.plot(kind='bar', color='lightblue')
    plt.title('Average Delay by Precipitation Level')
    plt.xlabel('Precipitation Category')
    plt.ylabel('Average Delay (Minutes)')
    plt.xticks(rotation=45)

    # 3. Visibility vs delays
    plt.subplot(2, 4, 3)
    plt.scatter(df['Visibility'], df['Avg_Delay'], alpha=0.5)
    plt.xlabel('Visibility (Miles)')
    plt.ylabel('Average Delay (Minutes)')
    plt.title('Visibility vs Average Delay')

    # 4. Wind speed vs delays
    plt.subplot(2, 4, 4)
    plt.scatter(df['Wind_Speed'], df['Avg_Delay'], alpha=0.5)
    plt.xlabel('Wind Speed (MPH)')
    plt.ylabel('Average Delay (Minutes)')
    plt.title('Wind Speed vs Average Delay')

    # 5. Temperature vs flight operations
    plt.subplot(2, 4, 5)
    plt.scatter(df['Temperature_High'], df['Flight_Count'], alpha=0.5)
    plt.xlabel('High Temperature (°F)')
    plt.ylabel('Number of Flights')
    plt.title('Temperature vs Flight Volume')

    # 6. Weather delay correlation
    plt.subplot(2, 4, 6)
    weather_corr = df[['Precipitation', 'Wind_Speed', 'Visibility', 'Temperature_High',
                       'Avg_Delay', 'Weather_Delay']].corr()
    sns.heatmap(weather_corr, annot=True, cmap='coolwarm', center=0, ax=plt.gca())
    plt.title('Weather Variables Correlation')

    # 7. Seasonal weather patterns
    plt.subplot(2, 4, 7)
    monthly_weather = df.groupby('Month')[['Precipitation', 'Temperature_High', 'Avg_Delay']].mean()
    monthly_weather.plot(kind='line', ax=plt.gca(), secondary_y=['Avg_Delay'])
    plt.title('Monthly Weather Patterns vs Delays')
    plt.xlabel('Month')

    # 8. Extreme weather events
    plt.subplot(2, 4, 8)
    extreme_weather = df[
        (df['Precipitation'] > 0.5) |
        (df['Wind_Speed'] > 25) |
        (df['Visibility'] < 3)
    ]
    normal_weather = df[
        (df['Precipitation'] <= 0.1) &
        (df['Wind_Speed'] <= 15) &
        (df['Visibility'] >= 8)
    ]

    delays = [normal_weather['Avg_Delay'].mean(), extreme_weather['Avg_Delay'].mean()]
    conditions = ['Normal Weather', 'Extreme Weather']
    plt.bar(conditions, delays, color=['lightgreen', 'red'])
    plt.title('Normal vs Extreme Weather Delays')
    plt.ylabel('Average Delay (Minutes)')

    plt.tight_layout()
    plt.savefig('weather_delay_analysis.png', dpi=300, bbox_inches='tight')
    plt.show()

def covid_impact_analysis(df):
    """Comprehensive COVID-19 impact analysis"""
    print("\n" + "="*50)
    print("COVID-19 IMPACT ANALYSIS")
    print("="*50)

    plt.figure(figsize=(20, 12))

    # 1. Flight volume over time
    plt.subplot(2, 4, 1)
    monthly_flights = df.groupby(['Year', 'Month'])['Flight_Count'].sum().reset_index()
    monthly_flights['Date'] = pd.to_datetime(monthly_flights[['Year', 'Month']].assign(day=1))
    plt.plot(monthly_flights['Date'], monthly_flights['Flight_Count'])
    plt.axvline(x=pd.to_datetime('2020-03-01'), color='red', linestyle='--', label='COVID Start')
    plt.title('Monthly Flight Volume Over Time')
    plt.xlabel('Date')
    plt.ylabel('Monthly Flights')
    plt.legend()
    plt.xticks(rotation=45)

    # 2. TSA throughput correlation
    plt.subplot(2, 4, 2)
    plt.scatter(df['Travelers_Total'], df['Flight_Count'], alpha=0.5)
    plt.xlabel('TSA Daily Travelers')
    plt.ylabel('Daily Flights from IAD')
    plt.title('TSA Throughput vs IAD Flights')

    # 3. Pre/During/Post COVID comparison
    plt.subplot(2, 4, 3)
    pre_covid = df[df['Year'] <= 2019]['Flight_Count'].mean()
    during_covid = df[df['COVID_Period']]['Flight_Count'].mean()
    post_covid = df[(df['Year'] >= 2022)]['Flight_Count'].mean()

    periods = ['Pre-COVID\n(2017-2019)', 'During COVID\n(2020-2021)', 'Post-COVID\n(2022-2024)']
    volumes = [pre_covid, during_covid, post_covid]
    plt.bar(periods, volumes, color=['green', 'red', 'blue'])
    plt.title('Average Daily Flights by Period')
    plt.ylabel('Average Daily Flights')

    # 4. Recovery timeline
    plt.subplot(2, 4, 4)
    recovery_data = df[df['Year'] >= 2020].groupby(['Year', 'Month'])['Flight_Count'].mean().reset_index()
    recovery_data['Period'] = recovery_data['Year'].astype(str) + '-' + recovery_data['Month'].astype(str).str.zfill(2)
    plt.plot(range(len(recovery_data)), recovery_data['Flight_Count'], marker='o')
    plt.title('Flight Recovery Timeline (2020-2024)')
    plt.xlabel('Time Period')
    plt.ylabel('Average Daily Flights')
    plt.xticks(range(0, len(recovery_data), 6), recovery_data['Period'][::6], rotation=45)

    # 5. Economic indicators during COVID
    plt.subplot(2, 4, 5)
    covid_data = df[df['Year'].isin([2019, 2020, 2021])].dropna(subset=['GDP_Growth', 'Unemployment_Rate'])
    if not covid_data.empty:
        ax = covid_data.groupby('Year')['GDP_Growth'].mean().plot(kind='bar', color='lightcoral')
        ax2 = ax.twinx()
        covid_data.groupby('Year')['Unemployment_Rate'].mean().plot(kind='bar', ax=ax2, color='lightblue', alpha=0.7)
        plt.title('Economic Indicators During COVID')
        ax.set_ylabel('GDP Growth (%)', color='red')
        ax2.set_ylabel('Unemployment Rate (%)', color='blue')

    # 6. Delay patterns during COVID
    plt.subplot(2, 4, 6)
    delay_comparison = df.groupby('COVID_Period')['Avg_Delay'].mean()
    delay_comparison.index = ['Normal Period', 'COVID Period']
    delay_comparison.plot(kind='bar', color=['lightgreen', 'orange'])
    plt.title('Average Delays: Normal vs COVID Period')
    plt.ylabel('Average Delay (Minutes)')
    plt.xticks(rotation=45)

    # 7. Carrier performance during COVID
    plt.subplot(2, 4, 7)
    # This would require carrier-specific data from the original dataset
    # For now, show general pattern
    yearly_pattern = df.groupby('Year')['Flight_Count'].mean()
    yearly_pattern.plot(kind='line', marker='o', color='purple')
    plt.title('Yearly Flight Volume Trend')
    plt.xlabel('Year')
    plt.ylabel('Average Daily Flights')

    # 8. Weekly patterns pre vs during COVID
    plt.subplot(2, 4, 8)
    pre_covid_weekly = df[df['Year'] <= 2019].groupby('DayOfWeek')['Flight_Count'].mean()
    covid_weekly = df[df['COVID_Period']].groupby('DayOfWeek')['Flight_Count'].mean()

    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    plt.plot(days, pre_covid_weekly.values, marker='o', label='Pre-COVID', color='green')
    plt.plot(days, covid_weekly.values, marker='s', label='During COVID', color='red')
    plt.title('Weekly Patterns: Pre vs During COVID')
    plt.xlabel('Day of Week')
    plt.ylabel('Average Daily Flights')
    plt.legend()

    plt.tight_layout()
    plt.savefig('covid_impact_analysis.png', dpi=300, bbox_inches='tight')
    plt.show()

def economic_correlation_analysis(df):
    """Analyze economic factors impact on aviation"""
    print("\n" + "="*50)
    print("ECONOMIC CORRELATION ANALYSIS")
    print("="*50)

    plt.figure(figsize=(20, 12))

    # 1. Flight volume vs economic indicators
    plt.subplot(2, 4, 1)
    economic_clean = df.dropna(subset=['GDP_Growth', 'Flight_Count'])
    if not economic_clean.empty:
        plt.scatter(economic_clean['GDP_Growth'], economic_clean['Flight_Count'], alpha=0.5)
        plt.xlabel('GDP Growth (%)')
        plt.ylabel('Daily Flights')
        plt.title('GDP Growth vs Flight Volume')

    # 2. Unemployment vs travel
    plt.subplot(2, 4, 2)
    unemployment_clean = df.dropna(subset=['Unemployment_Rate', 'Flight_Count'])
    if not unemployment_clean.empty:
        plt.scatter(unemployment_clean['Unemployment_Rate'], unemployment_clean['Flight_Count'], alpha=0.5)
        plt.xlabel('Unemployment Rate (%)')
        plt.ylabel('Daily Flights')
        plt.title('Unemployment vs Flight Volume')

    # 3. Consumer confidence vs travel
    plt.subplot(2, 4, 3)
    confidence_clean = df.dropna(subset=['Consumer_Confidence', 'Flight_Count'])
    if not confidence_clean.empty:
        plt.scatter(confidence_clean['Consumer_Confidence'], confidence_clean['Flight_Count'], alpha=0.5)
        plt.xlabel('Consumer Confidence Index')
        plt.ylabel('Daily Flights')
        plt.title('Consumer Confidence vs Flight Volume')

    # 4. Fuel prices vs delays
    plt.subplot(2, 4, 4)
    fuel_clean = df.dropna(subset=['Jet_Fuel_Price', 'Avg_Delay'])
    if not fuel_clean.empty:
        plt.scatter(fuel_clean['Jet_Fuel_Price'], fuel_clean['Avg_Delay'], alpha=0.5)
        plt.xlabel('Jet Fuel Price ($/gallon)')
        plt.ylabel('Average Delay (Minutes)')
        plt.title('Fuel Prices vs Delays')

    # 5. Economic indicators over time
    plt.subplot(2, 4, 5)
    monthly_econ = df.groupby(['Year', 'Month'])[['GDP_Growth', 'Unemployment_Rate', 'Consumer_Confidence']].first().dropna()
    if not monthly_econ.empty:
        monthly_econ.index = pd.to_datetime(monthly_econ.index.map(lambda x: f"{x[0]}-{x[1]:02d}-01"))
        monthly_econ['GDP_Growth'].plot(label='GDP Growth', ax=plt.gca())
        monthly_econ['Unemployment_Rate'].plot(label='Unemployment', ax=plt.gca())
        plt.title('Economic Indicators Over Time')
        plt.xlabel('Date')
        plt.ylabel('Percentage')
        plt.legend()

    # 6. Fuel price trends
    plt.subplot(2, 4, 6)
    fuel_trends = df.groupby(['Year', 'Month'])[['Jet_Fuel_Price', 'Crude_Oil_Price']].first().dropna()
    if not fuel_trends.empty:
        fuel_trends.index = pd.to_datetime(fuel_trends.index.map(lambda x: f"{x[0]}-{x[1]:02d}-01"))
        fuel_trends.plot(ax=plt.gca())
        plt.title('Fuel Price Trends')
        plt.xlabel('Date')
        plt.ylabel('Price ($)')
        plt.legend()

    # 7. Holiday impact
    plt.subplot(2, 4, 7)
    holiday_impact = df.groupby('Is_Holiday')['Flight_Count'].mean()
    holiday_impact.index = ['Regular Day', 'Holiday']
    holiday_impact.plot(kind='bar', color=['lightblue', 'orange'])
    plt.title('Holiday vs Regular Day Flight Volume')
    plt.ylabel('Average Daily Flights')
    plt.xticks(rotation=0)

    # 8. Correlation matrix
    plt.subplot(2, 4, 8)
    corr_vars = ['Flight_Count', 'Avg_Delay', 'GDP_Growth', 'Unemployment_Rate',
                 'Consumer_Confidence', 'Jet_Fuel_Price', 'Travelers_Total']
    corr_df = df[corr_vars].dropna()
    if not corr_df.empty:
        correlation_matrix = corr_df.corr()
        sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0, ax=plt.gca())
        plt.title('Economic-Aviation Correlation Matrix')

    plt.tight_layout()
    plt.savefig('economic_correlation_analysis.png', dpi=300, bbox_inches='tight')
    plt.show()

def comprehensive_insights_summary(df):
    """Generate comprehensive insights summary"""
    print("\n" + "="*60)
    print("COMPREHENSIVE INSIGHTS SUMMARY")
    print("="*60)

    # Calculate key statistics
    total_days = len(df)
    total_flights = df['Flight_Count'].sum()
    avg_daily_flights = df['Flight_Count'].mean()

    # Weather impact
    weather_clean = df.dropna(subset=['Weather_Condition', 'Avg_Delay'])
    if not weather_clean.empty:
        weather_impact = weather_clean.groupby('Weather_Condition')['Avg_Delay'].mean()
        worst_weather = weather_impact.idxmax()
        weather_delay_diff = weather_impact.max() - weather_impact.min()

    # COVID impact
    pre_covid_flights = df[df['Year'] <= 2019]['Flight_Count'].mean()
    covid_flights = df[df['COVID_Period']]['Flight_Count'].mean()
    covid_impact_pct = ((covid_flights - pre_covid_flights) / pre_covid_flights) * 100

    # Economic correlations
    econ_clean = df.dropna(subset=['GDP_Growth', 'Flight_Count', 'Unemployment_Rate'])
    if not econ_clean.empty:
        gdp_correlation = econ_clean['GDP_Growth'].corr(econ_clean['Flight_Count'])
        unemployment_correlation = econ_clean['Unemployment_Rate'].corr(econ_clean['Flight_Count'])

    print(f"DATASET OVERVIEW:")
    print(f"- Analysis period: {df['Date'].min()} to {df['Date'].max()}")
    print(f"- Total days analyzed: {total_days:,}")
    print(f"- Total flights: {total_flights:,}")
    print(f"- Average daily flights: {avg_daily_flights:.1f}")

    if 'weather_impact' in locals():
        print(f"\nWEATHER INSIGHTS:")
        print(f"- Worst weather condition for delays: {worst_weather}")
        print(f"- Weather-related delay variation: {weather_delay_diff:.1f} minutes")

    print(f"\nCOVID-19 IMPACT:")
    print(f"- Pre-COVID average daily flights: {pre_covid_flights:.1f}")
    print(f"- During COVID average daily flights: {covid_flights:.1f}")
    print(f"- COVID impact: {covid_impact_pct:.1f}% change")

    if 'gdp_correlation' in locals():
        print(f"\nECONOMIC CORRELATIONS:")
        print(f"- GDP Growth correlation with flights: {gdp_correlation:.3f}")
        print(f"- Unemployment correlation with flights: {unemployment_correlation:.3f}")

    # Seasonal patterns
    seasonal_flights = df.groupby('Month')['Flight_Count'].mean()
    peak_month = seasonal_flights.idxmax()
    low_month = seasonal_flights.idxmin()

    print(f"\nSEASONAL PATTERNS:")
    print(f"- Peak travel month: {peak_month} ({seasonal_flights.max():.1f} avg daily flights)")
    print(f"- Lowest travel month: {low_month} ({seasonal_flights.min():.1f} avg daily flights)")

    # Day of week patterns
    dow_flights = df.groupby('DayOfWeek')['Flight_Count'].mean()
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    busiest_day = days[dow_flights.idxmax()]
    quietest_day = days[dow_flights.idxmin()]

    print(f"\nWEEKLY PATTERNS:")
    print(f"- Busiest day: {busiest_day} ({dow_flights.max():.1f} avg flights)")
    print(f"- Quietest day: {quietest_day} ({dow_flights.min():.1f} avg flights)")

    print("="*60)

def main():
    """Main integrated analysis function"""
    print("Starting Comprehensive Integrated Analysis")
    print("=" * 70)

    # Load and integrate all data
    df = load_and_integrate_all_data()

    # Save integrated dataset
    df.to_csv('integrated_flight_analysis_dataset.csv', index=False)
    print(f"\nIntegrated dataset saved as 'integrated_flight_analysis_dataset.csv'")

    # Run all analyses
    weather_delay_analysis(df)
    covid_impact_analysis(df)
    economic_correlation_analysis(df)
    comprehensive_insights_summary(df)

    print("\n" + "="*70)
    print("INTEGRATED ANALYSIS COMPLETED")
    print("Generated visualizations:")
    print("- weather_delay_analysis.png")
    print("- covid_impact_analysis.png")
    print("- economic_correlation_analysis.png")
    print("- integrated_flight_analysis_dataset.csv")
    print("="*70)

    return df

if __name__ == "__main__":
    integrated_df = main()