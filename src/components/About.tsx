import React from 'react';
import { Activity, Award, Users, Clock } from 'lucide-react';

function About() {
  return (
    <div className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About HealthCare AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Leading the future of healthcare with advanced AI technology and compassionate care
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Users className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">10,000+</div>
            <div className="text-gray-600 dark:text-gray-300">Patients Served</div>
          </div>
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Award className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">50+</div>
            <div className="text-gray-600 dark:text-gray-300">Specialist Doctors</div>
          </div>
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Activity className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">95%</div>
            <div className="text-gray-600 dark:text-gray-300">Success Rate</div>
          </div>
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Clock className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">24/7</div>
            <div className="text-gray-600 dark:text-gray-300">Available Support</div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300">
              To revolutionize healthcare delivery through the integration of artificial intelligence
              and human expertise, ensuring accessible, accurate, and personalized medical care for
              all. We strive to predict and prevent health issues before they become critical,
              empowering patients to take control of their well-being.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h2>
            <p className="text-gray-600 dark:text-gray-300">
              To be the global leader in AI-driven healthcare solutions, creating a future where
              predictive healthcare is the norm, not the exception. We envision a world where
              technology and human care work in perfect harmony to provide the best possible health
              outcomes for every individual.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Why Choose HealthCare AI?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Advanced AI Technology
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI-powered systems provide accurate health predictions and personalized care
                recommendations based on your unique health data.
              </p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Expert Medical Team
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our network of specialized doctors and healthcare professionals ensures you receive
                the highest quality care and attention.
              </p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Comprehensive Care
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                From preventive care to specialized treatments, we offer a full range of healthcare
                services under one roof.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-primary-50 dark:bg-gray-800 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Experience the Future of Healthcare?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of satisfied patients who have chosen HealthCare AI for their medical needs.
          </p>
          <button className="btn-primary">
            Schedule an Appointment
          </button>
        </div>
      </div>
    </div>
  );
}

export default About;