// Data model for a person — fully portable to Unity C#
using System;
using System.Collections.Generic;
using System.Linq;

namespace PeopleMemory.Models
{
    /// <summary>Represents a person in the database.</summary>
    public class Person
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; } = string.Empty;
        /// <summary>Base64-encoded photo (data URI).</summary>
        public string? PhotoBase64 { get; set; }
        public List<string> Tags { get; set; } = new();
        /// <summary>0 = untrusted, 10 = fully trusted.</summary>
        public int TrustLevel { get; set; } = 5;

        // ── Note sections ──
        public string Description      { get; set; } = string.Empty;
        public string Likes            { get; set; } = string.Empty;
        public string Dislikes         { get; set; } = string.Empty;
        public string ThingsToRemember { get; set; } = string.Empty;
        public string QuickFacts       { get; set; } = string.Empty;

        // ── Important dates ──
        public DateTime? Birthday    { get; set; }
        public DateTime? FirstMet    { get; set; }
        public DateTime? LastMet     { get; set; }
        public DateTime? NextMeeting { get; set; }
        public List<PersonDate> CustomDates { get; set; } = new();

        // ── Metadata ──
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>Count of filled note sections plus custom dates.</summary>
        public int NotesCount =>
            (string.IsNullOrWhiteSpace(Description)      ? 0 : 1) +
            (string.IsNullOrWhiteSpace(Likes)            ? 0 : 1) +
            (string.IsNullOrWhiteSpace(Dislikes)         ? 0 : 1) +
            (string.IsNullOrWhiteSpace(ThingsToRemember) ? 0 : 1) +
            (string.IsNullOrWhiteSpace(QuickFacts)       ? 0 : 1) +
            CustomDates.Count;

        /// <summary>Initials for the avatar (up to 2 characters).</summary>
        public string Initials
        {
            get
            {
                var parts = Name.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
                return parts.Length >= 2
                    ? $"{parts[0][0]}{parts[^1][0]}".ToUpper()
                    : Name.Length > 0 ? Name[0].ToString().ToUpper() : "?";
            }
        }
    }

    /// <summary>A custom date entry on a person's timeline.</summary>
    public class PersonDate
    {
        public string   Id    { get; set; } = Guid.NewGuid().ToString();
        public DateTime Date  { get; set; } = DateTime.Today;
        public string   Label { get; set; } = string.Empty;
    }
}
