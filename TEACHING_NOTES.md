# CCOI 2026 Website - Teaching Notes

## 1. ELI5: What is this project?
Imagine you are making a **digital conference booklet**.

- **The Content (`data/`)**: In a real booklet, you have a list of speakers and a schedule. In this project, we keep that information in simple text files (JSON). If a speaker changes, we just edit the text file, we don't have to redesign the page.
- **The Design (`app/`)**: This is the "template" of the booklet. We define what a "Speaker Page" looks like once, and the code automatically fills it with the 100+ speakers from our content.
- **The Engine (Next.js)**: This is the machine that takes our Content and our Design and mashes them together into a website.
- **The Hosting (GitHub Pages)**: This is the library shelf where we put the finished booklet so anyone can read it.

---

## 2. Project Structure (The Skeleton)

This project uses **Next.js (App Router)**. Here is how the folders map to the website:

### `app/` (The Pages)
Every folder inside `app` becomes a URL on the website.
- `app/page.tsx` → The Home Page (`/`)
- `app/agenda/page.tsx` → The Agenda Page (`/agenda`)
- `app/speakers/page.tsx` → The Speakers Page (`/speakers`)
- `app/layout.tsx` → The "Frame" of the website. This holds the navigation bar and the footer. It wraps around every other page.

### `data/` (The Brain)
This is where the actual information lives.
- `agenda.json`: Contains the schedule, times, and speaker names.
- `speakers.json`: (If used) contains bios and photos.
- **Why?** It separates *code* from *content*. A non-programmer can update the schedule just by editing `agenda.json`.

### `public/` (The Assets)
- Images, icons, and logos go here.
- **Important**: Because we are on GitHub Pages, we use a special helper to find these images.

### `lib/` (The Tools)
- `utils.ts`: Contains small helper functions.
- **Key Tool**: `getImagePath()`. This function makes sure images load correctly whether we are testing on our laptop or viewing the live site on GitHub.

---

## 3. Key Concepts We Used

### A. The "App Shell" Layout
**Problem**: The navigation bar was covering up text, or the page was scrolling weirdly.
**Solution**: We made the main window (`body`) fixed height (`h-screen`) so it never scrolls. We put the content inside a specific box that *does* scroll. This makes it feel like a mobile app.

### B. Dynamic Linking
**Problem**: We wanted to click a speaker in the Agenda and see their bio.
**Solution**:
1. We gave every speaker a "slug" (a unique ID, like `john-doe`).
2. When you click a name in the Agenda, it sends you to `/speakers?slug=john-doe`.
3. The Speakers page reads that ID and automatically opens the popup.

### C. GitHub Pages Deployment
**Problem**: Images were broken on the live site.
**Solution**: GitHub Pages hosts the site at `username.github.io/repo-name`. Next.js thinks the site is at `/`. We had to tell Next.js to add `/repo-name` to every image and link.

---

## 4. The "Recipe" (Prompt History)

Here is a summary of the requests (prompts) used to build the advanced features:

1.  **"Fix the broken images"**
    *   *Action*: Created `lib/utils.ts` to handle image paths dynamically.

2.  **"The navigation bar is blocking the page"**
    *   *Action*: Refactored `layout.tsx` to use Flexbox and fixed positioning (CSS).

3.  **"Center the speaker popup"**
    *   *Action*: Used CSS Flexbox (`items-center justify-center`) on the popup container.

4.  **"Handle 'Fireside Chats' with Hosts and Guests"**
    *   *Action*: Wrote custom logic in `speakers/page.tsx` to parse strings like "Hosts: A, B Guests: C, D" and split them into individual speakers.

5.  **"Link the Agenda to the Speaker Popup (and back)"**
    *   *Action*: Added `Link` components with URL parameters (`?day=innovation` or `?slug=name`) and used `useEffect` to handle scrolling and popup opening.
