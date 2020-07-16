import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import FakeStorageAvatar from '@shared/providers/StorageProvider/fakes/FakeStorageAvatar';

import AppError from '@shared/errors/AppError';

describe('Update UserAvatar', () => {
    it('should be able to update avatar', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageAvatar = new FakeStorageAvatar();
        const updateUserAvatarService = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageAvatar
        );
        const user = await fakeUsersRepository.create({
            name: 'saulo',
            email: 'saulo.medeiros@g4flex.com.br',
            password: '123456',
        });
        await updateUserAvatarService.execute({
            avatarFilename: 'avatar.jpg',
            userId: user.id,
        });
        expect(user.avatar).toBe('avatar.jpg');
    });

    it('should not be able to update avatar from non existing user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageAvatar = new FakeStorageAvatar();
        const updateUserAvatarService = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageAvatar
        );
        await expect(
            updateUserAvatarService.execute({
                avatarFilename: 'avatar.jpg',
                userId: 'non-existing-user',
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should delete old avatar when updating new one', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageAvatar = new FakeStorageAvatar();

        const deleteFile = jest.spyOn(fakeStorageAvatar, 'deleteFile');

        const updateUserAvatarService = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageAvatar
        );
        const user = await fakeUsersRepository.create({
            name: 'saulo',
            email: 'saulo.medeiros@g4flex.com.br',
            password: '123456',
        });
        await updateUserAvatarService.execute({
            avatarFilename: 'avatar.jpg',
            userId: user.id,
        });
        await updateUserAvatarService.execute({
            avatarFilename: 'avatar2.jpg',
            userId: user.id,
        });
        expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
        expect(user.avatar).toBe('avatar2.jpg');
    });
});
