using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medicare_backend.Models
{
    public class Specialty
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("specialty_id")]
        public int SpecialtyId { get; set; }

        [MaxLength(100)]
        [Column("specialty_name")]
        public string? SpecialtyName { get; set; }
    }
}
