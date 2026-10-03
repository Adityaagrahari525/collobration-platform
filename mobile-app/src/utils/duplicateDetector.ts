/**
 * Jaccard Token Similarity Heuristic for Q&A Duplicate Detection
 * Tokenizes question titles, removes common English stop words,
 * and computes Jaccard set overlap ratio: J(A, B) = |A ∩ B| / |A ∪ B|
 */

import { Question } from "../types";

const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
  "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
  "can", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from",
  "further", "had", "has", "have", "having", "he", "how", "i", "if", "in", "into", "is", "it",
  "its", "me", "more", "most", "my", "no", "nor", "not", "of", "off", "on", "once", "only", "or",
  "other", "our", "out", "over", "own", "same", "should", "so", "some", "such", "than", "that",
  "the", "their", "them", "then", "there", "these", "they", "this", "those", "through", "to",
  "too", "under", "until", "up", "very", "was", "we", "were", "what", "when", "where", "which",
  "while", "who", "whom", "why", "with", "would", "you", "your"
]);

export function tokenize(text: string = ""): string[] {
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOP_WORDS.has(token));
}

export function computeJaccardSimilarity(textA: string = "", textB: string = ""): number {
  const tokensA = new Set(tokenize(textA));
  const tokensB = new Set(tokenize(textB));

  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  let intersectionCount = 0;
  tokensA.forEach(t => {
    if (tokensB.has(t)) intersectionCount++;
  });

  const unionSize = new Set([...tokensA, ...tokensB]).size;
  return unionSize === 0 ? 0 : intersectionCount / unionSize;
}

export interface DuplicateMatch {
  question: Question;
  similarity: number;
}

export function findSimilarQuestions(
  newTitle: string = "",
  existingQuestions: Question[] = [],
  threshold: number = 0.35
): DuplicateMatch[] {
  if (!newTitle || newTitle.trim().length < 5) return [];

  const matches = existingQuestions
    .map(q => {
      const similarity = computeJaccardSimilarity(newTitle, q.title);
      return { question: q, similarity };
    })
    .filter(item => item.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity);

  return matches;
}
