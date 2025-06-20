using System;

namespace Medicare_backend.Services.Pattern.Patients.Interfaces
{
    public interface IPatientSubject
    {
        void RegisterObserver(IPatientObserver observer);
        void RemoveObserver(IPatientObserver observer);
        void NotifyObservers(string message);
    }
} 