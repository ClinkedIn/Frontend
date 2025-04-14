// import React, { useState } from "react";
// import {
//   BarChart,
//   LineChart,
//   PieChart,
//   Calendar,
//   Users,
//   Activity,
//   TrendingUp,
//   Database,
// } from "lucide-react";

// const Analytics = () => {
//   const [activeTab, setActiveTab] = useState("overview");

//   // Sample analytics data
//   const overviewStats = [
//     {
//       title: "Total Users",
//       value: "24,532",
//       change: "+12%",
//       icon: <Users className="text-blue-500" />,
//     },
//     {
//       title: "Active Users",
//       value: "18,201",
//       change: "+8%",
//       icon: <Activity className="text-green-500" />,
//     },
//     {
//       title: "New Signups",
//       value: "1,204",
//       change: "+23%",
//       icon: <TrendingUp className="text-purple-500" />,
//     },
//     {
//       title: "Posts Created",
//       value: "8,392",
//       change: "+15%",
//       icon: <Database className="text-amber-500" />,
//     },
//   ];

//   const engagementData = [
//     { name: "Jan", posts: 4000, connections: 2400, messages: 2400 },
//     { name: "Feb", posts: 3000, connections: 1398, messages: 2210 },
//     { name: "Mar", posts: 2000, connections: 9800, messages: 2290 },
//     { name: "Apr", posts: 2780, connections: 3908, messages: 2000 },
//     { name: "May", posts: 1890, connections: 4800, messages: 2181 },
//     { name: "Jun", posts: 2390, connections: 3800, messages: 2500 },
//   ];

//   const tabs = [
//     {
//       id: "overview",
//       label: "Overview",
//       icon: <BarChart className="mr-2 h-4 w-4" />,
//     },
//     {
//       id: "users",
//       label: "User Analytics",
//       icon: <Users className="mr-2 h-4 w-4" />,
//     },
//     {
//       id: "engagement",
//       label: "Engagement",
//       icon: <Activity className="mr-2 h-4 w-4" />,
//     },
//     {
//       id: "content",
//       label: "Content",
//       icon: <Database className="mr-2 h-4 w-4" />,
//     },
//     {
//       id: "reports",
//       label: "Reports",
//       icon: <LineChart className="mr-2 h-4 w-4" />,
//     },
//   ];

//   return (
//     <div className="bg-gray-50 min-h-screen p-6">
//       <header className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">
//           Analytics Dashboard
//         </h1>
//         <p className="text-gray-500 mt-2">
//           Monitor your platform's performance and user engagement
//         </p>
//       </header>

//       {/* Tabs */}
//       <div className="bg-white rounded-lg shadow mb-6">
//         <div className="flex overflow-x-auto">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`flex items-center px-4 py-3 font-medium border-b-2 whitespace-nowrap ${
//                 activeTab === tab.id
//                   ? "border-blue-500 text-blue-600"
//                   : "border-transparent text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               {tab.icon}
//               {tab.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Overview Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {overviewStats.map((stat, index) => (
//           <div key={index} className="bg-white rounded-lg shadow p-6">
//             <div className="flex justify-between items-start">
//               <div>
//                 <p className="text-gray-500 text-sm">{stat.title}</p>
//                 <p className="text-2xl font-bold mt-1">{stat.value}</p>
//                 <div className="flex items-center mt-2">
//                   <span
//                     className={`text-sm ${
//                       stat.change.startsWith("+")
//                         ? "text-green-500"
//                         : "text-red-500"
//                     }`}
//                   >
//                     {stat.change}
//                   </span>
//                   <span className="text-gray-500 text-sm ml-1">
//                     vs last month
//                   </span>
//                 </div>
//               </div>
//               <div className="p-3 bg-gray-50 rounded-lg">{stat.icon}</div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         {/* User Acquisition Chart */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold">User Acquisition</h2>
//             <select className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm">
//               <option>Last 7 days</option>
//               <option>Last 30 days</option>
//               <option>Last 90 days</option>
//             </select>
//           </div>
//           <div className="h-64 flex items-center justify-center text-gray-400">
//             {/* Placeholder for actual chart component */}
//             <div className="text-center">
//               <BarChart className="mx-auto h-12 w-12 opacity-50" />
//               <p className="mt-2">User acquisition trend visualization</p>
//             </div>
//           </div>
//         </div>

//         {/* Engagement Chart */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold">Engagement Metrics</h2>
//             <select className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm">
//               <option>Last 7 days</option>
//               <option>Last 30 days</option>
//               <option>Last 90 days</option>
//             </select>
//           </div>
//           <div className="h-64 flex items-center justify-center text-gray-400">
//             {/* Placeholder for actual chart component */}
//             <div className="text-center">
//               <LineChart className="mx-auto h-12 w-12 opacity-50" />
//               <p className="mt-2">Engagement metrics visualization</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Additional Metrics */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Active Users by Industry */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-lg font-semibold mb-4">Users by Industry</h2>
//           <div className="h-64 flex items-center justify-center text-gray-400">
//             <div className="text-center">
//               <PieChart className="mx-auto h-12 w-12 opacity-50" />
//               <p className="mt-2">Industry distribution chart</p>
//             </div>
//           </div>
//         </div>

