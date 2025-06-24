import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  X, 
  Star, 
  ArrowRight, 
  Zap, 
  Shield, 
  Users, 
  Crown,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { fadeInUp, scaleIn } from '../components/ui/PageTransition';

interface PricingPlan {
  name: string;
  price: {
    monthly: number;
    yearly: number;
  };
  description: string;
  features: string[];
  limitations?: string[];
  cta: string;
  popular?: boolean;
  icon: React.ComponentType<any>;
  color: string;
}

interface FAQ {
  question: string;
  answer: string;
}

const plans: PricingPlan[] = [
  {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    description: 'Perfect for getting started with basic resume analysis',
    features: [
      'Basic resume templates (3)',
      'AI-powered suggestions',
      'PDF export',
      'Basic analytics dashboard',
      'Email support'
    ],
    limitations: [
      'Limited to 2 analyses per month',
      'Basic GitHub integration only',
      'No LeetCode integration'
    ],
    cta: 'Get Started Free',
    icon: Zap,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Pro',
    price: { monthly: 19, yearly: 15 },
    description: 'Most popular for serious job seekers and developers',
    features: [
      'Premium templates (15+)',
      'Advanced AI optimization',
      'Full GitHub & LeetCode integration',
      'ATS compatibility check',
      'Expert review (1x per month)',
      'Priority support',
      'Advanced analytics',
      'Custom branding',
      'Interview preparation tips'
    ],
    cta: 'Start Free Trial',
    popular: true,
    icon: Crown,
    color: 'from-purple-500 to-pink-500'
  },
  {
    name: 'Enterprise',
    price: { monthly: 49, yearly: 39 },
    description: 'For career professionals and teams',
    features: [
      'All Pro features included',
      'Unlimited expert reviews',
      'Personal career coach',
      'LinkedIn optimization',
      'Interview preparation sessions',
      'Team collaboration tools',
      'Custom integrations',
      'White-label solutions',
      'Dedicated account manager',
      'SLA guarantee'
    ],
    cta: 'Contact Sales',
    icon: Users,
    color: 'from-green-500 to-emerald-500'
  }
];

const faqs: FAQ[] = [
  {
    question: 'How does the free trial work?',
    answer: 'You get full access to Pro features for 14 days, no credit card required. After the trial, you can choose to upgrade or continue with our free plan.'
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period, and you won\'t be charged again.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for Enterprise customers.'
  },
  {
    question: 'Is my data secure and private?',
    answer: 'Absolutely. We use enterprise-grade encryption and never share your personal information. Your resume data is stored securely and you can delete it anytime.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied with our service, contact us for a full refund.'
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer: 'Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades take effect at the next billing cycle.'
  },
  {
    question: 'Do you offer team or bulk discounts?',
    answer: 'Yes, we offer special pricing for teams of 5+ users and educational institutions. Contact our sales team for custom pricing.'
  },
  {
    question: 'What kind of support do you provide?',
    answer: 'Free users get email support, Pro users get priority support, and Enterprise users get dedicated phone support with guaranteed response times.'
  }
];

const comparisonFeatures = [
  {
    category: 'Resume Building',
    features: [
      { name: 'Basic Templates', free: true, pro: true, enterprise: true },
      { name: 'Premium Templates (15+)', free: false, pro: true, enterprise: true },
      { name: 'Custom Branding', free: false, pro: true, enterprise: true },
      { name: 'White-label Solutions', free: false, pro: false, enterprise: true }
    ]
  },
  {
    category: 'AI Analysis',
    features: [
      { name: 'Basic AI Suggestions', free: true, pro: true, enterprise: true },
      { name: 'Advanced AI Optimization', free: false, pro: true, enterprise: true },
      { name: 'ATS Compatibility Check', free: false, pro: true, enterprise: true },
      { name: 'Industry-specific Analysis', free: false, pro: false, enterprise: true }
    ]
  },
  {
    category: 'Integrations',
    features: [
      { name: 'Basic GitHub Integration', free: true, pro: true, enterprise: true },
      { name: 'Full GitHub Analytics', free: false, pro: true, enterprise: true },
      { name: 'LeetCode Integration', free: false, pro: true, enterprise: true },
      { name: 'Custom API Integrations', free: false, pro: false, enterprise: true }
    ]
  },
  {
    category: 'Support & Services',
    features: [
      { name: 'Email Support', free: true, pro: true, enterprise: true },
      { name: 'Priority Support', free: false, pro: true, enterprise: true },
      { name: 'Expert Reviews', free: false, pro: '1/month', enterprise: 'Unlimited' },
      { name: 'Personal Career Coach', free: false, pro: false, enterprise: true }
    ]
  }
];

