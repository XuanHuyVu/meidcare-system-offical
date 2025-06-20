namespace Medicare_backend.Services.Interfaces
{
    public interface IMedicalRecordService
    {
        void AddMedicalRecord(int patientId, string diagnosis);
    }
}
