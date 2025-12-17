import type { Message } from "@/types/chat";

export const baseConversation: Message[] = [
  // ===== 17 DEC =====
  {
    id: "1",
    sender: "them",
    text: "Good morning 👋",
    time: "09:58",
    date: "2025-12-17",
  },
  {
    id: "2",
    sender: "me",
    text: "Good morning! How are you?",
    time: "10:00",
    date: "2025-12-17",
  },
  {
    id: "3",
    sender: "them",
    text: "All good, thanks. How about you?",
    time: "10:01",
    date: "2025-12-17",
  },
  {
    id: "4",
    sender: "me",
    text: "Doing well 👍 Just checking updates on the project.",
    time: "10:02",
    date: "2025-12-17",
  },
  {
    id: "5",
    sender: "them",
    text: "Sure. I’ve reviewed the latest designs.",
    time: "10:05",
    date: "2025-12-17",
  },
  {
    id: "6",
    sender: "them",
    text: "Added a few images for review.",
    time: "10:06",
    date: "2025-12-17",
    attachments: [
      "http://chatvia-light.react.themesbrand.com/static/media/img-2.47239849213a8e77c6ce.jpg",
      "https://images.unsplash.com/photo-1433838552652-f9a46b332c40?auto=format&fit=crop&w=400&q=60",
      "https://doot-light.react.themesbrand.com/static/media/img-1.94735bdcb4171caaa01e.jpg",
    ],
  },
  {
    id: "7",
    sender: "me",
    text: "Looks nice 👌 I like the second one the most.",
    time: "10:08",
    date: "2025-12-17",
  },
  {
    id: "8",
    sender: "them",
    text: "Great! I’ll move forward with that style.",
    time: "10:09",
    date: "2025-12-17",
  },
  {
    id: "9",
    sender: "me",
    text: "By the way, are we still on for tomorrow’s meeting?",
    time: "10:10",
    date: "2025-12-17",
  },
  {
    id: "10",
    sender: "them",
    text: "Yes 👍 Tomorrow at 10:00 AM as planned.",
    time: "10:11",
    date: "2025-12-17",
  },
  {
    id: "11",
    sender: "me",
    text: "Perfect, see you then.",
    time: "10:12",
    date: "2025-12-17",
  },

  // ===== 16 DEC =====
  {
    id: "12",
    sender: "them",
    text: "Hey, did you get a chance to check the docs?",
    time: "18:20",
    date: "2025-12-16",
  },
  {
    id: "13",
    sender: "me",
    text: "Yes, I reviewed them this afternoon.",
    time: "18:22",
    date: "2025-12-16",
  },
  {
    id: "14",
    sender: "me",
    text: "Everything looks fine, just a few minor comments.",
    time: "18:23",
    date: "2025-12-16",
  },
  {
    id: "15",
    sender: "them",
    text: "Nice, I’ll fix those today.",
    time: "18:24",
    date: "2025-12-16",
  },
  {
    id: "16",
    sender: "them",
    text: "Uploading updated version shortly.",
    time: "18:25",
    date: "2025-12-16",
  },
  {
    id: "17",
    sender: "me",
    text: "Cool, ping me once it’s ready.",
    time: "18:26",
    date: "2025-12-16",
  },

  // ===== 15 DEC =====
  {
    id: "18",
    sender: "them",
    text: "Morning! Are you available today?",
    time: "09:10",
    date: "2025-12-15",
  },
  {
    id: "19",
    sender: "me",
    text: "Yes, I’m free after lunch.",
    time: "09:12",
    date: "2025-12-15",
  },
  {
    id: "20",
    sender: "them",
    text: "Great, let’s sync around 3 PM.",
    time: "09:13",
    date: "2025-12-15",
  },
  {
    id: "21",
    sender: "me",
    text: "Works for me 👍",
    time: "09:14",
    date: "2025-12-15",
  },
];

export const conversationByUser: Record<number, Message[]> = {
  5: baseConversation,
  2: baseConversation,
};
