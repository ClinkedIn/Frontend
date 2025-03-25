import { http, HttpResponse } from "msw";
let storedOTP = Math.floor(100000 + Math.random() * 900000);
import axios from "axios";

const companyInfo ={
  userId: "12345",
  name: "Microsoft",
  address: "Cairo Cairo",
  website: "www.microsoft.com",
  industry: "software",
  organizationSize: "10000+",
  organizationType: "Public",
  logo: "https://purepng.com/public/uploads/large/purepng.com-microsoft-logo-iconlogobrand-logoiconslogos-251519939091wmudn.png",
  tagLine: "Every company has a mission. What's ours? To empower every person and every organization to achieve more. We believe technology can and should be a force for good and that meaningful innovation contributes to a brighter world in the future and today. Our culture doesn’t just encourage curiosity; it embraces it. Each day we make progress together by showing up as our authentic selves. We show up with a learn-it-all mentality. We show up cheering on others, knowing their success doesn't diminish our own. We show up every day open to learning our own biases, changing our behavior, and inviting in differences. Because impact matters.",
  _id: "12345",
  followers: [
    "string"
  ],
  visitors: [
    "string"
  ],
  createdAt: "2025-03-24T14:56:10.323Z",
  updatedAt: "2025-03-24T14:56:10.323Z"
};

const dummyUser = {
  name: "Hamsa Saber",
  email: "hamsa@gmail.com",
  location: "Cairo, Egypt",
  university: "Cairo University",
  profileImage: "https://picsum.photos/80",
};

