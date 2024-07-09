import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SignInDto } from './dtos/sign-in.dto';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 회원가입
   * @Param signUpDto
   * @return
   */
  @Post('/sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const data = await this.authService.signUp(signUpDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: '회원가입에 성공했습니다',
      data,
    };
  }

  /**
   * 로그인
   * @param req
   * @param signInDto
   * @returns
   */
  @UseGuards(AuthGuard('local'))
  @Post('sign-in')
  async signIn(@Request() req, @Body() signInDto: SignInDto) {
    return req.user;
  }
}
