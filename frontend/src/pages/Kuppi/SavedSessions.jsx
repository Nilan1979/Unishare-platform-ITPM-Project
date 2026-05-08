import { useEffect, useState } from "react";
import axios from "axios";
import { Link2, Calendar, Clock, BookmarkX } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const BOOKMARK_API = "http://localhost:8000/api/bookmarks";

function getLoggedUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

function formatDate(iso) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "-"
    : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function formatTime(iso) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "-"
    : d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export default function SavedSessions() {
  const user = getLoggedUser();
  const userId = user?._id || user?.id || "";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [removing, setRemoving] = useState("");

  useEffect(() => {
    const loadBookmarks = async () => {
      if (!userId) {
        setError("Please login to view saved sessions");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const response = await axios.get(BOOKMARK_API, {
          headers: { "x-user-id": userId },
        });
        setItems(Array.isArray(response.data?.data) ? response.data.data : []);
      } catch (err) {
        setItems([]);
        setError(err.response?.data?.message || "Failed to load saved sessions");
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, [userId]);

  const removeBookmark = async (sessionId) => {
    try {
      setRemoving(sessionId);
      await axios.delete(`${BOOKMARK_API}/${sessionId}`, {
        headers: { "x-user-id": userId },
      });
      setItems((prev) => prev.filter((item) => String(item.sessionId) !== String(sessionId)));
      setNotice("Bookmark removed");
      setTimeout(() => setNotice(""), 2500);
    } catch (err) {
      setNotice(err.response?.data?.message || "Failed to remove bookmark");
      setTimeout(() => setNotice(""), 3000);
    } finally {
      setRemoving("");
    }
  };

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'Poppins', sans-serif; }

        .ss-wrap { max-width: 980px; margin: 0 auto; padding: 34px 18px 60px; }
        .ss-title { font-size: 1.35rem; font-weight: 800; color: #0d2257; margin-bottom: 8px; }
        .ss-sub { color: #667085; font-size: 0.88rem; margin-bottom: 22px; }
        .ss-notice {
          margin-bottom: 14px; padding: 10px 13px; border-radius: 10px;
          background: #e8f0fe; border: 1px solid #c5d8f8; color: #0d47a1;
          font-size: 0.82rem; font-weight: 600;
        }
        .ss-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 14px;
        }
        .ss-card {
          background: #fff; border: 1px solid #e8f0fe; border-radius: 14px;
          box-shadow: 0 4px 16px rgba(21,101,192,0.08);
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .ss-module {
          display: inline-flex;
          width: fit-content;
          font-size: 0.68rem;
          font-weight: 700;
          color: #1565C0;
          background: #e8f0fe;
          border-radius: 999px;
          padding: 4px 10px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .ss-heading { color: #0d2257; font-size: 0.9rem; font-weight: 700; line-height: 1.35; }
        .ss-meta {
          display: grid;
          gap: 6px;
          font-size: 0.75rem;
          color: #4f5d7a;
          font-weight: 600;
        }
        .ss-meta span { display: inline-flex; align-items: center; gap: 6px; }
        .ss-link {
          font-size: 0.76rem;
          color: #1565C0;
          text-decoration: none;
          word-break: break-all;
        }
        .ss-link:hover { text-decoration: underline; }
        .ss-remove {
          margin-top: auto;
          padding: 9px;
          border: 1.5px solid #f5c0cf;
          background: #fce8ef;
          color: #993556;
          border-radius: 9px;
          font-size: 0.78rem;
          font-weight: 700;
          font-family: 'Poppins', sans-serif;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          transition: all 0.18s;
        }
        .ss-remove:hover { background: #993556; color: #fff; border-color: #993556; }
        .ss-remove:disabled { opacity: 0.65; cursor: not-allowed; }

        /* ─────────────────────────────────────────────────────────────
           COMPREHENSIVE MOBILE RESPONSIVE STYLES
        ───────────────────────────────────────────────────────────── */

        @media (max-width: 900px) {
          .ss-wrap { padding: 28px 16px 50px; }
          .ss-title { font-size: 1.2rem; margin-bottom: 6px; }
          .ss-sub { font-size: 0.82rem; margin-bottom: 18px; }
          .ss-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
          .ss-card { padding: 12px; gap: 8px; }
          .ss-module { font-size: 0.64rem; padding: 3px 8px; }
          .ss-heading { font-size: 0.86rem; }
          .ss-meta { gap: 4px; font-size: 0.72rem; }
          .ss-remove { font-size: 0.75rem; padding: 7px; gap: 5px; }
        }

        @media (max-width: 768px) {
          .ss-wrap { padding: 24px 14px 40px; }
          .ss-title { font-size: 1.1rem; margin-bottom: 4px; }
          .ss-sub { font-size: 0.78rem; margin-bottom: 14px; }
          .ss-notice { font-size: 0.77rem; padding: 8px 11px; margin-bottom: 12px; }
          .ss-grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; }
          .ss-card { padding: 11px; gap: 7px; border-radius: 12px; }
          .ss-module { font-size: 0.6rem; padding: 2px 7px; }
          .ss-heading { font-size: 0.82rem; line-height: 1.3; }
          .ss-meta { gap: 3px; font-size: 0.68rem; }
          .ss-meta span { gap: 4px; }
          .ss-link { font-size: 0.72rem; }
          .ss-remove { font-size: 0.72rem; padding: 6px; }
        }

        @media (max-width: 600px) {
          .ss-wrap { padding: 20px 12px 32px; }
          .ss-title { font-size: 1rem; margin-bottom: 2px; }
          .ss-sub { font-size: 0.75rem; margin-bottom: 12px; }
          .ss-notice { font-size: 0.74rem; padding: 7px 10px; }
          .ss-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px; }
          .ss-card { padding: 10px; gap: 6px; border-radius: 10px; }
          .ss-module { font-size: 0.55rem; padding: 2px 6px; }
          .ss-heading { font-size: 0.78rem; }
          .ss-meta { gap: 2px; font-size: 0.64rem; }
          .ss-meta span { gap: 3px; }
          .ss-link { font-size: 0.68rem; }
          .ss-remove { font-size: 0.68rem; padding: 5px; gap: 4px; }
        }

        @media (max-width: 480px) {
          .ss-wrap { padding: 16px 10px 28px; }
          .ss-title { font-size: 0.95rem; }
          .ss-sub { font-size: 0.72rem; margin-bottom: 10px; }
          .ss-notice { font-size: 0.7rem; padding: 6px 9px; }
          .ss-grid { grid-template-columns: 1fr; gap: 6px; }
          .ss-card { padding: 9px; gap: 5px; border-radius: 8px; }
          .ss-module { font-size: 0.5rem; padding: 1px 5px; }
          .ss-heading { font-size: 0.75rem; }
          .ss-meta { gap: 1px; font-size: 0.6rem; }
          .ss-link { font-size: 0.64rem; }
          .ss-remove { font-size: 0.64rem; padding: 4px; gap: 3px; }
          .ss-remove svg { width: 12px; height: 12px; }
        }

        @media (max-width: 360px) {
          .ss-wrap { padding: 12px 8px 24px; }
          .ss-title { font-size: 0.9rem; }
          .ss-sub { font-size: 0.68rem; }
          .ss-grid { gap: 4px; }
          .ss-card { padding: 8px; gap: 4px; }
          .ss-heading { font-size: 0.72rem; }
          .ss-meta { font-size: 0.58rem; }
          .ss-remove { font-size: 0.6rem; padding: 3px; }
        }
      `}</style>

      <Navbar />

      <div className="ss-wrap">
        <h2 className="ss-title">Saved Sessions</h2>
        <p className="ss-sub">Your bookmarked Kuppi sessions are listed below.</p>

        {!!notice && <div className="ss-notice">{notice}</div>}

        {loading && <p>Loading saved sessions...</p>}
        {!loading && !!error && <p>{error}</p>}
        {!loading && !error && items.length === 0 && <p>No saved sessions found.</p>}

        <div className="ss-grid">
          {items.map((item) => (
            <div key={item.bookmarkId || item.sessionId} className="ss-card">
              <span className="ss-module">{item.moduleName || "Module"}</span>
              <h3 className="ss-heading">{item.title || "Untitled Session"}</h3>

              <div className="ss-meta">
                <span><Calendar size={13} /> {formatDate(item.scheduledAt || item.date)}</span>
                <span><Clock size={13} /> {formatTime(item.scheduledAt || item.time)}</span>
                <span>
                  <Link2 size={13} />
                  <a className="ss-link" href={item.link} target="_blank" rel="noreferrer">
                    Join Session
                  </a>
                </span>
              </div>

              <button
                type="button"
                className="ss-remove"
                disabled={removing === String(item.sessionId)}
                onClick={() => removeBookmark(String(item.sessionId))}
              >
                <BookmarkX size={14} />
                {removing === String(item.sessionId) ? "Removing..." : "Remove Bookmark"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
