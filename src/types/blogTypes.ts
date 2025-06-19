// src/types/blogTypes.ts
export interface BlogData {
  meta: {
    title: string;
    description: string;
    keywords: string[];
    tags: string[];
  };
  content: {
    header: {
      title: string;
      intro: string;
    };
    key_features: {
      section_title: string;
      features: string[];
    };
    why_choose: {
      section_title: string;
      points: {
        title: string;
        description: string;
      }[];
    };
    comparison: {
      section_title: string;
      columns: string[];
      rows: string[][];
      verdict: string;
    };
    target_audience: {
      section_title: string;
      audiences: string[];
    };
    activation: {
      section_title: string;
      methods: string[];
    };
    tips: {
      section_title: string;
      tips: string[];
    };
    verdict: {
      section_title: string;
      conclusion: string;
      best_for: string;
      value: string;
    };
    cta: {
      text: string;
      button: string;
    };
  };
}