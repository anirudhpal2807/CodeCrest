import { ProblemDifficulty, ProblemTag } from '../types/enums';

// String formatting functions for the homepage
export const formatProblemCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
};

export const formatPercentage = (solved: number, total: number): string => {
  if (total === 0) return '0%';
  return `${Math.round((solved / total) * 100)}%`;
};

export const formatDifficultyLabel = (difficulty: ProblemDifficulty): string => {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
};

export const formatTagLabel = (tag: ProblemTag): string => {
  switch (tag) {
    case ProblemTag.LINKED_LIST:
      return 'Linked List';
    case ProblemTag.DP:
      return 'Dynamic Programming';
    default:
      return tag.charAt(0).toUpperCase() + tag.slice(1);
  }
};