
import React from 'react';

interface MaintenanceCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export const MaintenanceCard: React.FC<MaintenanceCardProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div className="flex items-center mb-3">
        <div className="text-indigo-600 mr-3">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="text-gray-600 text-sm">
        {children}
      </div>
    </div>
  );
};
