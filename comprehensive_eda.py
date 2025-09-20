#!/usr/bin/env python3
"""
Comprehensive EDA for IAD Flight Data
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import warnings
warnings.filterwarnings('ignore')

# Set style for better plots
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

def load_and_preprocess_data():
    """Load and preprocess the flight data"""
    print("Loading and preprocessing data...")

    df = pd.read_csv('Combined Data_Detailed_Statistics_Departures.csv')

    # Convert date and time columns
    df['Date (MM/DD/YYYY)'] = pd.to_datetime(df['Date (MM/DD/YYYY)'])
    df['Year'] = df['Date (MM/DD/YYYY)'].dt.year
    df['Month'] = df['Date (MM/DD/YYYY)'].dt.month
    df['DayOfWeek'] = df['Date (MM/DD/YYYY)'].dt.dayofweek
    df['DayOfWeek_Name'] = df['Date (MM/DD/YYYY)'].dt.day_name()
    df['Season'] = df['Month'].map({12:4, 1:4, 2:4, 3:1, 4:1, 5:1, 6:2, 7:2, 8:2, 9:3, 10:3, 11:3})
    df['Season_Name'] = df['Season'].map({1:'Spring', 2:'Summer', 3:'Fall', 4:'Winter'})

    # Create binary delay indicator
    df['Is_Delayed'] = df['Departure delay (Minutes)'] > 0
    df['Is_Significantly_Delayed'] = df['Departure delay (Minutes)'] > 15

    # Calculate efficiency metrics
    df['Schedule_Adherence'] = 100 - (df['Departure delay (Minutes)'].abs() / df['Scheduled elapsed time (Minutes)'] * 100)

    # Create time bins for departure time analysis
    df['Scheduled_Hour'] = pd.to_datetime(df['Scheduled departure time'], format='%H:%M', errors='coerce').dt.hour
    df['Time_Period'] = pd.cut(df['Scheduled_Hour'],
                               bins=[0, 6, 12, 18, 24],
                               labels=['Early Morning', 'Morning', 'Afternoon', 'Evening'],
                               include_lowest=True)

    return df

def temporal_analysis(df):
    """Comprehensive temporal analysis"""
    print("\n" + "="*50)
    print("TEMPORAL ANALYSIS")
    print("="*50)

    # Yearly trends
    plt.figure(figsize=(20, 15))

    # 1. Flight volume by year
    plt.subplot(3, 3, 1)
    yearly_counts = df.groupby('Year').size()
    yearly_counts.plot(kind='bar', color='skyblue')
    plt.title('Flight Volume by Year')
    plt.xlabel('Year')
    plt.ylabel('Number of Flights')
    plt.xticks(rotation=45)

    # 2. Average delay by year
    plt.subplot(3, 3, 2)
    yearly_delays = df.groupby('Year')['Departure delay (Minutes)'].mean()
    yearly_delays.plot(kind='bar', color='lightcoral')
    plt.title('Average Departure Delay by Year')
    plt.xlabel('Year')
    plt.ylabel('Average Delay (Minutes)')
    plt.xticks(rotation=45)

    # 3. Monthly patterns
    plt.subplot(3, 3, 3)
    monthly_counts = df.groupby('Month').size()
    monthly_counts.plot(kind='bar', color='lightgreen')
    plt.title('Flight Volume by Month')
    plt.xlabel('Month')
    plt.ylabel('Number of Flights')

    # 4. Day of week patterns
    plt.subplot(3, 3, 4)
    dow_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    dow_counts = df.groupby('DayOfWeek_Name').size().reindex(dow_order)
    dow_counts.plot(kind='bar', color='orange')
    plt.title('Flight Volume by Day of Week')
    plt.xlabel('Day of Week')
    plt.ylabel('Number of Flights')
    plt.xticks(rotation=45)

    # 5. Seasonal patterns
    plt.subplot(3, 3, 5)
    seasonal_counts = df.groupby('Season_Name').size()
    seasonal_counts.plot(kind='bar', color='purple')
    plt.title('Flight Volume by Season')
    plt.xlabel('Season')
    plt.ylabel('Number of Flights')

    # 6. Hourly departure patterns
    plt.subplot(3, 3, 6)
    hourly_counts = df.groupby('Scheduled_Hour').size()
    hourly_counts.plot(kind='bar', color='pink')
    plt.title('Flight Volume by Scheduled Hour')
    plt.xlabel('Hour of Day')
    plt.ylabel('Number of Flights')

    # 7. Delay patterns by time period
    plt.subplot(3, 3, 7)
    time_delays = df.groupby('Time_Period')['Departure delay (Minutes)'].mean()
    time_delays.plot(kind='bar', color='gold')
    plt.title('Average Delay by Time Period')
    plt.xlabel('Time Period')
    plt.ylabel('Average Delay (Minutes)')
    plt.xticks(rotation=45)

    # 8. COVID impact analysis (2019-2021)
    plt.subplot(3, 3, 8)
    covid_data = df[df['Year'].isin([2019, 2020, 2021])]
    covid_monthly = covid_data.groupby(['Year', 'Month']).size().unstack(level=0)
    covid_monthly.plot(kind='bar', ax=plt.gca())
    plt.title('COVID Impact: Monthly Flights (2019-2021)')
    plt.xlabel('Month')
    plt.ylabel('Number of Flights')
    plt.legend(title='Year')

    # 9. Weekend vs Weekday patterns
    plt.subplot(3, 3, 9)
    df['Is_Weekend'] = df['DayOfWeek'].isin([5, 6])
    weekend_delays = df.groupby('Is_Weekend')['Departure delay (Minutes)'].mean()
    weekend_delays.index = ['Weekday', 'Weekend']
    weekend_delays.plot(kind='bar', color=['lightblue', 'lightcoral'])
    plt.title('Average Delay: Weekday vs Weekend')
    plt.xlabel('Day Type')
    plt.ylabel('Average Delay (Minutes)')

    plt.tight_layout()
    plt.savefig('temporal_analysis.png', dpi=300, bbox_inches='tight')
    plt.show()

def carrier_analysis(df):
    """Comprehensive carrier performance analysis"""
    print("\n" + "="*50)
    print("CARRIER ANALYSIS")
    print("="*50)

    plt.figure(figsize=(20, 12))

    # 1. Market share
    plt.subplot(2, 4, 1)
    carrier_counts = df['Carrier Code'].value_counts()
    plt.pie(carrier_counts.values, labels=carrier_counts.index, autopct='%1.1f%%')
    plt.title('Market Share by Carrier')

    # 2. Average delay by carrier
    plt.subplot(2, 4, 2)
    carrier_delays = df.groupby('Carrier Code')['Departure delay (Minutes)'].mean().sort_values(ascending=True)
    carrier_delays.plot(kind='barh', color='lightcoral')
    plt.title('Average Departure Delay by Carrier')
    plt.xlabel('Average Delay (Minutes)')

    # 3. On-time performance (delays <= 15 minutes)
    plt.subplot(2, 4, 3)
    ontime_perf = (1 - df.groupby('Carrier Code')['Is_Significantly_Delayed'].mean()) * 100
    ontime_perf.sort_values(ascending=False).plot(kind='bar', color='lightgreen')
    plt.title('On-Time Performance by Carrier\n(% flights ≤15 min delay)')
    plt.ylabel('On-Time Performance (%)')
    plt.xticks(rotation=45)

    # 4. Delay distribution by carrier
    plt.subplot(2, 4, 4)
    for carrier in df['Carrier Code'].unique():
        carrier_data = df[df['Carrier Code'] == carrier]['Departure delay (Minutes)']
        carrier_data = carrier_data[(carrier_data >= -30) & (carrier_data <= 120)]  # Filter extreme outliers
        plt.hist(carrier_data, alpha=0.6, label=carrier, bins=30)
    plt.title('Delay Distribution by Carrier')
    plt.xlabel('Departure Delay (Minutes)')
    plt.ylabel('Frequency')
    plt.legend()

    # 5. Fleet utilization (flights per tail number)
    plt.subplot(2, 4, 5)
    fleet_util = df.groupby('Carrier Code')['Tail Number'].nunique() / df.groupby('Carrier Code').size() * 1000
    fleet_util.sort_values(ascending=False).plot(kind='bar', color='orange')
    plt.title('Fleet Efficiency\n(Unique Aircraft per 1000 flights)')
    plt.ylabel('Aircraft per 1000 flights')
    plt.xticks(rotation=45)

    # 6. Carrier delay type breakdown
    plt.subplot(2, 4, 6)
    delay_types = ['Delay Carrier (Minutes)', 'Delay Weather (Minutes)',
                   'Delay National Aviation System (Minutes)', 'Delay Security (Minutes)',
                   'Delay Late Aircraft Arrival (Minutes)']
    carrier_delay_breakdown = df.groupby('Carrier Code')[delay_types].mean()
    carrier_delay_breakdown.plot(kind='bar', stacked=True, ax=plt.gca())
    plt.title('Average Delay Breakdown by Carrier')
    plt.ylabel('Average Delay (Minutes)')
    plt.xticks(rotation=45)
    plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left')

    # 7. Yearly growth by carrier
    plt.subplot(2, 4, 7)
    yearly_carrier = df.groupby(['Year', 'Carrier Code']).size().unstack(fill_value=0)
    for carrier in yearly_carrier.columns:
        plt.plot(yearly_carrier.index, yearly_carrier[carrier], marker='o', label=carrier)
    plt.title('Yearly Flight Volume by Carrier')
    plt.xlabel('Year')
    plt.ylabel('Number of Flights')
    plt.legend()

    # 8. Schedule adherence by carrier
    plt.subplot(2, 4, 8)
    schedule_adherence = df.groupby('Carrier Code')['Schedule_Adherence'].mean()
    schedule_adherence.sort_values(ascending=False).plot(kind='bar', color='purple')
    plt.title('Schedule Adherence by Carrier')
    plt.ylabel('Schedule Adherence (%)')
    plt.xticks(rotation=45)

    plt.tight_layout()
    plt.savefig('carrier_analysis.png', dpi=300, bbox_inches='tight')
    plt.show()

def route_and_destination_analysis(df):
    """Comprehensive route and destination analysis"""
    print("\n" + "="*50)
    print("ROUTE & DESTINATION ANALYSIS")
    print("="*50)

    plt.figure(figsize=(20, 15))

    # 1. Top destinations by volume
    plt.subplot(3, 3, 1)
    top_destinations = df['Destination Airport'].value_counts().head(15)
    top_destinations.plot(kind='barh', color='skyblue')
    plt.title('Top 15 Destinations by Flight Volume')
    plt.xlabel('Number of Flights')

    # 2. Average delay by destination (top 20)
    plt.subplot(3, 3, 2)
    dest_delays = df.groupby('Destination Airport')['Departure delay (Minutes)'].mean()
    dest_delays = dest_delays[dest_delays.index.isin(top_destinations.index)]
    dest_delays.sort_values(ascending=True).plot(kind='barh', color='lightcoral')
    plt.title('Average Delay by Top Destinations')
    plt.xlabel('Average Delay (Minutes)')

    # 3. Flight distance vs delay correlation
    plt.subplot(3, 3, 3)
    plt.scatter(df['Scheduled elapsed time (Minutes)'], df['Departure delay (Minutes)'], alpha=0.1)
    plt.xlabel('Scheduled Flight Time (Minutes)')
    plt.ylabel('Departure Delay (Minutes)')
    plt.title('Flight Duration vs Departure Delay')
    plt.ylim(-50, 200)  # Limit y-axis for better visualization

    # 4. Route efficiency (actual vs scheduled time)
    plt.subplot(3, 3, 4)
    df['Time_Efficiency'] = (df['Scheduled elapsed time (Minutes)'] - df['Actual elapsed time (Minutes)']) / df['Scheduled elapsed time (Minutes)'] * 100
    route_efficiency = df.groupby('Destination Airport')['Time_Efficiency'].mean()
    route_efficiency = route_efficiency[route_efficiency.index.isin(top_destinations.head(10).index)]
    route_efficiency.sort_values(ascending=False).plot(kind='bar', color='lightgreen')
    plt.title('Route Efficiency by Destination\n(% faster than scheduled)')
    plt.ylabel('Time Efficiency (%)')
    plt.xticks(rotation=45)

    # 5. Seasonal destination preferences
    plt.subplot(3, 3, 5)
    seasonal_routes = df.groupby(['Season_Name', 'Destination Airport']).size().unstack(fill_value=0)
    top_seasonal = seasonal_routes.loc[:, seasonal_routes.sum().nlargest(8).index]
    top_seasonal.plot(kind='bar', ax=plt.gca())
    plt.title('Seasonal Destination Preferences (Top 8)')
    plt.xlabel('Season')
    plt.ylabel('Number of Flights')
    plt.xticks(rotation=45)
    plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left')

    # 6. Weekend vs weekday destination preferences
    plt.subplot(3, 3, 6)
    weekend_routes = df.groupby(['Is_Weekend', 'Destination Airport']).size().unstack(fill_value=0)
    weekend_routes = weekend_routes.loc[:, weekend_routes.sum().nlargest(10).index]
    weekend_routes.index = ['Weekday', 'Weekend']
    weekend_routes.T.plot(kind='bar', ax=plt.gca())
    plt.title('Weekday vs Weekend Destinations (Top 10)')
    plt.xlabel('Destination')
    plt.ylabel('Number of Flights')
    plt.xticks(rotation=45)
    plt.legend()

    # 7. Carrier market share by destination
    plt.subplot(3, 3, 7)
    carrier_dest = df.groupby(['Destination Airport', 'Carrier Code']).size().unstack(fill_value=0)
    top_dest_carrier = carrier_dest.loc[top_destinations.head(5).index]
    top_dest_carrier.plot(kind='bar', stacked=True, ax=plt.gca())
    plt.title('Carrier Competition in Top 5 Destinations')
    plt.xlabel('Destination')
    plt.ylabel('Number of Flights')
    plt.xticks(rotation=45)
    plt.legend(title='Carrier')

    # 8. Taxi time analysis by destination
    plt.subplot(3, 3, 8)
    taxi_times = df.groupby('Destination Airport')['Taxi-Out time (Minutes)'].mean()
    taxi_times = taxi_times[taxi_times.index.isin(top_destinations.head(10).index)]
    taxi_times.sort_values(ascending=False).plot(kind='bar', color='orange')
    plt.title('Average Taxi-Out Time by Destination')
    plt.ylabel('Taxi-Out Time (Minutes)')
    plt.xticks(rotation=45)

    # 9. Destination delay variability
    plt.subplot(3, 3, 9)
    delay_variability = df.groupby('Destination Airport')['Departure delay (Minutes)'].std()
    delay_variability = delay_variability[delay_variability.index.isin(top_destinations.head(10).index)]
    delay_variability.sort_values(ascending=False).plot(kind='bar', color='purple')
    plt.title('Delay Variability by Destination (Std Dev)')
    plt.ylabel('Delay Standard Deviation')
    plt.xticks(rotation=45)

    plt.tight_layout()
    plt.savefig('route_destination_analysis.png', dpi=300, bbox_inches='tight')
    plt.show()

def operational_efficiency_analysis(df):
    """Comprehensive operational efficiency analysis"""
    print("\n" + "="*50)
    print("OPERATIONAL EFFICIENCY ANALYSIS")
    print("="*50)

    plt.figure(figsize=(20, 12))

    # 1. Delay causes breakdown
    plt.subplot(2, 4, 1)
    delay_types = ['Delay Carrier (Minutes)', 'Delay Weather (Minutes)',
                   'Delay National Aviation System (Minutes)', 'Delay Security (Minutes)',
                   'Delay Late Aircraft Arrival (Minutes)']
    delay_totals = df[delay_types].sum()
    delay_totals.plot(kind='pie', autopct='%1.1f%%')
    plt.title('Total Delay Minutes by Cause')
    plt.ylabel('')

    # 2. Monthly delay trends
    plt.subplot(2, 4, 2)
    monthly_delays = df.groupby('Month')['Departure delay (Minutes)'].mean()
    monthly_delays.plot(kind='line', marker='o', color='red')
    plt.title('Average Monthly Delay Trends')
    plt.xlabel('Month')
    plt.ylabel('Average Delay (Minutes)')
    plt.grid(True)

    # 3. Taxi time efficiency
    plt.subplot(2, 4, 3)
    hourly_taxi = df.groupby('Scheduled_Hour')['Taxi-Out time (Minutes)'].mean()
    hourly_taxi.plot(kind='bar', color='orange')
    plt.title('Average Taxi-Out Time by Hour')
    plt.xlabel('Hour of Day')
    plt.ylabel('Taxi-Out Time (Minutes)')

    # 4. Flight punctuality distribution
    plt.subplot(2, 4, 4)
    punctuality_bins = [-np.inf, -15, 0, 15, 30, np.inf]
    punctuality_labels = ['Early (>15min)', 'Early (0-15min)', 'On-time', 'Late (0-15min)', 'Late (>15min)']
    df['Punctuality_Category'] = pd.cut(df['Departure delay (Minutes)'], bins=punctuality_bins, labels=punctuality_labels)
    punctuality_dist = df['Punctuality_Category'].value_counts()
    punctuality_dist.plot(kind='bar', color='skyblue')
    plt.title('Flight Punctuality Distribution')
    plt.xlabel('Punctuality Category')
    plt.ylabel('Number of Flights')
    plt.xticks(rotation=45)

    # 5. Efficiency trends over time
    plt.subplot(2, 4, 5)
    yearly_efficiency = df.groupby('Year')['Schedule_Adherence'].mean()
    yearly_efficiency.plot(kind='line', marker='o', color='green')
    plt.title('Schedule Adherence Trends Over Time')
    plt.xlabel('Year')
    plt.ylabel('Schedule Adherence (%)')
    plt.grid(True)

    # 6. Peak hour operations
    plt.subplot(2, 4, 6)
    hourly_operations = df.groupby('Scheduled_Hour').agg({
        'Flight Number': 'count',
        'Departure delay (Minutes)': 'mean'
    })
    ax = hourly_operations['Flight Number'].plot(kind='bar', color='lightblue', alpha=0.7)
    ax2 = ax.twinx()
    hourly_operations['Departure delay (Minutes)'].plot(kind='line', marker='o', color='red', ax=ax2)
    plt.title('Hourly Operations vs Delay')
    ax.set_xlabel('Hour of Day')
    ax.set_ylabel('Number of Flights', color='blue')
    ax2.set_ylabel('Average Delay (Minutes)', color='red')

    # 7. Delay correlation matrix
    plt.subplot(2, 4, 7)
    delay_corr = df[delay_types + ['Departure delay (Minutes)']].corr()
    sns.heatmap(delay_corr, annot=True, cmap='coolwarm', center=0, ax=plt.gca())
    plt.title('Delay Types Correlation Matrix')
    plt.xticks(rotation=45)
    plt.yticks(rotation=0)

    # 8. Aircraft utilization efficiency
    plt.subplot(2, 4, 8)
    aircraft_util = df.groupby('Tail Number').agg({
        'Flight Number': 'count',
        'Departure delay (Minutes)': 'mean'
    }).reset_index()
    aircraft_util = aircraft_util[aircraft_util['Flight Number'] >= 50]  # Filter for aircraft with significant data
    plt.scatter(aircraft_util['Flight Number'], aircraft_util['Departure delay (Minutes)'], alpha=0.6)
    plt.xlabel('Number of Flights per Aircraft')
    plt.ylabel('Average Delay per Aircraft (Minutes)')
    plt.title('Aircraft Utilization vs Performance')

    plt.tight_layout()
    plt.savefig('operational_efficiency_analysis.png', dpi=300, bbox_inches='tight')
    plt.show()

def main():
    """Main analysis function"""
    print("Starting Comprehensive EDA for IAD Flight Data")
    print("=" * 60)

    # Load and preprocess data
    df = load_and_preprocess_data()

    print(f"\nDataset loaded: {len(df):,} flights from {df['Date (MM/DD/YYYY)'].min().date()} to {df['Date (MM/DD/YYYY)'].max().date()}")

    # Run all analyses
    temporal_analysis(df)
    carrier_analysis(df)
    route_and_destination_analysis(df)
    operational_efficiency_analysis(df)

    print("\n" + "="*60)
    print("COMPREHENSIVE EDA COMPLETED")
    print("Generated visualizations:")
    print("- temporal_analysis.png")
    print("- carrier_analysis.png")
    print("- route_destination_analysis.png")
    print("- operational_efficiency_analysis.png")
    print("="*60)

if __name__ == "__main__":
    main()