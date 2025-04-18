import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import {
  getAllUserNotifications,
  getUserUnreadNotificationCount,
  markNotificationRead,
  NotificationType,
} from "@/services/NotificationService";
import { DataTableSkeleton } from "../Datatable/data-table-skeleton";
import format from "date-fns/format";

export function NotificationDrawer() {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const fetchAllUserNotification = async () => {
    try {
      setIsLoading(true);
      const response = await getAllUserNotifications();

      if (!response || response.statusCode !== 200) {
        setError(response.message);
        return;
      }
      setNotifications(response.data || []);
      fetchUnreadCount();
      setError("");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const count = await getUserUnreadNotificationCount();
      setUnreadCount(count.data);
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    setIsLoading(true);
    try {
      const markRead = await markNotificationRead(id);

      if (!markRead || markRead.statusCode !== 200) {
        setError(markRead.message);
        return;
      }
      fetchAllUserNotification();
      fetchUnreadCount();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(async () => {
  //   const unreadCount = await getUserUnreadNotificationCount();
  // }, [])

  useEffect(() => {

    fetchUnreadCount();
  }, []);

  return (
    <Sheet onOpenChange={(open) => open && fetchAllUserNotification()}>
      <SheetTrigger asChild>
        <div className="relative">
          <Bell className="text-gray-500 hover:text-gray-900 transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      </SheetTrigger>

      <SheetContent className="flex flex-col h-screen sm:max-w-md">
        <SheetHeader>
          <SheetTitle>NOTIFICATION CENTER</SheetTitle>
          <SheetDescription>
            All your notifications will appear here.
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto scrollable-content">
          {error && <div className="p-4 text-red-500">{error}</div>}
          {isLoading ? (
            <DataTableSkeleton
              columnCount={1}
              // searchableColumnCount={1}
              // filterableColumnCount={2}
              cellWidths={["1rem"]}
              shrinkZero
            />
          ) : (
            <div className="flex flex-col gap-4 my-4">
              {notifications.map((n: any) => (
                <Card
                  key={n.notificationId}
                  className={`border ${
                    n.readBy.length === 0 ? "border-primary" : "border-gray-400"
                  }`}
                >
                  <CardHeader className="p-2">
                    <div className="flex justify-between items-center">
                      <Badge
                        className={`capitalize ${
                          n.readBy.length !== 0
                            ? "bg-gray-600"
                            : "bg-indigo-800"
                        } pointer-events-none`}
                      >
                        {n.topic.name}
                      </Badge>
                      {n.readBy.length === 0 && (
                        <Button
                          variant="ghost"
                          className="flex items-center gap-2 text-green-800 hover:bg-green-100 hover:text-green-800 transition"
                          size="sm"
                          onClick={() => handleMarkAsRead(n.notificationId)}
                        >
                          <CheckCircle className="w-4 h-4" />
                          Mark as Read
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-2 pt-0">
                    <p
                      className={`${
                        n.readBy.length !== 0
                          ? "text-gray-500"
                          : "text-gray-900"
                      }`}
                    >
                      {n.message}
                    </p>
                  </CardContent>

                  <p className="text-sm text-end p-1 text-gray-500">
                    {format(new Date(n.createdAt), "MMMM d, yyyy")}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button>Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
