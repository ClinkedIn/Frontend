import { useState, useEffect } from "react";
import {
  LineChart,
  BarChart,
  PieChart,
  Pie,
  Cell,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Activity,
  Users,
  UserPlus,
  FileText,
  Briefcase,
  MessageSquare,
  UserCheck,
  Clock,
  Zap,
  PieChartIcon,
  Building,
  Briefcase as BriefcaseIcon,
  Shield,
  Monitor,
  Sun,
  Moon,
  Globe,
  Lock,
  BarChart as BarChartIcon,
  GitBranch,
} from "lucide-react";

/**
 * @typedef {Object} UserStats
 * @property {number} totalUsers - Total number of users registered on the platform
 * @property {number} activeUsers - Number of users active in the last 30 days
 * @property {number} premiumUsers - Number of users with premium subscriptions
 * @property {number} averageConnections - Average number of connections per user
 * @property {Array<{_id: string, count: number}>} employmentTypeCounts - Distribution of users by employment type
 * @property {Array<{_id: string, count: number}>} usersByProfilePrivacy - Distribution of users by profile privacy setting
 * @property {Array<{_id: string, count: number}>} usersByDefaultMode - Distribution of users by UI theme preference
 * @property {Array<{_id: string, count: number}>} usersByConnectionRequestPrivacy - Distribution of users by connection request privacy setting
 */

/**
 * @typedef {Object} PostStats
 * @property {number} totalPosts - Total number of posts created on the platform
 * @property {number} totalImpressions - Total number of post impressions
 * @property {Object} averageEngagement - Average engagement metrics per post
 * @property {number} averageEngagement.impressions - Average impressions per post
 * @property {number} averageEngagement.comments - Average comments per post
 * @property {number} averageEngagement.reposts - Average reposts per post
 */

/**
 * @typedef {Object} JobStats
 * @property {number} totalJobs - Total number of jobs posted on the platform
 * @property {number} averageApplications - Average number of applications per job
 * @property {Array<{_id: string, count: number}>} jobsByWorkplaceType - Distribution of jobs by workplace type
 * @property {Array<{_id: string, count: number}>} jobsByType - Distribution of jobs by employment type
 */

/**
 * @typedef {Object} CompanyStats
 * @property {number} totalCompanies - Total number of companies registered on the platform
 * @property {number} activeCompanies - Number of companies active in the last 30 days
 * @property {number} averageFollowers - Average number of followers per company
 * @property {Array<{_id: string, count: number}>} companiesBySize - Distribution of companies by size
 * @property {Array<{_id: string, count: number}>} companiesByIndustry - Distribution of companies by industry
 */

/**
 * @typedef {Object} AnalyticsData
 * @property {UserStats} userStats - Statistics related to platform users
 * @property {PostStats} postStats - Statistics related to posts and content
 * @property {JobStats} jobStats - Statistics related to job listings
 * @property {CompanyStats} companyStats - Statistics related to companies
 */

/**
 * AdminDashboard component for visualizing platform analytics and metrics
 * 
 * This component displays comprehensive analytics about platform usage including:
 * - User statistics (total users, active users, subscription types)
 * - Content engagement metrics (posts, impressions)
 * - Job and company statistics
 * - Various distribution charts for user settings and preferences
 * 
 * The component fetches data from the admin analytics API endpoint and refreshes
 * at regular intervals. It also includes real-time simulation updates for certain metrics.
 * 
 * @returns {JSX.Element} The AdminDashboard component with analytics visualizations
 */
