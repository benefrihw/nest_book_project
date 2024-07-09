import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DEFAULT_CUSTOMER_POINT } from 'src/constants/point.constant';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { SignInDto } from './dtos/sign-in.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
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

    const hashRounds = this.configService.get<number>('PASSWORD_HASH_ROUNDS');
    const hashedPassword = bcrypt.hashSync(password, hashRounds);

    // user 저장하기
    const user = await this.userRepository.save({
      email,
      password: hashedPassword,
      nickname,
      points: DEFAULT_CUSTOMER_POINT,
    });
    return this.signIn(user.id);
  }

  signIn(userId: number) {
    // 토큰 생성
    const payload = { id: userId };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  // 이메일, 비밀번호 일치여부 확인
  async validateUser({ email, password }: SignInDto) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, password: true },
    });
    const isPasswordMatched = bcrypt.compareSync(
      password,
      user?.password ?? '',
    );
    if (!user || !isPasswordMatched) {
      return null;
    }
    return { id: user.id };
  }
}
