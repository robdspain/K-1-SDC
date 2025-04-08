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
            features: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string | null
                    title: string
                    description: string | null
                    status: 'yes' | 'no' | 'planned'
                    notes: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    updated_at?: string | null
                    title: string
                    description?: string | null
                    status?: 'yes' | 'no' | 'planned'
                    notes?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    updated_at?: string | null
                    title?: string
                    description?: string | null
                    status?: 'yes' | 'no' | 'planned'
                    notes?: string | null
                }
                Relationships: []
            }
            profiles: {
                Row: {
                    id: string
                    created_at: string | null
                    updated_at: string | null
                    email: string | null
                    name: string | null
                    role: string | null
                }
                Insert: {
                    id: string
                    created_at?: string | null
                    updated_at?: string | null
                    email?: string | null
                    name?: string | null
                    role?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string | null
                    updated_at?: string | null
                    email?: string | null
                    name?: string | null
                    role?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        isOneToOne: true
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}

