import { Response, Request } from 'express';
import { container } from 'tsyringe';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

export default class UserAvatarController {
    public async update(
        request: Request,
        response: Response
    ): Promise<Response> {
        const updateUserAvatarService = container.resolve(
            UpdateUserAvatarService
        );

        const user = await updateUserAvatarService.execute({
            userId: request.user.id,
            avatarFilename: request.file.originalname,
        });

        delete user.password;

        return response.json(user);
    }
}
