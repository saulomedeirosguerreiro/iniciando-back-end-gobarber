import IParseMailTemplateDTO from '@shared/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

export default interface IMailTemplateProvider {
    parse(data: IParseMailTemplateDTO): Promise<string>;
}
