export interface MessageAttachment {
  id: string;
  type: 'image' | 'video' | 'audio' | 'file';
  url: string;
  fileName?: string;
  mimeType?: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'user' | 'contact';
  attachment?: MessageAttachment;
  isEdited?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatarUrl: string;
}

export interface Conversation {
  id: string;
  contactId: string;
  messages: Message[];
  workflowStageId: string;
  unreadCount?: number;
}

export type AccountTheme = 'whatsapp' | 'blue' | 'purple' | 'orange' | 'pink' | 'slate';

export interface WhatsAppAccount {
  id: string;
  name: string;
  phone: string;
  avatarUrl: string;
  contacts: Contact[];
  files: UploadedFile[];
  description?: string;
  themeColor: AccountTheme;
}

export interface WorkflowStage {
  id:string;
  title: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'spreadsheet';
  url: string;
  size: string;
}

export type View = 'dashboard' | 'workflow' | 'reports';