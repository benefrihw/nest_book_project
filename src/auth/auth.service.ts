import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DEFAULT_CUSTOMER_POINT } from 'src/constants/point.constant';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async signUp({ email, password, passwordConfirm, nickname }) {
    // 비밀번호 입력 확인
    const isPasswordMatched = password === passwordConfirm;
    if (!isPasswordMatched) {
      throw new BadRequestException('비밀번호가 서로 일치하지 않습니다.');
    }

    // 이메일 중복 확인
    const existedUser = await this.userRepository.findOneBy({ email });
    if (existedUser) {
      throw new BadRequestException('이미 가입 된 이메일입니다.');
    }

    // user 저장하기
    const user = await this.userRepository.save({
      email,
      password,
      nickname,
      points: DEFAULT_CUSTOMER_POINT,
    });
    // 비밀번호 삭제
    delete user.password;

    return user;
  }
}
