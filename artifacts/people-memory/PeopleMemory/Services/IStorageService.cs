// Storage abstraction — swap implementation for Unity (e.g. PlayerPrefs/JSON)
namespace PeopleMemory.Services
{
    public interface IStorageService
    {
        Task<T?> GetItemAsync<T>(string key);
        Task SetItemAsync<T>(string key, T value);
        Task RemoveItemAsync(string key);
    }
}
