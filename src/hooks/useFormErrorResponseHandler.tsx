import { UseFormReturnType } from '@mantine/form';
import { useTranslation } from 'react-i18next';

import { showError } from '@/utils/notifications';

type ErrorResponse = {
  response?: {
    data?: {
      errors?: Record<string, string>;
    };
    status?: number;
  };
};

export const useFormErrorResponseHandler = () => {
  const { t } = useTranslation();
  return (
    form: UseFormReturnType<any>,
    error: ErrorResponse | any,
    errorMessage = t`Please check the provided information is correct`,
  ) => {
    if (error?.response?.data?.errors) {
      form.setErrors(error.response.data.errors);
    }

    if (error?.response?.status && error.response.status >= 500) {
      showError(
        <>
          <p>
            {t`There was an error processing your request. Please try again.`}
          </p>
          <p style={{ fontSize: '0.8rem', color: '#ccc' }}>
            Error: {error.response.status}
          </p>
        </>,
      );
      return;
    }

    if (error?.response?.status && error.response.status >= 400) {
      showError(errorMessage);
      return;
    }

    showError(t`An unexpected error occurred. Please try again.`);
  };
};
