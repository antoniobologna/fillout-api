import { Controller, Get, Param, Query } from '@nestjs/common';
import { FormService } from './form.service';
import { GetQueryParamsDto } from './dto/get-form-response-filter.dto';

@Controller('fillout')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Get('/:id/filteredResponses')
  find(@Param('id') id: string, @Query() filters: GetQueryParamsDto) {
    return this.formService.find(id, filters);
  }
}
