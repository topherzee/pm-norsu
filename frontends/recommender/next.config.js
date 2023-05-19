const currentGitBranchName = require("current-git-branch");

module.exports = {
  reactStrictMode: true,
  env: {
    GIT_BRANCH: currentGitBranchName(),
  },
};

// module.exports = {
//   env: {
//     GIT_BRANCH: currentGitBranchName()
//   }
// };
