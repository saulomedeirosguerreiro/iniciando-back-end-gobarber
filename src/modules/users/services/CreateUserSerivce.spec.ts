import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUsersService from '@modules/users/services/CreateUserService';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUsersService: CreateUsersService;

describe('CreateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        createUsersService = new CreateUsersService(
            fakeUsersRepository,
            fakeHashProvider
        );
    });
    it('should be able to create a new user', async () => {
        const user = await createUsersService.execute({
            name: 'saulo',
            email: 'saulo.medeiros@g4flex.com.br',
            password: '123456',
        });
        expect(user).toHaveProperty('id');
        expect(user.name).toBe('saulo');
    });

    it('should be able to create a new user with same email another ', async () => {
        await createUsersService.execute({
            name: 'saulo',
            email: 'saulo.medeiros@g4flex.com.br',
            password: '123456',
        });

        await expect(
            createUsersService.execute({
                name: 'thiago',
                email: 'saulo.medeiros@g4flex.com.br',
                password: '123',
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
