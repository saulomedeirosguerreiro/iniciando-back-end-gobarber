import User from '@modules/users/infra/typeorm/entities/Users';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface Request {
    name: string;
    email: string;
    password: string;
}
@injectable()
class CreateUserService {
    constructor(
        @inject('UserRepository') private usersRepository: IUserRepository,
        @inject('HashProvider') private hashProvider: IHashProvider
    ) {}

    public async execute({ name, email, password }: Request): Promise<User> {
        const checkUserExists = await this.usersRepository.findByEmail(email);

        if (checkUserExists) {
            throw new AppError('Email Address already used');
        }

        const hashedPassword = await this.hashProvider.generateHash(password);

        const user = await this.usersRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        return user;
    }
}

export default CreateUserService;
