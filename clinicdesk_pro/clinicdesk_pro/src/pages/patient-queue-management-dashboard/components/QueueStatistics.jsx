import React from "react";
import { Users, Clock, UserCheck, CheckCircle } from "lucide-react";
import Icon from '../../../components/AppIcon';


export default function QueueStatistics({ queueStats, isPreview = false }) {
  const stats = [
    {
      title: "Total in Queue",
      value: queueStats?.total || 0,
      icon: Users,
      color: "blue",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      iconColor: "text-blue-500"
    },
    {
      title: "Waiting",
      value: queueStats?.waiting || 0,
      icon: Clock,
      color: "yellow",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      iconColor: "text-yellow-500"
    },
    {
      title: "With Doctor",
      value: queueStats?.with_doctor || 0,
      icon: UserCheck,
      color: "indigo",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
      iconColor: "text-indigo-500"
    },
    {
      title: "Completed",
      value: queueStats?.completed || 0,
      icon: CheckCircle,
      color: "green",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      iconColor: "text-green-500"
    }
  ];

  return (
    <div className="lg:col-span-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Queue Statistics</h2>
        {isPreview && (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
            Preview
          </span>
        )}
      </div>
      {stats?.map((stat) => {
        const Icon = stat?.icon;
        return (
          <div key={stat?.title} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stat?.bgColor} mr-3`}>
                <Icon className={`w-5 h-5 ${stat?.iconColor}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat?.title}</p>
                <p className={`text-2xl font-bold ${stat?.textColor}`}>
                  {stat?.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
      {/* Additional Queue Info */}
      {!isPreview && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Today's Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Average Wait Time</span>
              <span className="text-gray-900">
                {queueStats?.total > 0 ? '15 min' : '--'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Queue Started</span>
              <span className="text-gray-900">
                {new Date()?.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}