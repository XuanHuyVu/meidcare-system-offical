using System;

namespace Medicare_backend.Services.Pattern.Patients.Interfaces
{
    public interface IPatientObserver
    {
        void Update(string message);
    }
} 