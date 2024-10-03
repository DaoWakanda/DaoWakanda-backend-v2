import { ApiProperty } from '@nestjs/swagger';

export class AdminDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  id: string;
}
