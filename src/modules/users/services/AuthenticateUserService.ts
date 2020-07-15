import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/Users';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface Request {
    email: string;
    password: string;
}

interface Response {
    user: User;
    token: string;
}

@injectable()
class AuthenticateUserService {
    constructor(
        @inject('UserRepository') private usersRepository: IUserRepository,
        @inject('HashProvider') private hashProvider: IHashProvider
    ) {}

    public async execute({ email, password }: Request): Promise<Response> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Incorrect email/password combination', 401);
        }

        const passwordMatched = this.hashProvider.compareHash(password, user.password);

        if (!passwordMatched) {
            throw new AppError('Incorrect email/password combination', 401);
        }

        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        });

        return {
            user,
            token,
        };
    }
}

export default AuthenticateUserService;
