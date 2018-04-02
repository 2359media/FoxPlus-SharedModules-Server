export declare enum ErrorCode {
    RecordNotFound = 1,
}
export declare class AppError {
    private code;
    private origin?;
    private details?;
    private stack?;
    constructor(code: ErrorCode, err?: Error, details?: any);
    toString(): string;
    status(): number;
    data(): object;
    private humanize(camel);
}
