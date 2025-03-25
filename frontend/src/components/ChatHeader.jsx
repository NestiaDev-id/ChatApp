import { Edit3, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  if (!selectedUser) return null;

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.username || "User"}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">
              {selectedUser.username || "Unknown User"}
            </h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex gap-2">
          {/* Edit Button */}
          <button
            className="flex items-center gap-1 px-3 py-1.5"
            onClick={() => alert("Edit Profile")}
          >
            <Edit3 className="w-4 h-4" />
            <span className="hidden sm:inline">Edit</span>
          </button>

          {/* Close Button */}
          <button className="p-2" onClick={() => setSelectedUser(null)}>
            <X className="w-5 h-5 text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
