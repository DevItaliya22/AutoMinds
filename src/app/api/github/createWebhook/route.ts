import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/core';

const getWebhook = async (repoName: string, accessToken: string) => {
  const octokit = new Octokit({ auth: accessToken });
  const [owner, repo] = repoName.split('/'); // Split the repoName into owner and repo
  const response = await octokit.request(`GET /repos/${owner}/${repo}/hooks`, {
    owner,
    repo,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  return response.data;
};

const createWebhook = async (repoName: string, accessToken: string) => {
  const octokit = new Octokit({ auth: accessToken });

  const [owner, repo] = repoName.split('/'); // Split the repoName into owner and repo

  const response = await octokit.request(`POST /repos/${owner}/${repo}/hooks`, {
    owner,
    repo,
    name: 'web',
    active: true,
    events: ['push', 'pull_request'],
    config: {
      url: process.env.NEXT_WEBHOOK_URL_GITHUB,
      content_type: 'json',
      insecure_ssl: '0',
    },
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  return response.data;
};

export async function POST(request: Request) {
  // const {repoName , access_token } = await request.json();
  // const repoName = "DevItaliya22/z-test";
  const repoName = 'HarshBoghani/AllBasics';
  // const accessToken = process.env.NEXT_PUBLIC_GITHUB_PRIVATE_REPO_ACCESS_TOKEN || "";
  const accessToken = 'ghu_NqE1mWHyavs4Qi4zO0RPTjDqHH9mB405dF6x';

  const res = await getWebhook(repoName, accessToken);
  if (res.length > 0) {
    console.log('Webhook already exists', res);
    return NextResponse.json(
      { messgae: 'webhook already exists' },
      { status: 200 },
    );
  }
  try {
    const webhook = await createWebhook(repoName, accessToken);
    // console.log("Webhook created", webhook);
    return NextResponse.json({ messgae: 'webhook created' }, { status: 200 });
  } catch (error) {
    console.error('Error creating webhook:', error);
    return NextResponse.json(
      { error: 'Failed to create webhook' },
      { status: 500 },
    );
  }
}
