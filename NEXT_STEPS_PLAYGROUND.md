# Phase 2: The Playground Project (Safe Mode)

Since we want to keep the main project safe, we will create a copy of it to teach your colleague. This "Playground" version is where you can build the advanced features like "My Agenda" and "Search" without worry.

## 1. Setting Up the Playground
Run this command in your terminal to create a complete copy of your project in a new folder called `CCOI-Playground`:

```bash
# Make a copy of the folder
cp -r ../CCOI2026 ../CCOI-Playground

# Move into the new folder
cd ../CCOI-Playground

# Install dependencies (just to be safe)
npm install

# Start the dev server for the playground
npm run dev
```

*Note: You will need to open this new folder in VS Code to work on it.*

---

## 2. Lesson Plan: "My Agenda" (Favorites)
**Goal**: Add a "Star" button to sessions so users can make their own schedule.
**Concepts Taught**: React State, LocalStorage, Client-side interactivity.

### Step A: The Logic (The Hook)
Create a new file: `hooks/useBookmarks.ts`.
This manages the list of saved session IDs.

```typescript
import { useState, useEffect } from 'react';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  // Load from storage when app starts
  useEffect(() => {
    const saved = localStorage.getItem('ccoi-bookmarks');
    if (saved) setBookmarks(JSON.parse(saved));
  }, []);

  // Toggle a bookmark
  const toggleBookmark = (sessionId: string) => {
    const newBookmarks = bookmarks.includes(sessionId)
      ? bookmarks.filter(id => id !== sessionId) // Remove
      : [...bookmarks, sessionId]; // Add
    
    setBookmarks(newBookmarks);
    localStorage.setItem('ccoi-bookmarks', JSON.stringify(newBookmarks));
  };

  return { bookmarks, toggleBookmark };
}
```

### Step B: The UI (The Star Button)
In `app/agenda/page.tsx`, import the hook and add a button next to the session title.

```tsx
// 1. Import the hook
import { useBookmarks } from '../../hooks/useBookmarks';

// Inside the component...
const { bookmarks, toggleBookmark } = useBookmarks();

// 2. Inside your session map loop...
const isBookmarked = bookmarks.includes(session.time); // Assuming time is unique ID

return (
  <div className="flex gap-2">
    <button 
      onClick={() => toggleBookmark(session.time)}
      className="text-2xl"
    >
      {isBookmarked ? '★' : '☆'}
    </button>
    {/* ... rest of session content ... */}
  </div>
)
```

---

## 3. Lesson Plan: Global Search
**Goal**: Filter the agenda by typing.
**Concepts Taught**: Array filtering, Input handling.

### Step A: The Search Bar
In `app/agenda/page.tsx`, add a state for the search term.

```tsx
const [search, setSearch] = useState("");

// Add this input above your list
<input 
  type="text" 
  placeholder="Search sessions..." 
  className="w-full p-2 border rounded mb-4"
  onChange={(e) => setSearch(e.target.value.toLowerCase())}
/>
```

### Step B: The Filter Logic
Update how you get `groupedSessions`.

```tsx
const filteredSessions = sessions.filter(session => {
  if (!search) return true; // Show all if search is empty
  return (
    session.title.toLowerCase().includes(search) ||
    session.speakers.some(s => s.toLowerCase().includes(search))
  );
});

// Then group the *filtered* sessions
const groupedSessions = useMemo(() => {
  // ... use filteredSessions instead of sessions
}, [filteredSessions]);
```

---

## 4. Why this is good for teaching
1.  **Low Risk**: If the Playground breaks, you just delete the folder and copy it again.
2.  **Immediate Feedback**: They click a star, it turns yellow. They type, the list shrinks. It feels like magic.
3.  **Real World Skills**: Every app needs "Search" and "Save". These are foundational skills.
