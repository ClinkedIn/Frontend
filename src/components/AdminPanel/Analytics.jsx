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



import { useState, useEffect } from 'react';
import { 
  LineChart, BarChart, PieChart, Pie, Line, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Activity, Users, UserPlus, FileText, Briefcase, MessageSquare, 
  UserCheck, Clock, Zap, PieChart as PieChartIcon } from 'lucide-react';

export default function AdminDashboard() {
  // Sample data - in a real application, this would come from your API
  const [analyticsData, setAnalyticsData] = useState({
    totalUsers: 35428,
    activeUsers: 12853,
    newSignups: 246,
    postsCreated: 4587,
    activeCompanies: 578,
    avgJobsPerCompany: 3.7,
    activeUsersNow: 1243,
    messagesPerMin: 354,
    newConnectionsPerMin: 87,
    subscriptionPlans: [
      { name: 'Free', users: 21450 },
      { name: 'Basic', users: 8764 },
      { name: 'Premium', users: 3987 },
      { name: 'Enterprise', users: 1227 }
    ],
    activityTrend: [
      { name: 'Mon', users: 8245, posts: 3487, messages: 21543 },
      { name: 'Tue', users: 9453, posts: 3752, messages: 23654 },
      { name: 'Wed', users: 10254, posts: 4102, messages: 25784 },
      { name: 'Thu', users: 9876, posts: 3965, messages: 24321 },
      { name: 'Fri', users: 8765, posts: 3621, messages: 22541 },
      { name: 'Sat', users: 7432, posts: 2875, messages: 18432 },
      { name: 'Sun', users: 7984, posts: 3154, messages: 19754 }
    ]
  });

  // For demo purposes - simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalyticsData(prevData => ({
        ...prevData,
        activeUsersNow: prevData.activeUsersNow + Math.floor(Math.random() * 10) - 3,
        messagesPerMin: prevData.messagesPerMin + Math.floor(Math.random() * 15) - 5,
        newConnectionsPerMin: prevData.newConnectionsPerMin + Math.floor(Math.random() * 8) - 3
      }));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            icon={<Users className="text-blue-500" />} 
            title="Total Users" 
            value={analyticsData.totalUsers.toLocaleString()} 
          />
          <MetricCard 
            icon={<UserCheck className="text-green-500" />} 
            title="Active Users" 
            value={analyticsData.activeUsers.toLocaleString()} 
          />
          <MetricCard 
            icon={<UserPlus className="text-purple-500" />} 
            title="New Signups" 
            value={analyticsData.newSignups.toLocaleString()} 
          />
          <MetricCard 
            icon={<FileText className="text-yellow-500" />} 
            title="Posts Created" 
            value={analyticsData.postsCreated.toLocaleString()} 
          />
          <MetricCard 
            icon={<Briefcase className="text-indigo-500" />} 
            title="Active Companies" 
            value={analyticsData.activeCompanies.toLocaleString()} 
          />
          <MetricCard 
            icon={<Briefcase className="text-pink-500" />} 
            title="Avg Jobs Per Company" 
            value={analyticsData.avgJobsPerCompany.toFixed(1)} 
          />
          <MetricCard 
            icon={<Activity className="text-red-500" />} 
            title="Active Users Now" 
            value={analyticsData.activeUsersNow.toLocaleString()}
            highlight={true}
          />
          <MetricCard 
            icon={<Clock className="text-orange-500" />} 
            title="Messages / Min" 
            value={analyticsData.messagesPerMin.toLocaleString()}
            highlight={true}
          />
        </div>

        {/* Real-time Metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            <Zap className="inline-block mr-2" size={20} />
            Real-time Activity
          </h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <h3 className="text-lg font-medium text-blue-700">Active Users Now</h3>
                <p className="text-3xl font-bold text-blue-800">{analyticsData.activeUsersNow.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <h3 className="text-lg font-medium text-green-700">Messages / Minute</h3>
                <p className="text-3xl font-bold text-green-800">{analyticsData.messagesPerMin.toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <h3 className="text-lg font-medium text-purple-700">New Connections / Minute</h3>
                <p className="text-3xl font-bold text-purple-800">{analyticsData.newConnectionsPerMin.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Activity Trend */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Weekly Activity Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.activityTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" name="Active Users" />
                <Line type="monotone" dataKey="posts" stroke="#10b981" name="Posts" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Subscription Distribution */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              <PieChartIcon className="inline-block mr-2" size={20} />
              Users per Subscription Plans
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.subscriptionPlans}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="users"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {analyticsData.subscriptionPlans.map((entry, index) => {
                    const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];
                    return <Pie key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                  })}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString()} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Messages Activity */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            <MessageSquare className="inline-block mr-2" size={20} />
            Messaging Activity
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.activityTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => value.toLocaleString()} />
              <Legend />
              <Bar dataKey="messages" name="Messages" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}

// Component for individual metric cards
function MetricCard({ icon, title, value, highlight = false }) {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${highlight ? 'border-l-4 border-blue-500' : ''}`}>
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-gray-100 mr-4">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}