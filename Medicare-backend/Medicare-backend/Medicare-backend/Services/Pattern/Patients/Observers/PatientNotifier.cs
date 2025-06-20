using System;
using Medicare_backend.Services.Pattern.Patients.Interfaces;

namespace Medicare_backend.Services.Pattern.Patients.Observers
{
    public class PatientNotifier : IPatientObserver
    {
        public void Update(string message)
        {
            // Send notifications about patient activities
            Console.WriteLine($"[NOTIFICATION] {DateTime.Now}: {message}");
        }
    }
} 