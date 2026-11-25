# Four Muses Collections — Website

Static HTML site for fourmusescollections.com.

## File overview

```
index.html        # Homepage
collection.html   # Redirects to the collection section on index.html
collection.js     # Collection grid, filters, shortlist, rug detail view
rugs.js           # Rug data: one entry per design; [size, qty] = in stock, [size] = made to order
styles.css        # Shared styles
assets/rugs/      # Rug photos extracted from the catalog
```

## Contact form

The inquiry form on `index.html` posts to **FormSubmit** (free, no account), which emails each submission to `kinga@fourmusescollections.com`, including any attached file.

- The very first submission triggers an activation email to that address. Click **Activate Form** in it, or no submissions will be delivered.
- To change the recipient, edit the form's `action` URL: `https://formsubmit.co/<email>`.
- After submitting, visitors return to `/?sent=1#contact` and see a thank-you message.

## Deploying to GitHub Pages

1. Create a new repo on GitHub. Name it whatever you like.
2. Upload all files in this folder (including `.nojekyll` and the `assets/` folder) to the repo root.
3. In the repo, go to **Settings → Pages**.
4. Under "Source", choose **Deploy from a branch** → **main** → **/ (root)** → Save.
5. Wait ~1 minute. Your site will be live at `https://YOUR-USERNAME.github.io/REPO-NAME/`.

## Connecting your GoDaddy domain

1. In your repo's **Settings → Pages**, under "Custom domain", enter `fourmusescollections.com` and Save.
2. GitHub will create a `CNAME` file in your repo automatically.
3. In GoDaddy: **My Products → DNS → Manage DNS** for fourmusescollections.com.
4. Add these **A records** (host: `@`, points to each of these four IPs):
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
5. Add a **CNAME record** (host: `www`, points to `YOUR-USERNAME.github.io`).
6. Wait 15 min – a few hours for DNS to propagate.
7. Back in GitHub Pages settings, check **Enforce HTTPS** once it's available (~1 hour after DNS propagates).

Done — `fourmusescollections.com` will serve your site over HTTPS.
