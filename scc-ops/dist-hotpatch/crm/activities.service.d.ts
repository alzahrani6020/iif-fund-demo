export declare class ActivitiesService {
    findAll(req: any, query: any): Promise<{
        data: {
            id: string;
            tenantId: string;
            description: string | null;
            contactId: string | null;
            assignedToId: string | null;
            createdAt: Date;
            updatedAt: Date;
            type: import("@scc/database").$Enums.ActivityType;
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
        type: import("@scc/database").$Enums.ActivityType;
        subject: string;
        dealId: string | null;
        scheduledAt: Date | null;
        completedAt: Date | null;
        remindAt: Date | null;
        reminded: boolean;
    }>;
    create(req: any, dto: any): Promise<{
        id: string;
        tenantId: string;
        description: string | null;
        contactId: string | null;
        assignedToId: string | null;
        createdAt: Date;
        updatedAt: Date;
        type: import("@scc/database").$Enums.ActivityType;
        subject: string;
        dealId: string | null;
        scheduledAt: Date | null;
        completedAt: Date | null;
        remindAt: Date | null;
        reminded: boolean;
    }>;
    update(req: any, id: string, dto: any): Promise<{
        id: string;
        tenantId: string;
        description: string | null;
        contactId: string | null;
        assignedToId: string | null;
        createdAt: Date;
        updatedAt: Date;
        type: import("@scc/database").$Enums.ActivityType;
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
        type: import("@scc/database").$Enums.ActivityType;
        subject: string;
        dealId: string | null;
        scheduledAt: Date | null;
        completedAt: Date | null;
        remindAt: Date | null;
        reminded: boolean;
    }>;
}
//# sourceMappingURL=activities.service.d.ts.map