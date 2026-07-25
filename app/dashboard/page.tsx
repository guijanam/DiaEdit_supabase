"use client";

import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth-context";
import { formatDateTime } from "@/lib/utils";
import { OfficeInfoTab } from "@/components/dashboard/office-info-tab";
import { DiaManagementTab } from "@/components/dashboard/dia-management-tab";

export default function DashboardPage() {
  const { dias, officeInfo } = useAuth();

  return (
    <Container className="py-6">
      <Card>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b px-4 py-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {officeInfo?.office_name}
          </span>
          <span>
            최종 수정: {formatDateTime(officeInfo?.dia_updated_at ?? null)}
          </span>
        </div>
        <Tabs defaultValue="office">
          <TabsList variant="line" className="w-full justify-start rounded-none border-b px-4">
            <TabsTrigger value="office">승무소 정보</TabsTrigger>
            <TabsTrigger value="dia">
              다이아 관리 ({dias.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="office" className="p-6">
            <OfficeInfoTab />
          </TabsContent>
          <TabsContent value="dia" className="p-0">
            <DiaManagementTab />
          </TabsContent>
        </Tabs>
      </Card>
    </Container>
  );
}
