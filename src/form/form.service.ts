import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import {
  GetQueryParamsDto,
  GetformResponsesDto,
} from './dto/get-form-response-filter.dto';

type FilterClauseType = {
  id: string;
  condition: 'equals' | 'does_not_equal' | 'greater_than' | 'less_than';
  value: number | string;
};

// each of these filters should be applied like an AND in a "where" clause
// in SQL
type ResponseFiltersType = FilterClauseType[];

@Injectable()
export class FormService {
  private readonly logger = new Logger(FormService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async find(
    id: string,
    filters: GetQueryParamsDto,
  ): Promise<GetformResponsesDto> {
    const url = `${this.configService.get('FILLOUT_URL')}/v1/api/forms/${id}/submissions`;
    // I could prob expand this into a QueryFilter class that would handle the conversion of the filters to the correct format

    const urlWithQueryParams = `${url}?${new URLSearchParams(filters as Record<string, string>).toString()}`;

    const { data } = await firstValueFrom(
      this.httpService
        .get<GetformResponsesDto>(urlWithQueryParams, {
          headers: {
            Authorization: `Bearer ${this.configService.get('FILLOUT_API_KEY')}`,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );

    // Let's include filtering and filter data

    if (filters.filter) {
      const filterClause = JSON.parse(filters.filter) as ResponseFiltersType;
      const filteredResponses = data.responses.filter((response) => {
        // we should filter by filter.id, filter.condition, and filter.value for each responses' questions

        return filterClause.every((filter) => {
          // return filter.id === response.submissionId;
          const question = response.questions.find((q) => q.id === filter.id);
          if (!question) return false;
          switch (filter.condition) {
            case 'equals':
              return question.value === filter.value;
            case 'does_not_equal':
              return question.value !== filter.value;
            case 'greater_than':
              // check to see if type is string date and do appropiate conversion and validation
              if (
                typeof question.value === 'string' &&
                question.type === 'DatePicker' &&
                !isNaN(Date.parse(question.value)) &&
                typeof filter.value === 'string' &&
                !isNaN(Date.parse(filter.value))
              ) {
                return new Date(question.value) > new Date(filter.value);
              }

              return question.value > filter.value;
            case 'less_than':
              return question.value < filter.value;
            default:
              return false;
          }
        });
      });

      return {
        responses: filteredResponses,
        totalResponses: filteredResponses.length,
        pageCount: 1,
      };
    }

    return data;
  }
}
