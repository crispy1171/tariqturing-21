
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const Tutorial = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="w-full py-4 px-6 flex justify-between items-center border-b">
        <Link to="/" className="text-xl font-bold text-primary">Tariq Turing</Link>
        <div className="flex gap-4">
          <Link to="/simulator" className="text-sm text-gray-600 hover:text-primary">Simulator</Link>
          <Link to="/tutorial" className="text-sm font-medium text-primary">Tutorial</Link>
        </div>
      </nav>
      
      <div className="flex-1 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Understanding Turing Machines</h1>
          <p className="text-gray-600 mb-6">A step-by-step guide to computational theory fundamentals</p>
          
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>What is a Turing Machine?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  A Turing machine is a mathematical model of computation that defines an abstract machine which manipulates symbols on a strip of tape according to a table of rules. Despite its simplicity, it can simulate the logic of any computer algorithm.
                </p>
                
                <h3 className="text-lg font-medium mb-2">Components:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Tape:</strong> An infinite sequence of cells, each containing a symbol from a finite alphabet.</li>
                  <li><strong>Head:</strong> A read/write head that can read, write, and move along the tape.</li>
                  <li><strong>States:</strong> The machine exists in exactly one of a finite number of states at any time.</li>
                  <li><strong>Transition Function:</strong> Rules that define what the machine should do based on the current state and the symbol being read.</li>
                </ul>
                
                <h3 className="text-lg font-medium mt-4 mb-2">How It Works:</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>The machine starts in the initial state with the head positioned at a particular cell of the tape.</li>
                  <li>It reads the symbol in the current cell.</li>
                  <li>Based on the current state and the symbol it just read, the machine:
                    <ul className="list-disc pl-5 mt-2">
                      <li>Writes a new symbol in the current cell</li>
                      <li>Moves the head left or right</li>
                      <li>Transitions to a new state</li>
                    </ul>
                  </li>
                  <li>The process repeats until it reaches a halting state (if ever).</li>
                </ol>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Creating a State Table</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  The state table defines the behavior of a Turing machine. Each row specifies what happens when the machine is in a particular state and reads a particular symbol.
                </p>
                
                <h3 className="text-lg font-medium mb-2">{"{"} write: symbol, move: state {"}"}</h3>
                <p className="font-mono bg-gray-100 p-2 rounded mb-4">
                  currentState, readSymbol -&gt; nextState, writeSymbol, moveDirection
                </p>
                
                <h3 className="text-lg font-medium mb-2">Example:</h3>
                <pre className="font-mono bg-gray-100 p-2 rounded">
                  {`# Binary increment example
q0, 0 -> q0, 0, R  # Move right past leading zeros
q0, 1 -> q0, 1, R  # Move right past ones
q0, _ -> q1, _, L  # Reached end, move left to start incrementing
q1, 0 -> q2, 1, N  # Change 0 to 1 and halt
q1, 1 -> q1, 0, L  # Change 1 to 0 and move left (carry)
q1, _ -> q2, 1, N  # If we reach the start, add a new 1 and halt
q2, _, _, N        # Halt state`}
                </pre>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Try It Yourself</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Now that you understand the basics, try creating and running your own Turing machine!
                </p>
                
                <div className="flex justify-between">
                  <Link to="/simulator">
                    <Button>
                      Open Simulator
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
