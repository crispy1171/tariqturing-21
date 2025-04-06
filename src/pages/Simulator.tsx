
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, StepForward, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import TuringMachine from '@/components/simulator/TuringMachine';
import StateGraph from '@/components/simulator/StateGraph';
import { Slider } from '@/components/ui/slider';

// Example presets
const EXAMPLES = {
  binaryIncrement: `# Binary increment
# Initial tape: ...000...
q0, 0 -> q0, 0, R
q0, 1 -> q0, 1, R
q0, _ -> q1, _, L
q1, 0 -> q2, 1, N
q1, 1 -> q1, 0, L
q1, _ -> q2, 1, N
q2, _, _, N # Halt`,

  palindrome: `# Palindrome checker
# Initial tape: abcba
q0, a -> q1, X, R
q0, b -> q2, X, R
q0, X -> q5, X, R
q0, _ -> q5, _, R # Accept if empty
q1, a -> q1, a, R
q1, b -> q1, b, R
q1, X -> q1, X, R
q1, _ -> q3, _, L
q2, a -> q2, a, R
q2, b -> q2, b, R
q2, X -> q2, X, R
q2, _ -> q4, _, L
q3, a -> qr, X, L # Reject if not matching 'a'
q3, X -> q0, X, R # Match found, go back
q4, b -> qr, X, L # Reject if not matching 'b'
q4, X -> q0, X, R # Match found, go back
q5, _ -> qa, _, N # Accept
qa, _, _, N # Accept state
qr, _, _, N # Reject state`
};

// Parse transition rule: "q0, 0 -> q1, 1, R"
const parseRule = (rule: string) => {
  if (rule.trim().startsWith('#') || rule.trim() === '') {
    return null; // Skip comments and empty lines
  }
  
  try {
    const [left, right] = rule.split('->').map(s => s.trim());
    const [state, readSymbol] = left.split(',').map(s => s.trim());
    
    if (!right) {
      // Handle halt state format: "qa, _, _, N"
      const [s, read, write, move] = left.split(',').map(s => s.trim());
      return {
        currentState: s,
        readSymbol: read,
        nextState: s, // Same state (halting)
        writeSymbol: write,
        moveDirection: move
      };
    }
    
    const [nextState, writeSymbol, moveDirection] = right.split(',').map(s => s.trim());
    
    return {
      currentState: state,
      readSymbol,
      nextState,
      writeSymbol,
      moveDirection
    };
  } catch (e) {
    console.error('Error parsing rule:', rule, e);
    return null;
  }
};

