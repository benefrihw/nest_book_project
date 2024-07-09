import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsStrongPassword } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class SignUpDto extends PickType(User, [
  'email',
  'password',
  'nickname',
]) {
  /**
   * 비밀번호 확인
   * @example "User123!"
   */
  @IsNotEmpty({ message: '비밀번호 확인을 입력해주세요.' })
  @IsStrongPassword(
    { minLength: 6 },
    { message: '비밀번호 형식이 올바르지 않습니다.' },
  )
  passwordConfirm: string;
}
