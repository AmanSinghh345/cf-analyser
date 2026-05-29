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

  async function compareProfiles() {
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
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
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
          maxWidth: "1200px",
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
          Compare achievements of two Codeforces users
        </p>

        {/* SEARCH */}
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
            onChange={(e) => setHandle1(e.target.value)}
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Second handle"
            value={handle2}
            onChange={(e) => setHandle2(e.target.value)}
            style={inputStyle}
          />

          <button
            onClick={compareProfiles}
            style={{
              padding: "15px 24px",
              borderRadius: "14px",
              border: "none",
              background: "#9333ea",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(350px,1fr))",
              gap: "20px",
            }}
          >
            {[user1, user2].map((user, index) => (
              <div
                key={index}
                style={{
                  background: "#1e293b",
                  borderRadius: "24px",
                  padding: "30px",
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
                    src={user.profile.avatar}
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
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: "12px",
                  }}
                >
                  <CompareCard
                    title="Max Rating"
                    value={user.profile.maxRating}
                  />

                  <CompareCard
                    title="Max Rank"
                    value={user.profile.maxRank}
                  />

                  <CompareCard
                    title="Contribution"
                    value={user.profile.contribution}
                  />

                  <CompareCard
                    title="Total Solved"
                    value={user.totalSolved}
                  />

                  <CompareCard
                    title="Hardest Solved"
                    value={
                      user.insights.hardestSolved
                    }
                  />

                  <CompareCard
                    title="Contests Played"
                    value={
                      user.contestHistory?.length || 0
                    }
                  />

                  <CompareCard
                    title="Strongest Zone"
                    value={`${user.insights.strongestRange.min} - ${user.insights.strongestRange.max}`}
                  />

                  <CompareCard
                    title="Comfort Range"
                    value={`${user.insights.comfortRange.min} - ${user.insights.comfortRange.max}`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CompareCard({ title, value }) {
  return (
    <div
      style={{
        background: "#0f172a",
        padding: "16px",
        borderRadius: "16px",
      }}
    >
      <h4>{title}</h4>
      <h2>{value}</h2>
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

export default Compare;