//         {/* Activity Timeline */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-lg font-semibold mb-4">Activity Timeline</h2>
//           <div className="h-64 overflow-auto">
//             <div className="space-y-4">
//               {[1, 2, 3, 4, 5].map((item) => (
//                 <div key={item} className="flex">
//                   <div className="mr-3 flex-shrink-0">
//                     <div className="w-2 h-2 mt-1 rounded-full bg-blue-500"></div>
//                     <div className="w-0.5 h-full ml-0.5 bg-gray-200"></div>
//                   </div>
//                   <div className="pb-4">
//                     <p className="text-sm font-medium">New feature launched</p>
//                     <p className="text-xs text-gray-500 mt-1">
//                       April 1, 2025 · 08:30 AM
//                     </p>
//                     <p className="text-sm text-gray-600 mt-1">
//                       Profile enhancement feature was released to all users
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Real-time Metrics */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-lg font-semibold mb-4">Real-time Activity</h2>
//           <div className="space-y-4">
//             <div>
//               <div className="flex justify-between items-center mb-1">
//                 <span className="text-sm text-gray-600">Active Users Now</span>
//                 <span className="text-sm font-medium">4,256</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div
//                   className="bg-blue-500 h-2 rounded-full"
//                   style={{ width: "70%" }}
//                 ></div>
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between items-center mb-1">
//                 <span className="text-sm text-gray-600">Messages/min</span>
//                 <span className="text-sm font-medium">386</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div
//                   className="bg-green-500 h-2 rounded-full"
//                   style={{ width: "45%" }}
//                 ></div>
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between items-center mb-1">
//                 <span className="text-sm text-gray-600">Posts/min</span>
//                 <span className="text-sm font-medium">124</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div
//                   className="bg-purple-500 h-2 rounded-full"
//                   style={{ width: "30%" }}
//                 ></div>
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between items-center mb-1">
//                 <span className="text-sm text-gray-600">
//                   New Connections/min
//                 </span>
//                 <span className="text-sm font-medium">215</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div
//                   className="bg-amber-500 h-2 rounded-full"
//                   style={{ width: "50%" }}
//                 ></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Analytics;

//************************************** */
// import { useState, useEffect } from "react";
// import {
//   LineChart,
//   BarChart,
//   PieChart,
//   Pie,
//   Line,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   Activity,
//   Users,
//   UserPlus,
//   FileText,
//   Briefcase,
//   MessageSquare,
//   UserCheck,
//   Clock,
//   Zap,
//   PieChart as PieChartIcon,
// } from "lucide-react";

// export default function AdminDashboard() {
//   // Sample data - in a real application, this would come from your API
//   const [analyticsData, setAnalyticsData] = useState({
//     totalUsers: 35428,
//     activeUsers: 12853,
//     newSignups: 246,
//     postsCreated: 4587,
//     activeCompanies: 578,
//     avgJobsPerCompany: 3.7,
//     activeUsersNow: 1243,
//     messagesPerMin: 354,
//     newConnectionsPerMin: 87,
//     subscriptionPlans: [
//       { name: "Free", users: 21450 },
//       { name: "Basic", users: 8764 },
//       { name: "Premium", users: 3987 },
//       { name: "Enterprise", users: 1227 },
//     ],
//     activityTrend: [
//       { name: "Mon", users: 8245, posts: 3487, messages: 21543 },
//       { name: "Tue", users: 9453, posts: 3752, messages: 23654 },
//       { name: "Wed", users: 10254, posts: 4102, messages: 25784 },
//       { name: "Thu", users: 9876, posts: 3965, messages: 24321 },
//       { name: "Fri", users: 8765, posts: 3621, messages: 22541 },
//       { name: "Sat", users: 7432, posts: 2875, messages: 18432 },
//       { name: "Sun", users: 7984, posts: 3154, messages: 19754 },
//     ],
//   });

