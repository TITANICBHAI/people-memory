// PIN authentication service.
// Uses SHA-256 hashing — same implementation can be used in Unity via System.Security.Cryptography.
using System.Security.Cryptography;
using System.Text;
using PeopleMemory.Models;

namespace PeopleMemory.Services
{
    public class PinService
    {
        private readonly IStorageService _storage;
        private const string SettingsKey = "pm_settings";
        private const string Salt        = "PeopleMemory_2026";

        private bool     _isUnlocked  = false;
        private DateTime _lastActivity = DateTime.UtcNow;

        public PinService(IStorageService storage) => _storage = storage;

        public bool IsUnlocked => _isUnlocked;

        public async Task<AppSettings> GetSettingsAsync() =>
            await _storage.GetItemAsync<AppSettings>(SettingsKey) ?? new AppSettings();

        public async Task<bool> IsPinSetAsync()
        {
            var s = await GetSettingsAsync();
            return s.IsPinSet;
        }

        public async Task SetPinAsync(string pin)
        {
            var s      = await GetSettingsAsync();
            s.PinHash  = Hash(pin);
            s.IsPinSet = true;
            await _storage.SetItemAsync(SettingsKey, s);
        }

        public async Task<bool> VerifyPinAsync(string pin)
        {
            var s = await GetSettingsAsync();
            if (!s.IsPinSet) { _isUnlocked = true; return true; }
            var ok = s.PinHash == Hash(pin);
            if (ok) { _isUnlocked = true; _lastActivity = DateTime.UtcNow; }
            return ok;
        }

        public void RecordActivity() => _lastActivity = DateTime.UtcNow;

        public void Lock() => _isUnlocked = false;

        public async Task<bool> ShouldAutoLockAsync()
        {
            var s = await GetSettingsAsync();
            if (!s.AutoLockEnabled || !_isUnlocked) return false;
            return (DateTime.UtcNow - _lastActivity).TotalMinutes >= s.AutoLockMinutes;
        }

        public async Task SaveSettingsAsync(AppSettings settings) =>
            await _storage.SetItemAsync(SettingsKey, settings);

        private static string Hash(string pin) =>
            Convert.ToBase64String(
                SHA256.HashData(Encoding.UTF8.GetBytes(pin + Salt)));
    }
}
