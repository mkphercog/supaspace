# Changelog

</br>

## `v1.1.0`

### Changes:

- Added a profiles list showing current users in the app — visible only to logged-in users
- Added basic profile details — now you can view information about users who replied to your comment or added a post. In the profile, you can see their avatar, nickname, join date, and list of posts
- Added an `ImageSkeleton` component to improve image loading performance

</br>

## `v1.0.0` — Minimum Viable Product (MVP)

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
