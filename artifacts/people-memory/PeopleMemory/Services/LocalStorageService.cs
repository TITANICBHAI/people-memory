// Uses browser localStorage via JS interop.
// In Unity: replace with File.ReadAllText / File.WriteAllText on Application.persistentDataPath
using System.Text.Json;
using Microsoft.JSInterop;

namespace PeopleMemory.Services
{
    public class LocalStorageService : IStorageService
    {
        private readonly IJSRuntime _js;
        public LocalStorageService(IJSRuntime js) => _js = js;

        public async Task<T?> GetItemAsync<T>(string key)
        {
            var json = await _js.InvokeAsync<string?>("localStorage.getItem", key);
            if (json is null) return default;
            return JsonSerializer.Deserialize<T>(json);
        }

        public async Task SetItemAsync<T>(string key, T value)
        {
            var json = JsonSerializer.Serialize(value);
            await _js.InvokeVoidAsync("localStorage.setItem", key, json);
        }

        public async Task RemoveItemAsync(string key) =>
            await _js.InvokeVoidAsync("localStorage.removeItem", key);
    }
}
