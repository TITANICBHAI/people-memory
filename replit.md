# People Memory — Blazor WASM Private Database

## Project overview
A fully offline personal people-memory database. Built with **Blazor WebAssembly** (C# / .NET 8).  
All data persists in browser localStorage. Zero backend. Zero server. Zero database.  
Code is architected for easy portability to Unity C# (swap `LocalStorageService` for a PlayerPrefs/file implementation).

## Stack
- **Runtime**: Blazor WebAssembly (.NET 8)
- **Language**: C#
- **UI theme**: Unity Editor dark style (#1E1E1E / #252526 / #007ACC)
- **Storage**: Browser localStorage via JS interop
- **No JS frameworks**, no npm build step

## Artifact
- **Artifact id**: `artifacts/people-memory`
- **Preview path**: `/`
- **Port**: 24841 (injected via `$PORT` into `start-blazor.sh`)

## Key files
```
artifacts/people-memory/
  start-blazor.sh                     # Startup script (sets port, runs dotnet)
  PeopleMemory/
    PeopleMemory.csproj               # .NET 8 Blazor WASM project
    Program.cs                        # DI wiring
    App.razor                         # PIN gate
    _Imports.razor
    Layout/MainLayout.razor           # App shell + lock button
    Pages/
      PinLock.razor                   # 4–6 digit PIN setup + verify screen
      Dashboard.razor                 # Sortable/searchable Excel-style table
      PersonProfile.razor             # Hero, timeline, likes/dislikes, trust
      AddEditPerson.razor             # Full CRUD form
    Models/
      Person.cs                       # Person, PersonDate data models
      AppSettings.cs                  # App settings model
    Services/
      IStorageService.cs              # Portability seam (swap for Unity)
      LocalStorageService.cs          # localStorage via JS interop
      PeopleService.cs                # CRUD + search + sort
      PinService.cs                   # SHA-256 PIN hashing
    wwwroot/
      index.html                      # SRI disabled for proxy compatibility
      css/app.css                     # Full Unity dark theme CSS
      js/localStorage.js              # JS interop helpers
```

## Features
- PIN lock screen (4–6 digit, SHA-256 hashed, setup on first launch)
- Sortable + searchable dashboard table with tag filter bar
- Person profiles: photo (base64), trust level (0–10), tags
- Timelines with custom date entries
- Likes / dislikes / things to remember / quick facts
- Important dates: birthday, first met, last met, next meeting
- Full CRUD (add, edit, delete with confirmation)
- 100% offline — no network calls except Google Fonts

## Architecture note — Unity portability
`IStorageService` is the single portability seam. To run on Unity:
1. Implement `IStorageService` using `PlayerPrefs` or `System.IO` (JSON files)
2. Replace DI wiring in `Program.cs` with a Unity ServiceLocator
3. No other code changes needed
