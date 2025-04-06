
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const Tutorial = () => {
  return <div className="min-h-screen flex flex-col">
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
          <h1 className="text-3xl font-bold mb-2">Binary Increment with Turing Machines</h1>
          <p className="text-gray-600 mb-6">Learn how to implement a binary number incrementer using Turing machines</p>
          
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
                  <li><strong>Tape:</strong> An infinite sequence of cells, each containing a symbol (in our binary example: 0, 1, or blank).</li>
                  <li><strong>Head:</strong> A read/write head that can read the current symbol, write a new symbol, and move left or right.</li>
                  <li><strong>States:</strong> The machine exists in exactly one state at any time (in our example: "right", "carry", or "done").</li>
                  <li><strong>Transition Function:</strong> Rules that define what the machine should do based on the current state and the symbol being read.</li>
                </ul>
                
                <h3 className="text-lg font-medium mt-4 mb-2">Binary Increment Operation:</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Start in the "right" state and scan rightward until reaching the end of the number (a blank).</li>
                  <li>Move left one cell to the least significant bit.</li>
                  <li>Enter "carry" state and begin incrementing:
                    <ul className="list-disc pl-5 mt-2">
                      <li>If reading a 0, change it to 1 and finish (enter "done" state)</li>
                      <li>If reading a 1, change it to 0 and move left (continue carrying)</li>
                      <li>If reading a blank (reached the leftmost digit), write a 1 and finish</li>
                    </ul>
                  </li>
                  <li>The machine halts in the "done" state when the increment is complete.</li>
                </ol>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Creating a State Table</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  The state table for our binary incrementer defines what the machine should do in each state when reading each possible symbol (0, 1, or blank).
                </p>
                
                <h3 className="text-lg font-medium mb-2">Format:</h3>
                <p className="font-mono bg-gray-100 p-2 rounded mb-4">
                  Our simulator supports a structured syntax for defining Turing machines.
                </p>
                
                <h3 className="text-lg font-medium mb-2">Example:</h3>
                <pre className="font-mono bg-gray-100 p-2 rounded">
                  {`# Binary increment example
input: "1011"
blank: "_"
start state: right
table:
  # scan to the rightmost digit
  right:
    1: {R: right}
    0: {R: right}
    _: {L: carry}
  
  # then carry the 1
  carry:
    1: {write: 0, L: carry}
    0: {write: 1, L: done}
    _: {write: 1, L: done}
  
  # Done state (halts)
  done:
    1: {N: done}
    0: {N: done}
    _: {N: done}`}
                </pre>

                <h3 className="text-lg font-medium mt-4 mb-2">Explanation:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>input:</strong> The initial tape content ("1011" = decimal 11)</li>
                  <li><strong>blank:</strong> The symbol used for empty cells ("_")</li>
                  <li><strong>start state:</strong> The initial state of the machine ("right")</li>
                  <li><strong>table:</strong> The transition rules for each state and symbol combination:
                    <ul className="list-disc pl-5 mt-2">
                      <li><strong>right state:</strong> Moves right (R) until finding a blank</li>
                      <li><strong>carry state:</strong> Implements the carry logic, converting 0→1 or 1→0 with carry</li>
                      <li><strong>done state:</strong> The halting state where the machine stops</li>
                    </ul>
                  </li>
                </ul>
                
                <p className="mt-4">
                  After execution, our "1011" (decimal 11) becomes "1100" (decimal 12).
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Try It Yourself</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Now that you understand the binary increment Turing machine, try creating and running it in our simulator!
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
    </div>;
};

export default Tutorial;
