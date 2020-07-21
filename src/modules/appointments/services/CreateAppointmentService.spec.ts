import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppError from '@shared/errors/AppError';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        createAppointmentService = new CreateAppointmentService(
            fakeAppointmentsRepository
        );
    });

    it('should be able to create a new appointment', async () => {
        const appointment = await createAppointmentService.execute({
            providerId: '123123',
            date: new Date(),
        });
        expect(appointment).toHaveProperty('id');
        expect(appointment.providerId).toBe('123123');
    });

    it('should not be able to create two appointments on the same time ', async () => {
        const appointmentDate = new Date();
        await createAppointmentService.execute({
            providerId: '123123',
            date: appointmentDate,
        });
        expect(
            createAppointmentService.execute({
                providerId: '123123',
                date: appointmentDate,
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
