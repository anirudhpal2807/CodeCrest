// Type definitions for the homepage data structures
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Problem {
  _id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: 'array' | 'linkedList' | 'graph' | 'dp';
  description: string;
}

export interface SolvedProblem {
  _id: string;
}

export interface UserStats {
  totalProblems: number;
  solvedCount: number;
  easyCount: number;
  easySolved: number;
  mediumCount: number;
  mediumSolved: number;
  hardCount: number;
  hardSolved: number;
}

// Props types
export interface HomepageProps {
  user: User;
  problems: Problem[];
  solvedProblems: SolvedProblem[];
  stats: UserStats;
}