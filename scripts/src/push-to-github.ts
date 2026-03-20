import fs from "fs";
import path from "path";

const OWNER = "aervin0518";
const REPO = "ITS";
const BRANCH = "Dev";
const TOKEN = process.env.GITHUB_TOKEN;
const ROOT = path.resolve(import.meta.dirname, "../../");

if (!TOKEN) {
  console.error("GITHUB_TOKEN environment variable is not set");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: "application/vnd.github+json",
  "Content-Type": "application/json",
  "X-GitHub-Api-Version": "2022-11-28",
};

async function githubApi(endpoint: string, options: RequestInit = {}) {
  const url = `https://api.github.com${endpoint}`;
  const res = await fetch(url, { ...options, headers: { ...headers, ...(options.headers as Record<string, string> || {}) } });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API error ${res.status} for ${endpoint}: ${body}`);
  }
  return res.json() as Promise<any>;
}

function getFilesToPush(): string[] {
  const IGNORE_PATTERNS = [
    "node_modules",
    ".git",
    "dist",
    ".local",
    ".cache",
    "tsconfig.tsbuildinfo",
    ".replit-artifact",
    ".replit",
    "pnpm-lock.yaml",
  ];

  const results: string[] = [];

  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const rel = path.relative(ROOT, fullPath);
      if (IGNORE_PATTERNS.some((p) => rel.includes(p) || entry.name === p)) continue;
      if (entry.isDirectory()) {
        walk(fullPath);
      } else {
        results.push(rel);
      }
    }
  }

  walk(ROOT);
  return results;
}

async function createBlob(content: string): Promise<string> {
  const data = await githubApi(`/repos/${OWNER}/${REPO}/git/blobs`, {
    method: "POST",
    body: JSON.stringify({ content, encoding: "base64" }),
  });
  return data.sha;
}

async function run() {
  console.log(`Pushing project to ${OWNER}/${REPO} on branch ${BRANCH}...`);

  const ref = await githubApi(`/repos/${OWNER}/${REPO}/git/ref/heads/${BRANCH}`);
  const latestCommitSha: string = ref.object.sha;
  console.log(`Current ${BRANCH} commit: ${latestCommitSha}`);

  const commit = await githubApi(`/repos/${OWNER}/${REPO}/git/commits/${latestCommitSha}`);
  const baseTreeSha: string = commit.tree.sha;

  const files = getFilesToPush();
  console.log(`Uploading ${files.length} files...`);

  const treeItems: Array<{ path: string; mode: string; type: string; sha: string }> = [];

  for (const rel of files) {
    const fullPath = path.join(ROOT, rel);
    const rawContent = fs.readFileSync(fullPath);
    const base64Content = rawContent.toString("base64");
    const sha = await createBlob(base64Content);
    treeItems.push({ path: rel, mode: "100644", type: "blob", sha });
    process.stdout.write(`  ✓ ${rel}\n`);
  }

  console.log("Creating new tree...");
  const newTree = await githubApi(`/repos/${OWNER}/${REPO}/git/trees`, {
    method: "POST",
    body: JSON.stringify({ base_tree: baseTreeSha, tree: treeItems }),
  });

  console.log("Creating commit...");
  const newCommit = await githubApi(`/repos/${OWNER}/${REPO}/git/commits`, {
    method: "POST",
    body: JSON.stringify({
      message: "chore: sync project from Replit",
      tree: newTree.sha,
      parents: [latestCommitSha],
    }),
  });

  console.log("Updating branch...");
  await githubApi(`/repos/${OWNER}/${REPO}/git/refs/heads/${BRANCH}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: newCommit.sha }),
  });

  console.log(`\nSuccess! Project pushed to ${OWNER}/${REPO}@${BRANCH}`);
  console.log(`View it at: https://github.com/${OWNER}/${REPO}/tree/${BRANCH}`);
}

run().catch((err) => {
  console.error("Push failed:", err.message);
  process.exit(1);
});
