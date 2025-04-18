import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";

const notify = (title: string, description: string) => toast.custom((t) => (
    <div
      className={`${
        t.visible ? 'animate-enter-custom' : 'animate-leave'
      } max-w-md w-full bg-neutral-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-white">{title}</p>
            <p className="mt-1 text-sm text-gray-300">{description}</p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-white">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-green-400 hover:text-green-500 focus:outline-none"
        >
          <CheckCircle />
        </button>
      </div>
    </div>
));

const RECONNECTION_DELAY = 5000; // 5 seconds

const subscribeToUserNotifications = (): EventSource | null => {
    try {
        const eventSource = new EventSource('https://localhost:8081/api/notification/subscribe', {
            withCredentials: true
        });

        eventSource.onmessage = (event) => {
            const notification = JSON.parse(event.data);
            
            if (notification.type === "connected") {
                console.log("Connected to notification stream");
                notify("Notification connected", "Successfully connected to notifications");
                return;
            }
            
            const notificationDetails = JSON.parse(notification.message);
            notify(notificationDetails.title, notificationDetails.message);
        };

        eventSource.onerror = (error) => {
            console.error("SSE error:", error);
            if (eventSource) {
                eventSource.close();
            }

            // Attempt reconnection
            console.log("Attempting to reconnect...");
            setTimeout(() => {
                subscribeToUserNotifications();
            }, RECONNECTION_DELAY);
        };

        return eventSource;
    } catch (error) {
        console.error("Error creating EventSource:", error);
        return null;
    }
};

const NotificationListener = () => {
    useEffect(() => {
        let eventSource: EventSource | null = null;

        // Function to handle visibility change
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && !eventSource) {
                eventSource = subscribeToUserNotifications();
            }
        };

        // Initial connection
        eventSource = subscribeToUserNotifications();

        // Listen for visibility changes
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Cleanup function
        return () => {
            if (eventSource) {
                eventSource.close();
            }
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return null;
};

export default NotificationListener;
