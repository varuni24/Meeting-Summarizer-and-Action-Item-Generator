export interface ActionItem {
  task: string;
  deadline: string | null;
  speaker: string;
}

export interface DecisionWithAttribution {
  decision: string;
  mover: string | null;
}

export interface MeetingSummary {
  key_decisions: DecisionWithAttribution[];
  key_topics: string[];
  action_items: ActionItem[];
}
