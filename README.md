# 220240170060
HTTP URL Shortener Microservices
 ---

## 🚀 Features

- Shorten any valid URL into a compact, shareable link.
- Optional **custom shortcode** for personalized URLs.
- Set **expiry time** for each URL (default: 30 minutes).
- Redirect users to the original URL when visiting the short link.
- Track click statistics including:
  - Timestamp
  - Referrer
  - IP address
- Retrieve detailed statistics for each shortcode.

---

## 🛠 Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **nanoid** - Unique shortcode generator
- **date-fns** - Date and time handling
- **In-memory store** - Temporary storage for URLs and clicks (can be replaced with a database)

---

## ⚡ Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
