import { Chat } from '@/db/chat';

function groupChatsByDate(chats: Chat[]) {
  // Initialize groups
  const pinned: Chat[] = [];
  const today: Chat[] = [];
  const prev7days: Chat[] = [];
  const prev30days: Chat[] = [];
  const months: Record<string, Chat[]> = {};
  const years: Record<string, Chat[]> = {};

  // Get current date
  const currentDate = new Date();

  // Iterate over each chat
  chats.forEach((chat) => {
    // Parse updatedAt date
    const updatedAt = new Date(chat.updatedAt);

    // Calculate time difference in milliseconds
    const timeDiff = currentDate.getTime() - updatedAt.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    // Group chats based on time difference
    if (chat.isPinned) {
      pinned.push(chat);
    } else if (daysDiff === 0) {
      today.push(chat);
    } else if (daysDiff <= 7) {
      prev7days.push(chat);
    } else if (daysDiff <= 30) {
      prev30days.push(chat);
    } else {
      // TODO: redo this part
      const monthKey = updatedAt.toLocaleString('default', { month: 'long' });
      if (!months[monthKey]) {
        months[monthKey] = [];
      }
      months[monthKey].push(chat);

      const yearKey = updatedAt.getFullYear().toString();
      if (!years[yearKey]) {
        years[yearKey] = [];
      }
      years[yearKey].push(chat);
    }
  });

  // Format months object into array of objects
  const formattedMonths = Object.keys(months).map((key) => ({ month: key, chats: months[key] }));

  // Format years object into array of objects
  const formattedYears = Object.keys(years).map((key) => ({ year: key, chats: years[key] }));

  console.log(pinned);

  return {
    pinned,
    today,
    prev7days,
    prev30days,
    months: formattedMonths,
    years: formattedYears,
  };
}

function formatChatsList(groupedChats: ReturnType<typeof groupChatsByDate>) {
  const formattedList = [];

  if (groupedChats.pinned.length > 0) {
    formattedList.push({ period: 'Pinned Chats', chats: groupedChats.pinned });
  }

  // Add today chats
  if (groupedChats.today.length > 0) {
    formattedList.push({ period: 'Today', chats: groupedChats.today });
  }

  // Add previous 7 days chats
  if (groupedChats.prev7days.length > 0) {
    formattedList.push({ period: 'Previous 7 days', chats: groupedChats.prev7days });
  }

  // Add previous 30 days chats
  if (groupedChats.prev30days.length > 0) {
    formattedList.push({ period: 'Previous 30 days', chats: groupedChats.prev30days });
  }

  // Add chats grouped by months
  groupedChats.months.forEach((monthGroup) => {
    formattedList.push({ period: monthGroup.month, chats: monthGroup.chats });
  });

  // Add chats grouped by years
  groupedChats.years.forEach((yearGroup) => {
    formattedList.push({ period: yearGroup.year, chats: yearGroup.chats });
  });

  return formattedList;
}

export function groupChats(chats: Chat[]) {
  return formatChatsList(groupChatsByDate(chats));
}
