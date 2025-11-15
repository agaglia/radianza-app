export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      meetings: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          date: string;
          created_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          date: string;
          created_at?: string;
          created_by: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          date?: string;
          created_at?: string;
          created_by?: string;
        };
      };
      attendance: {
        Row: {
          id: string;
          meeting_id: string;
          user_id: string;
          status: 'present' | 'absent' | 'pending';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          meeting_id: string;
          user_id: string;
          status?: 'present' | 'absent' | 'pending';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          meeting_id?: string;
          user_id?: string;
          status?: 'present' | 'absent' | 'pending';
          created_at?: string;
          updated_at?: string;
        };
      };
      content: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          type: 'video' | 'photo' | 'text' | 'poem' | 'letter';
          url: string | null;
          text_content: string | null;
          created_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          type: 'video' | 'photo' | 'text' | 'poem' | 'letter';
          url?: string | null;
          text_content?: string | null;
          created_at?: string;
          created_by: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          type?: 'video' | 'photo' | 'text' | 'poem' | 'letter';
          url?: string | null;
          text_content?: string | null;
          created_at?: string;
          created_by?: string;
        };
      };
    };
  };
}
