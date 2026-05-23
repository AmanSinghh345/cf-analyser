const axios = require("axios");

async function getUserAnalytics(handle) {
  // Fetch submissions
  const submissionsResponse = await axios.get(
    `https://codeforces.com/api/user.status?handle=${handle}`
  );

  // Fetch profile info
  const infoResponse = await axios.get(
    `https://codeforces.com/api/user.info?handles=${handle}`
  );

  const ratingResponse = await axios.get(
  `https://codeforces.com/api/user.rating?handle=${handle}`
);

const contestHistory =
  ratingResponse.data.result.map(
    (contest) => ({
      contestName: contest.contestName,
      rating: contest.newRating,
      rank: contest.rank,
    })
  );

  const submissions =
    submissionsResponse.data.result;

  const userInfo =
    infoResponse.data.result[0];

  const solvedSet = new Set();

  const ratingWiseSolved = {};

  const recentSolved = [];

  for (const submission of submissions) {
    if (submission.verdict !== "OK")
      continue;

    const problem = submission.problem;

    if (!problem.rating) continue;

    const key = `${problem.contestId}-${problem.index}`;

    if (solvedSet.has(key)) continue;

    solvedSet.add(key);

    const rating = problem.rating;

    ratingWiseSolved[rating] =
      (ratingWiseSolved[rating] || 0) + 1;

    recentSolved.push({
      name: problem.name,
      rating: problem.rating,
      contestId: problem.contestId,
      index: problem.index,
    });
  }

  const solvedRatings = [];

for (const [rating, count] of Object.entries(
  ratingWiseSolved
)) {
  for (let i = 0; i < count; i++) {
    solvedRatings.push(Number(rating));
  }
}

solvedRatings.sort((a, b) => a - b);

// hardest solved
const hardestSolved = Math.max(
  ...solvedRatings
);

// strongest range (400 window)
let bestStart = 800;
let bestCount = 0;

for (let start = 800; start <= 3500; start += 100) {
  const end = start + 400;

  const count = solvedRatings.filter(
    (r) => r >= start && r <= end
  ).length;

  if (count > bestCount) {
    bestCount = count;
    bestStart = start;
  }
}

const strongestRange = {
  min: bestStart,
  max: bestStart + 400,
};

// comfort range (middle 80%)
const n = solvedRatings.length;

const lowIndex = Math.floor(n * 0.1);
const highIndex = Math.floor(n * 0.9);

const comfortRange = {
  min: solvedRatings[lowIndex],
  max: solvedRatings[highIndex],
};

let summary = "";

if (hardestSolved >= 3000) {
  summary =
    "Elite problem solver with consistent performance on very high-rated problems.";
} else if (hardestSolved >= 2400) {
  summary =
    "Strong advanced solver comfortable with difficult problems.";
} else if (hardestSolved >= 1900) {
  summary =
    "Solid competitive programmer with good mid-high difficulty coverage.";
} else if (hardestSolved >= 1400) {
  summary =
    "Developing problem-solving ability with growing consistency.";
} else {
  summary =
    "Focused mostly on beginner-friendly problems.";
}

  return {
    handle,

    profile: {
      avatar: userInfo.titlePhoto,
      rating: userInfo.rating,
      maxRating: userInfo.maxRating,
      rank: userInfo.rank,
      maxRank: userInfo.maxRank,
      contribution: userInfo.contribution,
    },

    totalSolved: solvedSet.size,

    ratingWiseSolved,

    recentSolved: recentSolved.slice(0, 10),

   insights: {
  strongestRange,
  hardestSolved,
  comfortRange,
  summary,
},
contestHistory,
  };
}

module.exports = { getUserAnalytics };