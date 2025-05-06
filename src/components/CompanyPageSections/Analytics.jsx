import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../constants';
import { Line, Bar } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CompanyAnalyticsPage = () => {
    const { companyInfo } = useOutletContext();
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
    const [endDate, setEndDate] = useState(new Date());
    const [interval, setInterval] = useState('day');
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [refreshInterval, setRefreshInterval] = useState(60); // in seconds

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}/companies/${companyInfo.id}/analytics`,
                {
                    params: {
                        startDate: startDate.toISOString(),
                        endDate: endDate.toISOString(),
                        interval
                    },
                    withCredentials: true
                }
            );
            setAnalyticsData(response.data.analytics);
            console.log(response.data)
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch analytics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (companyInfo?.id) {
            fetchAnalytics();
        }
    }, [companyInfo?.id, startDate, endDate, interval]);

    useEffect(() => {
        let intervalId;
        if (autoRefresh) {
            intervalId = setInterval(() => {
                fetchAnalytics();
            }, refreshInterval * 1000);
        }
        return () => clearInterval(intervalId);
    }, [autoRefresh, refreshInterval]);

    const handleRefresh = () => {
        fetchAnalytics();
    };

    if (loading && !analyticsData) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center p-4">
                {error}
                <button 
                    onClick={handleRefresh}
                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    precision: 0
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: ${context.parsed.y}`;
                    }
                }
            },
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Daily Statistics',
                font: {
                    size: 16
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };

    const allDates = [
        ...new Set([
          ...(analyticsData?.visitors?.map(item => item.date) || []),
          ...(analyticsData?.followers?.map(item => item.date) || []),
        ]),
      ].sort(); // Sort dates to ensure chronological order
      
      const combinedChartData = {
        labels: allDates,
        datasets: [
          {
            type: 'bar',
            label: 'Followers',
            data: allDates.map(date => {
              const follower = analyticsData?.followers?.find(item => item.date === date);
              return follower ? follower.count : 0;
            }),
            borderColor: 'rgb(153, 102, 255)',
            backgroundColor: 'rgba(153, 102, 255, 0.1)',
            tension: 0.1,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6,
            yAxisID: 'y',
          },
          {
            type: 'bar',
            label: 'Visitors',
            data: allDates.map(date => {
              const visitor = analyticsData?.visitors?.find(item => item.date === date);
              return visitor ? visitor.count : 0;
            }),
            backgroundColor: 'rgba(75, 192, 192, 0.7)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1,
            yAxisID: 'y',
          },
        ],
      };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            

            {/* Controls */}
            <div className="flex flex-wrap gap-4 mb-6 items-center">
                <div className="flex items-center gap-2">
                    <DatePicker
                        selected={startDate}
                        onChange={date => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        className="p-2 border rounded w-40"
                    />
                    <span>to</span>
                    <DatePicker
                        selected={endDate}
                        onChange={date => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        className="p-2 border rounded w-40"
                    />
                </div>
                <select
                    value={interval}
                    onChange={(e) => setInterval(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="day">Daily</option>
                    <option value="week">Weekly</option>
                    <option value="month">Monthly</option>
                </select>
                
                <div className="flex items-center gap-2 ml-auto">
                    {autoRefresh && (
                        <select
                            value={refreshInterval}
                            onChange={(e) => setRefreshInterval(Number(e.target.value))}
                            className="p-2 border rounded"
                        >
                            <option value="30">30 seconds</option>
                            <option value="60">1 minute</option>
                            <option value="300">5 minutes</option>
                            <option value="900">15 minutes</option>
                        </select>
                    )}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-blue-800">Total Visitors</h3>
                            <div className="text-3xl font-bold mb-2 text-blue-900">
                                {analyticsData?.summary.totalVisitors?.toLocaleString() || 0}
                            </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            analyticsData?.summary.visitorsTrend >= 0 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                        }`}>
                            {analyticsData?.summary.visitorsTrend >= 0 ? '↑' : '↓'} {Math.abs(analyticsData?.summary.visitorsTrend || 0)}%
                        </div>
                    </div>
                    <div className="text-sm text-gray-600">
                        vs previous period
                    </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-purple-800">Total Followers</h3>
                            <div className="text-3xl font-bold mb-2 text-purple-900">
                                {analyticsData?.summary.totalFollowers?.toLocaleString() || 0}
                            </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            analyticsData?.summary.followersTrend >= 0 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                        }`}>
                            {analyticsData?.summary.followersTrend >= 0 ? '↑' : '↓'} {Math.abs(analyticsData?.summary.followersTrend || 0)}%
                        </div>
                    </div>
                    <div className="text-sm text-gray-600">
                        vs previous period
                    </div>
                </div>
            </div>

            {/* Combined Chart */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <h3 className="text-lg font-semibold mb-4">Visitors & Followers Trend</h3>
                <div className="h-80">
                    <Line 
                        data={combinedChartData} 
                        options={{
                            ...chartOptions,
                            plugins: {
                                ...chartOptions.plugins,
                                title: {
                                    ...chartOptions.plugins.title,
                                    text: `${interval.charAt(0).toUpperCase() + interval.slice(1)} Trends`
                                }
                            }
                        }} 
                    />
                </div>
            </div>

            {/* Individual Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Visitor Statistics</h3>
                    <div className="h-64">
                        <Line 
                            data={{
                                labels: analyticsData?.visitors.map(item => item.date) || [],
                                datasets: [{
                                    label: 'Visitors',
                                    data: analyticsData?.visitors.map(item => item.count) || [],
                                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                                    borderColor: 'rgb(75, 192, 192)',
                                    borderWidth: 1
                                }]
                            }} 
                            options={chartOptions}
                        />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Follower Statistics</h3>
                    <div className="h-64">
                        <Line 
                            data={{
                                labels: analyticsData?.followers.map(item => item.date) || [],
                                datasets: [{
                                    label: 'Followers',
                                    data: analyticsData?.followers.map(item => item.count) || [],
                                    borderColor: 'rgb(153, 102, 255)',
                                    backgroundColor: 'rgba(153, 102, 255, 0.1)',
                                    tension: 0.1,
                                    fill: true
                                }]
                            }} 
                            options={chartOptions}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyAnalyticsPage;