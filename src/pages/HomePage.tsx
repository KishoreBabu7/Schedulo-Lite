import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, User, Shield, Globe, X } from 'lucide-react';
import { motion, useAnimation, useInView as framerUseInView } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// SVG Components for Parallax
const WavyBackground = () => (
  <div className="absolute bottom-0 left-0 right-0 h-32 z-0">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
      <path fill="#EEF2FF" fillOpacity="1" d="M0,96L48,96C96,96,192,96,288,117.3C384,139,480,181,576,176C672,171,768,117,864,106.7C960,96,1056,128,1152,128C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
    </svg>
  </div>
);

// Parallax section component
const ParallaxSection = ({ children, bgColor = 'bg-white', className = '' }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <section
      ref={ref}
      className={`relative py-20 ${bgColor} ${className}`}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={controls}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="container mx-auto px-4 relative z-10"
      >
        {children}
      </motion.div>
    </section>
  );
};

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = framerUseInView(ref, { once: false, threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate={controls}
      transition={{ duration: 0.5, delay }}
      className="card hover:border-primary-300 group"
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 p-3 bg-primary-50 rounded-full group-hover:bg-primary-100 transition-colors">
          <Icon className="h-8 w-8 text-primary-500" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-neutral-600">{description}</p>
      </div>
    </motion.div>
  );
};

