import { useState } from "react";
import axios from "axios";

function getRatingColor(rating) {
  if (rating < 1200) return "#9ca3af";
  if (rating < 1400) return "#22c55e";
  if (rating < 1600) return "#06b6d4";
  if (rating < 1900) return "#3b82f6";
  if (rating < 2100) return "#a855f7";
  if (rating < 2400) return "#f97316";
  return "#ef4444";
}

function Compare() {
  const [handle1, setHandle1] = useState("");
  const [handle2, setHandle2] = useState("");

  const [user1, setUser1] = useState(null);
  const [user2, setUser2] = useState(null);

  const [loading, setLoading] = useState(false);

  async function compareUsers() {
    if (!handle1.trim() || !handle2.trim()) return;

    try {
      setLoading(true);

      const [res1, res2] = await Promise.all([
        axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/${handle1}`
        ),
        axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/${handle2}`
        ),
      ]);

      setUser1(res1.data);
      setUser2(res2.data);
    } catch (err) {
      console.error(err);
      alert("User not found");
    } finally {
      setLoading(false);
    }
  }

  function ComparisonCard({
    title,
    value1,
    value2,
  }) {
    const winner1 = value1 > value2;
    const winner2 = value2 > value1;

    return (
      <div
        style={{
          background: "#0f172a",
          padding: "20px",
          borderRadius: "20px",
        }}
      >
        <h3 style={{ marginBottom: "20px" }}>
          {title}
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div>
            <h2
              style={{
                color: winner1
                  ? "#22c55e"
                  : "white",
              }}
            >
              {value1}
            </h2>

            {winner1 && <p>🏆 Winner</p>}
          </div>

          <div>
            <h2
              style={{
                color: winner2
                  ? "#22c55e"
                  : "white",
              }}
            >
              {value2}
            </h2>

            {winner2 && <p>🏆 Winner</p>}
          </div>
        </div>
      </div>
    );
  }

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
          Compare Profiles
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#94a3b8",
            marginBottom: "40px",
          }}
        >
          Compare two Codeforces users
        </p>

        {/* INPUTS */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "40px",
          }}
        >
          <input
            type="text"
            placeholder="First handle"
            value={handle1}
            onChange={(e) =>
              setHandle1(e.target.value)
            }
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Second handle"
            value={handle2}
            onChange={(e) =>
              setHandle2(e.target.value)
            }
            style={inputStyle}
          />

          <button
            onClick={compareUsers}
            style={buttonStyle}
          >
            Compare
          </button>
        </div>

        {loading && (
          <h2 style={{ textAlign: "center" }}>
            Loading...
          </h2>
        )}

        {user1 && user2 && (
          <>
            {/* USER HEADER */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(300px,1fr))",
                gap: "20px",
                marginBottom: "30px",
              }}
            >
              {[user1, user2].map((user, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#1e293b",
                    padding: "30px",
                    borderRadius: "24px",
                  }}
                >
                  <img
                    src={user.profile.avatar}
                    alt="avatar"
                    style={{
                      width: "90px",
                      height: "90px",
                      borderRadius: "50%",
                    }}
                  />

                  <h2
                    style={{
                      color: getRatingColor(
                        user.profile.rating
                      ),
                    }}
                  >
                    {user.handle}
                  </h2>

                  <p>
                    Rank: {user.profile.rank}
                  </p>

                  <p>
                    Rating: {user.profile.rating}
                  </p>

                  <p>
                    Max Rating:{" "}
                    {user.profile.maxRating}
                  </p>
                </div>
              ))}
            </div>

            {/* COMPARISON */}
            <div
              style={{
                display: "grid",
                gap: "20px",
              }}
            >
              <ComparisonCard
                title="Rating"
                value1={user1.profile.rating}
                value2={user2.profile.rating}
              />

              <ComparisonCard
                title="Max Rating"
                value1={user1.profile.maxRating}
                value2={user2.profile.maxRating}
              />

              <ComparisonCard
                title="Total Solved"
                value1={user1.totalSolved}
                value2={user2.totalSolved}
              />

              <ComparisonCard
                title="Contribution"
                value1={user1.profile.contribution}
                value2={user2.profile.contribution}
              />

              <ComparisonCard
                title="Hardest Solved"
                value1={
                  user1.insights.hardestSolved
                }
                value2={
                  user2.insights.hardestSolved
                }
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "250px",
  padding: "15px",
  borderRadius: "14px",
  border: "1px solid #334155",
  background: "#1e293b",
  color: "white",
  outline: "none",
};

const buttonStyle = {
  padding: "15px 24px",
  borderRadius: "14px",
  border: "none",
  background: "#9333ea",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

export default Compare;