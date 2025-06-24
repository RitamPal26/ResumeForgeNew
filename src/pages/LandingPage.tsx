import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, Zap, Shield, Users, TrendingUp, FileText } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 overflow-hidden">
        <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%232563eb" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="1"%3E%3C/circle%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse`}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6 leading-tight">
              Transform Your Resume
              <span className="text-primary-600 block">Land Your Dream Job</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Leverage AI-powered optimization, professional templates, and expert guidance to create resumes that get you noticed by top employers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" icon={ArrowRight} iconPosition="right">
                Start Optimizing Now
              </Button>
              <Button variant="outline" size="lg">
                Watch Demo
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-8 text-sm text-secondary-500">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Expert-approved templates</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Our comprehensive platform combines cutting-edge AI with proven hiring insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'AI-Powered Optimization',
                description: 'Advanced algorithms analyze your resume and suggest improvements based on industry best practices and ATS requirements.',
              },
              {
                icon: FileText,
                title: 'Professional Templates',
                description: 'Choose from dozens of expertly designed templates that are optimized for different industries and career levels.',
              },
              {
                icon: TrendingUp,
                title: 'Performance Analytics',
                description: 'Track your resume\'s performance with detailed insights and recommendations for continuous improvement.',
              },
              {
                icon: Shield,
                title: 'ATS Compatibility',
                description: 'Ensure your resume passes through Applicant Tracking Systems with our ATS optimization tools.',
              },
              {
                icon: Users,
                title: 'Expert Reviews',
                description: 'Get your resume reviewed by industry professionals and hiring managers for personalized feedback.',
              },
              {
                icon: Star,
                title: 'Real-time Collaboration',
                description: 'Share your resume with mentors, colleagues, or career coaches for instant feedback and suggestions.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border border-secondary-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">{feature.title}</h3>
                <p className="text-secondary-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Trusted by Professionals Worldwide
            </h2>
            <p className="text-xl text-secondary-600">
              Join thousands who have transformed their careers with ResumeForge
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Software Engineer at Google',
                content: 'ResumeForge helped me land my dream job at Google. The AI optimization suggestions were incredibly valuable.',
                rating: 5,
              },
              {
                name: 'Michael Chen',
                role: 'Marketing Director at Tesla',
                content: 'The professional templates and expert feedback transformed my resume completely. Highly recommended!',
                rating: 5,
              },
              {
                name: 'Emily Rodriguez',
                role: 'Product Manager at Apple',
                content: 'Outstanding platform! The ATS optimization feature ensured my resume reached human recruiters.',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-secondary-700 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-secondary-900">{testimonial.name}</p>
                  <p className="text-sm text-secondary-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-secondary-600">
              Choose the plan that fits your career goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Free',
                price: '$0',
                description: 'Perfect for getting started',
                features: [
                  'Basic resume templates',
                  'AI-powered suggestions',
                  'PDF export',
                  'Basic analytics',
                ],
                cta: 'Get Started',
                popular: false,
              },
              {
                name: 'Professional',
                price: '$19',
                description: 'Most popular for job seekers',
                features: [
                  'Premium templates',
                  'Advanced AI optimization',
                  'ATS compatibility check',
                  'Expert review (1x)',
                  'Priority support',
                ],
                cta: 'Start Free Trial',
                popular: true,
              },
              {
                name: 'Enterprise',
                price: '$49',
                description: 'For career professionals',
                features: [
                  'All professional features',
                  'Unlimited expert reviews',
                  'Personal career coach',
                  'LinkedIn optimization',
                  'Interview preparation',
                ],
                cta: 'Contact Sales',
                popular: false,
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                  plan.popular
                    ? 'border-primary-500 shadow-lg'
                    : 'border-secondary-200 hover:border-primary-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-secondary-900 mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-secondary-900">{plan.price}</span>
                    {plan.price !== '$0' && <span className="text-secondary-600">/month</span>}
                  </div>
                  <p className="text-secondary-600">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-secondary-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  className="w-full"
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join over 100,000 professionals who have successfully optimized their resumes with ResumeForge
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" icon={ArrowRight} iconPosition="right">
              Start Your Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}