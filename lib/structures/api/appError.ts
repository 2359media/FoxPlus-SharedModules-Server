import { HttpStatus } from "./controller";

export enum ErrorCode {
    RecordNotFound = 1,
}

function errorStatus(code: ErrorCode): HttpStatus {
    switch(code) {
        case ErrorCode.RecordNotFound:
            return HttpStatus.NotFound;
        default:
            return HttpStatus.InternalServerError;
    }
}

export class AppError {
    private code: ErrorCode;
    private origin?: Error;
    private details?: any;
    private stack?: string;
        
    constructor(code: ErrorCode, err?: Error, details?: any) {
        this.code = code;
        this.origin = err;
        this.details = details;
        this.stack = (new Error()).stack;
    }

    public toString(): string {
        const details = this.details instanceof Array ? this.details.slice() : [this.details];
        return details.toString();
    }

    public status(): number {
        return errorStatus(this.code);
    }

    public data(): object {
        return {
            error: {
                code: this.status() + `00${this.code}`.slice(-3),
                message: this.humanize(ErrorCode[this.code]),
                details: this.toString(),
                origin: this.origin,
                stack: this.stack
            }
        }
    }

    private humanize(camel: string): string {
        const words: Array<string> = [];
        const capRe: RegExp = /[A-Z]/;

        for (let i = 0; i < camel.length; i++) {
            words.push(i <= 0 ? camel[i] : capRe.test(camel[i]) ? ` ${camel[i]}` : camel[i]);
        }

        return words.join('');
    }
}