export default function AdminDashboard() {
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} Loading state indicator */
  const [loading, setLoading] = useState(true);
  
  /** @type {[AnalyticsData|null, React.Dispatch<React.SetStateAction<AnalyticsData|null>>]} Analytics data from API */
  const [analyticsData, setAnalyticsData] = useState(null);
  
  /** @type {[string|null, React.Dispatch<React.SetStateAction<string|null>>]} Error message if API request fails */
  const [error, setError] = useState(null);

  /**
   * Fetches analytics data from the API
   * 
   * @async
   * @function fetchAnalytics
   * @returns {Promise<void>}
   */
  useEffect(() => {
    const BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/admin/analytics/overview`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();

        if (result.status === "success") {
          setAnalyticsData(result.data);
        } else {
          throw new Error("API returned unsuccessful status");
        }
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();

    // Refresh data every 5 minutes
    const refreshInterval = setInterval(fetchAnalytics, 5 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  /**
   * Simulates real-time updates to certain metrics
   * 
   * In a production environment, this would be replaced with WebSocket connections
   * or server-sent events for true real-time updates.
   * 
   * @function simulateRealTimeUpdates
   * @returns {void}
   */
  useEffect(() => {
    if (!analyticsData) return;

    const interval = setInterval(() => {
      setAnalyticsData((prevData) => ({
        ...prevData,
        userStats: {
          ...prevData.userStats,
          activeUsers:
            prevData.userStats.activeUsers + Math.floor(Math.random() * 3) - 1,
        },
        postStats: {
          ...prevData.postStats,
          totalImpressions:
            prevData.postStats.totalImpressions + Math.floor(Math.random() * 5),
        },
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [analyticsData]);

  // Loading state
  if (loading && !analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 max-w-xl">
          <h2 className="text-xl font-semibold text-red-700 mb-2">
            Error Loading Data
          </h2>
          <p className="text-red-600">{error}</p>
          <button
            className="mt-4 bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No data available
  if (!analyticsData) {
    return null;
  }

  // Prepare data for charts
  const { userStats, postStats, jobStats, companyStats } = analyticsData;

  /**
   * Data prepared for subscription distribution pie chart
   * @type {Array<{name: string, users: number}>}
   */
  const subscriptionData = [
    { name: "Premium", users: userStats.premiumUsers },
    { name: "Free", users: userStats.totalUsers - userStats.premiumUsers },
  ];

  /**
   * Data prepared for employment type bar chart
   * @type {Array<{name: string, count: number}>}
   */
  const employmentData = userStats.employmentTypeCounts.map((item) => ({
    name: item._id,
    count: item.count,
  }));

  /**
   * Data prepared for workplace type pie chart
   * @type {Array<{name: string, value: number}>}
   */
  const workplaceData = jobStats.jobsByWorkplaceType.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  /**
   * Data prepared for company size distribution
   * @type {Array<{name: string, value: number}>}
   */
  const companySizeData = companyStats.companiesBySize.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  /**
   * Data prepared for profile privacy settings distribution
   * @type {Array<{name: string, value: number}>}
   */
  const privacyData = userStats.usersByProfilePrivacy.map((item) => ({
    name:
      item._id === "public"
        ? "Public"
        : item._id === "connectionsOnly"
        ? "Connections Only"
        : "Private",
    value: item.count,
  }));

  /**
   * Data prepared for UI theme preference distribution
   * @type {Array<{name: string, value: number}>}
   */
  const themePreferenceData = userStats.usersByDefaultMode.map((item) => ({
    name: item._id === "dark" ? "Dark Mode" : "Light Mode",
    value: item.count,
  }));

  /**
   * Data prepared for connection request privacy settings distribution
   * @type {Array<{name: string, value: number}>}
   */
  const connectionPrivacyData = userStats.usersByConnectionRequestPrivacy.map(
    (item) => ({
      name: item._id === "everyone" ? "Anyone" : "Connections Only",
      value: item.count,
    })
  );

  /**
   * Data prepared for job types distribution
   * @type {Array<{name: string, count: number}>}
   */
  const jobTypesData = jobStats.jobsByType.map((item) => ({
    name: item._id,
    count: item.count,
  }));

  /**
   * Data prepared for top 10 company industries
   * @type {Array<{name: string, count: number}>}
   */
  const companyIndustryData = companyStats.companiesByIndustry
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map((item) => ({
      name: item._id,
      count: item.count,
    }));

  /**
   * Color palette for charts
   * @type {string[]}
   */
  const CHART_COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#6366f1",
    "#d946ef",
    "#f97316",
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Platform Analytics
          </h1>
          <p className="text-gray-500 mt-1">
            Comprehensive overview of platform metrics
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Metrics Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Key Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              icon={<Users className="text-blue-500" />}
              title="Total Users"
              value={userStats.totalUsers}
            />
            <MetricCard
              icon={<UserCheck className="text-green-500" />}
              title="Active Users"
              value={userStats.activeUsers}
              highlight={true}
            />
            <MetricCard
              icon={<Shield className="text-purple-500" />}
              title="Premium Users"
              value={userStats.premiumUsers}
            />
            <MetricCard
              icon={<GitBranch className="text-indigo-500" />}
              title="Avg Connections"
              value={userStats.averageConnections}
            />
          </div>
        </div>

        {/* Post & Job Metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Content & Engagement
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              icon={<FileText className="text-yellow-500" />}
              title="Total Posts"
              value={postStats.totalPosts}
            />
            <MetricCard
              icon={<Activity className="text-red-500" />}
              title="Total Impressions"
              value={postStats.totalImpressions}
              highlight={true}
            />
            <MetricCard
              icon={<BriefcaseIcon className="text-pink-500" />}
              title="Total Jobs"
              value={jobStats.totalJobs}
            />
            <MetricCard
              icon={<MessageSquare className="text-orange-500" />}
              title="Avg Job Applications"
              value={jobStats.averageApplications}
            />
          </div>
        </div>

        {/* Company Metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Company Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              icon={<Building className="text-blue-500" />}
              title="Total Companies"
              value={companyStats.totalCompanies}
            />
            <MetricCard
              icon={<Building className="text-green-500" />}
              title="Active Companies"
              value={companyStats.activeCompanies}
              highlight={true}
            />
            <MetricCard
              icon={<Users className="text-purple-500" />}
              title="Avg Followers"
              value={companyStats.averageFollowers}
            />
            <MetricCard
              icon={<Zap className="text-indigo-500" />}
              title="Avg Engagement"
              value={postStats.averageEngagement.impressions.toFixed(1)}
            />
          </div>
        </div>

        {/* User Distribution Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Subscription Distribution */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              <Shield className="inline-block mr-2" size={20} />
              User Subscription Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={subscriptionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="users"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {subscriptionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* UI Theme Preference */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              <Sun className="inline-block mr-2" size={20} />
              <Moon className="inline-block mr-2" size={20} />
              UI Theme Preference
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={themePreferenceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {themePreferenceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.name === "Dark Mode" ? "#1e293b" : "#f8fafc"}
                      stroke={
                        entry.name === "Light Mode" ? "#94a3b8" : undefined
                      }
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Privacy Settings Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Profile Privacy */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              <Lock className="inline-block mr-2" size={20} />
              Profile Privacy Settings
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={privacyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {privacyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Connection Request Privacy */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              <Globe className="inline-block mr-2" size={20} />
              Connection Request Privacy
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={connectionPrivacyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {connectionPrivacyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Job Distribution Charts */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            <Briefcase className="inline-block mr-2" size={20} />
            Job Distribution
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Job Types */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Job Types
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={jobTypesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                  <Bar dataKey="count" name="Jobs" fill="#8b5cf6">
                    {jobTypesData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Workplace Types */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Workplace Types
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={workplaceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {workplaceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Employment and Company Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Employment Types */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              <BarChartIcon className="inline-block mr-2" size={20} />
              Employment Types
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={employmentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Bar dataKey="count" name="Users" fill="#3b82f6">
                  {employmentData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Company Size Distribution */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              <Building className="inline-block mr-2" size={20} />
              Company Size Distribution
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={companySizeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Bar dataKey="value" name="Companies" fill="#10b981">
                  {companySizeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Industries */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            <Building className="inline-block mr-2" size={20} />
            Top Industries
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={companyIndustryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip formatter={(value) => value.toLocaleString()} />
              <Bar dataKey="count" name="Companies" fill="#f59e0b">
                {companyIndustryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Post Engagement */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            <Activity className="inline-block mr-2" size={20} />
            Post Engagement Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-blue-700">
                Average Impressions
              </h3>
              <p className="text-3xl font-bold text-blue-800 mt-2">
                {postStats.averageEngagement.impressions}
              </p>
              <p className="text-sm text-blue-600 mt-1">Per post</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-green-700">
                Average Comments
              </h3>
              <p className="text-3xl font-bold text-green-800 mt-2">
                {postStats.averageEngagement.comments}
              </p>
              <p className="text-sm text-green-600 mt-1">Per post</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-purple-700">
                Average Reposts
              </h3>
              <p className="text-3xl font-bold text-purple-800 mt-2">
                {postStats.averageEngagement.reposts}
              </p>
              <p className="text-sm text-purple-600 mt-1">Per post</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * MetricCard component for displaying individual metric values with icons
 *
 * @component
 * @param {Object} props - Component props
 * @param {JSX.Element} props.icon - The icon element to display
 * @param {string} props.title - The title of the metric
 * @param {number|string} props.value - The value of the metric to display
 * @param {boolean} [props.highlight=false] - Whether to highlight the card with a colored border
 * @returns {JSX.Element} The MetricCard component
 */
function MetricCard({ icon, title, value, highlight = false }) {
  return (
    <div
      className={`bg-white rounded-lg shadow p-6 ${
        highlight ? "border-l-4 border-blue-500" : ""
      }`}
    >
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-gray-100 mr-4">{icon}</div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
