import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { LogOut, Plus, Sparkles, Copy, Check, Eye, Compass, BookOpen, Clock } from 'lucide-react';
import UploadModal from '../components/UploadModal';
import DetailModal from '../components/DetailModal';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState({}); // Stores copy status by post ID

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/post');
      // Set posts, checking if response.data is an array
      if (Array.isArray(response.data)) {
        setPosts(response.data.reverse()); // Show newest first
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCopy = async (e, post) => {
    e.stopPropagation(); // Avoid opening the detail modal
    try {
      await navigator.clipboard.writeText(post.caption);
      setCopyStatus((prev) => ({ ...prev, [post._id]: true }));
      setTimeout(() => {
        setCopyStatus((prev) => ({ ...prev, [post._id]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setIsDetailOpen(true);
  };

  return (
    <div className={`${styles.container} fade-in`}>
      {/* Background orbs */}
      <div className="bg-orb orb-primary"></div>
      <div className="bg-orb orb-secondary"></div>

      {/* Sticky Header Nav */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <Sparkles className="text-gradient-neon" size={24} />
          <span className="text-gradient-neon">CaptionCraft</span>
        </div>
        <div className={styles.navActions}>
          <div className={styles.userBadge}>
            <div className={styles.userDot}></div>
            <span>@{user?.username}</span>
          </div>
          <button className={styles.createBtn} onClick={() => setIsUploadOpen(true)}>
            <Plus size={16} />
            <span>New Post</span>
          </button>
          <button className={styles.logoutBtn} onClick={logout} title="Log Out">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Dashboard Main Workspace */}
      <main className={styles.main}>
        {/* Welcome Banner */}
        <section className={`${styles.hero} glass-panel`}>
          <div className={styles.heroContent}>
            <h1 className={`${styles.heroTitle} text-gradient`}>Welcome back, {user?.username}!</h1>
            <p className={styles.heroSubtitle}>
              Transform your raw images into ready-to-publish social media highlights. Select or upload an image and let Gemini AI create perfect descriptions.
            </p>
          </div>
        </section>

        {/* Dashboard Grid Panel */}
        <div className={styles.dashboardGrid}>
          {/* Left Panel: Statistics & Tips */}
          <aside className={styles.sidebar}>
            {/* Stats Card */}
            <div className={`${styles.statsCard} glass-panel`}>
              <div className={styles.statsLabel}>Total Creations</div>
              <div className={`${styles.statsValue} text-gradient`}>{posts.length}</div>
            </div>

            {/* Tips Card */}
            <div className={`${styles.quickTips} glass-panel`}>
              <div className={styles.tipsTitle}>
                <BookOpen size={16} className="text-gradient-neon" />
                <span>AI Prompt Guide</span>
              </div>
              <ul className={styles.tipsList}>
                <li>Use clean, high-resolution JPG or PNG images.</li>
                <li>Make sure subject matter is clear and well-lit.</li>
                <li>Each generation writes unique creative copy.</li>
                <li>Generated captions include curated emojis and tags.</li>
              </ul>
            </div>
          </aside>

          {/* Right Panel: Posts Feed */}
          <section className={styles.feedSection}>
            <div className={styles.feedTitle}>Your Creative Gallery</div>

            {loading ? (
              /* Grid Skeletons while loading */
              <div className={styles.loadingGrid}>
                {[1, 2, 3].map((n) => (
                  <div key={n} className={styles.skeletonCard}>
                    <div className={`${styles.skeletonImage} skeleton`}></div>
                    <div className={styles.skeletonInfo}>
                      <div className={`${styles.skeletonText} skeleton`}></div>
                      <div className={`${styles.skeletonText} skeleton`}></div>
                      <div className={`${styles.skeletonTextShort} skeleton`}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              /* Empty State Panel */
              <div className={`${styles.emptyState} glass-panel`}>
                <div className={styles.emptyIcon}>
                  <Compass size={40} />
                </div>
                <h3 className={styles.emptyTitle}>No Posts Yet</h3>
                <p className={styles.emptyText}>
                  Your gallery is currently empty. Click the button below to upload your first image and see Gemini AI write beautiful captions!
                </p>
                <button className={styles.emptyBtn} onClick={() => setIsUploadOpen(true)}>
                  <Plus size={18} />
                  <span>Generate Your First Post</span>
                </button>
              </div>
            ) : (
              /* Posts grid */
              <div className={styles.postGrid}>
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className={`${styles.postCard} glass-panel`}
                    onClick={() => handlePostClick(post)}
                  >
                    <div className={styles.postImageWrapper}>
                      <img src={post.image} alt="Upload" className={styles.postImage} loading="lazy" />
                    </div>
                    <div className={styles.postCardInfo}>
                      <p className={styles.postCaption}>{post.caption}</p>
                      <div className={styles.postActions}>
                        <button
                          className={`${styles.postCardBtn} ${copyStatus[post._id] ? styles.postCardBtnCopied : ''}`}
                          onClick={(e) => handleCopy(e, post)}
                        >
                          {copyStatus[post._id] ? (
                            <>
                              <Check size={14} />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={14} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                        <button className={styles.postCardBtn}>
                          <Eye size={14} />
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Creation Upload Modal overlay */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={fetchPosts}
      />

      {/* Insight details modal overlay */}
      <DetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        post={selectedPost}
        username={user?.username}
      />
    </div>
  );
};

export default DashboardPage;
