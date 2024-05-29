import { useStoreMap, useUnit } from 'effector-react';
import { JSX } from 'preact';
import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';

import { $chat, $messages, $streamedText } from '../model/chat.ts';

function updateScroll(el: HTMLDivElement | null) {
  setTimeout(() => {
    if (!el) return;
    // eslint-disable-next-line no-param-reassign
    el.scrollTop = el.scrollHeight;
  });
}

let isProgrammaticScroll = false;
let pinnedToBottom = true;

export const useListScroll = () => {
  const listRef = useRef<HTMLDivElement>(null);

  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const chatId = useUnit($chat.id);
  const streamedText = useUnit($streamedText);
  const messagesNumber = useStoreMap({
    store: $messages.idsList,
    keys: [],
    fn: (ids) => ids.length,
  });

  const scrollToBottom = useCallback((instant = false) => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: instant ? 'instant' : 'smooth',
    });
  }, []);

  useEffect(() => {
    isProgrammaticScroll = true;
    updateScroll(listRef.current);
  }, [chatId, messagesNumber]);

  useEffect(() => {
    if (!pinnedToBottom) return;
    updateScroll(listRef.current);
  }, [streamedText]);

  return useMemo(() => {
    const onStackScroll: JSX.UIEventHandler<HTMLDivElement> = (e) => {
      const el = e.currentTarget;
      if (!el) return;

      const { scrollTop } = el;
      const { scrollHeight } = el;
      const { clientHeight } = el;

      const isScrolledToBottom = el.scrollHeight - el.scrollTop === el.clientHeight;
      setShowScrollBtn(!isScrolledToBottom);

      if (isProgrammaticScroll) {
        isProgrammaticScroll = false;
        return;
      }

      if (scrollHeight - scrollTop === clientHeight) {
        // User scrolled to the bottom
        pinnedToBottom = true;
      } else {
        // User scrolled somewhere else
        pinnedToBottom = false;
      }
    };

    return { listRef, showScrollBtn, scrollToBottom, onStackScroll };
  }, [listRef, showScrollBtn, scrollToBottom]);
};
