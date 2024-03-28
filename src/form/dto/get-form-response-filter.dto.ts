export class GetQueryParamsDto {
  limit?: number;
  afterDate?: string;
  beforeDate?: string;
  offset?: number;
  status?: 'finished' | 'in_progress';
  includeEditLink?: boolean;
  sort?: 'asc' | 'desc';
  filter?: string;
}

type QuestionType =
  | 'Address'
  | 'AudioRecording'
  | 'Calcom'
  | 'Calendly'
  | 'Captcha'
  | 'Checkbox'
  | 'Checkboxes'
  | 'ColorPicker'
  | 'CurrencyInput'
  | 'DatePicker'
  | 'DateRange'
  | 'DateTimePicker'
  | 'Dropdown'
  | 'EmailInput'
  | 'FileUpload'
  | 'ImagePicker'
  | 'LocationCoordinates'
  | 'LongAnswer'
  | 'Matrix'
  | 'MultiSelect'
  | 'MultipleChoice'
  | 'NumberInput'
  | 'OpinionScale'
  | 'Password'
  | 'Payment'
  | 'PhoneNumber'
  | 'Ranking'
  | 'RecordPicker'
  | 'ShortAnswer'
  | 'Signature'
  | 'Slider'
  | 'StarRating'
  | 'Switch'
  | 'TimePicker'
  | 'URLInput';

type Question = {
  id: string;
  name: string;
  type: QuestionType;
  value: number | string;
};

interface Response {
  submissionId: string;
  submissionTime: string;
  lastUpdatedAt: string;
  questions: Question[];
}

export class GetformResponsesDto {
  responses: Response[];
  totalResponses: number;
  pageCount: number;
}
