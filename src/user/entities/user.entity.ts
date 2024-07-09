import {
  IsBoolean,
  IsEmail,
  isEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Book } from 'src/book/entities/book.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @IsNotEmpty({ message: '이메일을 입력해주세요' })
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @IsStrongPassword(
    { minLength: 6 },
    { message: '비밀번호 형식이 올바르지 않습니다.' },
  )
  @Column()
  password: string;

  @IsNotEmpty({ message: '닉네임을 입력해주세요' })
  @IsString()
  @Column()
  nickname: string;

  @IsNumber()
  @Column({ unsigned: true })
  points: number;

  @IsBoolean()
  @Column({ default: false })
  isAdmin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany((type) => Book, (book) => book.user)
  books: Book[];
}