export function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const getFeatureIcon = (available: boolean | string) => {
    if (available === true) return <Check className="w-4 h-4 text-green-500" />;
    if (available === false) return <X className="w-4 h-4 text-gray-300" />;
    return <span className="text-xs font-medium text-blue-600">{available}</span>;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-secondary-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-secondary-800 dark:via-secondary-900 dark:to-secondary-900 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-indigo-50/20 to-purple-100/20 animate-pulse"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 dark:text-white mb-6 leading-tight">
              Choose the Perfect Plan for Your
              <span className="text-primary-600 block">Career Journey</span>
            </h1>
            <p className="text-xl text-secondary-600 dark:text-secondary-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Powerful resume analytics trusted by 50,000+ professionals worldwide. 
              Start free and upgrade as you grow.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-sm font-medium ${!isYearly ? 'text-secondary-900 dark:text-white' : 'text-secondary-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-secondary-200 dark:bg-secondary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isYearly ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${isYearly ? 'text-secondary-900 dark:text-white' : 'text-secondary-500'}`}>
                Yearly
              </span>
              {isYearly && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Save 20%
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-white dark:bg-secondary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                className={`relative rounded-2xl border-2 p-8 transition-all duration-300 hover:shadow-xl ${
                  plan.popular
                    ? 'border-primary-500 shadow-lg scale-105 bg-white dark:bg-secondary-800'
                    : 'border-secondary-200 dark:border-secondary-700 hover:border-primary-300 bg-white dark:bg-secondary-800'
                }`}
                variants={scaleIn}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1 }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${plan.color} mb-4`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">{plan.name}</h3>
                  <p className="text-secondary-600 dark:text-secondary-300 mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-secondary-900 dark:text-white">
                      ${isYearly ? plan.price.yearly : plan.price.monthly}
                    </span>
                    {plan.price.monthly > 0 && (
                      <span className="text-secondary-600 dark:text-secondary-400">/month</span>
                    )}
                  </div>
                  
                  {isYearly && plan.price.monthly > 0 && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Save ${(plan.price.monthly - plan.price.yearly) * 12}/year
                    </p>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-secondary-700 dark:text-secondary-300">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations?.map((limitation, limitIndex) => (
                    <li key={limitIndex} className="flex items-start space-x-3">
                      <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-secondary-500 dark:text-secondary-400">{limitation}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  className="w-full"
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-20 bg-secondary-50 dark:bg-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
              Compare All Features
            </h2>
            <p className="text-xl text-secondary-600 dark:text-secondary-300">
              See exactly what's included in each plan
            </p>
          </motion.div>

          <div className="bg-white dark:bg-secondary-900 rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary-50 dark:bg-secondary-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-secondary-900 dark:text-white">
                      Features
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-secondary-900 dark:text-white">
                      Free
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-secondary-900 dark:text-white">
                      Pro
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-secondary-900 dark:text-white">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
                  {comparisonFeatures.map((category, categoryIndex) => (
                    <React.Fragment key={category.category}>
                      <tr className="bg-secondary-25 dark:bg-secondary-850">
                        <td colSpan={4} className="px-6 py-3 text-sm font-semibold text-secondary-900 dark:text-white">
                          {category.category}
                        </td>
                      </tr>
                      {category.features.map((feature, featureIndex) => (
                        <tr key={featureIndex} className="hover:bg-secondary-25 dark:hover:bg-secondary-850">
                          <td className="px-6 py-4 text-sm text-secondary-900 dark:text-white">
                            <div className="flex items-center space-x-2">
                              <span>{feature.name}</span>
                              <HelpCircle className="w-4 h-4 text-secondary-400" />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {getFeatureIcon(feature.free)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {getFeatureIcon(feature.pro)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {getFeatureIcon(feature.enterprise)}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-secondary-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-secondary-600 dark:text-secondary-300">
              Everything you need to know about our pricing and features
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="border border-secondary-200 dark:border-secondary-700 rounded-lg overflow-hidden"
                variants={scaleIn}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors"
                >
                  <span className="font-medium text-secondary-900 dark:text-white">{faq.question}</span>
                  {openFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-secondary-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-secondary-500" />
                  )}
                </button>
                {openFAQ === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-secondary-600 dark:text-secondary-300">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-secondary-600 dark:text-secondary-300 mb-4">
              Still have questions? We're here to help.
            </p>
            <Button variant="outline" icon={ArrowRight} iconPosition="right">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 bg-secondary-50 dark:bg-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
              Trusted by Professionals at Leading Companies
            </h3>
            <p className="text-secondary-600 dark:text-secondary-300">
              Join thousands of successful professionals who've advanced their careers
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60 dark:opacity-40">
            {['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Tesla', 'Netflix', 'Spotify'].map((company) => (
              <div key={company} className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">
                {company}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">50K+</div>
              <div className="text-secondary-600 dark:text-secondary-300">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">95%</div>
              <div className="text-secondary-600 dark:text-secondary-300">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">2.5x</div>
              <div className="text-secondary-600 dark:text-secondary-300">Interview Rate Increase</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join over 50,000 professionals who have accelerated their careers with ResumeForge
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" icon={ArrowRight} iconPosition="right">
                Start Your Free Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary-600"
              >
                Schedule a Demo
              </Button>
            </div>
            <p className="text-primary-200 text-sm mt-6">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}