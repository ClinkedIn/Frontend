import { http, HttpResponse } from "msw";
let storedOTP = Math.floor(100000 + Math.random() * 900000);
import axios from "axios";

const dummyUser = {
    name: "Hamsa Saber",
    email:"hamsa@gmail.com",
    location: "Cairo, Egypt",
    university: "Cairo University",
    profileImage: "https://picsum.photos/80",
  };


const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    type: "job",
    content: "<b>Amany Raafat</b> is hiring.",
    time: "4h",
    profileImg: "https://picsum.photos/80?random=1",
    isRead: false, 
  },
  {
    id: "2",
    type: "post",
    subType:"reactions",
    content: "Your posts got <b>15 impressions</b> last week. View your analytics.",
    time: "4h",
    profileImg: "https://picsum.photos/80?random=2",
    isRead: false, 
  },
  {
    id: "3",
    type: "job",
    content: "New from <b>Free Online Courses with Certificates</b>",
    time: "11h",
    profileImg: "https://picsum.photos/80?random=3",
    isRead: false, 
  },
  {
    id: "4",
    type:"post",
    subType: "comments",
    content: "<b>John Maverick</b> commented on your post: 'Great insights!'",
    time: "2h",
    profileImg: "https://picsum.photos/80?random=4",
    isRead: false, 
  },
  {
    id: "5",
    type: "job",
    content: "New job opportunities: <b>Software Engineer</b> at Microsoft.",
    time: "8h",
    profileImg: "https://picsum.photos/80?random=5",
    isRead: false, 
  },
  {
    id: "6",
    type: "post",
    subType: "reactions",
    content: "<b>Jane Doe</b> liked your post.",
    time: "30m",
    profileImg: "https://picsum.photos/80?random=6",
    isRead: false, 
  },
  {
    id: "7",
    type: "post",
    subType:"reposts",
    content: "<b>Ahmed Khaled</b> reposted your article: 'The Future of AI'.",
    time: "5h",
    profileImg: "https://picsum.photos/80?random=7",
    isRead: false, 
  },
  {
    id: "8",
    type: "mention",
    content: "<b>Sara Ali</b> mentioned you in a comment: '@yourusername check this out!'.",
    time: "1h",
    profileImg: "https://picsum.photos/80?random=8",
    isRead: false, 
  },
  {
    id: "9",
    type: "job",
    content: "<b>Ali Hassan</b> is looking for a <b>UX Designer</b>.",
    time: "3d",
    profileImg: "https://picsum.photos/80?random=9",
    isRead: false, 
  },
  {
    id: "10",
    type: "job",
    content: "Exciting opportunity: <b>Data Scientist</b> at Google.",
    time: "2d",
    profileImg: "https://picsum.photos/80?random=10",
    isRead: false, 
  },
];

export const handlers = [
// Modify the existing POST handler
http.post('/api/send-notification', async ({ request }) => {
  const { title, body } = await request.json();
  
  // Create new notification object
  const newNotification = {
    id: Date.now().toString(),
    type: "job",
    content: `${title} - ${body}`,
    time: "Just now",
    profileImg: `https://picsum.photos/80?random=${Math.floor(Math.random() * 1000)}`,
    isRead: false,
    subType: "system"
  };

  // Add to beginning of mock array
  MOCK_NOTIFICATIONS.unshift(newNotification);

  return HttpResponse.json(
    { success: true, message: 'Notification sent', notification: newNotification },
    { status: 200, delay: 150 }
  );
}),
  //Mock API to get User
  http.get("/user", async()=>{
    console.log("[MSW] Intercepted GET /api/user");
    return HttpResponse.json(dummyUser);
  }),
  //Mock API to get notifications
  http.get("/notifications", async () => {
    console.log("[MSW] Intercepted GET /api/notifications");
    return HttpResponse.json(MOCK_NOTIFICATIONS);
  }),

  //Mock API to get unread notifications count
  http.get("/notifications/unseenCount", () => {
    const unreadCount = MOCK_NOTIFICATIONS.filter(
      (notification) => !notification.isRead
    ).length;
    
    return HttpResponse.json({ count: unreadCount });
  }),

  //Mock API to handling reading notification
  http.patch("/notifications/:id/read", async ({ request, params }) => {
    console.log(`[MSW] Intercepted PATCH /notifications/${params.id}`);
    const { id } = params;
    const { isRead } = await request.json();

    // Find the notification in the mock data
    const notificationIndex = MOCK_NOTIFICATIONS.findIndex((n) => n.id.toString() === id);
    if (notificationIndex !== -1) {
      MOCK_NOTIFICATIONS[notificationIndex] = {
        ...MOCK_NOTIFICATIONS[notificationIndex],
        isRead
      };
      return HttpResponse.json({
        status: 200,
        success: true,
        message: "Notification updated successfully",
        updatedNotification: MOCK_NOTIFICATIONS[notificationIndex]
      });
    } 
    
    return HttpResponse.json(
      { success: false, message: "Notification not found" },
      { status: 404 }
    );
  }),
  //Mock Api to delete a notification
  http.delete("/notifications/:id", async ({ params }) => {
    console.log(`[MSW] Intercepted DELETE /notifications/${params.id}`);
    const { id } = params;

    // Find the notification in the mock data and remove it
    const notificationIndex = MOCK_NOTIFICATIONS.findIndex((n) => n.id === id);
    if (notificationIndex !== -1) {
      MOCK_NOTIFICATIONS.splice(notificationIndex, 1); // Remove the notification
      return HttpResponse.json({ success: true, message: "Notification deleted successfully" });
    } else {
      return HttpResponse.json({ success: false, message: "Notification not found" }, { status: 404 });
    }
  }),
 //Mock API to restore notification
  http.post("/notifications/restore", async ({ request }) => {
    console.log("[MSW] Intercepted POST /notifications/restore");
    
    const notification = await request.json();
    
    // Check if the notification already exists
    const exists = MOCK_NOTIFICATIONS.some((n) => n.id === notification.id);
    
    if (!exists) {
      MOCK_NOTIFICATIONS.push(notification); // Restore the notification
      return HttpResponse.json({ success: true, message: "Notification restored" });
    } else {
      return HttpResponse.json({ success: false, message: "Notification already exists" }, { status: 400 });
    }
  }),

  // Mock API to request OTP
   http.get("/request-otp", async () => {
    storedOTP = Math.floor(100000 + Math.random() * 900000);
    return HttpResponse.json({ success: true, otp: storedOTP });
  }),

  // Mock API to verify OTP
  http.post("/verify-otp", async ({ request }) => {
    const { otp } = await request.json();
    if (otp == storedOTP) {
      return HttpResponse.json({ success: true, message: "OTP verified successfully!" });
    } else {
      return HttpResponse.json({ success: false, message: "Invalid OTP" }, { status: 400 });
    }
  }),


  
];
