# Changelog

### Version `1.2.2` changes:

- Unified styles in the post detail view — consistent button appearance (e.g. delete button) and added breadcrumbs for improved navigation
- Added basic user roles support (admin, standard) — groundwork for future permission handling

---

### Version `1.2.1` changes:

- Added author information for reactions
- Fixed issue where multiple reactions could be sent on slow internet connections

---

### Version `1.2.0` changes:

- Added the ability to react to comments
- Improved accessibility
- Fixed an issue with comment form IDs that caused unexpected behavior

---

### Version `1.1.1` changes:

- Convert images to `.webp` before uploading to storage for better loading performance
- Improve app performance by lazy-loading `MDEditor` and `MDPreview`
- Reduce API requests: data is now refetched only after at least 3 minutes
- Fix an issue where the comment form was not cleared after submitting a comment

---

### Version `1.1.0` changes:

- Added a profiles list showing current users in the app — visible only to logged-in users
- Added basic profile details — now you can view information about users who replied to your comment or added a post. In the profile, you can see their avatar, nickname, join date, and list of posts
- Added an `ImageSkeleton` component to improve image loading performance

---

### Version `1.0.0` — MVP (Minimum Viable Product)

Initial release of **Supa.space()**, a minimal and lightweight social platform.

### Features:

- Google login with automatic account creation
- Editable user profile (avatar & nickname)
- Post creation with a Markdown editor + live preview
- Delete your own posts
- Image support (with preview):
  - Max **200kB** for avatars
  - Max **300kB** for post images  
    _(Images are automatically scaled in the background)_
- Voting system for posts (upvotes/downvotes)
- Commenting on posts, with the ability to delete your own comments
- Account deletion permanently removes all associated data
- Clean, fast, and privacy-focused user experience
