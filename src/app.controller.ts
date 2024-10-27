import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { StatusResponseDto } from './app/dtos/status-response.dto';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @ApiOperation({ summary: 'Get app status' })
  @ApiResponse({ status: 200, description: 'Status of the application', type: StatusResponseDto })
  @Get('status')
  getStatus(): { status: string } {
    return this.appService.getStatus();
  }
}
