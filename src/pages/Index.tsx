
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import TuringAnimation from "@/components/landing/TuringAnimation";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="w-full py-4 px-6 flex justify-between items-center border-b">
        <h1 className="text-xl font-bold text-primary">TuringTales</h1>
        <div className="flex gap-4">
          <Link to="/simulator" className="text-sm text-gray-600 hover:text-primary">Simulator</Link>
          <Link to="/tutorial" className="text-sm text-gray-600 hover:text-primary">Tutorial</Link>
          <Link to="/examples" className="text-sm text-gray-600 hover:text-primary">Examples</Link>
        </div>
      </nav>
      
      {/* Hero Section */}
      <div className="flex-1 flex flex-col md:flex-row">
        <div className="flex-1 flex flex-col justify-center px-6 md:px-12 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Learn Turing Machines Visually</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-md">
            Explore the foundations of computational theory through interactive animations 
            of Turing machines — the mathematical models that define what computers can solve.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/tutorial">
              <Button className="w-full sm:w-auto" variant="default">
                Quick Tutorial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/simulator">
              <Button className="w-full sm:w-auto" variant="outline">
                Start Simulating
                <Play className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-lg aspect-video bg-gray-50 rounded-lg shadow-sm border overflow-hidden">
            <TuringAnimation />
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-gray-50 py-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium mb-2">Interactive Visualization</h3>
              <p className="text-gray-600">
                Watch the Turing machine in action with dynamic animations of tape movements and state transitions.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium mb-2">Step-by-Step Execution</h3>
              <p className="text-gray-600">
                Control the execution speed or step through the computation one move at a time to understand each transition.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium mb-2">Preloaded Examples</h3>
              <p className="text-gray-600">
                Learn from ready-to-run examples like binary incrementers, palindrome checkers, and basic arithmetic.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-6 px-6 border-t text-center text-sm text-gray-600">
        <p>© 2025 TuringTales — An Educational Visualization Tool</p>
      </footer>
    </div>
  );
};

export default Index;
