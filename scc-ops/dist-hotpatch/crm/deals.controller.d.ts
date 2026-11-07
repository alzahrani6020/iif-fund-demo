import { DealsService } from './deals.service';
declare class CreateDealDto {
    title: string;
    description?: string;
    contactId: string;
    value?: number;
    currency?: string;
    stage?: string;
    probability?: number;
    expectedClose?: string;
    assignedToId?: string;
}
declare class UpdateDealDto {
    title?: string;
    description?: string;
    contactId?: string;
    value?: number;
    currency?: string;
    stage?: string;
    probability?: number;
    expectedClose?: string;
    assignedToId?: string;
}
export declare class DealsController {
    private readonly service;
    constructor(service: DealsService);
    findAll(req: any, query: any): Promise<{
        data: {
            id: string;
            tenantId: string;
            title: string;
            description: string | null;
            contactId: string;
            value: import("@prisma/client/runtime/library").Decimal | null;
            currency: string | null;
            stage: import("@prisma/client").$Enums.DealStage;
            probability: number | null;
            expectedClose: Date | null;
            actualClose: Date | null;
            assignedToId: string | null;
            pipelineId: string | null;
            stageOrder: number | null;
            customFields: import("@prisma/client/runtime/library").JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        count: number;
    }>;
    findOne(req: any, id: string): Promise<{
        id: string;
        tenantId: string;
        title: string;
        description: string | null;
        contactId: string;
        value: import("@prisma/client/runtime/library").Decimal | null;
        currency: string | null;
        stage: import("@prisma/client").$Enums.DealStage;
        probability: number | null;
        expectedClose: Date | null;
        actualClose: Date | null;
        assignedToId: string | null;
        pipelineId: string | null;
        stageOrder: number | null;
        customFields: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(req: any, dto: CreateDealDto): Promise<{
        id: string;
        tenantId: string;
        title: string;
        description: string | null;
        contactId: string;
        value: import("@prisma/client/runtime/library").Decimal | null;
        currency: string | null;
        stage: import("@prisma/client").$Enums.DealStage;
        probability: number | null;
        expectedClose: Date | null;
        actualClose: Date | null;
        assignedToId: string | null;
        pipelineId: string | null;
        stageOrder: number | null;
        customFields: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(req: any, id: string, dto: UpdateDealDto): Promise<{
        id: string;
        tenantId: string;
        title: string;
        description: string | null;
        contactId: string;
        value: import("@prisma/client/runtime/library").Decimal | null;
        currency: string | null;
        stage: import("@prisma/client").$Enums.DealStage;
        probability: number | null;
        expectedClose: Date | null;
        actualClose: Date | null;
        assignedToId: string | null;
        pipelineId: string | null;
        stageOrder: number | null;
        customFields: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(req: any, id: string): Promise<{
        id: string;
        tenantId: string;
        title: string;
        description: string | null;
        contactId: string;
        value: import("@prisma/client/runtime/library").Decimal | null;
        currency: string | null;
        stage: import("@prisma/client").$Enums.DealStage;
        probability: number | null;
        expectedClose: Date | null;
        actualClose: Date | null;
        assignedToId: string | null;
        pipelineId: string | null;
        stageOrder: number | null;
        customFields: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
//# sourceMappingURL=deals.controller.d.ts.map