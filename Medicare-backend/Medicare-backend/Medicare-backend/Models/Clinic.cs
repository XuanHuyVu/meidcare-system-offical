using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medicare_backend.Models
{
    public class Clinic
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("clinic_id")]
        public int ClinicId { get; set; }

        [MaxLength(100)]
        [Column("clinic_name")]
        public string? ClinicName { get; set; }
    }
}