const MOCK_POSTS = [
  {
    id: "post123",
    author: {
      id: "user456",
      name: "Hamsa Saber",
      headline: "Software Engineer at Tech Company",
      profileImage: "https://picsum.photos/80?random=1",
    },
    content: {
      text: "Excited to share that I've just completed a major project using React and Node.js! #webdevelopment #javascript #reactjs",
      media: [
        {
          type: "image",
          url: "https://picsum.photos/600/400?random=42",
          alt: "Project screenshot"
        }
      ]
    },
    metrics: {
      likes: 147,
      comments: 23,
      reposts: 12,
      impressions: 1893
    },
    reactions: [
      { type: "like", count: 89 },
      { type: "celebrate", count: 32 },
      { type: "support", count: 18 },
      { type: "insightful", count: 8 }
    ],
    comments: [
      {
        id: "comment789",
        authorId: "user789",
        authorName: "Ahmed Khaled",
        authorImage: "https://picsum.photos/80?random=7",
        text: "Great work! The UI looks amazing.",
        timestamp: "2025-03-22T14:30:00Z",
        likes: 5
      }
    ],
    timestamp: "2025-03-22T10:15:00Z",
    isEdited: false,
    visibility: "public",
    hashtags: ["webdevelopment", "javascript", "reactjs"]
  },
  {
    id: "post456",
    author: {
      id: "user789",
      name: "Ahmed Khaled",
      headline: "UX Designer at Creative Studio",
      profileImage: "https://picsum.photos/80?random=2",
    },
    content: {
      text: "Just published my latest UX case study on improving e-commerce checkout flows. Reduced cart abandonment by 23%! Check it out in the link below. #uxdesign #ecommerce #userresearch",
      media: [
        {
          type: "image",
          url: "https://picsum.photos/600/400?random=43",
          alt: "UX design mockup"
        }
      ]
    },
    metrics: {
      likes: 89,
      comments: 12,
      reposts: 7,
      impressions: 1250
    },
    reactions: [
      { type: "like", count: 42 },
      { type: "celebrate", count: 27 },
      { type: "insightful", count: 20 }
    ],
    comments: [
      {
        id: "comment456",
        authorId: "user456",
        authorName: "Hamsa Saber",
        authorImage: "https://picsum.photos/80?random=1",
        text: "Really impressive work! Would love to hear more about your research methodology.",
        timestamp: "2025-03-21T15:45:00Z",
        likes: 3
      }
    ],
    timestamp: "2025-03-21T11:30:00Z",
    isEdited: false,
    visibility: "public",
    hashtags: ["uxdesign", "ecommerce", "userresearch"]
  },
  {
    id: "post789",
    author: {
      id: "user101",
      name: "Sara Ali",
      headline: "Data Scientist at AI Solutions",
      profileImage: "https://picsum.photos/80?random=3",
    },
    content: {
      text: "I'm thrilled to announce that our research paper on predictive analytics in healthcare has been accepted for publication! A big thank you to my amazing team for their hard work and dedication. #datascience #machinelearning #healthcare",
      media: [
        {
          type: "image",
          url: "https://picsum.photos/600/400?random=44",
          alt: "Data visualization"
        }
      ]
    },
    metrics: {
      likes: 215,
      comments: 32,
      reposts: 45,
      impressions: 3240
    },
    reactions: [
      { type: "like", count: 105 },
      { type: "celebrate", count: 85 },
      { type: "support", count: 15 },
      { type: "insightful", count: 10 }
    ],
    comments: [
      {
        id: "comment123",
        authorId: "user456",
        authorName: "Hamsa Saber",
        authorImage: "https://picsum.photos/80?random=1",
        text: "Congratulations! Looking forward to reading the paper.",
        timestamp: "2025-03-20T09:15:00Z",
        likes: 2
      },
      {
        id: "comment124",
        authorId: "user789",
        authorName: "Ahmed Khaled",
        authorImage: "https://picsum.photos/80?random=2",
        text: "This is groundbreaking work. Would love to discuss potential applications.",
        timestamp: "2025-03-20T10:30:00Z",
        likes: 4
      }
    ],
    timestamp: "2025-03-20T08:45:00Z",
    isEdited: false,
    visibility: "public",
    hashtags: ["datascience", "machinelearning", "healthcare"]
  },
  {
    id: "post101",
    author: {
      id: "user202",
      name: "Mohamed Ayman",
      headline: "Frontend Developer | Open Source Contributor",
      profileImage: "https://picsum.photos/80?random=4",
    },
    content: {
      text: "I'm hosting a free workshop next week on 'Building Accessible Web Applications'. We'll cover WCAG guidelines, keyboard navigation, screen reader compatibility, and more. Everyone is welcome! Register with the link in comments. #accessibility #webdev #inclusivedesign",
      media: []
    },
    metrics: {
      likes: 78,
      comments: 19,
      reposts: 25,
      impressions: 1560
    },
    reactions: [
      { type: "like", count: 45 },
      { type: "celebrate", count: 18 },
      { type: "support", count: 10 },
      { type: "love", count: 5 }
    ],
    comments: [
      {
        id: "comment321",
        authorId: "user202",
        authorName: "Mohamed Ayman",
        authorImage: "https://picsum.photos/80?random=4",
        text: "Here's the registration link: workshop.example.com/register",
        timestamp: "2025-03-19T13:25:00Z",
        likes: 7
      },
      {
        id: "comment322",
        authorId: "user101",
        authorName: "Sara Ali",
        authorImage: "https://picsum.photos/80?random=3",
        text: "This is exactly what our industry needs more of. Thank you for organizing!",
        timestamp: "2025-03-19T14:10:00Z",
        likes: 3
      }
    ],
    timestamp: "2025-03-19T13:20:00Z",
    isEdited: true,
    visibility: "public",
    hashtags: ["accessibility", "webdev", "inclusivedesign"]
  }
];


