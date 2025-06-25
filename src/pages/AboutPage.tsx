import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle, 
  Github, 
  Code, 
  BarChart3, 
  Target, 
  Users, 
  Shield, 
  Zap,
  Star,
  TrendingUp,
  Award,
  Brain,
  Lightbulb,
  Rocket
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export function AboutPage() {
  const steps = [
    {
      number: '01',
      title: 'Connect Your Accounts',
      description: 'Link your GitHub and LeetCode profiles to begin comprehensive analysis',
      features: [
        'Secure GitHub integration',
        'LeetCode profile synchronization',
        'Real-time data fetching',
        'Privacy-first approach'
      ],
      icon: Github,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      number: '02',
      title: 'AI-Powered Analysis',
      description: 'Our advanced algorithms evaluate your coding skills and project portfolio',
      features: [
        'Repository quality assessment',
        'Code complexity metrics',
        'Problem-solving pattern analysis',
        'Language proficiency scoring'
      ],
      icon: Brain,
      color: 'from-purple-500 to-pink-500'
    },
    {
      number: '03',
      title: 'Get Actionable Insights',
      description: 'Receive personalized recommendations to enhance your developer profile',
      features: [
        'Comprehensive skill assessment',
        'Targeted growth recommendations',
        'Resume optimization suggestions',
        'Interview readiness score'
      ],
      icon: Target,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast Analysis',
      description: 'Get comprehensive insights in under 60 seconds with our optimized algorithms.'
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Your data is encrypted and never shared. We only analyze public repositories.'
    },
    {
      icon: BarChart3,
      title: 'Detailed Metrics',
      description: 'Deep dive into 50+ metrics covering code quality, collaboration, and growth.'
    },
    {
      icon: Lightbulb,
      title: 'Smart Recommendations',
      description: 'AI-powered suggestions tailored to your career goals and skill level.'
    },
    {
      icon: Users,
      title: 'Industry Benchmarks',
      description: 'Compare your skills against industry standards and top performers.'
    },
    {
      icon: Rocket,
      title: 'Career Acceleration',
      description: 'Proven strategies to advance your career and land your dream job.'
    }
  ];

  const testimonials = [
    {
      name: 'DK Singh',
      role: 'Senior Software Engineer at Ooogle',
      content: 'ResumeForge helped me identify gaps in my profile that I never noticed. The AI insights were incredibly accurate and actionable.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    {
      name: 'Saransh Banger',
      role: 'Full Stack Developer at Micosoft',
      content: 'The GitHub analysis revealed optimization opportunities that boosted my profile visibility. Got 3 interview calls within a week!',
      rating: 4,
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    {
      name: 'Emily Watson',
      role: 'Data Scientist at Tisla',
      content: 'The LeetCode integration and skill assessment helped me focus my preparation for technical interviews. Landed my dream job!',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    }
  ];

  const stats = [
    { value: '50K+', label: 'Developers Analyzed' },
    { value: '95%', label: 'Success Rate' },
    { value: '2.5x', label: 'Interview Rate Increase' },
    { value: '24hrs', label: 'Average Response Time' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-secondary-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-secondary-800 dark:via-secondary-900 dark:to-secondary-900 py-24 overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-indigo-50/20 to-purple-100/20 animate-pulse">
</div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 dark:text-white mb-6 leading-tight transition-colors duration-300">
              Intelligent Developer
              <span className="text-primary-600 block">Profile Analysis</span>
            </h1>
            <p className="text-xl text-secondary-600 dark:text-secondary-300 mb-8 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
              Harness the power of AI to analyze your GitHub repositories and LeetCode performance. 
              Get personalized insights that transform your developer profile and accelerate your career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" icon={ArrowRight} iconPosition="right">
                Try ResumeForge Free
              </Button>
              <Button variant="outline" size="lg">
                Watch Demo
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">{stat.value}</div>
                  <div className="text-sm text-secondary-600 dark:text-secondary-400 transition-colors duration-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white dark:bg-secondary-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-4 transition-colors duration-300">
              How ResumeForge Works
            </h2>
            <p className="text-xl text-secondary-600 dark:text-secondary-300 max-w-2xl mx-auto transition-colors duration-300">
              Three simple steps to unlock your developer potential and land your dream job
            </p>
          </div>

          <div className="space-y-24">
            {steps.map((step, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12`}>
                <div className="flex-1 space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-xl`}>
                      {step.number}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-secondary-900 dark:text-white transition-colors duration-300">{step.title}</h3>
                      <p className="text-secondary-600 dark:text-secondary-300 transition-colors duration-300">{step.description}</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-3">
                    {step.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-secondary-700 dark:text-secondary-300 transition-colors duration-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex-1 flex justify-center">
                  <div className={`w-80 h-80 rounded-3xl bg-gradient-to-r ${step.color} flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300`}>
                    <step.icon className="w-32 h-32 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary-50 dark:bg-secondary-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-4 transition-colors duration-300">
              Why Choose ResumeForge?
            </h2>
            <p className="text-xl text-secondary-600 dark:text-secondary-300 max-w-2xl mx-auto transition-colors duration-300">
              Advanced features designed to give you a competitive edge in today's job market
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-900 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-200 dark:group-hover:bg-primary-800 transition-colors duration-300">
                  <feature.icon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-3 transition-colors duration-300">{feature.title}</h3>
                <p className="text-secondary-600 dark:text-secondary-300 transition-colors duration-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white dark:bg-secondary-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-4 transition-colors duration-300">
              Success Stories
            </h2>
            <p className="text-xl text-secondary-600 dark:text-secondary-300 transition-colors duration-300">
              Join thousands of developers who have transformed their careers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-secondary-800 p-8 rounded-2xl shadow-lg border border-secondary-200 dark:border-secondary-700 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-secondary-700 dark:text-secondary-300 mb-6 italic transition-colors duration-300">"{testimonial.content}"</p>
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-secondary-900 dark:text-white transition-colors duration-300">{testimonial.name}</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400 transition-colors duration-300">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-secondary-50 dark:bg-secondary-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4 transition-colors duration-300">
              Trusted by Leading Companies
            </h3>
            <p className="text-secondary-600 dark:text-secondary-300 transition-colors duration-300">
              Our users work at top tech companies worldwide
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60 dark:opacity-40">
            {['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Tesla', 'Netflix', 'Spotify'].map((company) => (
              <div key={company} className="text-2xl font-bold text-secondary-600 dark:text-secondary-400 transition-colors duration-300">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Developer Profile?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join over 50,000 developers who have accelerated their careers with ResumeForge
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/signup">
              <Button size="lg" variant="secondary" icon={ArrowRight} iconPosition="right">
                Start Your Free Analysis
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
              Schedule a Demo
            </Button>
          </div>
          <p className="text-primary-200 text-sm mt-6">
            No credit card required • Free forever plan available • GDPR compliant
          </p>
        </div>
      </section>
    </div>
  );
}