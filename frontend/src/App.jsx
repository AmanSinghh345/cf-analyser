import { useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  LineChart,
  Line,
} from "recharts";

function getRatingColor(rating) {
  if (rating < 1200) return "#9ca3af";
  if (rating < 1400) return "#22c55e";
  if (rating < 1600) return "#06b6d4";
  if (rating < 1900) return "#3b82f6";
  if (rating < 2100) return "#a855f7";
  if (rating < 2400) return "#f97316";
  return "#ef4444";
}

function App() {
  const [handle, setHandle] = useState("");
  const [compareHandle, setCompareHandle] = useState("");
  const [compareData, setCompareData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchUser() {
    if (!handle.trim()) return;

    try {
      setLoading(true);

      const mainReq = axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/${handle}`
      );

      const compareReq = compareHandle.trim()
        ? axios.get(
            `${import.meta.env.VITE_API_URL}/api/user/${compareHandle}`
          )
        : Promise.resolve(null);

      const [mainRes, compareRes] = await Promise.all([
        mainReq,
        compareReq,
      ]);

      setUserData(mainRes.data);
      setCompareData(compareRes?.data || null);
    } catch (err) {
      console.error(err);
      alert("User not found");
    } finally {
      setLoading(false);
    }
  }

  const chartData = userData
    ? Object.entries(userData.ratingWiseSolved).map(
        ([rating, solved]) => ({
          rating,
          solved,
        })
      )
    : [];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom right, #0f172a, #111827, #1e293b)",
        color: "white",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "3rem",
            marginBottom: "10px",
          }}
        >
          Codeforces Analyzer
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#94a3b8",
            marginBottom: "40px",
          }}
        >
          Analyze rating-wise solved problems
        </p>

        {/* SEARCH */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "40px",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="Enter handle..."
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchUser()}
            style={{
              width: "300px",
              padding: "15px",
              borderRadius: "14px",
              border: "1px solid #334155",
              background: "#1e293b",
              color: "white",
              outline: "none",
            }}
          />

          <input
            type="text"
            placeholder="Compare with..."
            value={compareHandle}
            onChange={(e) => setCompareHandle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchUser()}
            style={{
              width: "300px",
              padding: "15px",
              borderRadius: "14px",
              border: "1px solid #334155",
              background: "#1e293b",
              color: "white",
              outline: "none",
            }}
          />

          <button
            onClick={fetchUser}
            style={{
              padding: "15px 24px",
              borderRadius: "14px",
              border: "none",
              background: "#2563eb",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Search
          </button>
        </div>

        {loading && (
          <h2 style={{ textAlign: "center" }}>Loading...</h2>
        )}

        {userData && (
          <>
            {/* HEADER */}
            <div
              style={{
                background: "#1e293b",
                borderRadius: "24px",
                padding: "30px",
                marginBottom: "30px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <img
                  src={userData.profile.avatar}
                  alt="avatar"
                  style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "50%",
                  }}
                />

                <div>
                  <h2
                    style={{
                      color: getRatingColor(
                        userData.profile.rating
                      ),
                    }}
                  >
                    {userData.handle}
                  </h2>

                  <p>
                    Rank: {userData.profile.rank}
                  </p>

                  <p>
                    Rating: {userData.profile.rating}
                  </p>

                  <p>
                    Max Rating:{" "}
                    {userData.profile.maxRating}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px,1fr))",
                  gap: "20px",
                }}
              >
                <Card
                  title="Contribution"
                  value={userData.profile.contribution}
                />

                <Card
                  title="Max Rank"
                  value={userData.profile.maxRank}
                />

                <Card
                  title="Total Solved"
                  value={userData.totalSolved}
                />

                <Card
                  title="Rating Buckets"
                  value={
                    Object.keys(
                      userData.ratingWiseSolved
                    ).length
                  }
                />
              </div>
            </div>

            {/* RATING GRAPH */}
            <div
              style={{
                background: "#1e293b",
                borderRadius: "24px",
                padding: "30px",
                marginBottom: "30px",
              }}
            >
              <h2>Rating Wise Solved</h2>

              <div
                style={{
                  width: "100%",
                  height: "400px",
                }}
              >
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="rating" />

                    <YAxis />

                    <Tooltip />

                    <Bar dataKey="solved">
                      {chartData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={getRatingColor(
                            Number(entry.rating)
                          )}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CONTEST PROGRESSION */}
            <div
              style={{
                background: "#1e293b",
                borderRadius: "24px",
                padding: "30px",
                marginBottom: "30px",
              }}
            >
              <h2 style={{ marginBottom: "20px" }}>
                Contest Rating Progression
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px,1fr))",
                  gap: "20px",
                  marginBottom: "25px",
                }}
              >
                <Card
                  title="Current Rating"
                  value={userData.profile.rating}
                />

                <Card
                  title="Peak Rating"
                  value={userData.profile.maxRating}
                />

                <Card
                  title="Contests Played"
                  value={
                    userData.contestHistory?.length || 0
                  }
                />
              </div>

              <div
                style={{
                  width: "100%",
                  height: "400px",
                }}
              >
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <LineChart
                    data={
                      userData.contestHistory || []
                    }
                  >
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis hide />

                    <YAxis />

                    <Tooltip
                      formatter={(value) => [
                        value,
                        "Rating",
                      ]}
                      labelFormatter={(_, payload) =>
                        payload?.[0]?.payload
                          ?.contestName || ""
                      }
                    />

                    <Line
                      type="monotone"
                      dataKey="rating"
                      stroke={getRatingColor(
                        userData.profile.rating
                      )}
                      strokeWidth={4}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* RECENT PROBLEMS */}
            <div
              style={{
                background: "#1e293b",
                borderRadius: "24px",
                padding: "30px",
              }}
            >
              <h2>Recent Solved Problems</h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(250px,1fr))",
                  gap: "15px",
                }}
              >
                {userData.recentSolved.map(
                  (problem, index) => (
                    <div
                      key={index}
                      style={{
                        background: "#0f172a",
                        padding: "20px",
                        borderRadius: "18px",
                      }}
                    >
                      <h3
                        style={{
                          color: getRatingColor(
                            problem.rating
                          ),
                        }}
                      >
                        {problem.name}
                      </h3>

                      <p>
                        Rating: {problem.rating}
                      </p>

                      <p>
                        {problem.contestId}
                        {problem.index}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        background: "#0f172a",
        padding: "20px",
        borderRadius: "18px",
      }}
    >
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}

export default App;