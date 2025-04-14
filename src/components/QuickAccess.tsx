import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, FileText, Activity, Thermometer, Phone } from 'lucide-react';

const QuickAccess = () => {
  const quickLinks = [
    {
      title: 'Book Appointment',
      description: 'Schedule a consultation with our specialists',
      icon: Calendar,
      path: '/services/consultations',
      color: 'bg-blue-500',
    },
    {
      title: 'Find Doctors',
      description: 'Search for specialists by condition or specialty',
      icon: Users,
      path: '/doctors',
      color: 'bg-green-500',
    },
    {
      title: 'Lab Tests',
      description: 'Book diagnostic tests and health checkups',
      icon: FileText,
      path: '/services/diagnostics',
      color: 'bg-purple-500',
    },
    {
      title: 'Emergency Care',
      description: '24/7 emergency medical assistance',
      icon: Activity,
      path: '/services/emergency',
      color: 'bg-red-500',
    },
    {
      title: 'Health Monitoring',
      description: 'Track your vital signs and health metrics',
      icon: Thermometer,
      path: '/dashboard',
      color: 'bg-orange-500',
    },
    {
      title: 'Contact Us',
      description: 'Get in touch with our healthcare team',
      icon: Phone,
      path: '/contact',
      color: 'bg-teal-500',
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Your Health, Our Priority
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Access quality healthcare services with just a few clicks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quickLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={link.title}
                to={link.path}
                className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-transform hover:-translate-y-1"
              >
                <div className="flex items-start space-x-4">
                  <div className={`${link.color} p-3 rounded-lg`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {link.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {link.description}
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-primary-500">Learn more →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuickAccess;