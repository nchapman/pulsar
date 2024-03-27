import { useStoreMap, useUnit } from 'effector-react';
import { JSX } from 'preact';
import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';

import { useLog } from '@/shared/lib/hooks';
import { $chat } from '@/widgets/chat';
import { $messages, $streamedText } from '@/widgets/chat/model/chat.ts';

export const useListScroll = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const msgEls = listRef.current?.children;
  const [isScrolling, setIsScrolling] = useState(false);

  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const chatId = useUnit($chat.id);
  const streamedText = useUnit($streamedText);
  const messagesNumber = useStoreMap({
    store: $messages.idsList,
    keys: [],
    fn: (ids) => ids.length,
  });

  useLog(isScrolling, 'isScrolling');

  useEffect(() => {
    setIsScrolling(false);
  }, [messagesNumber]);

  useEffect(() => {
    // Stick answer to top
    if (!msgEls || !listRef.current || msgEls.length < 1 || isScrolling) return;

    const lastAnswerHeight = msgEls[msgEls.length - 1].getBoundingClientRect().height;

    const lastAnsTopRelativeToStack = listRef.current.scrollHeight - lastAnswerHeight;
    listRef.current.scrollTo({ top: lastAnsTopRelativeToStack, behavior: 'instant' });
  }, [msgEls, chatId, streamedText, messagesNumber, isScrolling]);

  const scrollToBottom = useCallback((instant = false) => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: instant ? 'instant' : 'smooth',
    });
  }, []);

  return useMemo(() => {
    const onStackScroll: JSX.UIEventHandler<HTMLDivElement> = (e) => {
      const el = e.currentTarget;
      if (!el) return;
      setIsScrolling(true);
      const isScrolledToBottom = el.scrollHeight - el.scrollTop === el.clientHeight;
      setShowScrollBtn(!isScrolledToBottom);
    };

    return { listRef, showScrollBtn, scrollToBottom, onStackScroll };
  }, [listRef, showScrollBtn, scrollToBottom]);
};
