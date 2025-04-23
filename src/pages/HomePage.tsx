import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Flame, Check, Users, Trophy } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-50 to-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block text-purple-600 p-2 rounded-full bg-purple-100 mb-4">
              <Flame className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Build Tiny Habits,<br />
              <span className="text-purple-600">Achieve Big Results</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              LoopList helps you build consistent micro-habits through visual streaks, social accountability, and satisfying progress tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button as={Link} to="/signup" size="lg" className="px-8">
                Start Your First Loop
              </Button>
              <Button as={Link} to="/discover" variant="outline" size="lg">
                Explore Habits
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How LoopList Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Check className="h-8 w-8 text-green-500" />}
              title="Simple Daily Check-ins"
              description="Tap once to mark your habit complete. No complicated tracking, just consistent action."
            />
            <FeatureCard 
              icon={<Flame className="h-8 w-8 text-orange-500" />}
              title="Visualize Your Streaks"
              description="Watch your streaks grow with heatmaps and counters. Feel the motivation of not breaking the chain."
            />
            <FeatureCard 
              icon={<Users className="h-8 w-8 text-blue-500" />}
              title="Social Accountability"
              description="Share your habits publicly for extra motivation or cheer on others to stay consistent."
            />
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Building Better Habits Together</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <TestimonialCard 
              quote="Since using LoopList, my morning meditation went from sporadic to a 43-day streak. The public accountability makes all the difference!"
              author="Jamie L."
              habit="Meditation"
              streak={43}
            />
            <TestimonialCard 
              quote="I cloned a 'Read 10 pages' habit from another user and now we cheer each other on. I've finished 3 books in a month!"
              author="Chris B."
              habit="Reading"
              streak={28}
            />
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <Trophy className="h-12 w-12 mx-auto mb-6 text-yellow-300" />
          <h2 className="text-3xl font-bold mb-6">Ready to build lasting habits?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands who are using tiny, consistent actions to transform their lives.
          </p>
          <Button 
            as={Link} 
            to="/signup" 
            size="lg" 
            className="bg-white text-purple-600 hover:bg-purple-50"
          >
            Get Started — It's Free
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Flame className="h-6 w-6 text-purple-400 mr-2" />
              <span className="text-xl font-semibold text-white">LoopList</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white">About</a>
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
              <a href="#" className="hover:text-white">Contact</a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            &copy; {new Date().getFullYear()} LoopList. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-lg p-6 text-center">
      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-50 text-purple-600 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

interface TestimonialCardProps {
  quote: string;
  author: string;
  habit: string;
  streak: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, author, habit, streak }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <p className="italic text-gray-700 mb-4">"{quote}"</p>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{author}</p>
          <p className="text-sm text-gray-500">{habit}</p>
        </div>
        <div className="flex items-center bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
          <Flame className="h-4 w-4 mr-1" />
          <span className="font-semibold">{streak} days</span>
        </div>
      </div>
    </div>
  );
};