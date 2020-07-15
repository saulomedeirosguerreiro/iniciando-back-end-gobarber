import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
describe('CreateAppointment', () => {
    it('should be able to create a new appointment', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        const createAppointmentService = new CreateAppointmentService(fakeAppointmentsRepository);
        const appointment = await createAppointmentService.execute({ providerId:'123123', date:new Date() });
        expect(appointment).toHaveProperty('id');
        expect(appointment.providerId).toBe('123123');

    });
});