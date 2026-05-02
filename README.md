# Four Muses Collections — Website

Static HTML site for fourmusescollections.com.

## File overview

```
index.html        # Homepage
collection.html   # Shop / collections page
styles.css        # Shared styles
assets/           # All images, logo, favicon, OG share image
```

## Before you go live — one thing to wire up

The contact form on `index.html` is set up to use **Formspree** (free up to 50 submissions/mo).
You need to:

1. Sign up at https://formspree.io with `info@fourmusescollections.com`.
2. Create a new form.
3. Copy your form ID (looks like `xyzabcde`).
4. Open `index.html` and find this line:
   ```html
   <form class="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST" ...>
   ```
5. Replace `YOUR_FORM_ID` with your real form ID.
6. Save, commit, push.

That's it — submissions will arrive as email at info@fourmusescollections.com, including the attached inspiration image.

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
