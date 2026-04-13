import { SuccessResponse } from './types';

export const buildSuccessResponse = ({
  message,
  data,
}: {
  message: string;
  data?: any;
}): SuccessResponse => {
  return {
    success: true,
    message,
    data,
  };
};
