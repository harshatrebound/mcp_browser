import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface State {
  evaluation_previous_goal: string;
  memory: string;
  next_goal: string;
}

export interface StepResult {
  current_state: State;
  action: object[];
}

export function formatLog(response: StepResult) {
  let emoji;

  if (response.current_state.evaluation_previous_goal.includes("Success")) {
    emoji = "👍";
  } else if (
    response.current_state.evaluation_previous_goal.includes("Failed")
  ) {
    emoji = "⚠";
  } else {
    emoji = "🤷";
  }

  const result = {
    eval: `${emoji} Eval: ${response.current_state.evaluation_previous_goal}`,
    memory: `🧠 Memory: ${response.current_state.memory}`,
    goal: `🎯 Next goal: ${response.current_state.next_goal}`,
  };

  return result;
}
