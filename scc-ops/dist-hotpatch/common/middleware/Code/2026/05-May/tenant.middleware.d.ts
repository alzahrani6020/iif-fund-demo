import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
export interface TenantRequest extends Request {
    tenantSlug?: string;
    tenantId?: string;
    user?: any;
}
export declare class TenantMiddleware implements NestMiddleware {
    use(req: TenantRequest, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
}
//# sourceMappingURL=tenant.middleware.d.ts.map