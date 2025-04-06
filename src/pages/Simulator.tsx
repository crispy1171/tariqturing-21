
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, StepForward, RotateCcw, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import TuringMachine from '@/components/simulator/TuringMachine';
import StateGraph from '@/components/simulator/StateGraph';
import { Slider } from '@/components/ui/slider';
import { parseStateTable } from '@/utils/turingMachineParser';

// Default binary increment example
const DEFAULT_EXAMPLE = `# Adds 1 to a binary number
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
    _: {N: done}
`;

const Simulator = () => {
  const [stateTable, setStateTable] = useState(DEFAULT_EXAMPLE);
  const [tape, setTape] = useState<string[]>([]);
  const [headPosition, setHeadPosition] = useState(0);
  const [currentState, setCurrentState] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState([50]); // 1-100 speed
  const [transitions, setTransitions] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [debugLog, setDebugLog] = useState<string[]>(['# Machine initialized']);
  const [isDone, setIsDone] = useState(false);
  
  // Initialize the machine
  const initialize = () => {
    setErrorMessage(null);
    setDebugLog(['# Machine initialized']);
    setCurrentStep(0);
    setIsDone(false);
    
    try {
      // Use the parser utility
      const { transitions: parsedTransitions, initialTape, initialState } = parseStateTable(stateTable);
      
      if (parsedTransitions.length === 0) {
        setErrorMessage('No valid transitions found in the state table');
        return;
      }
      
      setTransitions(parsedTransitions);
      setTape(initialTape);
      setHeadPosition(0);
      setCurrentState(initialState);
      
      addToDebugLog(`Initialized with ${parsedTransitions.length} transitions`);
      addToDebugLog(`Initial state: ${initialState}, Tape: ${initialTape.join('')}`);
    } catch (error) {
      console.error('Error initializing:', error);
      setErrorMessage(`Error parsing state table: ${(error as Error).message}`);
    }
  };
  
  const addToDebugLog = (message: string) => {
    setDebugLog(prev => [...prev, message]);
  };
  
  // Step through the machine
  const step = () => {
    if (!transitions.length) {
      initialize();
      return;
    }
    
    if (isDone) {
      addToDebugLog("Machine already halted. Reset to run again.");
      return;
    }
    
    const currentSymbol = tape[headPosition] || '_';
    
    // Find matching transition
    const transition = transitions.find(
      t => t.currentState === currentState && 
        (t.readSymbol === currentSymbol || 
         (Array.isArray(t.readSymbol) && t.readSymbol.includes(currentSymbol)))
    );
    
    if (!transition) {
      setErrorMessage(`No transition defined for state '${currentState}' reading symbol '${currentSymbol}'`);
      addToDebugLog(`ERROR: No transition for state ${currentState}, symbol ${currentSymbol}`);
      setIsRunning(false);
      return;
    }
    
    // Log the step
    addToDebugLog(`Step ${currentStep + 1}: ${currentState} read ${currentSymbol} -> ${transition.nextState}`);
    
    // Update tape
    const newTape = [...tape];
    if (transition.writeSymbol && transition.writeSymbol !== 'R') {
      newTape[headPosition] = transition.writeSymbol;
      setTape(newTape);
      addToDebugLog(`  Write: ${transition.writeSymbol}`);
    }
    
    // Update state
    setCurrentState(transition.nextState);
    
    // Move head
    if (transition.moveDirection === 'L') {
      setHeadPosition(Math.max(0, headPosition - 1));
      addToDebugLog(`  Move: Left to position ${Math.max(0, headPosition - 1)}`);
    } else if (transition.moveDirection === 'R') {
      setHeadPosition(headPosition + 1);
      addToDebugLog(`  Move: Right to position ${headPosition + 1}`);
      // Extend tape if necessary
      if (headPosition + 1 >= tape.length) {
        setTape([...newTape, '_']);
      }
    } else {
      addToDebugLog(`  Move: None (halt)`);
      setIsDone(true);
    }
    
    setCurrentStep(prev => prev + 1);
    
    // Check for halting
    if (transition.moveDirection === 'N' || transition.nextState === 'done') {
      addToDebugLog(`Machine halted at state ${transition.nextState}`);
      setIsDone(true);
      setIsRunning(false);
    }
  };
  
  // Run continuously
  React.useEffect(() => {
    if (!isRunning || isDone) return;
    
    const interval = setInterval(() => {
      step();
    }, 1000 - (speed[0] * 9)); // Map 1-100 to 1000-100ms
    
    return () => clearInterval(interval);
  }, [isRunning, headPosition, currentState, tape, transitions, speed, isDone]);
  
  // Initialize on first load
  useEffect(() => {
    initialize();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="w-full py-4 px-6 flex justify-between items-center border-b">
        <Link to="/" className="text-xl font-bold text-primary">TuringTales</Link>
        <div className="flex gap-4">
          <Link to="/simulator" className="text-sm font-medium text-primary">Simulator</Link>
          <Link to="/tutorial" className="text-sm text-gray-600 hover:text-primary">Tutorial</Link>
        </div>
      </nav>
      
      <div className="flex-1 p-4 md:p-6 flex flex-col">
        <h1 className="text-3xl font-bold mb-6">Turing Machine Simulator</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - State Table */}
          <Card className="col-span-1 row-span-2">
            <CardHeader className="pb-2">
              <CardTitle>State Table</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={stateTable}
                onChange={(e) => {
                  setStateTable(e.target.value);
                }}
                className="font-mono text-sm h-[400px]"
                placeholder="Enter state table rules..."
              />
              
              {errorMessage && (
                <div className="mt-2 text-sm text-red-500 p-2 bg-red-50 rounded">
                  Error: {errorMessage}
                </div>
              )}
              
              <div className="mt-4 flex flex-col gap-2">
                <Button 
                  onClick={initialize}
                  variant="outline"
                  className="w-full"
                >
                  Parse & Initialize
                </Button>
                
                <div className="bg-gray-50 p-2 rounded text-sm">
                  <h3 className="text-sm font-medium mb-1">Syntax Format:</h3>
                  <p className="text-xs text-gray-600">
                    <strong>Structured:</strong> Uses states, symbols, and transitions with named sections
                  </p>
                </div>
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
                        disabled={isDone}
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
                        disabled={isRunning || isDone}
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
                
                <div className="mt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div className="text-sm">
                    <p><strong>Current State:</strong> {currentState}</p>
                    <p><strong>Steps:</strong> {currentStep}</p>
                  </div>
                  {isDone && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-md">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="font-medium">Computation Complete</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Debug Console */}
            <Card className="flex-1">
              <CardHeader className="pb-2">
                <CardTitle>Debug Console</CardTitle>
              </CardHeader>
              <CardContent className="h-[200px] overflow-y-auto font-mono text-xs bg-gray-50 p-2 rounded">
                {debugLog.map((log, index) => (
                  <div key={index}>
                    {log.startsWith('#') ? (
                      <span className="text-gray-500">{log}</span>
                    ) : log.includes('ERROR') ? (
                      <span className="text-red-500">{log}</span>
                    ) : log.includes('Step') ? (
                      <span className="text-green-500">{log}</span>
                    ) : (
                      <span className="text-gray-700">{log}</span>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulator;
