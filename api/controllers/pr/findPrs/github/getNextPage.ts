import { Octokit } from '@octokit/rest';
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/parameters-and-response-types';
import getPageLinks from './getPageLinks';
import hasNextPage from './hasNextPage';

const getNextPage = async (
  response: RestEndpointMethodTypes['search']['issuesAndPullRequests']['response'],
  github: Octokit,
  pullRequestData: RestEndpointMethodTypes['search']['issuesAndPullRequests']['response']['data']['items']
) => {
  try {
    const baseUrl = process.env.GITHUB_API_BASE_URL
      ? process.env.GITHUB_API_BASE_URL
      : 'https://api.github.com';
    const nextPageLink = await getPageLinks(response).next.replace(baseUrl, '');

    const githubResults = (await github.request(
      'GET ' + nextPageLink
    )) as RestEndpointMethodTypes['search']['issuesAndPullRequests']['response'];
    const newPullRequestData = pullRequestData.concat(githubResults.data.items);
    if (hasNextPage(githubResults)) {
      return await getNextPage(githubResults, github, newPullRequestData);
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log(`Found ${pullRequestData.length} pull requests.`);
    }
    return newPullRequestData;
  } catch (error: unknown) {
    console.log('Error: ' + error);
    return error;
  }
};

export default getNextPage;