const Simulator = () => {
  const [stateTable, setStateTable] = useState(EXAMPLES.binaryIncrement);
  const [tape, setTape] = useState(['0', '0', '0', '0', '0']);
  const [headPosition, setHeadPosition] = useState(0);
  const [currentState, setCurrentState] = useState('q0');
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState([50]); // 1-100 speed
  const [transitions, setTransitions] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Parse the state table
  const parseStateTable = () => {
    setErrorMessage(null);
    const rules: any[] = [];
    const lines = stateTable.split('\n');
    
    lines.forEach((line, index) => {
      const rule = parseRule(line);
      if (rule) {
        rules.push({...rule, lineNumber: index + 1});
      }
    });
    
    return rules;
  };
  
  // Initialize the machine
  const initialize = () => {
    setHeadPosition(0);
    setCurrentState('q0');
    setCurrentStep(0);
    setErrorMessage(null);
    
    // Parse the rules
    const rules = parseStateTable();
    setTransitions(rules);
  };
  
  // Step through the machine
  const step = () => {
    if (!transitions.length) {
      initialize();
      return;
    }
    
    const currentSymbol = tape[headPosition] || '_';
    
    // Find matching transition
    const transition = transitions.find(
      t => t.currentState === currentState && (t.readSymbol === currentSymbol || t.readSymbol === '_')
    );
    
    if (!transition) {
      setErrorMessage(`No transition defined for state '${currentState}' reading symbol '${currentSymbol}'`);
      setIsRunning(false);
      return;
    }
    
    // Update tape
    const newTape = [...tape];
    if (transition.writeSymbol !== '_') {
      newTape[headPosition] = transition.writeSymbol;
      setTape(newTape);
    }
    
    // Update state
    setCurrentState(transition.nextState);
    
    // Move head
    if (transition.moveDirection === 'L') {
      setHeadPosition(Math.max(0, headPosition - 1));
    } else if (transition.moveDirection === 'R') {
      setHeadPosition(headPosition + 1);
      // Extend tape if necessary
      if (headPosition + 1 >= tape.length) {
        setTape([...newTape, '_']);
      }
    }
    
    setCurrentStep(prev => prev + 1);
    
    // Check for halting
    if (transition.moveDirection === 'N') {
      setIsRunning(false);
    }
  };
  
  // Run continuously
  React.useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      step();
    }, 1000 - (speed[0] * 9)); // Map 1-100 to 1000-100ms
    
    return () => clearInterval(interval);
  }, [isRunning, headPosition, currentState, tape, transitions, speed]);
  
  // Load an example
  const loadExample = (example: keyof typeof EXAMPLES) => {
    setStateTable(EXAMPLES[example]);
    setIsRunning(false);
    setTape(['0', '0', '0', '0', '0']);
    initialize();
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="w-full py-4 px-6 flex justify-between items-center border-b">
        <Link to="/" className="text-xl font-bold text-primary">TuringTales</Link>
        <div className="flex gap-4">
          <Link to="/simulator" className="text-sm font-medium text-primary">Simulator</Link>
          <Link to="/tutorial" className="text-sm text-gray-600 hover:text-primary">Tutorial</Link>
          <Link to="/examples" className="text-sm text-gray-600 hover:text-primary">Examples</Link>
        </div>
      </nav>
      
      <div className="flex-1 p-4 md:p-6 flex flex-col">
        <h1 className="text-3xl font-bold mb-6">Turing Machine Simulator</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - State Table */}
          <Card className="col-span-1 row-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>State Table</span>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => loadExample('binaryIncrement')}
                  >
                    Binary +1
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => loadExample('palindrome')}
                  >
                    Palindrome
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={stateTable}
                onChange={(e) => setStateTable(e.target.value)}
                className="font-mono text-sm h-[400px]"
                placeholder="Enter state table rules..."
              />
              
              {errorMessage && (
                <div className="mt-2 text-sm text-red-500 p-2 bg-red-50 rounded">
                  Error: {errorMessage}
                </div>
              )}
              
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-1">Format:</h3>
                <p className="text-xs text-gray-600">
                  currentState, readSymbol -&gt; nextState, writeSymbol, moveDirection
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Example: q0, 0 -&gt; q1, 1, R
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Center and right columns */}
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
            {/* State Graph */}
            <Card className="flex-1">
              <CardHeader className="pb-2">
                <CardTitle>State Graph</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] overflow-hidden">
                <StateGraph 
                  transitions={transitions}
                  currentState={currentState}
                />
              </CardContent>
            </Card>
            
            {/* Tape Visualization */}
            <Card className="flex-1">
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span>Tape</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Speed:</span>
                      <Slider
                        value={speed}
                        onValueChange={setSpeed}
                        className="w-24"
                        min={1}
                        max={100}
                      />
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          initialize();
                          setIsRunning(false);
                        }}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant={isRunning ? "destructive" : "default"}
                        onClick={() => setIsRunning(!isRunning)}
                      >
                        {isRunning ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={step}
                        disabled={isRunning}
                      >
                        <StepForward className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TuringMachine
                  tape={tape}
                  headPosition={headPosition}
                  currentState={currentState}
                />
                
                <div className="mt-4 text-sm">
                  <p><strong>Current State:</strong> {currentState}</p>
                  <p><strong>Steps:</strong> {currentStep}</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Debug Console */}
            <Card className="flex-1">
              <CardHeader className="pb-2">
                <CardTitle>Debug Console</CardTitle>
              </CardHeader>
              <CardContent className="h-[200px] overflow-y-auto font-mono text-xs bg-gray-50 p-2 rounded">
                <div>
                  <span className="text-gray-500"># Machine initialized</span>
                </div>
                <div>
                  <span className="text-gray-500">State: {currentState}, Position: {headPosition}, Read: '{tape[headPosition]}'</span>
                </div>
                {currentStep > 0 && (
                  <div>
                    <span className="text-green-500"># Step {currentStep}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulator;
