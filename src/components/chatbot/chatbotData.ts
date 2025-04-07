
export const chatbotData = {
  welcomeMessage: "Hello! 👋 I'm here to help you with questions about our website. Please select a topic below to get started.",
  categories: [
    {
      id: "getting-started",
      name: "Getting Started",
      questions: [
        {
          id: "what-is-turing",
          text: "What is a Turing Machine?",
          answer: "A Turing Machine is a mathematical model of computation that defines an abstract machine which manipulates symbols on a strip of tape according to a table of rules. It's a conceptual device that helps us understand the fundamental limits of what can be computed."
        },
        {
          id: "how-to-use-simulator",
          text: "How do I use the simulator?",
          answer: "To use our Turing Machine simulator, navigate to the Simulator page, define your states and transitions in the editor panel, then click the 'Run' button to see the machine in action. You can adjust the speed and step through the execution one move at a time."
        },
        {
          id: "binary-increment",
          text: "What is binary increment?",
          answer: "Binary increment is the operation of adding 1 to a binary number. In our tutorial, we show how to implement this operation using a Turing Machine, which demonstrates the fundamental concepts of computational theory in a practical way."
        }
      ]
    },
    {
      id: "common-issues",
      name: "Common Issues",
      questions: [
        {
          id: "simulator-not-working",
          text: "The simulator isn't working correctly",
          answer: "If the simulator isn't working as expected, try the following: 1) Make sure your state transitions are correctly defined. 2) Check for syntax errors in your input. 3) Try refreshing the page. 4) If issues persist, check our documentation for common mistakes."
        },
        {
          id: "slow-performance",
          text: "The simulator is running slowly",
          answer: "If you're experiencing slow performance, try reducing the complexity of your Turing Machine, or decrease the animation speed using the speed control slider. For very complex machines, consider running them without animation for faster results."
        },
        {
          id: "save-machine",
          text: "How do I save my Turing Machine?",
          answer: "Currently, we don't have a built-in save feature, but you can copy your state table definition to a text file for safekeeping. We're working on adding persistent storage in a future update."
        }
      ]
    },
    {
      id: "website-navigation",
      name: "Website Navigation",
      questions: [
        {
          id: "find-tutorials",
          text: "Where can I find tutorials?",
          answer: "Our tutorials can be accessed from the 'Tutorial' link in the main navigation. We offer step-by-step guides on understanding Turing Machines and implementing common algorithms."
        },
        {
          id: "additional-resources",
          text: "Are there additional learning resources?",
          answer: "While we don't currently offer additional resources beyond our tutorials and simulator, we recommend exploring computational theory textbooks or online courses for deeper understanding of Turing Machines and their applications."
        }
      ]
    },
    {
      id: "about",
      name: "About This Project",
      questions: [
        {
          id: "project-purpose",
          text: "What is the purpose of this project?",
          answer: "This project aims to provide an interactive way to learn about and experiment with Turing Machines, a fundamental concept in computer science. Our goal is to make theoretical concepts more accessible through visualization and hands-on experimentation."
        },
        {
          id: "contact-info",
          text: "How can I contact the creators?",
          answer: "This project is maintained by enthusiasts of theoretical computer science. While we don't have a direct contact method implemented yet, we appreciate your interest and feedback!"
        }
      ]
    }
  ]
};
