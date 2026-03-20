import { ReplitConnectors } from "@replit/connectors-sdk";

const connectors = new ReplitConnectors();

export async function githubRequest<T = unknown>(
  endpoint: string,
  options: { method?: string; body?: unknown } = {}
): Promise<T> {
  const response = await connectors.proxy("github", endpoint, {
    method: options.method ?? "GET",
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });
  return response.json() as Promise<T>;
}

export async function getAuthenticatedUser() {
  return githubRequest<{ login: string; name: string; avatar_url: string }>("/user");
}

export async function listUserRepos() {
  return githubRequest<Array<{ id: number; full_name: string; html_url: string; private: boolean }>>(
    "/user/repos?sort=updated&per_page=30"
  );
}
