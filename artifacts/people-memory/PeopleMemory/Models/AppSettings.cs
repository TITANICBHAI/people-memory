// App settings model — stores PIN and auto-lock config
namespace PeopleMemory.Models
{
    public class AppSettings
    {
        public string PinHash          { get; set; } = string.Empty;
        public bool   IsPinSet         { get; set; } = false;
        public bool   AutoLockEnabled  { get; set; } = false;
        public int    AutoLockMinutes  { get; set; } = 5;
    }
}
