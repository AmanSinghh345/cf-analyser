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
        `${import.meta.env.VITE_API_URL}/api/user/${handle}`,
      );
      //comment 

      const res = await axios.get(
  `${import.meta.env.VITE_API_URL}/api/user/${handle}`
);

console.log(res.data);

setUserData(res.data);

      // ....


      const compareReq = compareHandle.trim()
        ? axios.get(`${import.meta.env.VITE_API_URL}/api/user/${compareHandle}`)
        : Promise.resolve(null);

      const [mainRes, compareRes] = await Promise.all([mainReq, compareReq]);

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
    ? Object.entries(userData.ratingWiseSolved).map(([rating, solved]) => ({
        rating,
        solved,
      }))
    : [];
    //debugging
      console.log("ratingWiseSolved", userData?.ratingWiseSolved);
console.log("recentSolved", userData?.recentSolved);
console.log("insights", userData?.insights);
console.log("strongestRange", userData?.insights?.strongestRange);
console.log("comfortRange", userData?.insights?.comfortRange);
console.log("chartData", chartData);
    //...
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
              fontSize: "16px",
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
              fontSize: "16px",
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
              fontSize: "16px",
            }}
          >
            Search
          </button>
        </div>

        {loading && <h2 style={{ textAlign: "center" }}>Loading...</h2>}

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
                  alignItems: "center",
                  gap: "20px",
                  flexWrap: "wrap",
                  marginBottom: "25px",
                }}
              >
                <img
                  src={userData.profile.avatar}
                  alt="avatar"
                  style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "50%",
                    border: "4px solid #334155",
                  }}
                />

                <div>
                  <h2
                    style={{
                      fontSize: "2rem",
                      color: getRatingColor(userData.profile.rating),
                    }}
                  >
                    {userData.handle}
                  </h2>

                  <p>
                    Rank:{" "}
                    <span
                      style={{
                        color: getRatingColor(userData.profile.rating),
                        fontWeight: "bold",
                      }}
                    >
                      {userData.profile.rank}
                    </span>
                  </p>

                  <p>
                    Rating: <strong>{userData.profile.rating}</strong>
                  </p>

                  <p>
                    Max Rating: <strong>{userData.profile.maxRating}</strong>
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    background: "#0f172a",
                    padding: "20px",
                    borderRadius: "20px",
                    minWidth: "220px",
                  }}
                >
                  <h4>Contribution</h4>
                  <h1>{userData.profile.contribution}</h1>
                </div>

                <div
                  style={{
                    background: "#0f172a",
                    padding: "20px",
                    borderRadius: "20px",
                    minWidth: "220px",
                  }}
                >
                  <h4>Max Rank</h4>
                  <h3>{userData.profile.maxRank}</h3>
                </div>
                <div
                  style={{
                    background: "#0f172a",
                    padding: "20px",
                    borderRadius: "20px",
                    minWidth: "220px",
                  }}
                >
                  <h4>Total Solved</h4>
                  <h1>{userData.totalSolved}</h1>
                </div>

                <div
                  style={{
                    background: "#0f172a",
                    padding: "20px",
                    borderRadius: "20px",
                    minWidth: "220px",
                  }}
                >
                  <h4>Rating Buckets</h4>
                  <h1>{Object.keys(userData.ratingWiseSolved).length}</h1>
                </div>
              </div>
            </div>

            {compareData && (
              <div
                style={{
                  background: "#1e293b",
                  borderRadius: "24px",
                  padding: "30px",
                  marginBottom: "30px",
                }}
              >
                <h2
                  style={{
                    marginBottom: "20px",
                  }}
                >
                  Handle Comparison
                </h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                  }}
                >
                  {[userData, compareData].map((user, index) => (
                    <div
                      key={index}
                      style={{
                        background: "#0f172a",
                        padding: "24px",
                        borderRadius: "20px",
                      }}
                    >
                      <h2
                        style={{
                          color: getRatingColor(user.profile.rating),
                        }}
                      >
                        {user.handle}
                      </h2>

                      <p>Rating: {user.profile.rating}</p>

                      <p>Max Rating: {user.profile.maxRating}</p>

                      <p>Total Solved: {user.totalSolved}</p>

                      <p>Hardest Solved: {user.insights.hardestSolved}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* CHART */}
            <div
              style={{
                background: "#1e293b",
                borderRadius: "24px",
                padding: "30px",
                marginBottom: "30px",
              }}
            >
              <h2 style={{ marginBottom: "20px" }}>Rating Wise Solved</h2>

              {/* <div style={{ height: "420px" }}>
                <ResponsiveContainer>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rating" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="solved">
                      {chartData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={getRatingColor(Number(entry.rating))}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div> */}

                <div style={{ height: "420px" }}>
                  <BarChart width={900} height={400} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rating" />  
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="solved">  
                      {chartData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={getRatingColor(Number(entry.rating))}
                        />
                      ))} 
                    </Bar>
                  </BarChart>
                </div>

            </div>

            <div
              style={{
                background: "#1e293b",
                borderRadius: "24px",
                padding: "30px",
                marginBottom: "30px",
              }}
            >
              <h2 style={{ marginBottom: "20px" }}>Performance Insights</h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    background: "#0f172a",
                    padding: "20px",
                    borderRadius: "20px",
                  }}
                >
                  <h4>Strongest Zone</h4>

                  <h2
                    style={{
                      color: getRatingColor(
                        userData.insights.strongestRange.max,
                      ),
                    }}
                  >
                    {userData.insights.strongestRange.min}—
                    {userData.insights.strongestRange.max}
                  </h2>
                </div>

                <div
                  style={{
                    background: "#0f172a",
                    padding: "20px",
                    borderRadius: "20px",
                  }}
                >
                  <h4>Hardest Solved</h4>

                  <h2
                    style={{
                      color: getRatingColor(userData.insights.hardestSolved),
                    }}
                  >
                    {userData.insights.hardestSolved}
                  </h2>
                </div>

                <div
                  style={{
                    background: "#0f172a",
                    padding: "20px",
                    borderRadius: "20px",
                  }}
                >
                  <h4>Comfort Range</h4>

                  <h2>
                    {userData.insights.comfortRange.min}—
                    {userData.insights.comfortRange.max}
                  </h2>
                </div>
              </div>
              <div
                style={{
                  marginTop: "20px",
                  background: "#0f172a",
                  padding: "24px",
                  borderRadius: "20px",
                  border: "1px solid #334155",
                }}
              >
                <h3
                  style={{
                    marginBottom: "10px",
                  }}
                >
                  Profile Analysis
                </h3>

                <p
                  style={{
                    color: "#cbd5e1",
                    lineHeight: "1.8",
                    fontSize: "16px",
                  }}
                >
                  {userData.insights.summary}
                </p>
              </div>
            </div>

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
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
                  gap: "20px",
                  marginBottom: "25px",
                }}
              >
                <div
                  style={{
                    background: "#0f172a",
                    padding: "20px",
                    borderRadius: "18px",
                  }}
                >
                  <h4>Current Rating</h4>
                  <h2
                    style={{
                      color: getRatingColor(userData.profile.rating),
                    }}
                  >
                    {userData.profile.rating}
                  </h2>
                </div>

                <div
                  style={{
                    background: "#0f172a",
                    padding: "20px",
                    borderRadius: "18px",
                  }}
                >
                  <h4>Peak Rating</h4>
                  <h2
                    style={{
                      color: getRatingColor(userData.profile.maxRating),
                    }}
                  >
                    {userData.profile.maxRating}
                  </h2>
                </div>

                <div
                  style={{
                    background: "#0f172a",
                    padding: "20px",
                    borderRadius: "18px",
                  }}
                >
                  <h4>Contests Played</h4>
                  <h2>{userData.contestHistory?.length || 0}</h2>
                  {/* debug log */}
                  console.log("contestHistory", userData?.contestHistory);
                  console.log("contestHistory", userData?.contestHistory);

                </div>
              </div>
              <div style={{ height: "400px" }}>
                <ResponsiveContainer>
                  <LineChart data={userData.contestHistory || []}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis hide />

                    <YAxis />

                    <Tooltip
                      formatter={(value) => [value, "Rating"]}
                      labelFormatter={(_, payload) =>
                        payload?.[0]?.payload?.contestName || ""
                      }
                    />

                    <Line
                      type="monotone"
                      dataKey="rating"
                      stroke={getRatingColor(userData.profile.rating)}
                      strokeWidth={4}
                      dot={false}
                      activeDot={{
                        r: 7,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* RECENT */}
            <div
              style={{
                background: "#1e293b",
                borderRadius: "24px",
                padding: "30px",
              }}
            >
              <h2 style={{ marginBottom: "20px" }}>Recent Solved Problems</h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "15px",
                }}
              >
                {userData.recentSolved.map((problem, index) => (
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
                        marginBottom: "10px",
                        color: getRatingColor(problem.rating),
                      }}
                    >
                      {problem.name}
                    </h3>

                    <p>
                      Rating:{" "}
                      <span
                        style={{
                          color: getRatingColor(problem.rating),
                          fontWeight: "bold",
                        }}
                      >
                        {problem.rating}
                      </span>
                    </p>

                    <p>
                      {problem.contestId}
                      {problem.index}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
