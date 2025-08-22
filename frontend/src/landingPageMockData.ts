// Mock data for CodeCrest Landing Page

// Statistics data
export const mockStats = {
  problems: 2000,
  users: "500K",
  successRate: 95
};

// User data for authenticated state
export const mockUser = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  role: "user" as const
};

// Navigation items (removed as per requirements)
export const navigationItems = [
  // Problems, Contest, Discuss, Interview sections removed as requested
];

// Hero section content
export const heroContent = {
  title: "Master Coding Interviews",
  subtitle: "Level up your coding skills with our comprehensive collection of algorithm challenges, data structure problems, and interview preparation.",
  primaryButtonText: "Start Coding Now",
  secondaryButtonText: "Explore Problems"
};

// Code editor sample content
export const sampleCode = {
  filename: "solution.py",
  content: [
    "class ListNode:",
    "    def __init__(self):",
    "        self.val = 0",
    "        self.next = None"
  ]
};

// Matrix animation characters
export const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

// Landing page props interface
export interface LandingPageProps {
  isAuthenticated?: boolean;
  user?: typeof mockUser;
  onNavigate?: (path: string) => void;
}