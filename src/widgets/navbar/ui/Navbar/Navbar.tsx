import { memo } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';
import { Button, Text } from '@/shared/ui';
import { classNames } from '@/shared/lib/func';
import s from './Navbar.module.scss';
import { switchChat } from '@/widgets/chat';
import { NewChatIcon } from '../../assets/NewChatIcon';
import { postsRepository } from '@/db';
import { Test } from '@/widgets/navbar/ui/Test/Test.tsx';

interface Props {
  className?: string;
}

const usePost = () => {
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    postsRepository.getById('Id0NgIH6cuMWjm0g').then(setPost);
  }, []);

  const handleChangePostTitle = async () => {
    setPost(await postsRepository.update('Id0NgIH6cuMWjm0g', { title: 'Justin Timberlake' }));
  };

  return { post, handleChangePostTitle };
};

export const Navbar = memo((props: Props) => {
  const { className } = props;
  const { post, handleChangePostTitle } = usePost();

  return (
    <div className={classNames(s.navbar, [className])}>
      <Button onClick={handleChangePostTitle}>
        <NewChatIcon />
      </Button>
      <Text className={s.title} type="heading-1">
        Pulsar 1.0
      </Text>

      <Test post={post} />

      <div className={s.history}>
        {['1', '2', '3'].map((chatId) => (
          <Button key={chatId} onClick={() => switchChat(chatId)}>
            C{chatId}
          </Button>
        ))}
      </div>
    </div>
  );
});
