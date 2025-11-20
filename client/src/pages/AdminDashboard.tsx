
import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { BRANCHES } from '../constants';
import { TrendingUp, Users, Car, DollarSign, Loader } from 'lucide-react';

const COLORS = ['#0046FF', '#F59E0B', '#3B82F6', '#EF4444'];

const StatCard = ({ title, value, icon: Icon, trend }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
      </div>
      <div className="p-2 bg-gray-50 rounded-lg">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center text-sm text-blue-600 font-medium">
        <TrendingUp className="w-4 h-4 mr-1" />
        <span>{trend} vs last month</span>
      </div>
    )}
  </div>
);

// Helper Map Icon
const MapIcon: React.FC<any> = (props) => (
   <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" 
      fill="none" stroke="currentColor" strokeWidth="2" 
      strokeLinecap="round" strokeLinejoin="round" 
      {...props}
   >
      <polygon points="3 6 9 3 15 6 21 3 21 21 15 18 9 21 3 18 3 6" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="15" y1="6" x2="15" y2="18" />
   </svg>
);

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader className="w-8 h-8 animate-spin text-blue-600"/></div>;
  }

  // Data transformation for charts
  const dataStatus = stats?.statusBreakdown.map((s: any) => ({
    name: s._id.charAt(0).toUpperCase() + s._id.slice(1),
    value: s.count
  })) || [];

  // Mock Revenue Data (since we don't have time-series in this simple backend yet)
  const dataRevenue = [
    { name: 'Bengaluru', revenue: 400000 },
    { name: 'Mumbai', revenue: 300000 },
    { name: 'Delhi', revenue: 200000 },
    { name: 'Hyderabad', revenue: 150000 },
    { name: 'Chennai', revenue: 120000 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of fleet performance and bookings.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Revenue" value={`₹${stats?.totalRevenue.toLocaleString()}`} icon={DollarSign} trend="+12.5%" />
        <StatCard title="Total Bookings" value={stats?.totalBookings} icon={Users} trend="+4.2%" />
        <StatCard title="Total Fleet" value={stats?.totalCars} icon={Car} />
        <StatCard title="Branches" value={BRANCHES.length} icon={MapIcon} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue by City (Target)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataRevenue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="revenue" fill="#0046FF" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fleet Status */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Fleet Status Breakdown</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataStatus.map((_: any, index: number) => (
  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
))}

                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              {dataStatus.map((entry: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-sm text-gray-600">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity Mock */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
         <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Recent Bookings</h3>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                  <tr>
                     <th className="px-6 py-3">ID</th>
                     <th className="px-6 py-3">User</th>
                     <th className="px-6 py-3">Status</th>
                     <th className="px-6 py-3">Amount</th>
                  </tr>
               </thead>
               <tbody>
                  <tr className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4" colSpan={4}>
                       Check database for live bookings...
                    </td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
