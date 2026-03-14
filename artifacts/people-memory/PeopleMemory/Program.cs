using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using PeopleMemory;
using PeopleMemory.Services;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

// Register services
builder.Services.AddScoped<IStorageService, LocalStorageService>();
builder.Services.AddScoped<PeopleService>();
builder.Services.AddScoped<PinService>();

await builder.Build().RunAsync();
