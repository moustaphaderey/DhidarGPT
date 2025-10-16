export type Page = 'home' | 'chat' | 'summarize' | 'image';

export interface ChatPart {
  text: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: ChatPart[];
}
