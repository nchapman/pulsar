import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Text } from '@/shared/ui';
import { agentsLibModel } from '@/widgets/agents/model/agents-lib.model.ts';
import { ChatInput, ChatMsgList } from '@/widgets/chat';

import s from './AgentPlayground.module.scss';

interface Props {
  className?: string;
}

export const AgentPlayground = memo((props: Props) => {
  const { className } = props;
  const agent = useUnit(agentsLibModel.$currAgentData);

  if (!agent) return null;

  return (
    <div className={classNames(s.agentPlayground, [className])}>
      <div className={s.header}>
        <div className={s.headerUpper}>
          <Text w="semi" c="primary" s={18}>
            Playground
          </Text>
          <div className={s.limited}>Limited to 3 responses</div>
        </div>
        <Text s={14} c="tertiary">
          This is a demo chat for testing the selected agent.
        </Text>
      </div>

      <div className={s.chat}>
        <ChatMsgList demo className={s.msgList} agent={agent} />

        <ChatInput demo className={s.chatInput} />
      </div>
    </div>
  );
});
