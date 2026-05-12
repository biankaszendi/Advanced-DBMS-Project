using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class AuditLogModel
    {
        [Key]
        public int LogID { get; set; }

        [Required]
        public DateTime EventDate { get; set; } = DateTime.Now;

        [Required]
        [StringLength(500)]
        public string EventDescription { get; set; }
    }
}