const MOCK_USERS = [
  {
    email: "mohamedayman@gmail.com",
    id: "123",
    password: "hashedPassword@123", // This would be hashed in a real system
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
  http.get("/user", async () => {
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
    const notificationIndex = MOCK_NOTIFICATIONS.findIndex(
      (n) => n.id.toString() === id
    );
    if (notificationIndex !== -1) {
      MOCK_NOTIFICATIONS[notificationIndex] = {
        ...MOCK_NOTIFICATIONS[notificationIndex],
        isRead,
      };
      return HttpResponse.json({
        status: 200,
        success: true,
        message: "Notification updated successfully",
        updatedNotification: MOCK_NOTIFICATIONS[notificationIndex],
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
      return HttpResponse.json({
        success: true,
        message: "Notification deleted successfully",
      });
    } else {
      return HttpResponse.json(
        { success: false, message: "Notification not found" },
        { status: 404 }
      );
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
      return HttpResponse.json({
        success: true,
        message: "Notification restored",
      });
    } else {
      return HttpResponse.json(
        { success: false, message: "Notification already exists" },
        { status: 400 }
      );
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
      return HttpResponse.json({
        success: true,
        message: "OTP verified successfully!",
      });
    } else {
      return HttpResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 }
      );
    }
  }),

  // Mock API to register user
  http.post("/api/user/", async ({ request }) => {
    console.log("[MSW] Intercepted POST /api/user/");

    const { email, password, recaptchaToken } = await request.json();
    console.log("Received user data:", { email });

    // Validate required fields
    if (!email || !password || !recaptchaToken) {
        return HttpResponse.json(
            { error: "Missing required fields. Please provide email, password, and complete reCAPTCHA." },
            { status: 400 }
        );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return HttpResponse.json(
            { error: "Invalid email format. Please enter a valid email address." },
            { status: 400 }
        );
    }

    // Validate password strength
    const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
        return HttpResponse.json(
            { error: "Weak password. Must be at least 8 characters, contain an uppercase letter, a number, and a special character." },
            { status: 400 }
        );
    }

    // // Mock reCAPTCHA verification
    // if (recaptchaToken !== "mock-valid-recaptcha") {
    //     return HttpResponse.json(
    //         { error: "reCAPTCHA verification failed. Please try again." },
    //         { status: 400 }
    //     );
    // }

    // Check if user already exists
    const existingUser = MOCK_USERS.find((user) => user.email === email);
    if (existingUser) {
        return HttpResponse.json(
            { error: "User already exists." },
            { status: 409 } // Conflict
        );
    }

    // Create new user
    const newUser = { id: MOCK_USERS.length + 1, email, password, confirmed: false };
    MOCK_USERS.push(newUser);

    // Mock email confirmation link
    const confirmationLink = `https://example.com/confirm?email=${encodeURIComponent(email)}`;

    console.log("Generated confirmation link:", confirmationLink);

    // Mock authentication tokens
    const authToken = `mock-auth-token-${newUser.id}`;
    const refreshToken = `mock-refresh-token-${newUser.id}`;

    return HttpResponse.json(
        { message: "User created successfully. Check email for confirmation.", confirmationLink },
        {
            status: 201, // Created
            headers: { 
                "Set-Cookie": `authToken=${authToken}; HttpOnly, refreshToken=${refreshToken}; HttpOnly`
            },
        }
    );
  }),


  // Mock API to login user
  http.post("/api/user/login", async ({ request }) => {
    console.log("[MSW] Intercepted POST /api/user/login");

    const { email, password } = await request.json();
    console.log("Received user data:", { email });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return HttpResponse.json(
            { error: "Invalid email format. Please enter a valid email address." },
            { status: 400 }
        );
    }

    // Find user in the mock database
    const existingUser = MOCK_USERS.find((user) => user.email === email);

    if (!existingUser) {
        return HttpResponse.json(
            { error: "User not found. Please sign up first." },
            { status: 404 }
        );
    }

    // Check password match
    if (existingUser.password !== password) {
        return HttpResponse.json(
            { error: "Invalid email or password." },
            { status: 401 }
        );
    }

    // Mock authentication tokens
    const authToken = "mock-auth-token-" + existingUser.id;
    const refreshToken = "mock-refresh-token-" + existingUser.id;

    console.log("User logged in successfully:", { email });

    return HttpResponse.json(
        {
            message: "Login successful.",
            user: {
                id: existingUser.id,
                email: existingUser.email,
                name: existingUser.name,
                confirmed: existingUser.confirmed,
            },
            authToken,
            refreshToken,
        },
        {
            status: 200,
            headers: { 
                "Set-Cookie": `authToken=${authToken}; HttpOnly, refreshToken=${refreshToken}; HttpOnly`
            },
        }
    );
  }),


  http.post("/api/user/forgot-password", async ({ request }) => {
    console.log("[MSW] Intercepted POST /api/user/forgot-password");
    const { email } = await request.json();
    console.log("Received email:", email);
    const user = MOCK_USERS.find((user) => user.email === email);

    if (user) {
      console.log(email + " found in mock users.");
      return HttpResponse.json(
        {
          message: "Verification code sent.",
        },
        { status: 200 }
      );
    } else {
      console.log(email + " not found in mock users.");
      return HttpResponse.json(
        {
          error: "User not found.",
        },
        { status: 404 }
      );
    }
  }),

  http.patch("/api/user/profile", async ({ request }) => {
    const requestBody = await request.json();

    console.log("UpdateUserNameForm API call with data:", requestBody);

    if (!requestBody.firstName || !requestBody.lastName) {
      return new HttpResponse(
        JSON.stringify({
          success: false,
          message: "First name and last name are required",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return HttpResponse.json({
      success: true,
      message: "User name updated successfully",
      user: {
        id: "mock-user-id",
        firstName: requestBody.firstName,
        lastName: requestBody.lastName,
        additionalName: requestBody.additionalName || "",
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  http.patch("/api/user/update-password", async ({ request }) => {
    console.log("[MSW] Intercepted POST /api/user/update-password");
    const { currentPassword, newPassword, confirmPassword } =
      await request.json();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return HttpResponse.json(
        {
          success: false,
          message: "All password fields are required",
        },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return HttpResponse.json(
        {
          success: false,
          message: "New password and confirmation do not match",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return HttpResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters long",
        },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      success: true,
      message: "Password updated successfully",
      updatedAt: new Date().toISOString(),
    });
  }),






  // Add these to your handlers array
  //posts related handlers
http.get("/api/posts", async () => {
  console.log("[MSW] Intercepted GET /api/posts");
  return HttpResponse.json(MOCK_POSTS);
}),

http.get("/api/posts/:id", async ({ params }) => {
  console.log(`[MSW] Intercepted GET /api/posts/${params.id}`);
  const { id } = params;
  
  // Find the post in mock data
  const post = MOCK_POSTS.find(post => post.id === id);
  
  if (post) {
    return HttpResponse.json(post);
  } else {
    return HttpResponse.json(
      { success: false, message: "Post not found" },
      { status: 404 }
    );
  }
}),

http.post("/api/posts", async ({ request }) => {
  console.log("[MSW] Intercepted POST /api/posts");
  const postData = await request.json();
  
  // Create new post with generated ID
  const newPost = {
    id: `post${Date.now()}`,
    ...postData,
    timestamp: new Date().toISOString(),
    metrics: {
      likes: 0,
      comments: 0,
      reposts: 0,
      impressions: 0
    },
    reactions: [],
    comments: [],
    isEdited: false
  };
  
  // Add to beginning of posts array
  MOCK_POSTS.unshift(newPost);
  
  return HttpResponse.json(
    { success: true, message: 'Post created', post: newPost },
    { status: 201, delay: 300 }
  );
}),

// For liking/reacting to posts
http.post("/api/posts/:id/react", async ({ request, params }) => {
        console.log(`[MSW] Intercepted POST /api/posts/${params.id}/react`);
        const { id } = params;
        const { reactionType } = await request.json();
        
        const postIndex = MOCK_POSTS.findIndex(post => post.id === id);
        if (postIndex !== -1) {
          // Find if this reaction type already exists
        const reactionIndex = MOCK_POSTS[postIndex].reactions.findIndex(
          r => r.type === reactionType
        );
        
        if (reactionIndex !== -1) {
          // Increment existing reaction
          MOCK_POSTS[postIndex].reactions[reactionIndex].count += 1;
        } else {
          // Add new reaction type
          MOCK_POSTS[postIndex].reactions.push({ type: reactionType, count: 1 });
        }
        
        // Update total likes in metrics
        MOCK_POSTS[postIndex].metrics.likes = MOCK_POSTS[postIndex].reactions.reduce(
          (total, reaction) => total + reaction.count, 0
        );
        
        return HttpResponse.json({
          success: true,
          message: "Reaction added",
          post: MOCK_POSTS[postIndex]
        });
      }

      return HttpResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
      }),


   http.get("/companies/:companyId", async  ({ request, params }) => {
          console.log(`[MSW] Intercepted GET /api/companies/${params.companyId}`);
          return HttpResponse.json(companyInfo);
        }),
    http.put("/companies/:companyId",async ({ request, params }) => {
      console.log(`[MSW] Intercepted PUT /api/companies/${params.companyId}`);
      const companyInfo = await request.json();
      return HttpResponse.json({ companyInfo }, {
        status: 201
      });
    }),
    http.post("/companies/:companyId/follow",async ({ request, params }) => {
      console.log(`[MSW] Intercepted POST /api/companies/${params.companyId}/follow`);
      //const userId = await request.json() 
      return HttpResponse.json({ companyInfo }, {
        status: 200
      });
    }),
    http.delete("/companies/:companyId/follow",async ({ request, params }) => {
      console.log(`[MSW] Intercepted DELETE /api/companies/${params.companyId}/follow`);
      //const userId = await request.json() 
      return HttpResponse.json({ companyInfo }, {
        status: 201
      });
    }),
];
