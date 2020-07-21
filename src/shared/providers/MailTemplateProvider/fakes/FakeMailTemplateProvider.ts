import IMailTemplateProvider from '@shared/providers/MailTemplateProvider/models/IMailTemplateProvider';

class FakeMailTemplateProvider implements IMailTemplateProvider {
    public async parse(): Promise<string> {
        return 'Mail Content';
    }
}

export default FakeMailTemplateProvider;
