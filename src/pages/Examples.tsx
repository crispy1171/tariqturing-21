
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';

const examples = [
  {
    id: 'binary-increment',
    name: 'Binary Incrementer',
    description: 'Adds 1 to a binary number represented on the tape.',
    difficulty: 'Beginner',
    preview: `q0, 0 -> q0, 0, R
q0, 1 -> q0, 1, R
q0, _ -> q1, _, L
q1, 0 -> q2, 1, N
q1, 1 -> q1, 0, L
q1, _ -> q2, 1, N
q2, _, _, N # Halt`,
    initialTape: '0001',
  },
  {
    id: 'palindrome',
    name: 'Palindrome Checker',
    description: 'Determines if the input string is a palindrome (reads the same forwards and backwards).',
    difficulty: 'Intermediate',
    preview: `# Start by marking first symbol and going to the end
q0, a -> q1, X, R
q0, b -> q2, X, R
q0, X -> q5, X, R
q0, _ -> q5, _, R # Accept if empty`,
    initialTape: 'abcba',
  },
  {
    id: 'copy',
    name: 'String Duplicator',
    description: 'Creates a copy of the input string, separated by a blank.',
    difficulty: 'Intermediate',
    preview: `# Mark first symbol and start copying process
q0, 0 -> q1, X, R
q0, 1 -> q2, X, R
q0, X -> q6, X, R
q0, _ -> q6, _, R`,
    initialTape: '1010',
  },
  {
    id: 'addition',
    name: 'Binary Addition',
    description: 'Adds two binary numbers separated by a special symbol.',
    difficulty: 'Advanced',
    preview: `# Complex state transitions for binary addition
q0, 0 -> q0, 0, R
q0, 1 -> q0, 1, R
q0, + -> q1, +, R`,
    initialTape: '1101+1011',
  },
  {
    id: 'subtraction',
    name: 'Binary Subtraction',
    description: 'Subtracts the second binary number from the first (assumes result is positive).',
    difficulty: 'Advanced',
    preview: `# Complex state transitions for binary subtraction
q0, 0 -> q0, 0, R
q0, 1 -> q0, 1, R
q0, - -> q1, -, R`,
    initialTape: '1101-0011',
  },
  {
    id: 'multiplication',
    name: 'Unary Multiplication',
    description: 'Multiplies two unary numbers (represented as sequences of 1s).',
    difficulty: 'Expert',
    preview: `# Very complex state machine
# This example is abbreviated for display
q0, 1 -> q1, X, R
q0, * -> q7, _, R`,
    initialTape: '111*11',
  },
];

const Examples = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="w-full py-4 px-6 flex justify-between items-center border-b">
        <Link to="/" className="text-xl font-bold text-primary">TuringTales</Link>
        <div className="flex gap-4">
          <Link to="/simulator" className="text-sm text-gray-600 hover:text-primary">Simulator</Link>
          <Link to="/tutorial" className="text-sm text-gray-600 hover:text-primary">Tutorial</Link>
          <Link to="/examples" className="text-sm font-medium text-primary">Examples</Link>
        </div>
      </nav>
      
      <div className="flex-1 p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-2">Example Turing Machines</h1>
        <p className="text-gray-600 mb-6">Explore pre-built examples to understand common algorithms</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examples.map((example) => (
            <Card key={example.id} className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>{example.name}</span>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {example.difficulty}
                  </span>
                </CardTitle>
                <CardDescription>{example.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1">
                  <div className="font-mono text-xs bg-gray-50 p-2 rounded h-24 overflow-hidden">
                    {example.preview}
                  </div>
                  <div className="mt-2 text-sm">
                    <strong>Initial tape:</strong> <code className="bg-gray-100 px-1 rounded">{example.initialTape}</code>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Link to={`/simulator?example=${example.id}`}>
                    <Button className="w-full">
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Load in Simulator
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Examples;
