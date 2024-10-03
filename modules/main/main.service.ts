import { Injectable } from '@nestjs/common';

@Injectable()
export class MainService {
  greetings() {
    return "Hi I'm Friday";
  }
}
