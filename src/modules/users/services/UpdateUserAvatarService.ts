import path from 'path';
import fs from 'fs';
import { injectable, inject } from 'tsyringe';
import uploadConfig from '@config/upload';
import User from '@modules/users/infra/typeorm/entities/Users';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/providers/StorageProvider/models/IStorageProvider';
import IUserRepository from '../repositories/IUserRepository';

interface Request {
    userId: string;
    avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
    constructor(
        @inject('UserRepository') private usersRepository: IUserRepository,
        @inject('StorageProvider') private storageProvider: IStorageProvider
    ) {}

    public async execute({ userId, avatarFilename }: Request): Promise<User> {
        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new AppError(
                'Only authenticated users can change avatar',
                401
            );
        }

        if (user.avatar) {
            await this.storageProvider.deleteFile(user.avatar);
        }

        const filename = await this.storageProvider.saveFile(avatarFilename);

        user.avatar = filename;

        await this.usersRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;
