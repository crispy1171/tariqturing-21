
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
  let initialState = '';
  let blank = '_';
  let input = '';
  const transitions = new Map<string, StateTransitions>();
  let currentState = '';

  const processTransition = (line: string, state: string) => {
    // Format: [symbol]: {options}
    // or: symbol: {options}
    const match = line.match(/^\s*(?:\[(.*)\]|([^:]+)):\s*(.*)/);
    if (!match) return;
    
    const symbol = (match[1] || match[2]).trim();
    const options = match[3].trim();

    // Parse options like {write: 0, L: done}
    const writeMatch = options.match(/\{write:\s*([^,}]+)/);
    const nextStateMatch = options.match(/(?:L|R|N):\s*([^,}]+)/);
    const moveMatch = options.match(/([LRN]):/);

    if (nextStateMatch && moveMatch) {
      if (!transitions.has(state)) {
        transitions.set(state, {});
      }
      
      transitions.get(state)![symbol] = {
        nextState: nextStateMatch[1].trim(),
        move: moveMatch[1] as 'L' | 'R' | 'N',
        write: writeMatch ? writeMatch[1].trim() : undefined
      };
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
    if (line.endsWith(':') && !line.includes('[') && !line.includes('{')) {
      currentState = line.slice(0, -1).trim();
      continue;
    }
    
    // Parse transitions within a state
    if (currentState && (line.includes('[') || !line.includes(':'))) {
      processTransition(line, currentState);
    }
  }

  return {
    initialState: initialState || 'right', // Default to 'right' if not specified
    blank,
    input,
    transitions
  };
};

/**
 * Convert the structured syntax to classic format
 * (q0, 0 -> q1, 1, R format)
 */
export const structuredToClassicFormat = (config: TuringMachineConfig): string => {
  let result = `# Converted from structured format\n`;
  
  Array.from(config.transitions.entries()).forEach(([state, transitions]) => {
    Object.entries(transitions).forEach(([symbol, rule]) => {
      const readSymbol = symbol === '' ? config.blank : symbol;
      const writeSymbol = rule.write !== undefined ? rule.write : readSymbol;
      
      result += `${state}, ${readSymbol} -> ${rule.nextState}, ${writeSymbol}, ${rule.move}\n`;
    });
  });
  
  return result;
};

/**
 * Parse the classic syntax format
 */
export const parseClassicSyntax = (stateTable: string): { transitions: any[], tape: string[], initialState: string } => {
  const rules: any[] = [];
  const lines = stateTable.split('\n');
  let initialState = 'q0';
  let initialTape: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip comments and empty lines
    if (line.startsWith('#') || line === '') continue;
    
    // Check for initial tape definition
    const tapeMatch = line.match(/^Initial tape:\s*(.+)$/i);
    if (tapeMatch) {
      initialTape = Array.from(tapeMatch[1].trim());
      continue;
    }
    
    // Parse transition rule
    try {
      const [left, right] = line.split('->').map(s => s.trim());
      if (!right) {
        // Handle halt state format: "qa, _, _, N"
        const [s, read, write, move] = left.split(',').map(s => s.trim());
        rules.push({
          currentState: s,
          readSymbol: read,
          nextState: s, // Same state (halting)
          writeSymbol: write,
          moveDirection: move,
          lineNumber: i + 1
        });
        continue;
      }
      
      const [state, readSymbol] = left.split(',').map(s => s.trim());
      const [nextState, writeSymbol, moveDirection] = right.split(',').map(s => s.trim());
      
      rules.push({
        currentState: state,
        readSymbol,
        nextState,
        writeSymbol,
        moveDirection,
        lineNumber: i + 1
      });
      
      // If we find "q0" as a currentState, use it as initial state
      if (state === 'q0' && initialState === 'q0') {
        initialState = 'q0';
      }
    } catch (e) {
      console.error('Error parsing classic rule:', line, e);
    }
  }
  
  return { 
    transitions: rules, 
    tape: initialTape, 
    initialState 
  };
};

/**
 * Determine if the state table is in structured or classic format
 */
export const detectSyntaxFormat = (stateTable: string): 'structured' | 'classic' => {
  // Check for characteristic structured syntax markers
  if (
    stateTable.includes('start state:') ||
    stateTable.includes('table:') ||
    stateTable.includes('input:')
  ) {
    return 'structured';
  }
  
  // Default to classic
  return 'classic';
};

/**
 * Parse the state table regardless of format
 */
export const parseStateTable = (stateTable: string): { 
  transitions: any[], 
  initialTape: string[], 
  initialState: string 
} => {
  const format = detectSyntaxFormat(stateTable);
  
  if (format === 'structured') {
    const config = parseStructuredSyntax(stateTable);
    
    // Convert the structured format transitions to the format expected by the simulator
    const transitions: any[] = [];
    config.transitions.forEach((stateTransitions, state) => {
      Object.entries(stateTransitions).forEach(([symbol, rule]) => {
        const readSymbol = symbol === '' ? config.blank : symbol;
        transitions.push({
          currentState: state,
          readSymbol,
          nextState: rule.nextState,
          writeSymbol: rule.write !== undefined ? rule.write : readSymbol,
          moveDirection: rule.move
        });
      });
    });
    
    // Convert the input string to an array
    let initialTape = config.input ? Array.from(config.input) : [];
    if (initialTape.length === 0) initialTape = ['0', '0', '0'];
    
    return {
      transitions,
      initialTape,
      initialState: config.initialState
    };
  } else {
    const { transitions, tape, initialState } = parseClassicSyntax(stateTable);
    return {
      transitions,
      initialTape: tape.length > 0 ? tape : ['0', '0', '0'],
      initialState
    };
  }
};
