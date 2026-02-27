"use client";

import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth-context";
import { OfficeInfoTab } from "@/components/dashboard/office-info-tab";
import { DiaManagementTab } from "@/components/dashboard/dia-management-tab";

export default function DashboardPage() {
  const { dias } = useAuth();

  return (
    <Container className="py-6">
      <Card>
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
