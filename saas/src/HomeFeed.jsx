import React, { useEffect, useState } from "react";

export default function HomeFeed({ user, backendUrl }) {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${backendUrl}/feed?user=${user.id}`)
      .then(res => res.json())
      .then(data => {
        setFeed(data.posts);
        setLoading(false);
      });
  }, [user, backendUrl]);

  if (loading) return <div>Loading...</div>;

  if (feed.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "3em" }}>
        <h2>No posts yet</h2>
        <button onClick={() => window.location = "/upload"}>
          Upload your first photo
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Home Feed</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "2em" }}>
        {feed.map(post => (
          <div key={post.id} style={{ border: "1px solid #eee", padding: "1em", borderRadius: "8px", width: "300px" }}>
            <img src={post.imageUrl} alt="" style={{ width: "100%", borderRadius: "8px" }} />
            <div>
              <strong>{post.authorName}</strong>
              <div>{post.caption}</div>
              {post.tags && (
                <div style={{ marginTop: "0.5em" }}>
                  {post.tags.map(tag => (
                    <span key={tag} style={{ background: "#f0f0f0", marginRight: "0.5em", padding: "0.2em 0.5em", borderRadius: "4px" }}>{tag}</span>
                  ))}
                </div>
              )}
              {post.category && (
                <div style={{ marginTop: "0.5em", fontStyle: "italic", color: "#888" }}>
                  Category: {post.category}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}