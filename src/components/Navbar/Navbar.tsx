import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../services/axios";
import { Link } from "react-router-dom";
import { Home, Users, Bell, User, LogOut } from "lucide-react";

const Navbar = () => {
  const queryClient = useQueryClient();

  /**
   * Fetches the authenticated user's data using a React Query `useQuery` hook.
   *
   * @constant
   * @type {object}
   * @property {object} data - The authenticated user's data.
   * @property {string[]} queryKey - The unique key for the query, used for caching and refetching.
   * @property {Function} queryFn - The function to fetch the authenticated user's data from the server.
   * @property {number} retry - The number of retry attempts for the query in case of failure (set to 0).
   *
   * @returns {object} The result of the query, including the authenticated user's data.
   */
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => (await axiosInstance.get("/me")).data,
    retry: 0,
  });
  
  const isLoggedIn = Boolean(authUser);

  /**
   * Fetches notifications data using a React Query `useQuery` hook.
   *
   * @constant
   * @type {object}
   * @property {Array|undefined} data - The fetched notifications data. It will be `undefined` if the query is disabled or still loading.
   * @returns {object} - The result of the query, including the `data` property containing the notifications.
   *
   * @remarks
   * - The query is enabled only when the user is logged in (`isLoggedIn` is true).
   * - The `queryFn` makes an HTTP GET request to the `/notifications` endpoint using `axiosInstance`.
   * - The `queryKey` is set to `["notifications"]` to uniquely identify this query.
   */
  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => (await axiosInstance.get("/notifications")).data,
    enabled: isLoggedIn,
  });

  /**
   * Fetches the list of connection requests for the logged-in user.
   *
   * @constant
   * @type {object}
   * @property {Array} data - The list of connection requests fetched from the server.
   * @returns {object} The result of the query containing the connection requests data.
   *
   * @remarks
   * This query is enabled only when the user is logged in (`isLoggedIn` is true).
   * It uses the `useQuery` hook from React Query to fetch data from the endpoint
   * `/connections/requests` using the `axiosInstance`.
   *
   * @see {@link https://tanstack.com/query/v4/docs/react/reference/useQuery | React Query useQuery Documentation}
   */
  const { data: connectionRequests } = useQuery({
    queryKey: ["connectionRequests"],
    queryFn: async () => (await axiosInstance.get("/connections/requests")).data,
    enabled: isLoggedIn,
  });

  /**
   * Custom hook that provides a mutation function for logging out a user.
   * 
   * This hook uses `useMutation` from React Query to handle the logout process.
   * It sends a POST request to the `/auth/logout` endpoint using `axiosInstance`.
   * On successful logout, it invalidates the `authUser` query in the query client
   * to ensure the authentication state is updated across the application.
   * 
   * @returns {Object} An object containing the `mutate` function renamed as `logout`.
   * 
   * @example
   * ```tsx
   * const { mutate: logout } = useLogout();
   * 
   * const handleLogout = () => {
   *   logout();
   * };
   * ```
   */
  const { mutate: logout } = useMutation({
    mutationFn: async () => await axiosInstance.post("/auth/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  /**
   * Calculates the count of unread notifications.
   *
   * Filters the `notifications` array to find notifications that have not been read
   * and returns the count of such notifications. If `notifications` is undefined or null,
   * the count defaults to 0.
   *
   * @constant
   * @type {number}
   * @default 0
   */
  const unreadNotificationCount = notifications?.filter((notification: { read: boolean }) => !notification.read).length || 0;
  
  /**
   * Represents the count of unread connection requests.
   * If `connectionRequests` is undefined or null, the count defaults to 0.
   *
   * @constant
   * @type {number}
   */
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