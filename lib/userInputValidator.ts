import got from 'got';

// Regex adapted from: https://github.com/shinnn/github-username-regex
// Updated Regex adapted from https://github.com/jonasgwt/tp/blob/4b142b221ce621106cec504290d19a7adb8afa5b/src/main/java/seedu/masslinkers/model/student/GitHub.java#L20
// const validUserRegex = /^@w(-w|ww|w){0,19}$/;
// const validUserGitHubTokenRegex = /^ghp_[a-zA-Z0-9]{36}$/;

// Regex from https://gist.github.com/magnetikonline/073afe7909ffdd6f10ef06a00bc3bc88
const isValidGitHubUser = async (name: string): Promise<boolean> => {
  try {
    await got
      .get(`https://api.github.com/users/${name}`, {
        headers: {
          Accept: 'application/vnd.github+json',
        },
        timeout: {
          request: 1000,
        },
      })
      .json();
    return true;
  } catch (_e) {
    return false;
  }
};
const isValidUserGitHubToken = async (token: string) => {
  const apiReq = await got('https://api.github.com', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    throwHttpErrors: false,
  });
  console.log(apiReq.body);
  if (apiReq.statusCode === 200) return true;
  return false;
};

export { isValidGitHubUser, isValidUserGitHubToken };
// export validUserRegex;
