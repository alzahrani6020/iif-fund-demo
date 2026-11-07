import { ActivitiesService } from './activities.service';
declare class CreateActivityDto {
    type: string;
    subject: string;
    description?: string;
    contactId?: string;
    dealId?: string;
    scheduledAt?: string;
    assignedToId?: string;
}
declare class UpdateActivityDto {
    type?: string;
    subject?: string;
    description?: string;
    scheduledAt?: string;
    completedAt?: string;
    assignedToId?: string;
}
export declare class ActivitiesController {
    private readonly service;
    constructor(service: ActivitiesService);
    findAll(req: any, query: any): Promise<{
        data: {
            id: string;
            tenantId: string;
            description: string | null;
            contactId: string | null;
            assignedToId: string | null;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.ActivityType;
            subject: string;
            dealId: string | null;
            scheduledAt: Date | null;
            completedAt: Date | null;
            remindAt: Date | null;
            reminded: boolean;
        }[];
        count: number;
    }>;
    findOne(req: any, id: string): Promise<{
        id: string;
        tenantId: string;
        description: string | null;
        contactId: string | null;
        assignedToId: string | null;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.ActivityType;
        subject: string;
        dealId: string | null;
        scheduledAt: Date | null;
        completedAt: Date | null;
        remindAt: Date | null;
        reminded: boolean;
    }>;
    create(req: any, dto: CreateActivityDto): Promise<{
        id: string;
        tenantId: string;
        description: string | null;
        contactId: string | null;
        assignedToId: string | null;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.ActivityType;
        subject: string;
        dealId: string | null;
        scheduledAt: Date | null;
        completedAt: Date | null;
        remindAt: Date | null;
        reminded: boolean;
    }>;
    update(req: any, id: string, dto: UpdateActivityDto): Promise<{
        id: string;
        tenantId: string;
        description: string | null;
        contactId: string | null;
        assignedToId: string | null;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.ActivityType;
        subject: string;
        dealId: string | null;
        scheduledAt: Date | null;
        completedAt: Date | null;
        remindAt: Date | null;
        reminded: boolean;
    }>;
    remove(req: any, id: string): Promise<{
        id: string;
        tenantId: string;
        description: string | null;
        contactId: string | null;
        assignedToId: string | null;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.ActivityType;
        subject: string;
        dealId: string | null;
        scheduledAt: Date | null;
        completedAt: Date | null;
        remindAt: Date | null;
        reminded: boolean;
    }>;
}
export {};
//# sourceMappingURL=activities.controller.d.ts.map