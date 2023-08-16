export interface DestinyResponse<T = unknown> {
    Response: T;
    ErrorCode: number;
    ThrottleSeconds: number;
    ErrorStatus: string;
    Message: string;
    MessageData: Record<string, string>;
    DetailedErrorTrace: string;
}