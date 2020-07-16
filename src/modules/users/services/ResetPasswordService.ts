import { isAfter, addHours } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import AppError from '@shared/errors/AppError';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface Request {
    token: string;
    password: string;
}
@injectable()
class ResetPasswordService {
    constructor(
        @inject('UserRepository') private usersRepository: IUserRepository,
        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository,
        @inject('HashProvider')
        private hashProvider: IHashProvider
    ) {}

    public async execute({ token, password }: Request): Promise<void> {
        const userToken = await this.userTokensRepository.findByToken(token);
        if (!userToken) {
            throw new AppError('User token does not exists');
        }

        const user = await this.usersRepository.findById(userToken.userId);

        if (!user) {
            throw new AppError('User does not exists');
        }

        const tokenCreateAt = userToken.createdAt;
        const compareDate = addHours(tokenCreateAt, 2);

        if (isAfter(Date.now(), compareDate)) {
            throw new AppError('Token Expired');
        }

        user.password = await this.hashProvider.generateHash(password);

        await this.usersRepository.save(user);
    }
}
export default ResetPasswordService;
