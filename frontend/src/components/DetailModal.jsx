import React, { useState } from 'react';
import { X, Copy, Check, Calendar, Sparkles, User } from 'lucide-react';
import styles from './DetailModal.module.css';

const DetailModal = ({ isOpen, onClose, post, username }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !post) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(post.caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Extract avatar initials
  const initials = username ? username.substring(0, 2).toUpperCase() : 'U';

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.modal} glass-panel`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>
            <Sparkles className="text-gradient-neon" size={18} />
            <span className="text-gradient-neon">Post Insights</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.body}>
          {/* Image Container */}
          <div className={styles.imageContainer}>
            <img src={post.image} alt="Post Content" className={styles.image} />
          </div>

          {/* Details Section */}
          <div className={styles.details}>
            <div className={styles.infoSection}>
              {/* Creator Card */}
              <div className={styles.authorCard}>
                <div className={styles.avatar}>{initials}</div>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>{username || 'Active Creator'}</span>
                  <span className={styles.metaText}>CaptionCraft Contributor</span>
                </div>
              </div>

              {/* Caption Box */}
              <div className={styles.captionContainer}>
                <div className={styles.captionTitle}>
                  <Sparkles size={12} className="text-gradient-neon" />
                  <span>Gemini AI generated Caption</span>
                </div>
                <p className={styles.captionContent}>{post.caption}</p>
              </div>
            </div>

            {/* Actions */}
            <div>
              <button
                className={`${styles.actionBtn} ${copied ? styles.actionBtnSuccess : ''}`}
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    <span>Caption Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span>Copy AI Caption</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
