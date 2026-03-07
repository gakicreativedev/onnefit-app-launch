export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      body_measurements: {
        Row: {
          arm_left_cm: number | null
          arm_right_cm: number | null
          body_fat_pct: number | null
          chest_cm: number | null
          created_at: string
          date: string
          hip_cm: number | null
          id: string
          neck_cm: number | null
          notes: string | null
          thigh_left_cm: number | null
          thigh_right_cm: number | null
          user_id: string
          waist_cm: number | null
          weight_kg: number | null
        }
        Insert: {
          arm_left_cm?: number | null
          arm_right_cm?: number | null
          body_fat_pct?: number | null
          chest_cm?: number | null
          created_at?: string
          date?: string
          hip_cm?: number | null
          id?: string
          neck_cm?: number | null
          notes?: string | null
          thigh_left_cm?: number | null
          thigh_right_cm?: number | null
          user_id: string
          waist_cm?: number | null
          weight_kg?: number | null
        }
        Update: {
          arm_left_cm?: number | null
          arm_right_cm?: number | null
          body_fat_pct?: number | null
          chest_cm?: number | null
          created_at?: string
          date?: string
          hip_cm?: number | null
          id?: string
          neck_cm?: number | null
          notes?: string | null
          thigh_left_cm?: number | null
          thigh_right_cm?: number | null
          user_id?: string
          waist_cm?: number | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      group_activities: {
        Row: {
          calories: number | null
          created_at: string | null
          custom_rule_label: string | null
          description: string | null
          distance_km: number | null
          duration_min: number | null
          group_id: string
          id: string
          image_url: string | null
          photo_url: string | null
          points_awarded: number | null
          steps: number | null
          title: string | null
          user_id: string
        }
        Insert: {
          calories?: number | null
          created_at?: string | null
          custom_rule_label?: string | null
          description?: string | null
          distance_km?: number | null
          duration_min?: number | null
          group_id: string
          id?: string
          image_url?: string | null
          photo_url?: string | null
          points_awarded?: number | null
          steps?: number | null
          title?: string | null
          user_id: string
        }
        Update: {
          calories?: number | null
          created_at?: string | null
          custom_rule_label?: string | null
          description?: string | null
          distance_km?: number | null
          duration_min?: number | null
          group_id?: string
          id?: string
          image_url?: string | null
          photo_url?: string | null
          points_awarded?: number | null
          steps?: number | null
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_activities_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_activity_comments: {
        Row: {
          activity_id: string
          content: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          activity_id: string
          content: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          activity_id?: string
          content?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_activity_comments_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "group_activities"
            referencedColumns: ["id"]
          },
        ]
      }
      group_activity_reactions: {
        Row: {
          activity_id: string
          created_at: string | null
          emoji: string
          id: string
          user_id: string
        }
        Insert: {
          activity_id: string
          created_at?: string | null
          emoji: string
          id?: string
          user_id: string
        }
        Update: {
          activity_id?: string
          created_at?: string | null
          emoji?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_activity_reactions_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "group_activities"
            referencedColumns: ["id"]
          },
        ]
      }
      group_goals: {
        Row: {
          created_at: string | null
          created_by: string
          deadline: string | null
          group_id: string
          id: string
          metric_type: string
          target_value: number
          title: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          deadline?: string | null
          group_id: string
          id?: string
          metric_type: string
          target_value: number
          title: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          deadline?: string | null
          group_id?: string
          id?: string
          metric_type?: string
          target_value?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_goals_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_invites: {
        Row: {
          created_at: string | null
          group_id: string
          id: string
          invited_by: string
          invited_user_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          group_id: string
          id?: string
          invited_by: string
          invited_user_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          group_id?: string
          id?: string
          invited_by?: string
          invited_user_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_invites_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_messages: {
        Row: {
          content: string
          created_at: string | null
          group_id: string
          id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          group_id: string
          id?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          group_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_rankings: {
        Row: {
          calculated_at: string | null
          days_diet_logged: number | null
          days_trained: number | null
          group_id: string
          id: string
          period_end: string
          period_start: string
          period_type: string
          rank_position: number | null
          streak_best: number | null
          total_score: number | null
          user_id: string
          water_goal_days: number | null
        }
        Insert: {
          calculated_at?: string | null
          days_diet_logged?: number | null
          days_trained?: number | null
          group_id: string
          id?: string
          period_end: string
          period_start: string
          period_type: string
          rank_position?: number | null
          streak_best?: number | null
          total_score?: number | null
          user_id: string
          water_goal_days?: number | null
        }
        Update: {
          calculated_at?: string | null
          days_diet_logged?: number | null
          days_trained?: number | null
          group_id?: string
          id?: string
          period_end?: string
          period_start?: string
          period_type?: string
          rank_position?: number | null
          streak_best?: number | null
          total_score?: number | null
          user_id?: string
          water_goal_days?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "group_rankings_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_resources: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          group_id: string
          id: string
          title: string
          url: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          group_id: string
          id?: string
          title: string
          url?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          group_id?: string
          id?: string
          title?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_resources_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          end_date: string | null
          group_type: string | null
          id: string
          image_url: string | null
          invite_code: string | null
          is_public: boolean | null
          max_members: number | null
          name: string
          score_rules: Json | null
          start_date: string | null
          start_of_week: number | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          end_date?: string | null
          group_type?: string | null
          id?: string
          image_url?: string | null
          invite_code?: string | null
          is_public?: boolean | null
          max_members?: number | null
          name: string
          score_rules?: Json | null
          start_date?: string | null
          start_of_week?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          end_date?: string | null
          group_type?: string | null
          id?: string
          image_url?: string | null
          invite_code?: string | null
          is_public?: boolean | null
          max_members?: number | null
          name?: string
          score_rules?: Json | null
          start_date?: string | null
          start_of_week?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activity_level: string | null
          age: number | null
          allergies: string[] | null
          avatar_url: string | null
          bio: string | null
          bmr: number | null
          calorie_target: number | null
          created_at: string | null
          date_of_birth: string | null
          dietary_restrictions: string[] | null
          gender: string | null
          goal: string | null
          height_cm: number | null
          id: string
          injuries: string[] | null
          is_private: boolean | null
          is_verified: boolean | null
          name: string | null
          onboarding_completed: boolean | null
          theme_color: string | null
          updated_at: string | null
          user_id: string
          username: string | null
          username_changed_at: Json | null
          weight_kg: number | null
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          allergies?: string[] | null
          avatar_url?: string | null
          bio?: string | null
          bmr?: number | null
          calorie_target?: number | null
          created_at?: string | null
          date_of_birth?: string | null
          dietary_restrictions?: string[] | null
          gender?: string | null
          goal?: string | null
          height_cm?: number | null
          id?: string
          injuries?: string[] | null
          is_private?: boolean | null
          is_verified?: boolean | null
          name?: string | null
          onboarding_completed?: boolean | null
          theme_color?: string | null
          updated_at?: string | null
          user_id: string
          username?: string | null
          username_changed_at?: Json | null
          weight_kg?: number | null
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          allergies?: string[] | null
          avatar_url?: string | null
          bio?: string | null
          bmr?: number | null
          calorie_target?: number | null
          created_at?: string | null
          date_of_birth?: string | null
          dietary_restrictions?: string[] | null
          gender?: string | null
          goal?: string | null
          height_cm?: number | null
          id?: string
          injuries?: string[] | null
          is_private?: boolean | null
          is_verified?: boolean | null
          name?: string | null
          onboarding_completed?: boolean | null
          theme_color?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
          username_changed_at?: Json | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      progress_photos: {
        Row: {
          category: string
          created_at: string
          date: string
          id: string
          notes: string | null
          photo_url: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          photo_url: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          photo_url?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_profiles: {
        Row: {
          avatar_url: string | null
          goal: string | null
          is_private: boolean | null
          is_verified: boolean | null
          name: string | null
          user_id: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          goal?: string | null
          is_private?: boolean | null
          is_verified?: boolean | null
          name?: string | null
          user_id?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          goal?: string | null
          is_private?: boolean | null
          is_verified?: boolean | null
          name?: string | null
          user_id?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: { Args: { _role: string; _user_id: string }; Returns: boolean }
      is_group_member: {
        Args: { _group_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
