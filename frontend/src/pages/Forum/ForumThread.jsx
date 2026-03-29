import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  ArrowLeft,
  ThumbsUp,
  Heart,
  Lightbulb,
  Sparkles,
  MessageSquare,
  Clock,
  Eye,
  Tag,
  Send,
  Trash2,
} from "lucide-react";
import "./ForumThread.css";

const CATEGORY_CONFIG = {
  "Database":        { color: "#1a3a6e", bg: "#e6eaf6", accent: "#378add" },
  "Networking":      { color: "#0d4f3c", bg: "#e6f4f1", accent: "#1d9e75" },
  "Programming":     { color: "#4a1f6e", bg: "#efe8f6", accent: "#7f77dd" },
  "Security":        { color: "#6e1f1f", bg: "#f6e8e8", accent: "#d4537e" },
  "Data Structures": { color: "#1f4a6e", bg: "#e8f0f6", accent: "#378add" },
  "Machine Learning":{ color: "#1f6e5a", bg: "#e8f6f2", accent: "#1d9e75" },
  "General":         { color: "#4a3f1a", bg: "#f6f2e8", accent: "#ba7517" },
};

const CATEGORY_ICONS = {
  "Database":         "🗄️",
  "Networking":       "🌐",
  "Programming":      "💻",
  "Security":         "🔐",
  "Data Structures":  "🌳",
  "Machine Learning": "🤖",
  "General":          "💬",
};

const REACTIONS = [
  { type: 'like', icon: <ThumbsUp size={16} />, label: 'Like' },
  { type: 'helpful', icon: <Heart size={16} />, label: 'Helpful' },
  { type: 'insightful', icon: <Lightbulb size={16} />, label: 'Insightful' },
  { type: 'thanks', icon: <Sparkles size={16} />, label: 'Thanks' },
];

