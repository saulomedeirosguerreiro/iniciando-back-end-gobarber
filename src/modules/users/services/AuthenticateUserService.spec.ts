import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import CreateUsersService from '@modules/users/services/CreateUserService';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUsersService: CreateUsersService;
let authenticateUsersService: AuthenticateUserService;

describe('Authenticate User', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        createUsersService = new CreateUsersService(
            fakeUsersRepository,
            fakeHashProvider
        );
        authenticateUsersService = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider
        );
    });

    it('should be able to authenticate', async () => {
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
        await expect(
            authenticateUsersService.execute({
                email: 'saulo.medeiros@g4flex.com.br',
                password: '123456',
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to authenticate with wrong password', async () => {
        await createUsersService.execute({
            name: 'saulo',
            email: 'saulo.medeiros@g4flex.com.br',
            password: '123456',
        });

        await expect(
            authenticateUsersService.execute({
                email: 'saulo.medeiros@g4flex.com.br',
                password: '1231',
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
