import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Modal, Text } from '@/shared/ui';
import { agentsMock } from '@/widgets/agents/mocks/agents.mock.ts';
import { AgentsView } from '@/widgets/agents/types/agent.types.ts';
import { AgentsList } from '@/widgets/agents/ui/AgentsList/AgentsList.tsx';
import { AgentsSearch } from '@/widgets/agents/ui/AgentsSearch/AgentsSearch.tsx';

import { agentsChatInputModel } from '../../model/agents-chat-input.model.ts';
import s from './AgentAddModal.module.scss';

interface Props {
  className?: string;
}
export const AgentAddModal = memo((props: Props) => {
  const { className } = props;

  const isOpen = useUnit(agentsChatInputModel.$modalOpen);

  const agents = agentsMock;

  return (
    <Modal
      open={isOpen}
      className={classNames(s.agentAddModal, [className])}
      onClose={agentsChatInputModel.closeModal}
    >
      <Text className={s.title} s={18} w="semi">
        Add chat agents
      </Text>

      <AgentsSearch className={s.search} />

      <AgentsList agents={agents} view={AgentsView.AllAgents} />
    </Modal>
  );
});
