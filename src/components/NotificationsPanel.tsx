import { ServerNotification } from '@modelcontextprotocol/sdk/types.js';

interface NotificationsPanelProps {
  notifications: ServerNotification[];
  onClear: () => void;
}

export function NotificationsPanel({ notifications, onClear }: NotificationsPanelProps) {
  return (
    <div className="p-4 border rounded-lg mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Notifications</h2>
        <button
          onClick={onClear}
          disabled={notifications.length === 0}
          className={`px-3 py-1 rounded ${
            notifications.length === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-red-500 text-white hover:bg-red-600'
          }`}
        >
          Clear
        </button>
      </div>
      
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications received</p>
      ) : (
        <div className="max-h-60 overflow-y-auto">
          {notifications.map((notification, index) => (
            <div key={index} className="mb-2 p-3 border rounded">
              <div className="font-bold mb-1">
                Method: {notification.method}
              </div>
              <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-sm">
                {JSON.stringify(notification.params, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
