---
layout:                     post
title:                      Get rid of disqus
date:                       2025-04-01
mathjax:                    true
comments:                   true
---

Recently, I decided it was time for a major cleanup of my blog (proudly hosted on GitHub Pages!). Part of this cleanup involved rethinking my choice of commenting system—specifically, saying goodbye to Disqus.

I never liked Disqus that much anyway:

- It's bulky and slows down my page load times.
- Visitors are required to log in before commenting, which feels cumbersome.
- Notifications about comments didn't always arrive, making it hard for me to keep track of conversations.

With these points in mind, I searched for alternatives—something lightweight, fast, privacy-friendly, and free (or at least generous with a free tier). Luckily, there are plenty of good options around:

- **Static solutions** like **Utterances** and **Giscus** use GitHub Issues or Discussions. They're developer-friendly and require minimal to no management. But commenters must use GitHub accounts, which might be restrictive.

- **Fully static approaches** like **Staticman**, which turn comments into pull requests on GitHub. No third-party services are required, providing privacy and independence, but the setup is more complicated as you'd need separate backend hosting.

- **Third-party hosted options** such as **Cusdis** and **Commento**: both lightweight, privacy-focused, open-source commenting services. They don't force commenters to create an account, have a smooth modern UI, and are easy to integrate without additional infrastructure.

After comparing these options, Both **Cusdis** and **Commento** look great. RNG god tells me to choose **Cusdis**. Very fast intergration (5 min I guess).

So here we are—no more forcing visitors to log into Disqus, no more missed notifications. Enjoy the new Cusdis commenting system below. Feel free to test it out right here!