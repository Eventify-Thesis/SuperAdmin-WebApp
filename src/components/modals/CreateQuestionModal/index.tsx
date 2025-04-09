import { Button } from '@mantine/core';
import {
  GenericModalProps,
  Question,
  QuestionRequestData,
  QuestionType,
} from '@/types/types.ts';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useParams } from 'react-router-dom';
import { Modal } from '../../common/Modal';
import { QuestionForm } from '../../forms/QuestionForm';
import { showError } from '@/utils/notifications.tsx';
import { useTranslation } from 'react-i18next';
import { useListTicketTypes } from '@/queries/useTicketTypeQueries';
import { useQuestionMutations } from '@/queries/useQuestionQueries';
import { QuestionBelongsTo, QuestionModel } from '@/domain/QuestionModel';

interface CreateQuestionModalProps extends GenericModalProps {
  onCompleted: (question: Question) => void;
  reloadQuestions: () => void;
}

export const CreateQuestionModal = ({
  onClose,
  onCompleted,
  reloadQuestions,
}: CreateQuestionModalProps) => {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const { data: ticketTypesResponse } = useListTicketTypes(eventId!);
  const ticketTypes = ticketTypesResponse || [];
  const { createQuestionMutation } = useQuestionMutations(eventId!);

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      type: QuestionType.SINGLE_LINE_TEXT,
      required: false,
      options: [],
      ticketTypeIds: [],
      belongsTo: QuestionBelongsTo.ORDER,
      isHidden: false,
    },
  });

  const handleSubmit = async (values: QuestionModel) => {
    try {
      const question = await createQuestionMutation.mutateAsync(values);
      notifications.show({
        message: t('questions.create.success'),
        color: 'green',
      });
      onCompleted(question);
      form.reset();
      onClose();
    } catch (error: any) {
      if (error?.response?.data?.errors) {
        form.setErrors(error.response.data.errors);
      } else {
        showError(t('questions.create.error'));
      }
    }
  };

  return (
    <Modal opened onClose={onClose} heading={t('questions.create.title')}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <QuestionForm form={form} ticketTypes={ticketTypes} />
        <Button
          loading={createQuestionMutation.isPending}
          type="submit"
          fullWidth
          mt="xl"
        >
          {createQuestionMutation.isPending
            ? t('questions.create.working')
            : t('questions.create.title')}
        </Button>
      </form>
    </Modal>
  );
};
