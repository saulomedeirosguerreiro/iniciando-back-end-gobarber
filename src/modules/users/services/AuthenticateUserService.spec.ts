import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import CreateUsersService from '@modules/users/services/CreateUserService';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

import AppError from '@shared/errors/AppError';

describe('Authenticate User', () => {
    it('should be able to authenticate', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const createUsersService = new CreateUsersService(
            fakeUsersRepository,
            fakeHashProvider
        );
        const authenticateUsersService = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider
        );

        const user = await createUsersService.execute({
            name: 'saulo',
            email: 'saulo.medeiros@g4flex.com.br',
            password: '123456',
        });

        const response = await authenticateUsersService.execute({
            email: 'saulo.medeiros@g4flex.com.br',
            password: '123456',
        });

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it('should be able to authenticate with non existing user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const authenticateUsersService = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider
        );

        await expect(
            authenticateUsersService.execute({
                email: 'saulo.medeiros@g4flex.com.br',
                password: '123456',
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to authenticate with wrong password', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const createUsersService = new CreateUsersService(
            fakeUsersRepository,
            fakeHashProvider
        );
        const authenticateUsersService = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider
        );

        await createUsersService.execute({
            name: 'saulo',
            email: 'saulo.medeiros@g4flex.com.br',
            password: '123456',
        });

        await expect(
            authenticateUsersService.execute({
                email: 'saulo.medeiros@g4flex.com.br',
                password: '1236',
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
