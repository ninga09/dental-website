# Deploying Next.js to cPanel

Moving from Render to cPanel is a great choice for stability and data persistence. Unlike Render, cPanel will NOT wipe your database files when the app restarts.

## Step 1: Prepare the Build
Run the following commands on your local machine to create a production-ready package:

```bash
npm run build
```

Verify that you have a `.next/standalone` folder.

## Step 2: ZIP the Deployment Files
You need to upload these specific files and folders to cPanel:
1.  `.next/standalone` (Everything inside this folder)
2.  `.next/static` (Copy this folder INTO `.next/standalone/.next/`)
3.  `public` (Copy this folder INTO `.next/standalone/`)
4.  `package.json`
5.  `prisma` (folder)
6.  `database.sqlite` (Your local database file)

**Crucial Manual Step**: Once you have the `standalone` folder, move `static` and `public` inside it as mentioned above so that images and styles load correctly.

## Step 3: Upload to cPanel
1.  Log in to your cPanel.
2.  Open **File Manager** and navigate to your domain's folder (usually `public_html` or a subdirectory).
3.  Upload your ZIP file and extract it.

## Step 4: Setup Node.js App in cPanel
1.  Search for **"Setup Node.js App"** in cPanel.
2.  Click **Create Application**.
3.  **Application root**: The directory where you uploaded the files.
4.  **Application URL**: Your domain name.
5.  **Application startup file**: Change this to `server.js`.
6.  **Environment Variables**:
    *   `NODE_ENV`: `production`
    *   `PORT`: `3000` (or whatever cPanel assigns)
    *   `DATABASE_URL`: `file:./database.sqlite`
7.  Click **Create** and then **Run JS Script** → `npm install` (if requested).

## Step 5: Configure SQLite Path
In cPanel, `/tmp` is also often restricted. Ensure your `lib/db.js` uses a relative path like `./database.sqlite` instead of `/tmp/dental.db` to keep the data permanently in your domain folder.

### Updated `lib/db.js` for cPanel:
```javascript
// Use a local path for cPanel persistence
const dbPath = path.join(process.cwd(), 'database.sqlite');
```

## Why cPanel is Better for You:
*   **Persistent File Storage**: Your database won't be deleted.
*   **Faster Loading**: Better response times for users in Kenya.
*   **Full Control**: You can easily back up your `database.sqlite` via File Manager.