// Testimonial Component
const Testimonial = ({ quote, author, role, image, delay = 0 }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = framerUseInView(ref, { once: false, threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate={controls}
      transition={{ duration: 0.5, delay }}
      className="card"
    >
      <div className="relative">
        <div className="absolute -top-6 -left-2 text-6xl text-primary-300">"</div>
        <p className="text-neutral-700 mb-4 relative z-10">{quote}</p>
        <div className="flex items-center mt-4">
          <img
            src={image}
            alt={author}
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
          <div>
            <p className="font-semibold">{author}</p>
            <p className="text-sm text-neutral-500">{role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const HomePage = () => {
  // Animation for hero section
  const heroControls = useAnimation();
  const heroRef = useRef(null);
  const heroInView = framerUseInView(heroRef, { once: true });

  useEffect(() => {
    if (heroInView) {
      heroControls.start('visible');
    }
  }, [heroControls, heroInView]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 right-10 w-64 h-64 bg-primary-200 rounded-full filter blur-3xl opacity-40 animate-pulse-slow"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-accent-200 rounded-full filter blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <motion.div 
          ref={heroRef}
          className="container mx-auto px-4 py-12 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate={heroControls}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
            <motion.div 
              className="md:w-1/2 text-center md:text-left"
              variants={itemVariants}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-primary-900">
                Smart Session Booking <span className="text-primary-500">Made Simple</span>
              </h1>
              <p className="text-xl text-neutral-700 mb-8 max-w-lg">
                Effortlessly schedule and manage your appointments with our intuitive platform. No more double bookings or missed opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/register" className="btn btn-primary px-8 py-3">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-outline px-8 py-3">
                  Sign In
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2 mt-8 md:mt-0"
              variants={itemVariants}
            >
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-400 to-accent-400 rounded-lg blur opacity-30 animate-pulse"></div>
                <div className="relative bg-white p-6 rounded-lg shadow-xl overflow-hidden">
                  <div className="text-xl font-semibold mb-4 text-neutral-800">Available Sessions</div>
                  <div className="space-y-3">
                    {[
                      { time: '10:00 AM', status: 'available' },
                      { time: '11:00 AM', status: 'booked' },
                      { time: '12:00 PM', status: 'available' },
                      { time: '1:00 PM', status: 'available' },
                    ].map((slot, index) => (
                      <div 
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          slot.status === 'available' 
                            ? 'bg-success-50 border border-success-200' 
                            : 'bg-error-50 border border-error-200'
                        }`}
                      >
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-neutral-700" />
                          <span>{slot.time}</span>
                        </div>
                        <div className="flex items-center">
                          {slot.status === 'available' ? (
                            <>
                              <CheckCircle className="h-5 w-5 mr-1 text-success-500" />
                              <span className="text-success-700">Available</span>
                            </>
                          ) : (
                            <>
                              <X className="h-5 w-5 mr-1 text-error-500" />
                              <span className="text-error-700">Booked</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-center">
                    <Link to="/dashboard" className="btn btn-primary w-full">
                      Book a Session
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        <WavyBackground />
      </section>

      {/* Features Section */}
      <ParallaxSection id="features" bgColor="bg-white" className="py-24">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Powerful Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-neutral-600 max-w-2xl mx-auto"
          >
            Everything you need to manage your scheduling efficiently
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={Calendar}
            title="Smart Scheduling"
            description="Intelligent time slot management system that prevents double bookings and maximizes your availability."
            delay={0.1}
          />
          <FeatureCard
            icon={User}
            title="User Profiles"
            description="Create your personal profile, view your booking history, and manage all your appointments in one place."
            delay={0.2}
          />
          <FeatureCard
            icon={Clock}
            title="Real-time Updates"
            description="Get instant confirmation when your slot is booked and receive timely reminders before your appointments."
            delay={0.3}
          />
          <FeatureCard
            icon={Shield}
            title="Secure System"
            description="Industry-standard security protocols to keep your data safe and your bookings protected."
            delay={0.4}
          />
          <FeatureCard
            icon={CheckCircle}
            title="Easy Cancellation"
            description="Hassle-free cancellation process with automatic slot availability updates."
            delay={0.5}
          />
          <FeatureCard
            icon={Globe}
            title="Access Anywhere"
            description="Fully responsive design works seamlessly across all your devices - desktop, tablet, or mobile."
            delay={0.6}
          />
        </div>
      </ParallaxSection>

      {/* How It Works Section */}
      <ParallaxSection bgColor="bg-primary-50" className="py-24">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-neutral-600 max-w-2xl mx-auto"
          >
            Start booking sessions in three simple steps
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/4 left-1/4 right-1/4 h-0.5 bg-primary-200"></div>
          
          {/* Steps */}
          {[
            {
              number: 1,
              title: 'Create an Account',
              description: 'Sign up and create your personal profile in just a few clicks.'
            },
            {
              number: 2,
              title: 'Browse Available Slots',
              description: 'View all available time slots and choose the one that works for you.'
            },
            {
              number: 3,
              title: 'Confirm Your Booking',
              description: 'Enter your details, confirm your slot, and receive instant confirmation.'
            }
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center text-2xl font-bold text-primary-500 mb-4 relative z-10">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-neutral-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link to="/register" className="btn btn-primary px-8 py-3">
            Get Started Now
          </Link>
        </motion.div>
      </ParallaxSection>

      {/* Testimonials */}
      <ParallaxSection bgColor="bg-white" className="py-24">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            What Our Users Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-neutral-600 max-w-2xl mx-auto"
          >
            Don't just take our word for it
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Testimonial
            quote="Schedulo Lite transformed our tutoring business. No more scheduling conflicts or missed appointments!"
            author="Sarah Johnson"
            role="Education Consultant"
            image="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=600"
            delay={0.1}
          />
          <Testimonial
            quote="The interface is incredibly intuitive. I've tried many booking systems, but this one tops them all with its simplicity."
            author="Michael Chen"
            role="Freelance Designer"
            image="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600"
            delay={0.2}
          />
          <Testimonial
            quote="I love how I can see all my bookings at a glance. It's saved me countless hours of administrative work."
            author="Emily Rodriguez"
            role="Life Coach"
            image="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600"
            delay={0.3}
          />
        </div>
      </ParallaxSection>

      {/* CTA Section */}
      <ParallaxSection bgColor="bg-primary-900" className="py-20">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4 text-white"
          >
            Ready to Streamline Your Scheduling?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-primary-100 max-w-2xl mx-auto mb-8"
          >
            Join thousands of satisfied users today and take control of your calendar.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link 
              to="/register" 
              className="btn px-8 py-3 bg-white text-primary-600 hover:bg-primary-50"
            >
              Sign Up Now — It's Free
            </Link>
          </motion.div>
        </div>
      </ParallaxSection>
    </div>
  );
};

export default HomePage;