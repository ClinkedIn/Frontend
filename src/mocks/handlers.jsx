import { http, HttpResponse } from "msw";

// const users = [
//   {
//     id: "c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d",
//     firstName: "John",
//     lastName: "Maverick",
//   },
//   {
//     id: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
//     firstName: "Jane",
//     lastName: "Doe",
//   },
// ];

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    type: "hiring",
    content: "<b>Amany Raafat</b> is hiring.",
    time: "4h",
    profileImg: "https://picsum.photos/80?random=1",
    isRead: false, 
  },
  {
    id: "2",
    type: "analytics",
    content: "Your posts got <b>15 impressions</b> last week. View your analytics.",
    time: "4h",
    profileImg: "https://picsum.photos/80?random=2",
    isRead: false, 
  },
  {
    id: "3",
    type: "course",
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
  // {
  //   id: "5",
  //   type: "job",
  //   content: "New job opportunities: <b>Software Engineer</b> at Microsoft.",
  //   time: "8h",
  //   profileImg: "https://picsum.photos/80?random=5",
  //   isRead: false, 
  // },
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
    type: "hiring",
    content: "<b>Ali Hassan</b> is looking for a <b>UX Designer</b>.",
    time: "3d",
    profileImg: "https://picsum.photos/80?random=9",
    isRead: false, 
  },
  // {
  //   id: "10",
  //   type: "job",
  //   content: "Exciting opportunity: <b>Data Scientist</b> at Google.",
  //   time: "2d",
  //   profileImg: "https://picsum.photos/80?random=10",
  //   isRead: false, 
  // },
];

export const handlers = [

  http.get("/notifications", async () => {
    console.log("[MSW] Intercepted GET /api/notifications");
    return HttpResponse.json(MOCK_NOTIFICATIONS);
  }),
];
