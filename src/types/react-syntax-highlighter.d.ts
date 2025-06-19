declare module 'react-syntax-highlighter' {
  import { ComponentType, CSSProperties } from 'react';

  interface SyntaxHighlighterProps {
    language: string;
    style?: { [key: string]: CSSProperties };
    customStyle?: CSSProperties;
    lineNumberStyle?: CSSProperties;
    showLineNumbers?: boolean;
    startingLineNumber?: number;
    lineProps?: CSSProperties | ((lineNumber: number) => CSSProperties);
    wrapLines?: boolean;
    wrapLongLines?: boolean;
    children: string;
    // Add other props as needed
  }

  export const Prism: ComponentType<SyntaxHighlighterProps>;
}

declare module 'react-syntax-highlighter/dist/cjs/styles/prism' {
  import { CSSProperties } from 'react';

  export const materialDark: { [key: string]: CSSProperties };
}