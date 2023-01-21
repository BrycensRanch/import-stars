/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unused-vars */
export declare namespace GitHubRes {
  export interface Owner {
    login: string;
    id: number;
    nodeId: string;
    avatarUrl: string;
    gravatarId: string;
    url: string;
    htmlUrl: string;
    followersUrl: string;
    followingUrl: string;
    gistsUrl: string;
    starredUrl: string;
    subscriptionsUrl: string;
    organizationsUrl: string;
    reposUrl: string;
    eventsUrl: string;
    receivedEventsUrl: string;
    type: string;
    siteAdmin: boolean;
  }
  export interface AuthenticatedUser {
    login: string;
    id: number;
    nodeId: string;
    avatarUrl: string;
    gravatarId: string;
    url: string;
    htmlUrl: string;
    followersUrl: string;
    followingUrl: string;
    gistsUrl: string;
    starredUrl: string;
    subscriptionsUrl: string;
    organizationsUrl: string;
    reposUrl: string;
    eventsUrl: string;
    receivedEventsUrl: string;
    type: string;
    siteAdmin: boolean;
    name: string;
    company: string;
    blog: string;
    location: string;
    email: string;
    hireable: boolean;
    bio: string;
    twitterUsername: string;
    publicRepos: number;
    publicGists: number;
    followers: number;
    following: number;
    createdAt: Date;
    updatedAt: Date;
  }
  export interface License {
    key: string;
    name: string;
    spdxId: string;
    url: string;
    nodeId: string;
  }

  export interface Permissions {
    admin: boolean;
    maintain: boolean;
    push: boolean;
    triage: boolean;
    pull: boolean;
  }

  export interface Repo {
    id: number;
    nodeId: string;
    name: string;
    fullName: string;
    private: boolean;
    owner: Owner;
    htmlUrl: string;
    description: string;
    fork: boolean;
    url: string;
    forksUrl: string;
    keysUrl: string;
    collaboratorsUrl: string;
    teamsUrl: string;
    hooksUrl: string;
    issueEventsUrl: string;
    eventsUrl: string;
    assigneesUrl: string;
    branchesUrl: string;
    tagsUrl: string;
    blobsUrl: string;
    gitTagsUrl: string;
    gitRefsUrl: string;
    treesUrl: string;
    statusesUrl: string;
    languagesUrl: string;
    stargazersUrl: string;
    contributorsUrl: string;
    subscribersUrl: string;
    subscriptionUrl: string;
    commitsUrl: string;
    gitCommitsUrl: string;
    commentsUrl: string;
    issueCommentUrl: string;
    contentsUrl: string;
    compareUrl: string;
    mergesUrl: string;
    archiveUrl: string;
    downloadsUrl: string;
    issuesUrl: string;
    pullsUrl: string;
    milestonesUrl: string;
    notificationsUrl: string;
    labelsUrl: string;
    releasesUrl: string;
    deploymentsUrl: string;
    createdAt: Date;
    updatedAt: Date;
    pushedAt: Date;
    gitUrl: string;
    sshUrl: string;
    cloneUrl: string;
    svnUrl: string;
    homepage?: unknown;
    size: number;
    stargazersCount: number;
    watchersCount: number;
    language?: string;
    hasIssues: boolean;
    hasProjects: boolean;
    hasDownloads: boolean;
    hasWiki: boolean;
    hasPages: boolean;
    hasDiscussions: boolean;
    forksCount: number;
    mirrorUrl?: unknown;
    archived: boolean;
    disabled: boolean;
    openIssuesCount: number;
    license: License;
    allowForking: boolean;
    isTemplate: boolean;
    webCommitSignoffRequired: boolean;
    topics: string[];
    visibility: string;
    forks: number;
    openIssues: number;
    watchers: number;
    defaultBranch: string;
    permissions: Permissions;
  }

  export interface RootObject {
    starredAt: Date;
    repo: Repo;
  }
}