export default function ForumThread() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [userReaction, setUserReaction] = useState(null);

  // Mock user data - replace with actual user context
  const currentUser = {
    id: "user123",
    name: "John Doe",
    year: "2nd Year",
  };

  useEffect(() => {
    fetchThread();
  }, [id]);

  const fetchThread = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/forum/${id}`);
      const data = await res.json();
      if (data.success) {
        setThread(data.data);
        // Check if current user has reacted
        const myReaction = data.data.reactions?.find(r => r.userId === currentUser.id);
        if (myReaction) {
          setUserReaction(myReaction.type);
        }
      }
    } catch (err) {
      console.error("Failed to fetch thread:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (type) => {
    try {
      const res = await fetch(`http://localhost:8000/forum/${id}/reaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          userName: currentUser.name,
          type,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setThread(data.data);
        // Toggle reaction
        setUserReaction(userReaction === type ? null : type);
      }
    } catch (err) {
      console.error("Failed to add reaction:", err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(`http://localhost:8000/forum/${id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: currentUser.name,
          authorYear: currentUser.year,
          content: comment,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setThread(data.data);
        setComment("");
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/forum/${id}/comment/${commentId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        setThread(data.data);
      } else {
        alert("Failed to delete comment: " + data.message);
      }
    } catch (err) {
      console.error("Failed to delete comment:", err);
      alert("Failed to delete comment");
    }
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  const getReactionCount = (type) => {
    return thread?.reactions?.filter(r => r.type === type).length || 0;
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="thread-loading">
          <div className="thread-spinner" />
          <p>Loading discussion...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!thread) {
    return (
      <div>
        <Navbar />
        <div className="thread-error">
          <h2>Discussion not found</h2>
          <button onClick={() => navigate("/forum")}>Back to Forum</button>
        </div>
        <Footer />
      </div>
    );
  }

  const cfg = CATEGORY_CONFIG[thread.category] || CATEGORY_CONFIG["General"];
  const icon = CATEGORY_ICONS[thread.category] || "💬";

  return (
    <div>
      <Navbar />

      <div className="thread-container">
        <button className="thread-back-btn" onClick={() => navigate("/forum")}>
          <ArrowLeft size={16} /> Back to Forum
        </button>

        {/* Main Thread Card */}
        <div className="thread-main-card">
          <div className="thread-header">
            <div className="thread-header-top">
              <span
                className="thread-category-badge"
                style={{
                  background: cfg.bg,
                  color: cfg.color,
                  borderColor: cfg.accent + "44",
                }}
              >
                <span>{icon}</span> {thread.category}
              </span>

              <div className="thread-tags">
                {thread.tags?.map((tag) => (
                  <span key={tag} className="thread-tag-badge">
                    <Tag size={10} /> {tag}
                  </span>
                ))}
              </div>
            </div>

            <h1 className="thread-main-title">{thread.title}</h1>

            <div className="thread-meta">
              <div className="thread-author-info">
                <div
                  className="thread-author-avatar"
                  style={{ background: cfg.color }}
                >
                  {(thread.authorName || "U")[0].toUpperCase()}
                </div>
                <div>
                  <div className="thread-author-name">{thread.authorName || "Anonymous"}</div>
                  <div className="thread-meta-row">
                    {thread.authorYear && (
                      <span className="thread-author-year">{thread.authorYear}</span>
                    )}
                    <span className="thread-time">
                      <Clock size={11} /> {timeAgo(thread.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="thread-stats-row">
                <span className="thread-stat">
                  <Eye size={14} /> {thread.views || 0} views
                </span>
                <span className="thread-stat">
                  <MessageSquare size={14} /> {thread.replies || 0} replies
                </span>
              </div>
            </div>
          </div>

          <div className="thread-body-content">
            <p>{thread.body}</p>
          </div>

          {/* Reactions Section */}
          <div className="thread-reactions-section">
            <div className="reactions-bar">
              {REACTIONS.map((reaction) => {
                const count = getReactionCount(reaction.type);
                const isActive = userReaction === reaction.type;

                return (
                  <button
                    key={reaction.type}
                    className={`reaction-btn${isActive ? " active" : ""}`}
                    onClick={() => handleReaction(reaction.type)}
                  >
                    {reaction.icon}
                    <span>{reaction.label}</span>
                    {count > 0 && <span className="reaction-count">{count}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="thread-comments-section" id="comments">
          <h3 className="comments-title">
            <MessageSquare size={18} />
            {thread.comments?.length || 0} {thread.comments?.length === 1 ? 'Comment' : 'Comments'}
          </h3>

          {/* Add Comment Form */}
          <form className="add-comment-form" onSubmit={handleAddComment}>
            <div className="comment-input-wrapper">
              <div className="comment-user-avatar" style={{ background: cfg.color }}>
                {currentUser.name[0].toUpperCase()}
              </div>
              <textarea
                className="comment-input"
                placeholder="Add your comment or answer..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
            </div>
            <div className="comment-form-footer">
              <span className="comment-counter">{comment.length}/500</span>
              <button
                type="submit"
                className="comment-submit-btn"
                disabled={!comment.trim() || submittingComment}
              >
                <Send size={14} />
                {submittingComment ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="comments-list">
            {thread.comments?.length === 0 ? (
              <div className="no-comments">
                <MessageSquare size={32} />
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              thread.comments?.map((c) => (
                <div key={c._id} className="comment-card">
                  <div className="comment-avatar" style={{ background: cfg.accent }}>
                    {(c.authorName || "U")[0].toUpperCase()}
                  </div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-author">{c.authorName || "Anonymous"}</span>
                      {c.authorYear && <span className="comment-year">{c.authorYear}</span>}
                      <span className="comment-time">
                        <Clock size={10} /> {timeAgo(c.createdAt)}
                      </span>
                      {c.authorName === currentUser.name && (
                        <button
                          className="comment-delete-btn"
                          onClick={() => handleDeleteComment(c._id)}
                          title="Delete comment"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                    <p className="comment-text">{c.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
