
// Types for the structured syntax parser
export interface TuringMachineConfig {
  initialState: string;
  blank: string;
  input: string;
  transitions: Map<string, StateTransitions>;
}

export interface StateTransitions {
  [symbol: string]: TransitionRule;
}

export interface TransitionRule {
  write?: string;
  move: 'L' | 'R' | 'N';
  nextState: string;
}

/**
 * Parse the structured syntax format for Turing machines
 */
export const parseStructuredSyntax = (code: string): TuringMachineConfig => {
  const lines = code.split('\n');
  let initialState = 'right'; // Default to 'right' as initial state
  let blank = '_';
  let input = '';
  const transitions = new Map<string, StateTransitions>();
  let currentState = '';

  const processTransition = (line: string, state: string) => {
    // Format: [symbol]: {options}
    // or: symbol: {options}
    const match = line.match(/^\s*(?:\[([^\]]+)\]|([^:]+)):\s*(.*)/);
    if (!match) return;
    
    const symbols = match[1] ? match[1].split(',').map(s => s.trim()) : [match[2].trim()];
    const options = match[3].trim();

    // Parse options like {write: 0, L: done} or {R: right}
    const writeMatch = options.match(/write:\s*([^,}\s]+)/);
    const moveMatch = options.match(/([LRN]):\s*([^,}\s]+)/);

    if (moveMatch) {
      const move = moveMatch[1] as 'L' | 'R' | 'N';
      const nextState = moveMatch[2].trim();
      const write = writeMatch ? writeMatch[1].trim() : undefined;

      if (!transitions.has(state)) {
        transitions.set(state, {});
      }
      
      // Add a transition for each symbol in the list
      for (const symbol of symbols) {
        transitions.get(state)![symbol.trim()] = {
          nextState,
          move,
          write
        };
      }
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip comments and empty lines
    if (line.startsWith('#') || line === '') continue;
    
    // Parse input declaration
    if (line.startsWith('input:')) {
      const match = line.match(/input:\s*['"]([^'"]*)['"]/);
      if (match) input = match[1];
      continue;
    }
    
    // Parse blank symbol
    if (line.startsWith('blank:')) {
      const match = line.match(/blank:\s*['"]([^'"]*)['"]/);
      if (match) blank = match[1];
      continue;
    }
    
    // Parse start state
    if (line.startsWith('start state:')) {
      const match = line.match(/start state:\s*(\w+)/);
      if (match) initialState = match[1].trim();
      continue;
    }
    
    // Parse table sections
    if (line === 'table:') continue;
    
    // Parse state definitions (ends with :)
    if (line.endsWith(':') && !line.includes('{')) {
      currentState = line.slice(0, -1).trim();
      continue;
    }
    
    // Parse transitions within a state
    if (currentState && (line.includes('{') || line.includes('['))) {
      processTransition(line, currentState);
    }
  }

  return {
    initialState,
    blank,
    input,
    transitions
  };
};

/**
 * Parse the state table regardless of format
 */
export const parseStateTable = (stateTable: string): { 
  transitions: any[], 
  initialTape: string[], 
  initialState: string 
} => {
  // Log the input for debugging
  console.log('Parsing state table:', stateTable);
  
  // We're focusing only on structured syntax now
  const config = parseStructuredSyntax(stateTable);
  
  console.log('Parsed config:', JSON.stringify({
    initialState: config.initialState,
    blank: config.blank,
    input: config.input,
    transitions: Object.fromEntries([...config.transitions].map(([k, v]) => [k, v]))
  }, null, 2));
  
  // Convert the structured format transitions to the format expected by the simulator
  const transitions: any[] = [];
  config.transitions.forEach((stateTransitions, state) => {
    console.log(`Processing transitions for state '${state}'`, stateTransitions);
    Object.entries(stateTransitions).forEach(([symbol, rule]) => {
      // Handle both single symbols and arrays of symbols
      const symbols = symbol.includes(',') ? symbol.split(',').map(s => s.trim()) : [symbol];
      
      for (const readSymbol of symbols) {
        const actualReadSymbol = readSymbol === '' ? config.blank : readSymbol;
        
        // Check for cases where write is specified vs not specified
        let writeSymbol = actualReadSymbol; // Default to read symbol
        if (rule.write !== undefined) {
          writeSymbol = rule.write;
        }
        
        transitions.push({
          currentState: state,
          readSymbol: actualReadSymbol,
          nextState: rule.nextState,
          writeSymbol,
          moveDirection: rule.move
        });
        
        console.log(`Added transition: ${state} + ${actualReadSymbol} -> ${rule.nextState}, write ${writeSymbol}, move ${rule.move}`);
      }
    });
  });
  
  // Convert the input string to an array
  let initialTape = config.input ? Array.from(config.input) : [];
  if (initialTape.length === 0) initialTape = ['1', '0', '1', '1']; // Default to "1011" if no input
  
  console.log('Final transitions:', transitions);
  
  return {
    transitions,
    initialTape,
    initialState: config.initialState
  };
};
