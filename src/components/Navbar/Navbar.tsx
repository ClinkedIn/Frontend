import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../services/axios";
import { Link } from "react-router-dom";
import { Home, Users, Bell, User, LogOut } from "lucide-react";

const Navbar = () => {
  const queryClient = useQueryClient();

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => (await axiosInstance.get("/me")).data,
    retry: 0,
  });
  
  const isLoggedIn = Boolean(authUser);

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => (await axiosInstance.get("/notifications")).data,
    enabled: isLoggedIn,
  });

  const { data: connectionRequests } = useQuery({
    queryKey: ["connectionRequests"],
    queryFn: async () => (await axiosInstance.get("/connections/requests")).data,
    enabled: isLoggedIn,
  });

  const { mutate: logout } = useMutation({
    mutationFn: async () => await axiosInstance.post("/auth/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const unreadNotificationCount = notifications?.filter((notification: { read: boolean }) => !notification.read).length || 0;
  const unreadConnectionRequestsCount = connectionRequests?.length || 0;

  return (
    <nav className="bg-secondary shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <img className="h-8 rounded" src="/public/images/small-logo.png" alt="LinkedIn" />
            </Link>
          </div>
          <div className="flex items-center gap-2 md:gap-6">
            {isLoggedIn ? (
              <>
                <Link to="/" className="text-neutral flex flex-col items-center">
                  <Home size={20} />
                  <span className="text-xs hidden md:block">Home</span>
                </Link>
                <Link to="/network" className="text-neutral flex flex-col items-center relative">
                  <Users size={20} />
                  <span className="text-xs hidden md:block">My Network</span>
                  {unreadConnectionRequestsCount > 0 && (
                    <span className="absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs rounded-full size-3 md:size-4 flex items-center justify-center">
                      {unreadConnectionRequestsCount}
                    </span>
                  )}
                </Link>
                <Link to="/notifications" className="text-neutral flex flex-col items-center relative">
                  <Bell size={20} />
                  <span className="text-xs hidden md:block">Notifications</span>
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs rounded-full size-3 md:size-4 flex items-center justify-center">
                      {unreadNotificationCount}
                    </span>
                  )}
                </Link>
                <Link to={`/profile/${authUser?.username}`} className="text-neutral flex flex-col items-center">
                  <User size={20} />
                  <span className="text-xs hidden md:block">Me</span>
                </Link>
                <button
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                  onClick={() => logout()}
                >
                  <LogOut size={20} />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Join now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;