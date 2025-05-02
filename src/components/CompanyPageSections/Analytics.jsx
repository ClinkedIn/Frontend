import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../constants';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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

    if (loading) {
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
            </div>
        );
    }

    const chartData = {
        visitors: {
            labels: analyticsData?.visitors.map(item => item.date) || [],
            datasets: [{
                label: 'Visitors',
                data: analyticsData?.visitors.map(item => item.count) || [],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        followers: {
            labels: analyticsData?.followers.map(item => item.date) || [],
            datasets: [{
                label: 'Followers',
                data: analyticsData?.followers.map(item => item.count) || [],
                borderColor: 'rgb(153, 102, 255)',
                tension: 0.1
            }]
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            {/* Controls */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <DatePicker
                        selected={startDate}
                        onChange={date => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        className="p-2 border rounded"
                    />
                    <span>to</span>
                    <DatePicker
                        selected={endDate}
                        onChange={date => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        className="p-2 border rounded"
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
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Visitors</h3>
                    <div className="text-3xl font-bold mb-2">
                        {analyticsData?.summary.totalVisitors}
                    </div>
                    <div className={`text-sm ${analyticsData?.summary.visitorsTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {analyticsData?.summary.visitorsTrend}% from previous period
                    </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Followers</h3>
                    <div className="text-3xl font-bold mb-2">
                        {analyticsData?.summary.totalFollowers}
                    </div>
                    <div className={`text-sm ${analyticsData?.summary.followersTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {analyticsData?.summary.followersTrend}% from previous period
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Visitor Trends</h3>
                    <Line data={chartData.visitors} options={{ responsive: true }} />
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Follower Trends</h3>
                    <Line data={chartData.followers} options={{ responsive: true }} />
                </div>
            </div>
        </div>
    );
};

export default CompanyAnalyticsPage;