
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navbar: React.FC = () => {
  const location = useLocation();
  
  // Check if we're on a specific content page (not the home page)
  const isContentPage = location.pathname !== "/";
  
  return (
    <nav 
      className={cn(
        "w-full flex justify-between items-center border-b transition-all duration-300",
        isContentPage ? "py-2 px-4" : "py-4 px-6"
      )}
    >
      <Link to="/" className={cn(
        "font-bold text-primary transition-all duration-300",
        isContentPage ? "text-lg" : "text-xl"
      )}>
        Tariq Turing
      </Link>
      
      <div className="flex gap-4">
        <Link 
          to="/simulator" 
          className={cn(
            "transition-all duration-300 hover:text-primary",
            isContentPage ? "text-xs" : "text-sm",
            location.pathname === "/simulator" ? "text-primary font-medium" : "text-gray-600"
          )}
        >
          Simulator
        </Link>
        <Link 
          to="/tutorial" 
          className={cn(
            "transition-all duration-300 hover:text-primary",
            isContentPage ? "text-xs" : "text-sm",
            location.pathname === "/tutorial" ? "text-primary font-medium" : "text-gray-600"
          )}
        >
          Tutorial
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
