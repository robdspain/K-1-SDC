export interface DRDPDomain {
    id: string;
    name: string;
    description: string | null;
    sort_order: number | null;
    measures?: DRDPMeasure[];
}

export interface DRDPMeasure {
    id: string;
    domain_id: string;
    code: string;
    name: string;
    description: string | null;
    sort_order: number | null;
    ratings?: DRDPRating[];
}

export interface DRDPDevelopmentalLevel {
    id: string;
    code: string;
    name: string;
    description: string | null;
    sort_order: number | null;
}

export interface Student {
    id: string;
    first_name: string;
    last_name: string;
    birthdate: string | null;
    grade: string | null;
    class: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface DRDPAssessment {
    id: string;
    student_id: string;
    assessor_id: string;
    assessment_date: string;
    assessment_period: 'Fall' | 'Winter' | 'Spring';
    notes: string | null;
    status: 'draft' | 'complete';
    created_at: string;
    updated_at: string;
    student?: Student;
    ratings?: DRDPRating[];
}

export interface DRDPRating {
    id: string;
    assessment_id: string;
    measure_id: string;
    developmental_level_id: string | null;
    observation_notes: string | null;
    created_at: string;
    updated_at: string;
    developmental_level?: DRDPDevelopmentalLevel;
    measure?: DRDPMeasure;
    observations?: DRDPObservation[];
}

export interface DRDPObservation {
    id: string;
    rating_id: string;
    observation_date: string;
    observation_text: string;
    created_at: string;
    updated_at: string;
}

export interface AssessmentFormData {
    student_id: string;
    assessment_date: string;
    assessment_period: 'Fall' | 'Winter' | 'Spring';
    notes: string;
}

export interface RatingFormData {
    measure_id: string;
    developmental_level_id: string | null;
    observation_notes: string;
}

export interface ObservationFormData {
    observation_date: string;
    observation_text: string;
}

export interface DomainSummary {
    domain: DRDPDomain;
    totalMeasures: number;
    ratedMeasures: number;
    averageLevel: number;
} 