import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthProvider } from 'src/modules/auth/dto/auth-provider.enum';
import { Repository } from 'typeorm';
import { User } from '../entity/user';

@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private usersRepository: Repository<User>,
  ) { }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  findOneByGoogleId(id: string): Promise<User> {
    return this.usersRepository.findOne({ where: { googleId: id } })
  }

  async registerOAuthUser(user: User, thirdPartyId: string, provider: AuthProvider): Promise<User> {
    switch (provider) {
      case AuthProvider.GOOGLE:
        user.googleId = thirdPartyId;
        break;
    }

    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}