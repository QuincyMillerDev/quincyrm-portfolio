export interface ProjectDetails {
    /** One-line framing shown under the title in the detail dialog */
    tagline?: string;
    /** Scannable case-study bullets; the RAG corpus holds the depth */
    bullets: string[];
    /** Tech stack chips */
    stack?: string[];
}

export interface Project {
    title: string;
    description: string;
    /** External URL; omitted for work with no public link */
    link?: string;
    chatQuery?: string;
    chatSuggestion?: string;
    details?: ProjectDetails;
}
