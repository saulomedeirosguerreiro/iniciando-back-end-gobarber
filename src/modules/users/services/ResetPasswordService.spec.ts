import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPasswordService: ResetPasswordService;

describe('ResetPassword', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();
        resetPasswordService = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokensRepository,
            fakeHashProvider
        );
    });

    it('should be able to reset password ', async () => {
        const user = await fakeUsersRepository.create({
            name: 'saulo',
            email: 'saulo.medeiros@g4flex.com.br',
            password: '123456',
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        await resetPasswordService.execute({
            token,
            password: '123123',
        });

        const updatedUser = await fakeUsersRepository.findById(user.id);
        expect(generateHash).toHaveBeenCalledWith('123123');
        expect(updatedUser?.password).toBe('123123');
    });

    it('should not be able to reset password tith non-existing token ', async () => {
        await expect(
            resetPasswordService.execute({
                token: 'non-existing-token',
                password: '123456',
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset password tith non-existing user ', async () => {
        const { token } = await fakeUserTokensRepository.generate(
            'non-existing-user'
        );
        await expect(
            resetPasswordService.execute({
                token,
                password: '123456',
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to reset password if passed  more than 2 hours', async () => {
        const user = await fakeUsersRepository.create({
            name: 'saulo',
            email: 'saulo.medeiros@g4flex.com.br',
            password: '123456',
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        });

        await expect(
            resetPasswordService.execute({
                token,
                password: '123123',
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
