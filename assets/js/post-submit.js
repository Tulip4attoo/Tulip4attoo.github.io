---
---
(function () {
  const form = document.querySelector('#post-form');
  if (!form) return;

  const repoFull = '{{ site.github_site_repo | default: "tulip4attoo/tulip4attoo.github.io" }}';
  const [owner, repo] = repoFull.split('/');
  const defaultBranchFallback = 'master';

  const tokenInput = document.querySelector('#gh-token');
  const rememberToken = document.querySelector('#remember-token');
  const titleInput = document.querySelector('#post-title');
  const slugInput = document.querySelector('#post-slug');
  const langInput = document.querySelector('#post-lang');
  const tagsInput = document.querySelector('#post-tags');
  const descriptionInput = document.querySelector('#post-description');
  const commentsInput = document.querySelector('#post-comments');
  const dateInput = document.querySelector('#post-date');
  const branchInput = document.querySelector('#post-branch');
  const prTitleInput = document.querySelector('#pr-title');
  const contentInput = document.querySelector('#post-body');
  const typeRadios = Array.from(document.querySelectorAll('input[name="post-kind"]'));
  const statusBox = document.querySelector('#submission-status');
  const filePreview = document.querySelector('#file-preview');
  const submitBtn = form.querySelector('button[type="submit"]');

  const savedToken = localStorage.getItem('ghDraftToken');
  if (savedToken && tokenInput) {
    tokenInput.value = savedToken;
    if (rememberToken) rememberToken.checked = true;
  }

  if (rememberToken) {
    rememberToken.addEventListener('change', () => {
      if (!tokenInput) return;
      if (rememberToken.checked) {
        localStorage.setItem('ghDraftToken', tokenInput.value.trim());
      } else {
        localStorage.removeItem('ghDraftToken');
      }
    });
  }

  if (tokenInput) {
    tokenInput.addEventListener('input', () => {
      if (rememberToken && rememberToken.checked) {
        localStorage.setItem('ghDraftToken', tokenInput.value.trim());
      }
    });
  }

  // Default date is "now" truncated to minutes
  if (dateInput) {
    const now = new Date();
    now.setSeconds(0, 0);
    dateInput.value = formatForDatetimeLocal(now);
  }

  let slugDirty = false;
  let branchDirty = false;
  let prDirty = false;

  if (slugInput) {
    slugInput.addEventListener('input', () => {
      slugDirty = slugInput.value.trim().length > 0;
      updateFilePreview();
    });
  }

  if (titleInput) {
    titleInput.addEventListener('input', () => {
      if (!slugDirty && slugInput) {
        slugInput.value = slugify(titleInput.value);
      }
      if (!branchDirty && branchInput) {
        branchInput.value = buildBranchName();
      }
      if (!prDirty && prTitleInput) {
        prTitleInput.value = buildPrTitle();
      }
      updateFilePreview();
    });
  }

  if (branchInput) {
    branchInput.addEventListener('input', () => {
      branchDirty = branchInput.value.trim().length > 0;
    });
  }

  if (prTitleInput) {
    prTitleInput.addEventListener('input', () => {
      prDirty = prTitleInput.value.trim().length > 0;
    });
  }

  typeRadios.forEach((radio) => radio.addEventListener('change', updateFilePreview));
  if (dateInput) dateInput.addEventListener('change', updateFilePreview);

  updateDerivedDefaults();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearStatus();
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
    }

    try {
      const token = (tokenInput?.value || '').trim();
      if (!token) throw new Error('GitHub token is required.');

      if (rememberToken && rememberToken.checked) {
        localStorage.setItem('ghDraftToken', token);
      }

      const title = (titleInput?.value || '').trim();
      if (!title) throw new Error('Please enter a title.');
      const slug = (slugInput?.value || '').trim() || slugify(title);
      if (!slug) throw new Error('Please provide a slug.');

      const kind = selectedKind();
      const lang = (langInput?.value || 'vi').trim();
      const tags = parseTags(tagsInput?.value || '');
      const description = (descriptionInput?.value || '').trim();
      const allowComments = !!commentsInput?.checked;
      const body = (contentInput?.value || '').trim();

      const dateValue = parseDateInput(dateInput?.value);
      const fmDate = formatFrontMatterDate(dateValue);
      const fileDate = formatFileDate(dateValue);

      const path = kind === 'draft' ? `_drafts/${slug}.md` : `_posts/${fileDate}-${slug}.md`;
      const branchName = (branchInput?.value || '').trim() || buildBranchName(slug);
      const prTitle = (prTitleInput?.value || '').trim() || buildPrTitle(title);
      const prBody = buildPrBody({ title, path, kind });

      const fileContent = buildFileContent({
        title,
        lang,
        tags,
        description,
        allowComments,
        date: fmDate,
        body,
      });

      const { defaultBranch, baseSha } = await getBaseSha(token);

      setStatus(`Creating branch "${branchName}" from ${defaultBranch}...`, 'info');
      await ensureBranch(token, branchName, baseSha);

      setStatus(`Uploading ${path}...`, 'info');
      await createFile(token, path, fileContent, branchName, `Add ${kind === 'draft' ? 'draft' : 'post'}: ${title}`);

      setStatus('Opening pull request...', 'info');
      const pr = await openPr(token, {
        title: prTitle,
        head: branchName,
        base: defaultBranch,
        body: prBody,
      });

      setStatus(`Success! PR #${pr.number} created: ${pr.html_url}`, 'success');
    } catch (error) {
      setStatus(error.message || 'Something went wrong while submitting.', 'error');
      console.error(error);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit draft → PR';
      }
    }
  });

  function updateDerivedDefaults() {
    if (titleInput && slugInput && !slugDirty) {
      slugInput.value = slugify(titleInput.value);
    }
    if (branchInput && !branchDirty) {
      branchInput.value = buildBranchName();
    }
    if (prTitleInput && !prDirty) {
      prTitleInput.value = buildPrTitle();
    }
    updateFilePreview();
  }

  function updateFilePreview() {
    if (!filePreview) return;
    const slug = (slugInput?.value || '').trim() || slugify(titleInput?.value || '');
    const kind = selectedKind();
    const dateValue = parseDateInput(dateInput?.value);
    const fileDate = formatFileDate(dateValue);
    const path = kind === 'draft' ? `_drafts/${slug || 'draft'}.md` : `_posts/${fileDate}-${slug || 'post'}.md`;
    filePreview.textContent = path;
  }

  function selectedKind() {
    const selected = typeRadios.find((radio) => radio.checked);
    return selected ? selected.value : 'draft';
  }

  function slugify(text) {
    return (text || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  function parseTags(raw) {
    return raw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }

  function parseDateInput(value) {
    if (!value) return new Date();
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  }

  function pad(num) {
    return num.toString().padStart(2, '0');
  }

  function formatFileDate(date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  function formatFrontMatterDate(date) {
    const offsetMinutes = date.getTimezoneOffset();
    const sign = offsetMinutes > 0 ? '-' : '+';
    const offsetHours = pad(Math.floor(Math.abs(offsetMinutes) / 60));
    const offsetMins = pad(Math.abs(offsetMinutes) % 60);
    return `${formatFileDate(date)} ${pad(date.getHours())}:${pad(date.getMinutes())} ${sign}${offsetHours}:${offsetMins}`;
  }

  function formatForDatetimeLocal(date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function buildBranchName(slugOverride) {
    const slug = slugOverride || (slugInput?.value || '').trim() || slugify(titleInput?.value || 'draft');
    return `draft/${slug}`;
  }

  function buildPrTitle(titleOverride) {
    const title = titleOverride || (titleInput?.value || '').trim() || 'New post';
    return `Draft: ${title}`;
  }

  function buildFileContent({ title, lang, tags, description, allowComments, date, body }) {
    const tagLine = tags.length ? `tags: [${tags.map((t) => `"${escapeQuotes(t)}"`).join(', ')}]\n` : '';
    const descriptionLine = description ? `description: "${escapeQuotes(description)}"\n` : '';
    const lines = [
      '---',
      'layout: post',
      `title: "${escapeQuotes(title)}"`,
      `date: ${date}`,
      `lang: ${lang}`,
      tagLine ? tagLine.trimEnd() : '',
      descriptionLine ? descriptionLine.trimEnd() : '',
      `comments: ${allowComments ? 'true' : 'false'}`,
      '---',
      '',
      body || '',
      '',
    ];

    return lines.filter(Boolean).join('\n');
  }

  function escapeQuotes(text) {
    return (text || '').replace(/"/g, '\\"');
  }

  function buildPrBody({ title, path, kind }) {
    return [
      `Automated ${kind} submission from the on-site form.`,
      '',
      `- Title: ${title}`,
      `- Path: \`${path}\``,
    ].join('\n');
  }

  function encodeContent(content) {
    return btoa(unescape(encodeURIComponent(content)));
  }

  async function getBaseSha(token) {
    const repoInfo = await gh(`/repos/${owner}/${repo}`, token);
    const defaultBranch = repoInfo.default_branch || defaultBranchFallback;
    const ref = await gh(`/repos/${owner}/${repo}/git/ref/heads/${defaultBranch}`, token);
    return { defaultBranch, baseSha: ref.object.sha };
  }

  async function ensureBranch(token, branchName, baseSha) {
    try {
      await gh(`/repos/${owner}/${repo}/git/refs`, token, {
        method: 'POST',
        body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: baseSha }),
      });
    } catch (error) {
      if (error.status === 422 && /already exists/i.test(error.message || '')) {
        return;
      }
      throw error;
    }
  }

  async function createFile(token, path, content, branchName, message) {
    const encodedPath = path
      .split('/')
      .map((segment) => encodeURIComponent(segment))
      .join('/');
    return gh(`/repos/${owner}/${repo}/contents/${encodedPath}`, token, {
      method: 'PUT',
      body: JSON.stringify({
        message,
        content: encodeContent(content),
        branch: branchName,
      }),
    });
  }

  async function openPr(token, payload) {
    return gh(`/repos/${owner}/${repo}/pulls`, token, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async function gh(path, token, { method = 'GET', body } = {}) {
    const headers = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`https://api.github.com${path}`, {
      method,
      headers,
      body,
    });

    let data = {};
    try {
      data = await response.json();
    } catch (_) {
      // Non-JSON responses are ignored
    }

    if (!response.ok) {
      const error = new Error(data.message || `GitHub request failed (${response.status})`);
      error.status = response.status;
      throw error;
    }
    return data;
  }

  function clearStatus() {
    if (!statusBox) return;
    statusBox.textContent = '';
    statusBox.className = 'status';
  }

  function setStatus(message, tone = 'info') {
    if (!statusBox) return;
    statusBox.textContent = message;
    statusBox.className = `status status--${tone}`;
  }
})();
