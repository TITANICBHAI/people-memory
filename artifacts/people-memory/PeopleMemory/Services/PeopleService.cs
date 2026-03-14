// CRUD service for the people database.
// Controller layer — portable to Unity with a different IStorageService implementation.
using PeopleMemory.Models;

namespace PeopleMemory.Services
{
    public class PeopleService
    {
        private readonly IStorageService _storage;
        private const string Key = "pm_people";
        private List<Person>? _cache;

        public PeopleService(IStorageService storage) => _storage = storage;

        /// <summary>Returns all stored people, using cache when available.</summary>
        public async Task<List<Person>> GetAllAsync()
        {
            _cache ??= await _storage.GetItemAsync<List<Person>>(Key) ?? new List<Person>();
            return _cache;
        }

        public async Task<Person?> GetByIdAsync(string id)
        {
            var all = await GetAllAsync();
            return all.FirstOrDefault(p => p.Id == id);
        }

        /// <summary>Insert or update a person.</summary>
        public async Task SaveAsync(Person person)
        {
            var all = await GetAllAsync();
            person.UpdatedAt = DateTime.UtcNow;
            var idx = all.FindIndex(p => p.Id == person.Id);
            if (idx >= 0) all[idx] = person;
            else          all.Add(person);
            _cache = all;
            await _storage.SetItemAsync(Key, all);
        }

        public async Task DeleteAsync(string id)
        {
            var all = await GetAllAsync();
            all.RemoveAll(p => p.Id == id);
            _cache = all;
            await _storage.SetItemAsync(Key, all);
        }

        /// <summary>Full-text search across name, tags, and all note fields.</summary>
        public async Task<List<Person>> SearchAsync(string query)
        {
            if (string.IsNullOrWhiteSpace(query)) return await GetAllAsync();
            var q   = query.ToLower().Trim();
            var all = await GetAllAsync();
            return all.Where(p =>
                p.Name.ToLower().Contains(q) ||
                p.Tags.Any(t => t.ToLower().Contains(q)) ||
                p.Description.ToLower().Contains(q) ||
                p.Likes.ToLower().Contains(q) ||
                p.Dislikes.ToLower().Contains(q) ||
                p.ThingsToRemember.ToLower().Contains(q) ||
                p.QuickFacts.ToLower().Contains(q) ||
                p.CustomDates.Any(d => d.Label.ToLower().Contains(q))
            ).ToList();
        }

        public void InvalidateCache() => _cache = null;
    }
}
