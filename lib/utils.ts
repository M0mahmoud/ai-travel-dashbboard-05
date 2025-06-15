import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string): string => {
  return dayjs(dateString).format("MMMM DD, YYYY");
};
export function parseMarkdownToJson(markdownText: string): unknown | null {
  if (!markdownText) return null;

  // Normalize quotes (smart quotes to standard)
  const normalized = markdownText.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");

  // Try to extract JSON inside any code block (```json, ```js, or even ```text)
  const codeBlocks = Array.from(
    normalized.matchAll(/```(?:json|js|text)?\s*([\s\S]+?)\s*```/gi)
  );

  for (const match of codeBlocks) {
    const block = match[1].trim();
    try {
      return JSON.parse(block);
    } catch (err) {
      console.warn("⚠️ Failed parsing block, trying next:", err);
    }
  }

  // Try to extract anything that looks like a JSON object
  const jsonLikeMatch = normalized.match(/{[\s\S]+}/);
  if (jsonLikeMatch) {
    try {
      return JSON.parse(jsonLikeMatch[0]);
    } catch (err) {
      console.warn("⚠️ Could not parse JSON-like match:", err);
    }
  }

  // Finally try the whole response as JSON
  try {
    return JSON.parse(normalized.trim());
  } catch (err) {
    console.error("❌ Final JSON parsing failed:", err);
    console.error("📄 Problematic content:\n", markdownText);
    return null;
  }
}

export function parseTripData(jsonString: string): Trip | null {
  try {
    const data: Trip = JSON.parse(jsonString);

    return data;
  } catch (error) {
    console.error("Failed to parse trip data:", error);
    return null;
  }
}

export function getFirstWord(input: string = ""): string {
  return input.trim().split(/\s+/)[0] || "";
}

export const calculateTrendPercentage = (
  countOfThisMonth: number,
  countOfLastMonth: number
): TrendResult => {
  if (countOfLastMonth === 0) {
    return countOfThisMonth === 0
      ? { trend: "no change", percentage: 0 }
      : { trend: "increment", percentage: 100 };
  }

  const change = countOfThisMonth - countOfLastMonth;
  const percentage = Math.abs((change / countOfLastMonth) * 100);

  if (change > 0) {
    return { trend: "increment", percentage };
  } else if (change < 0) {
    return { trend: "decrement", percentage };
  } else {
    return { trend: "no change", percentage: 0 };
  }
};

export const formatKey = (key: keyof TripFormData) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};
