import React from 'react';
import { 
  Users, 
  CalendarCheck, 
  TrendingUp, 
  Clock 
} from 'lucide-react';

const stats = [
  { name: 'Total Appointments', value: '128', icon: CalendarCheck, change: '+12%', changeType: 'increase' },
  { name: 'Active Clients', value: '1,042', icon: Users, change: '+5%', changeType: 'increase' },
  { name: 'Service Revenue', value: '45,200 сом', icon: TrendingUp, change: '+18%', changeType: 'increase' },
  { name: 'Avg. Duration', value: '45 min', icon: Clock, change: '-2%', changeType: 'decrease' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="text-slate-400 mt-1">Welcome back, here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div key={item.name} className="glass p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <item.icon className="w-6 h-6 text-slate-400 group-hover:text-emerald-400" />
              </div>
              <span className={cn(
                "text-sm font-medium px-2 py-1 rounded-lg",
                item.changeType === 'increase' ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
              )}>
                {item.change}
              </span>
            </div>
            <p className="text-slate-400 text-sm font-medium">{item.name}</p>
            <h3 className="text-2xl font-bold mt-1">{item.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl border border-slate-800">
          <h3 className="text-xl font-bold mb-6">Recent Appointments</h3>
          <div className="space-y-4">
              {[1,2,3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                      <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-slate-300" />
                          </div>
                          <div>
                              <p className="font-semibold">Client Name {i}</p>
                              <p className="text-sm text-slate-400">Haircut • 14:00 Today</p>
                          </div>
                      </div>
                      <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-bold rounded-full border border-amber-500/20">
                          Pending
                      </span>
                  </div>
              ))}
          </div>
        </div>

        <div className="glass p-8 rounded-3xl border border-slate-800 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Growth Analytics</h3>
            <p className="text-slate-400 max-w-xs mb-6">Your business is growing 20% faster than last month. Keep it up!</p>
            <button className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                View Full Report
            </button>
        </div>
      </div>
    </div>
  );
}

// Helper function locally if utils import fails (though it shouldn't)
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
