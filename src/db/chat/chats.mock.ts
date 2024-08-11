import { Chat, ModelSettings } from './chat.repository.ts';

const defaultModelSettings: ModelSettings = {
  topP: 0.9,
  temp: 0.8,
  maxLength: 10000,
  stopTokens: [],
};

function minusDaysTS(days: number): number {
  const today = new Date();
  return today.setDate(today.getDate() - days);
}

export const chatsMock: Chat[] = [
  {
    id: '1',
    title: 'Chat 1',
    messages: [
      {
        id: '1',
        text: 'Hello, world!',
        isUser: true,
        user: { name: 'User' },
      },
      {
        id: '2',
        text:
          'Of course! Here are some popular appetizer options that are easy to prepare and always a hit at potlucks:\n' +
          '\n' +
          'Bruschetta: Toasted bread rubbed with garlic and topped with chopped tomatoes, fresh basil, and olive oil.\n' +
          '\n' +
          'Deviled eggs: Hard-boiled eggs halved with the yolks mashed and mixed with mayonnaise, mustard, and seasonings, then piped back into the egg whites.\n' +
          '\n' +
          'Spring rolls: Thin rice paper wrapped around a variety of vegetables and/or meat, then fried until crispy.\n' +
          '\n' +
          'Meat and cheese platter: A selection of sliced deli meats, cheeses, crackers, and sometimes olives or pickles.\n' +
          '\n' +
          'Vegetable platter: A colorful assortment of raw and/or cooked vegetables served with a dipping sauce like ranch or hummus.\n' +
          '\n' +
          'Stuffed mushrooms: Large mushroom caps filled with a mixture of breadcrumbs, cheese, and sometimes sausage or bacon, then baked until golden.\n' +
          '\n' +
          'Spinach artichoke dip: A creamy dip made from spinach, artichoke hearts, cream cheese, and sometimes garlic and Parmesan cheese, served with tortilla chips or bread.\n' +
          '\n' +
          'Stuffed peppers: Halved bell peppers filled with a mixture of rice, ground meat, beans, and seasonings, then baked until tender.\n' +
          '\n' +
          'Chicken wings: Classic party food, either plain or coated in a sauce like barbecue, buffalo, or honey garlic.\n' +
          '\n' +
          'Stuffed jalapenos: Jalapeno peppers filled with a mixture of rice, ground meat, cheese, and seasonings, then baked until bubbly.\n' +
          '\n' +
          'Remember to consider any dietary restrictions or preferences among the guests when choosing your appetizers.',
        isUser: false,
        assistant: { userMsgId: '1', input: 'Hello, world!' },
      },
    ],
    model: 'chat',
    modelSettings: defaultModelSettings,
    createdAt: 1631182800000,
    updatedAt: minusDaysTS(0),
    isArchived: false,
    isPinned: true,
  },
  {
    id: '2',
    title: 'Chat 2',
    messages: [],
    model: 'chat',
    modelSettings: defaultModelSettings,
    createdAt: 1631182800000,
    updatedAt: minusDaysTS(0),
    isArchived: false,
    isPinned: false,
  },
  {
    id: '3',
    title: 'Chat 3',
    messages: [],
    model: 'chat',
    modelSettings: defaultModelSettings,
    createdAt: 1631182800000,
    updatedAt: minusDaysTS(1),
    isArchived: false,
    isPinned: false,
  },
  {
    id: '4',
    title: 'Chat 4',
    messages: [],
    model: 'chat',
    modelSettings: defaultModelSettings,
    createdAt: 1631182800000,
    updatedAt: minusDaysTS(40),
    isArchived: false,
    isPinned: false,
  },
  {
    id: '5',
    title: 'Chat 5',
    messages: [],
    model: 'chat',
    modelSettings: defaultModelSettings,
    createdAt: 1631182800000,
    updatedAt: minusDaysTS(600),
    isArchived: false,
    isPinned: false,
  },
];
