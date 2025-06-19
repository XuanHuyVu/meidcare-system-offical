using System;
using Medicare_backend.Services.Pattern.Patients.Interfaces;

namespace Medicare_backend.Services.Pattern.Patients.Observers
{
    public class PatientLogger : IPatientObserver
    {
        public void Update(string message)
        {
            // Log the patient activity
            Console.WriteLine($"[LOG] {DateTime.Now}: {message}");
        }
    }
} 