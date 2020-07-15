import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUsersService from '@modules/users/services/CreateUserService';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import AppError from '@shared/errors/AppError';
describe('CreateUser', () => {
    it('should be able to create a new user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const createUsersService = new CreateUsersService(fakeUsersRepository,fakeHashProvider);
        const user = await createUsersService.execute({name:'saulo', email:'saulo.medeiros@g4flex.com.br', password:'123456'});
        expect(user).toHaveProperty('id');
        expect(user.name).toBe('saulo');
    });

    it('should be able to create a new user with same email another ', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUsersService = new CreateUsersService(fakeUsersRepository,fakeHashProvider);
        await createUsersService.execute({name:'saulo', email:'saulo.medeiros@g4flex.com.br', password:'123456'});

        expect(createUsersService.execute({name:'thiago', email:'saulo.medeiros@g4flex.com.br', password:'123'})
        ).rejects.toBeInstanceOf(AppError);
    });
});