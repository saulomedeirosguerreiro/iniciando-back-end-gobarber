// import User from '@modules/users/infra/typeorm/entities/Users';
// import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import IMailProvider from '@shared/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

interface Request {
    email: string;
}
@injectable()
class SendForgotPasswordEmailService {
    constructor(
        @inject('UserRepository') private usersRepository: IUserRepository,
        @inject('MailProvider') private mailProvider: IMailProvider,
        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository
    ) {}

    public async execute({ email }: Request): Promise<void> {
        const checkUserExists = await this.usersRepository.findByEmail(email);

        if (!checkUserExists) {
            throw new AppError('User does not exists');
        }

        await this.userTokensRepository.generate(checkUserExists.id);

        this.mailProvider.sendMail(
            email,
            'Pedido de recuperação de email recebido'
        );
    }
}
export default SendForgotPasswordEmailService;