//   // For demo purposes - simulate real-time updates
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setAnalyticsData((prevData) => ({
//         ...prevData,
//         activeUsersNow:
//           prevData.activeUsersNow + Math.floor(Math.random() * 10) - 3,
//         messagesPerMin:
//           prevData.messagesPerMin + Math.floor(Math.random() * 15) - 5,
//         newConnectionsPerMin:
//           prevData.newConnectionsPerMin + Math.floor(Math.random() * 8) - 3,
//       }));
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       {/* Header */}
//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
//           <h1 className="text-3xl font-bold text-gray-900">
//             Platform Analytics
//           </h1>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
//         {/* Metrics Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <MetricCard
//             icon={<Users className="text-blue-500" />}
//             title="Total Users"
//             value={analyticsData.totalUsers.toLocaleString()}
//           />
//           <MetricCard
//             icon={<UserCheck className="text-green-500" />}
//             title="Active Users"
//             value={analyticsData.activeUsers.toLocaleString()}
//           />
//           <MetricCard
//             icon={<UserPlus className="text-purple-500" />}
//             title="New Signups"
//             value={analyticsData.newSignups.toLocaleString()}
//           />
//           <MetricCard
//             icon={<FileText className="text-yellow-500" />}
//             title="Posts Created"
//             value={analyticsData.postsCreated.toLocaleString()}
//           />
//           <MetricCard
//             icon={<Briefcase className="text-indigo-500" />}
//             title="Active Companies"
//             value={analyticsData.activeCompanies.toLocaleString()}
//           />
//           <MetricCard
//             icon={<Briefcase className="text-pink-500" />}
//             title="Avg Jobs Per Company"
//             value={analyticsData.avgJobsPerCompany.toFixed(1)}
//           />
//           <MetricCard
//             icon={<Activity className="text-red-500" />}
//             title="Active Users Now"
//             value={analyticsData.activeUsersNow.toLocaleString()}
//             highlight={true}
//           />
//           <MetricCard
//             icon={<Clock className="text-orange-500" />}
//             title="Messages / Min"
//             value={analyticsData.messagesPerMin.toLocaleString()}
//             highlight={true}
//           />
//         </div>

//         {/* Real-time Metrics */}
//         <div className="mb-8">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">
//             <Zap className="inline-block mr-2" size={20} />
//             Real-time Activity
//           </h2>
//           <div className="bg-white p-6 rounded-lg shadow">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="bg-blue-50 rounded-lg p-4 text-center">
//                 <h3 className="text-lg font-medium text-blue-700">
//                   Active Users Now
//                 </h3>
//                 <p className="text-3xl font-bold text-blue-800">
//                   {analyticsData.activeUsersNow.toLocaleString()}
//                 </p>
//               </div>
//               <div className="bg-green-50 rounded-lg p-4 text-center">
//                 <h3 className="text-lg font-medium text-green-700">
//                   Messages / Minute
//                 </h3>
//                 <p className="text-3xl font-bold text-green-800">
//                   {analyticsData.messagesPerMin.toLocaleString()}
//                 </p>
//               </div>
//               <div className="bg-purple-50 rounded-lg p-4 text-center">
//                 <h3 className="text-lg font-medium text-purple-700">
//                   New Connections / Minute
//                 </h3>
//                 <p className="text-3xl font-bold text-purple-800">
//                   {analyticsData.newConnectionsPerMin.toLocaleString()}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Charts */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//           {/* Weekly Activity Trend */}
//           <div className="bg-white p-6 rounded-lg shadow">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">
//               Weekly Activity Trend
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={analyticsData.activityTrend}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="users"
//                   stroke="#3b82f6"
//                   name="Active Users"
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="posts"
//                   stroke="#10b981"
//                   name="Posts"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Subscription Distribution */}
//           <div className="bg-white p-6 rounded-lg shadow">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">
//               <PieChartIcon className="inline-block mr-2" size={20} />
//               Users per Subscription Plans
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={analyticsData.subscriptionPlans}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   outerRadius={100}
//                   fill="#8884d8"
//                   dataKey="users"
//                   nameKey="name"
//                   label={({ name, percent }) =>
//                     `${name}: ${(percent * 100).toFixed(0)}%`
//                   }
//                 >
//                   {analyticsData.subscriptionPlans.map((entry, index) => {
//                     const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"];
//                     return (
//                       <Pie
//                         key={`cell-${index}`}
//                         fill={COLORS[index % COLORS.length]}
//                       />
//                     );
//                   })}
//                 </Pie>
//                 <Tooltip formatter={(value) => value.toLocaleString()} />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Messages Activity */}
//         <div className="bg-white p-6 rounded-lg shadow mb-8">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">
//             <MessageSquare className="inline-block mr-2" size={20} />
//             Messaging Activity
//           </h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={analyticsData.activityTrend}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip formatter={(value) => value.toLocaleString()} />
//               <Legend />
//               <Bar dataKey="messages" name="Messages" fill="#8b5cf6" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </main>
//     </div>
//   );
// }

// // Component for individual metric cards
// function MetricCard({ icon, title, value, highlight = false }) {
//   return (
//     <div
//       className={`bg-white rounded-lg shadow p-6 ${
//         highlight ? "border-l-4 border-blue-500" : ""
//       }`}
//     >
//       <div className="flex items-center">
//         <div className="p-3 rounded-full bg-gray-100 mr-4">{icon}</div>
//         <div>
//           <p className="text-sm font-medium text-gray-600">{title}</p>
//           <p className="text-2xl font-semibold text-gray-900">{value}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

//******************************************* */

// import { useState, useEffect } from "react";
// import {
//   LineChart,
//   BarChart,
//   PieChart,
//   Pie,
//   Line,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   Activity,
//   Users,
//   UserPlus,
//   FileText,
//   Briefcase,
//   MessageSquare,
//   UserCheck,
//   Clock,
//   Zap,
//   PieChart as PieChartIcon,
// } from "lucide-react";

// export default function AdminDashboard() {
//   const [analyticsData, setAnalyticsData] = useState({
//     totalUsers: 0,
//     activeUsers: 0,
//     newSignups: 0,
//     postsCreated: 0,
//     activeCompanies: 0,
//     avgJobsPerCompany: 0,
//     activeUsersNow: 0,
//     messagesPerMin: 0,
//     newConnectionsPerMin: 0,
//     subscriptionPlans: [],
//     activityTrend: [],
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Base URL should be defined in your environment variables or config
//   const baseUrl = "http://localhost:3000"; // Replace with your actual base URL

//   // Fetch data from API
//   useEffect(() => {
//     const fetchAnalytics = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`${baseUrl}/admin/analytics/overview`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token-based auth
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//         });

//         if (!response.ok) {
//           throw new Error(`API request failed with status ${response.status}`);
//         }

//         const result = await response.json();

//         if (result.status === "success") {
//           // Transform API data to match the format expected by our component
//           const transformedData = transformApiData(result.data);
//           setAnalyticsData(transformedData);
//         } else {
//           throw new Error("API returned unsuccessful status");
//         }
//       } catch (err) {
//         console.error("Error fetching analytics data:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnalytics();

//     // Set up polling interval (optional)
//     const interval = setInterval(fetchAnalytics, 60000); // Refresh every minute

//     return () => clearInterval(interval);
//   }, [baseUrl]);

//   // Transform API data to match the format needed by our components
//   const transformApiData = (apiData) => {
//     const { userStats, postStats, jobStats, companyStats } = apiData;

//     // Create dummy activity trend data - this would ideally come from the API
//     const activityTrend = [
//       { name: "Mon", users: 0, posts: 0, messages: 0 },
//       { name: "Tue", users: 0, posts: 0, messages: 0 },
//       { name: "Wed", users: 0, posts: 0, messages: 0 },
//       { name: "Thu", users: 0, posts: 0, messages: 0 },
//       { name: "Fri", users: 0, posts: 0, messages: 0 },
//       { name: "Sat", users: 0, posts: 0, messages: 0 },
//       { name: "Sun", users: 0, posts: 0, messages: 0 },
//     ];

//     // Create subscription plan data from premium vs regular users
//     const subscriptionPlans = [
//       { name: "Free", users: userStats.totalUsers - userStats.premiumUsers },
//       { name: "Premium", users: userStats.premiumUsers },
//     ];

//     // Calculate avg jobs per company
//     const avgJobsPerCompany =
//       companyStats.activeCompanies > 0
//         ? (jobStats.activeJobs / companyStats.activeCompanies).toFixed(1)
//         : 0;

//     return {
//       totalUsers: userStats.totalUsers,
//       activeUsers: userStats.activeUsers,
//       newSignups: Math.floor(userStats.totalUsers * 0.02), // assuming 2% are new signups (example)
//       postsCreated: postStats.totalPosts,
//       activeCompanies: companyStats.activeCompanies,
//       avgJobsPerCompany: parseFloat(avgJobsPerCompany),
//       activeUsersNow: Math.floor(userStats.activeUsers * 0.4), // approx 40% of active users online now
//       messagesPerMin: Math.floor(userStats.totalUsers * 0.1), // example metric
//       newConnectionsPerMin: Math.floor(userStats.averageConnections * 0.05), // example metric
//       subscriptionPlans,
//       activityTrend,
//     };
//   };

//   // Simulate real-time updates for certain metrics
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setAnalyticsData((prevData) => ({
//         ...prevData,
//         activeUsersNow:
//           prevData.activeUsersNow + Math.floor(Math.random() * 10) - 3,
//         messagesPerMin:
//           prevData.messagesPerMin + Math.floor(Math.random() * 15) - 5,
//         newConnectionsPerMin:
//           prevData.newConnectionsPerMin + Math.floor(Math.random() * 8) - 3,
//       }));
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-pulse flex flex-col items-center">
//           <div className="h-12 w-12 bg-blue-400 rounded-full mb-4"></div>
//           <div className="text-xl font-medium text-gray-700">
//             Loading dashboard data...
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="bg-red-50 p-6 rounded-lg border border-red-200 max-w-md">
//           <h2 className="text-xl font-bold text-red-700 mb-2">
//             Error Loading Data
//           </h2>
//           <p className="text-red-600">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       {/* Header */}
//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
//           <h1 className="text-3xl font-bold text-gray-900">
//             Platform Analytics
//           </h1>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
//         {/* Metrics Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <MetricCard
//             icon={<Users className="text-blue-500" />}
//             title="Total Users"
//             value={analyticsData.totalUsers.toLocaleString()}
//           />
//           <MetricCard
//             icon={<UserCheck className="text-green-500" />}
//             title="Active Users"
//             value={analyticsData.activeUsers.toLocaleString()}
//           />
//           <MetricCard
//             icon={<UserPlus className="text-purple-500" />}
//             title="New Signups"
//             value={analyticsData.newSignups.toLocaleString()}
//           />
//           <MetricCard
//             icon={<FileText className="text-yellow-500" />}
//             title="Posts Created"
//             value={analyticsData.postsCreated.toLocaleString()}
//           />
//           <MetricCard
//             icon={<Briefcase className="text-indigo-500" />}
//             title="Active Companies"
//             value={analyticsData.activeCompanies.toLocaleString()}
//           />
//           <MetricCard
//             icon={<Briefcase className="text-pink-500" />}
//             title="Avg Jobs Per Company"
//             value={analyticsData.avgJobsPerCompany.toFixed(1)}
//           />
//           <MetricCard
//             icon={<Activity className="text-red-500" />}
//             title="Active Users Now"
//             value={analyticsData.activeUsersNow.toLocaleString()}
//             highlight={true}
//           />
//           <MetricCard
//             icon={<Clock className="text-orange-500" />}
//             title="Messages / Min"
//             value={analyticsData.messagesPerMin.toLocaleString()}
//             highlight={true}
//           />
//         </div>

//         {/* Real-time Metrics */}
//         <div className="mb-8">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">
//             <Zap className="inline-block mr-2" size={20} />
//             Real-time Activity
//           </h2>
//           <div className="bg-white p-6 rounded-lg shadow">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="bg-blue-50 rounded-lg p-4 text-center">
//                 <h3 className="text-lg font-medium text-blue-700">
//                   Active Users Now
//                 </h3>
//                 <p className="text-3xl font-bold text-blue-800">
//                   {analyticsData.activeUsersNow.toLocaleString()}
//                 </p>
//               </div>
//               <div className="bg-green-50 rounded-lg p-4 text-center">
//                 <h3 className="text-lg font-medium text-green-700">
//                   Messages / Minute
//                 </h3>
//                 <p className="text-3xl font-bold text-green-800">
//                   {analyticsData.messagesPerMin.toLocaleString()}
//                 </p>
//               </div>
//               <div className="bg-purple-50 rounded-lg p-4 text-center">
//                 <h3 className="text-lg font-medium text-purple-700">
//                   New Connections / Minute
//                 </h3>
//                 <p className="text-3xl font-bold text-purple-800">
//                   {analyticsData.newConnectionsPerMin.toLocaleString()}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Charts */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//           {/* User Profile Settings Distribution */}
//           <div className="bg-white p-6 rounded-lg shadow">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">
//               User Profile Privacy Settings
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={analyticsData.usersByProfilePrivacy || []}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   outerRadius={100}
//                   fill="#8884d8"
//                   dataKey="count"
//                   nameKey="_id"
//                   label={({ _id, percent }) =>
//                     `${_id}: ${(percent * 100).toFixed(0)}%`
//                   }
//                 >
//                   {(analyticsData.usersByProfilePrivacy || []).map(
//                     (entry, index) => {
//                       const COLORS = [
//                         "#3b82f6",
//                         "#10b981",
//                         "#8b5cf6",
//                         "#f59e0b",
//                       ];
//                       return (
//                         <Pie
//                           key={`cell-${index}`}
//                           fill={COLORS[index % COLORS.length]}
//                         />
//                       );
//                     }
//                   )}
//                 </Pie>
//                 <Tooltip formatter={(value) => value.toLocaleString()} />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Subscription Distribution */}
//           <div className="bg-white p-6 rounded-lg shadow">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">
//               <PieChartIcon className="inline-block mr-2" size={20} />
//               Users by Subscription Type
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={analyticsData.subscriptionPlans}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   outerRadius={100}
//                   fill="#8884d8"
//                   dataKey="users"
//                   nameKey="name"
//                   label={({ name, percent }) =>
//                     `${name}: ${(percent * 100).toFixed(0)}%`
//                   }
//                 >
//                   {analyticsData.subscriptionPlans.map((entry, index) => {
//                     const COLORS = ["#3b82f6", "#10b981"];
//                     return (
//                       <Pie
//                         key={`cell-${index}`}
//                         fill={COLORS[index % COLORS.length]}
//                       />
//                     );
//                   })}
//                 </Pie>
//                 <Tooltip formatter={(value) => value.toLocaleString()} />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Job Distribution */}
//         <div className="bg-white p-6 rounded-lg shadow mb-8">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">
//             <Briefcase className="inline-block mr-2" size={20} />
//             Jobs by Type
//           </h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={analyticsData.jobsByType || []}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="_id" />
//               <YAxis />
//               <Tooltip formatter={(value) => value.toLocaleString()} />
//               <Legend />
//               <Bar dataKey="count" name="Jobs" fill="#8b5cf6" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* User Employment Types */}
//         <div className="bg-white p-6 rounded-lg shadow mb-8">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">
//             <Users className="inline-block mr-2" size={20} />
//             User Employment Types
//           </h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={analyticsData.employmentTypeCounts || []}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="_id" />
//               <YAxis />
//               <Tooltip formatter={(value) => value.toLocaleString()} />
//               <Legend />
//               <Bar dataKey="count" name="Users" fill="#3b82f6" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </main>
//     </div>
//   );
// }

// // Component for individual metric cards
// function MetricCard({ icon, title, value, highlight = false }) {
//   return (
//     <div
//       className={`bg-white rounded-lg shadow p-6 ${
//         highlight ? "border-l-4 border-blue-500" : ""
//       }`}
//     >
//       <div className="flex items-center">
//         <div className="p-3 rounded-full bg-gray-100 mr-4">{icon}</div>
//         <div>
//           <p className="text-sm font-medium text-gray-600">{title}</p>
//           <p className="text-2xl font-semibold text-gray-900">{value}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

//******************************************** */

// import { useState, useEffect } from "react";
// import {
//   LineChart,
//   BarChart,
//   PieChart,
//   Pie,
//   Line,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   Activity,
//   Users,
//   UserPlus,
//   FileText,
//   Briefcase,
//   MessageSquare,
//   UserCheck,
//   Clock,
//   Zap,
//   PieChartIcon,
//   Building,
//   Briefcase as BriefcaseIcon,
//   Shield,
//   Monitor,
// } from "lucide-react";

// export default function AdminDashboard() {
//   const [loading, setLoading] = useState(true);
//   const [analyticsData, setAnalyticsData] = useState(null);
//   const [error, setError] = useState(null);

//   // Fetch data from API
//   useEffect(() => {
//     const baseUrl ="http://localhost:3000"; // Replace with your actual base URL
//       console.log("Base URL:", baseUrl); // Debugging line
//     const fetchAnalytics = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`${baseUrl}/admin/analytics/overview`, {
//           credentials: "include",
//         });

//         if (!response.ok) {
//           throw new Error(`API error: ${response.status}`);
//         }

//         const result = await response.json();

//         if (result.status === "success") {
//           setAnalyticsData(result.data);
//         } else {
//           throw new Error("API returned unsuccessful status");
//         }
//       } catch (err) {
//         console.error("Failed to fetch analytics:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnalytics();

//     // Refresh data every 5 minutes
//     const refreshInterval = setInterval(fetchAnalytics, 5 * 60 * 1000);

//     return () => clearInterval(refreshInterval);
//   }, []);

//   // For real-time simulation - you would replace this with websocket data in production
//   useEffect(() => {
//     if (!analyticsData) return;

//     const interval = setInterval(() => {
//       setAnalyticsData((prevData) => ({
//         ...prevData,
//         userStats: {
//           ...prevData.userStats,
//           activeUsers:
//             prevData.userStats.activeUsers + Math.floor(Math.random() * 3) - 1,
//         },
//         postStats: {
//           ...prevData.postStats,
//           totalImpressions:
//             prevData.postStats.totalImpressions + Math.floor(Math.random() * 5),
//         },
//       }));
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [analyticsData]);

//   // Loading state
//   if (loading && !analyticsData) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading dashboard data...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="bg-red-50 p-6 rounded-lg border border-red-200 max-w-xl">
//           <h2 className="text-xl font-semibold text-red-700 mb-2">
//             Error Loading Data
//           </h2>
//           <p className="text-red-600">{error}</p>
//           <button
//             className="mt-4 bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded"
//             onClick={() => window.location.reload()}
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // No data available
//   if (!analyticsData) {
//     return null;
//   }

//   // Prepare data for charts
//   const { userStats, postStats, jobStats, companyStats } = analyticsData;

//   // Prepare subscription data for pie chart
//   const subscriptionData = [
//     { name: "Premium", users: userStats.premiumUsers },
//     { name: "Free", users: userStats.totalUsers - userStats.premiumUsers },
//   ];

//   // Prepare employment type data for bar chart
//   const employmentData = userStats.employmentTypeCounts.map((item) => ({
//     name: item._id,
//     count: item.count,
//   }));

//   // Prepare workplace type data for pie chart
//   const workplaceData = jobStats.jobsByWorkplaceType.map((item) => ({
//     name: item._id,
//     value: item.count,
//   }));

//   // Prepare company size data for pie chart
//   const companySizeData = companyStats.companiesBySize.map((item) => ({
//     name: item._id,
//     value: item.count,
//   }));

//   // Prepare profile privacy data for pie chart
//   const privacyData = userStats.usersByProfilePrivacy.map((item) => ({
//     name: item._id,
//     value: item.count,
//   }));

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       {/* Header */}
//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
//           <h1 className="text-3xl font-bold text-gray-900">
//             Platform Analytics
//           </h1>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
//         {/* Metrics Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <MetricCard
//             icon={<Users className="text-blue-500" />}
//             title="Total Users"
//             value={userStats.totalUsers}
//           />
//           <MetricCard
//             icon={<UserCheck className="text-green-500" />}
//             title="Active Users"
//             value={userStats.activeUsers}
//             highlight={true}
//           />
//           <MetricCard
//             icon={<Shield className="text-purple-500" />}
//             title="Premium Users"
//             value={userStats.premiumUsers}
//           />
//           <MetricCard
//             icon={<FileText className="text-yellow-500" />}
//             title="Total Posts"
//             value={postStats.totalPosts}
//           />
//           <MetricCard
//             icon={<Activity className="text-indigo-500" />}
//             title="Total Impressions"
//             value={postStats.totalImpressions}
//           />
//           <MetricCard
//             icon={<BriefcaseIcon className="text-pink-500" />}
//             title="Active Jobs"
//             value={jobStats.activeJobs}
//           />
//           <MetricCard
//             icon={<Building className="text-red-500" />}
//             title="Active Companies"
//             value={companyStats.activeCompanies}
//           />
//           <MetricCard
//             icon={<Users className="text-orange-500" />}
//             title="Avg. Connections"
//             value={userStats.averageConnections}
//           />
//         </div>

//         {/* Real-time Metrics */}
//         <div className="mb-8">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">
//             <Zap className="inline-block mr-2" size={20} />
//             Platform Engagement
//           </h2>
//           <div className="bg-white p-6 rounded-lg shadow">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="bg-blue-50 rounded-lg p-4 text-center">
//                 <h3 className="text-lg font-medium text-blue-700">
//                   Active Users
//                 </h3>
//                 <p className="text-3xl font-bold text-blue-800">
//                   {userStats.activeUsers}
//                 </p>
//                 <p className="text-sm text-blue-600 mt-1">
//                   {Math.round(
//                     (userStats.activeUsers / userStats.totalUsers) * 100
//                   )}
//                   % of total
//                 </p>
//               </div>
//               <div className="bg-green-50 rounded-lg p-4 text-center">
//                 <h3 className="text-lg font-medium text-green-700">
//                   Avg. Job Applications
//                 </h3>
//                 <p className="text-3xl font-bold text-green-800">
//                   {jobStats.averageApplications}
//                 </p>
//                 <p className="text-sm text-green-600 mt-1">Per job posting</p>
//               </div>
//               <div className="bg-purple-50 rounded-lg p-4 text-center">
//                 <h3 className="text-lg font-medium text-purple-700">
//                   Avg. Company Followers
//                 </h3>
//                 <p className="text-3xl font-bold text-purple-800">
//                   {companyStats.averageFollowers}
//                 </p>
//                 <p className="text-sm text-purple-600 mt-1">
//                   {companyStats.activeCompanies} active companies
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Charts */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//           {/* Subscription Distribution */}
//           <div className="bg-white p-6 rounded-lg shadow">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">
//               <Shield className="inline-block mr-2" size={20} />
//               User Subscription Distribution
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={subscriptionData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   outerRadius={100}
//                   fill="#8884d8"
//                   dataKey="users"
//                   nameKey="name"
//                   label={({ name, percent }) =>
//                     `${name}: ${(percent * 100).toFixed(0)}%`
//                   }
//                 >
//                   {subscriptionData.map((entry, index) => (
//                     <Pie
//                       key={`cell-${index}`}
//                       fill={index === 0 ? "#8b5cf6" : "#3b82f6"}
//                     />
//                   ))}
//                 </Pie>
//                 <Tooltip formatter={(value) => value.toLocaleString()} />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Profile Privacy Distribution */}
//           <div className="bg-white p-6 rounded-lg shadow">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">
//               <PieChartIcon className="inline-block mr-2" size={20} />
//               User Privacy Settings
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={privacyData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   outerRadius={100}
//                   fill="#8884d8"
//                   dataKey="value"
//                   nameKey="name"
//                   label={({ name, percent }) =>
//                     `${name}: ${(percent * 100).toFixed(0)}%`
//                   }
//                 >
//                   {privacyData.map((entry, index) => {
//                     const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];
//                     return (
//                       <Pie
//                         key={`cell-${index}`}
//                         fill={COLORS[index % COLORS.length]}
//                       />
//                     );
//                   })}
//                 </Pie>
//                 <Tooltip formatter={(value) => value.toLocaleString()} />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Employment Types */}
//         <div className="bg-white p-6 rounded-lg shadow mb-8">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">
//             <Briefcase className="inline-block mr-2" size={20} />
//             Employment Types
//           </h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={employmentData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip formatter={(value) => value.toLocaleString()} />
//               <Legend />
//               <Bar dataKey="count" name="Users" fill="#8b5cf6" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Job Distribution by Workplace Type */}
//         <div className="bg-white p-6 rounded-lg shadow mb-8">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">
//             <Monitor className="inline-block mr-2" size={20} />
//             Jobs by Workplace Type
//           </h2>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <div>
//               <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                   <Pie
//                     data={workplaceData}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     outerRadius={100}
//                     fill="#8884d8"
//                     dataKey="value"
//                     nameKey="name"
//                     label={({ name, percent }) =>
//                       `${name}: ${(percent * 100).toFixed(0)}%`
//                     }
//                   >
//                     {workplaceData.map((entry, index) => {
//                       const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];
//                       return (
//                         <Pie
//                           key={`cell-${index}`}
//                           fill={COLORS[index % COLORS.length]}
//                         />
//                       );
//                     })}
//                   </Pie>
//                   <Tooltip formatter={(value) => value.toLocaleString()} />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//             <div>
//               <div className="grid grid-cols-1 gap-4">
//                 {jobStats.jobsByWorkplaceType.map((type) => (
//                   <div key={type._id} className="bg-gray-50 p-4 rounded-lg">
//                     <h3 className="text-lg font-medium text-gray-800">
//                       {type._id}
//                     </h3>
//                     <div className="flex justify-between items-center mt-2">
//                       <div className="text-2xl font-semibold">{type.count}</div>
//                       <div className="text-sm text-gray-500">
//                         {Math.round((type.count / jobStats.totalJobs) * 100)}%
//                         of total
//                       </div>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
//                       <div
//                         className="bg-blue-600 h-2.5 rounded-full"
//                         style={{
//                           width: `${(type.count / jobStats.totalJobs) * 100}%`,
//                         }}
//                       ></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// // Component for individual metric cards
// function MetricCard({ icon, title, value, highlight = false }) {
//   return (
//     <div
//       className={`bg-white rounded-lg shadow p-6 ${
//         highlight ? "border-l-4 border-blue-500" : ""
//       }`}
//     >
//       <div className="flex items-center">
//         <div className="p-3 rounded-full bg-gray-100 mr-4">{icon}</div>
//         <div>
//           <p className="text-sm font-medium text-gray-600">{title}</p>
//           <p className="text-2xl font-semibold text-gray-900">{value}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

//********************************** */

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

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch data from API
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

  // For real-time simulation - you would replace this with websocket data in production
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

  // Prepare subscription data for pie chart
  const subscriptionData = [
    { name: "Premium", users: userStats.premiumUsers },
    { name: "Free", users: userStats.totalUsers - userStats.premiumUsers },
  ];

  // Prepare employment type data for bar chart
  const employmentData = userStats.employmentTypeCounts.map((item) => ({
    name: item._id,
    count: item.count,
  }));

  // Prepare workplace type data for pie chart
  const workplaceData = jobStats.jobsByWorkplaceType.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  // Prepare company size data for pie chart
  const companySizeData = companyStats.companiesBySize.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  // Prepare profile privacy data for pie chart
  const privacyData = userStats.usersByProfilePrivacy.map((item) => ({
    name:
      item._id === "public"
        ? "Public"
        : item._id === "connectionsOnly"
        ? "Connections Only"
        : "Private",
    value: item.count,
  }));

  // Prepare UI theme preference data for pie chart
  const themePreferenceData = userStats.usersByDefaultMode.map((item) => ({
    name: item._id === "dark" ? "Dark Mode" : "Light Mode",
    value: item.count,
  }));

  // Prepare connection request privacy data for pie chart
  const connectionPrivacyData = userStats.usersByConnectionRequestPrivacy.map(
    (item) => ({
      name: item._id === "everyone" ? "Anyone" : "Connections Only",
      value: item.count,
    })
  );

  // Prepare job types data for bar chart
  const jobTypesData = jobStats.jobsByType.map((item) => ({
    name: item._id,
    count: item.count,
  }));

  // Prepare company industry data for bar chart (top 10)
  const companyIndustryData = companyStats.companiesByIndustry
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map((item) => ({
      name: item._id,
      count: item.count,
    }));

  // Colors for charts
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

// Component for individual metric cards
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
