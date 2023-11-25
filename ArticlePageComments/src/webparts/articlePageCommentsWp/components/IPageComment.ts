export interface IPageComment {
    id: number;
    author?: string;
    comment: string;
    createdDate?: Date;
    language: string;
    sentiment: string;
    confidence: number;
}