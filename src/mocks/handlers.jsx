import { http, HttpResponse } from "msw";

const users = [
  {
    id: "c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d",
    firstName: "John",
    lastName: "Maverick",
  },
  {
    id: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
    firstName: "Jane",
    lastName: "Doe",
  },
];

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    type: "hiring",
    content: "<b>Amany Raafat</b> is hiring.",
    time: "4h",
    profileImg: "/api/placeholder/50/50",
    isNew: true,
  },
  {
    id: "2",
    type: "analytics",
    content: "Your posts got <b>15 impressions</b> last week. View your analytics.",
    time: "4h",
    profileImg: "/api/placeholder/50/50",
    isNew: true,
  },
  {
    id: "3",
    type: "course",
    content: "New from <b>Free Online Courses with Certificates</b>: Boost Your Skills with 100 Free Courses and Certificates on Udemy and Coursera",
    time: "11h",
    profileImg: "/api/placeholder/50/50",
    isNew: true,
  },
];

export const handlers = [


  http.get("/notifications", async () => {
    console.log("[MSW] Intercepted GET /api/notifications");
    return HttpResponse.json(MOCK_NOTIFICATIONS);
  }),
];
