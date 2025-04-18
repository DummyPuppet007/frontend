import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bell, Package, User, Clock } from "lucide-react";

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  timestamp: string;
  type: "order" | "notification" | "customer";
}

const ActivityItem = ({ icon, title, description, timestamp, type }: ActivityItemProps) => (
  <div className="flex items-center gap-4 rounded-lg border p-3 mb-2">
    <div className="rounded-full bg-secondary p-2">{icon}</div>
    <div className="flex-1 space-y-1">
      <p className="text-sm font-medium leading-none">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <div className="flex flex-col items-end gap-2">
      <Badge variant={
        type === "order" ? "default" :
        type === "notification" ? "secondary" : "outline"
      }>
        {type}
      </Badge>
      <time className="text-xs text-muted-foreground">{timestamp}</time>
    </div>
  </div>
);

export function DashboardActivity() {
  const activities = [
    {
      icon: <Package className="h-4 w-4" />,
      title: "New Sales Order #1234",
      description: "Order created for Customer XYZ",
      timestamp: "2 min ago",
      type: "order" as const,
    },
    {
      icon: <Bell className="h-4 w-4" />,
      title: "Price Update Notification",
      description: "Product A price has been updated",
      timestamp: "1 hour ago",
      type: "notification" as const,
    },
    {
      icon: <User className="h-4 w-4" />,
      title: "New Customer Added",
      description: "ABC Corp. joined as a customer",
      timestamp: "3 hours ago",
      type: "customer" as const,
    },
  ];

  const tasks = [
    {
      title: "Review Pending Orders",
      deadline: "Today, 5:00 PM",
      priority: "high",
    },
    {
      title: "Update Product Catalog",
      deadline: "Tomorrow, 12:00 PM",
      priority: "medium",
    },
    {
      title: "Customer Follow-up",
      deadline: "Friday, 3:00 PM",
      priority: "low",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 mt-4">
      <Card className="border border-neutral-300 shadow-xl">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {activities.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {tasks.map((task, index) => (
              <div key={index} className="flex items-center gap-4 rounded-lg border p-3 mb-2">
                <div className="rounded-full bg-secondary p-2">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{task.title}</p>
                  <p className="text-sm text-muted-foreground">Due: {task.deadline}</p>
                </div>
                <Badge variant={
                  task.priority === "high" ? "destructive" :
                  task.priority === "medium" ? "secondary" : "outline"
                }>
                  {task.priority}
                </Badge>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
