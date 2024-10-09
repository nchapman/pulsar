import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Logo, Text } from '@/shared/ui';

import s from './OnboardingContent.module.scss';

interface Props {
  className?: string;
}

// function loadFirstModel() {
//   const llava = curatedModels['llava-v1.6-mistral-7b'];
//   const llvaMmp = curatedModels['mmproj-model-file-f16'];
//
//   getDownloadPath(llava.file.name)
//     .then(async (path) => {
//       await modelManager.addModel({
//         dto: llava,
//         filePath: path,
//         type: 'llm',
//       });
//
//       return getDownloadPath(llvaMmp.file.name);
//     })
//     .then((path) => {
//       modelManager.addModel({
//         dto: llvaMmp,
//         filePath: path,
//         type: 'mmp',
//       });
//     });
// }
//
// function deleteModel() {
//   modelManager.deleteModel(userSettingsManager.get('defaultModel')!);
// }

export const OnboardingContent = memo((props: Props) => {
  const { className } = props;

  return (
    <div className={classNames(s.onboardingContent, [className])}>
      <Logo size="xl" />

      <Text className={s.title} c="primary" w="medium" s={48}>
        Welcome to Hiro
      </Text>

      {/* <Button variant="primary" onClick={loadFirstModel}> */}
      {/*  Load first model-file */}
      {/* </Button> */}

      {/* <Button variant="primary" onClick={deleteModel}> */}
      {/*  Delete current model-file */}
      {/* </Button> */}

      <Text>
        To get started we need to setup a model! You can download other models from Manage Models,
        but to start, we recommend one of the following:
      </Text>
    </div>
  );
});
